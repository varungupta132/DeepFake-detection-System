/**
 * DeepScan AI — Node.js + Express Backend
 * Receives video upload → calls Python detector → returns JSON result
 */

const express    = require('express');
const multer     = require('multer');
const cors       = require('cors');
const { spawn }  = require('child_process');
const path       = require('path');
const fs         = require('fs');
const os         = require('os');

const app  = express();
const PORT = process.env.PORT || 8001;

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ── Multer — file upload to temp dir ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = path.join(__dirname, 'temp_uploads');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname) || '.mp4';
    const name = `upload_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const ALLOWED_MIMES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/webm', 'video/x-matroska', 'video/mpeg',
];

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const validExts = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.mpeg', '.mpg'];
    const valid    = ALLOWED_MIMES.includes(file.mimetype) || validExts.includes(ext);
    cb(valid ? null : new Error(`Unsupported file type: ${file.mimetype}`), valid);
  },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name:    'DeepScan AI',
    version: '9.0.0',
    stack:   'Node.js + Express + Python CV/ML',
    status:  'running',
    endpoints: {
      health:  '/health',
      predict: 'POST /api/predict/',
      docs:    'N/A',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status:  'healthy',
    version: '9.0.0',
    runtime: `Node.js ${process.version}`,
  });
});

app.post('/api/predict/', upload.single('upload_video_file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: 'No video file uploaded.' });
  }

  const videoPath = req.file.path;
  const numFrames = parseInt(req.body.num_frames) || 30;
  // Clamp between 10 and 60
  const frames = Math.min(60, Math.max(10, numFrames));
  console.log(`\n[RECEIVED] ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(1)} MB) | frames: ${frames}`);

  try {
    const result = await runPythonDetector(videoPath, frames);
    res.json(result);
  } catch (err) {
    console.error('Detection error:', err);
    res.status(500).json({ detail: `Analysis failed: ${err.message}` });
  } finally {
    // Cleanup temp file
    fs.unlink(videoPath, () => {});
  }
});

// ── Python detector runner ────────────────────────────────────────────────────
function runPythonDetector(videoPath, numFrames) {
  return new Promise((resolve, reject) => {
    // Path to detector script (in ../backend/)
    const detectorScript = path.join(__dirname, '..', 'backend', 'run_detector.py');
    const pythonCmd      = process.platform === 'win32' ? 'python' : 'python3';

    console.log(`  [PYTHON] Running: ${pythonCmd} ${detectorScript} "${videoPath}" ${numFrames}`);

    const py = spawn(pythonCmd, [detectorScript, videoPath, String(numFrames)], {
      cwd: path.join(__dirname, '..', 'backend'),
    });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => { stdout += data.toString(); });
    py.stderr.on('data', (data) => {
      stderr += data.toString();
      // Print Python logs to Node console
      process.stdout.write(data.toString());
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('Python stderr:', stderr);
        return reject(new Error(stderr.trim() || `Python exited with code ${code}`));
      }
      try {
        // Last line of stdout is the JSON result
        const lines      = stdout.trim().split('\n');
        const jsonLine   = lines[lines.length - 1];
        const result     = JSON.parse(jsonLine);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    py.on('error', (err) => {
      reject(new Error(`Could not start Python: ${err.message}`));
    });
  });
}

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ detail: 'File exceeds 100 MB limit.' });
  }
  res.status(400).json({ detail: err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(55));
  console.log('  DeepScan AI -- Node.js + Express Backend v9.0');
  console.log(`  http://0.0.0.0:${PORT}`);
  console.log('='.repeat(55) + '\n');

  // Pre-load EfficientNet model on startup so first request is fast
  warmupModel();
});

function warmupModel() {
  const detectorScript = path.join(__dirname, '..', 'backend', 'run_detector.py');
  const pythonCmd      = process.platform === 'win32' ? 'python' : 'python3';

  console.log('  [WARMUP] Pre-loading EfficientNet model...');

  const py = spawn(pythonCmd, [detectorScript, '--warmup'], {
    cwd: path.join(__dirname, '..', 'backend'),
  });

  let stdout = '';
  py.stdout.on('data', d => { stdout += d.toString(); });
  py.stderr.on('data', d => { process.stdout.write(d.toString()); });

  py.on('close', (code) => {
    if (code === 0) {
      console.log('  [WARMUP] EfficientNet model loaded and ready!');
    } else {
      console.log('  [WARMUP] Model pre-load failed — will load on first request');
    }
  });

  py.on('error', () => {
    console.log('  [WARMUP] Python not found — model will load on first request');
  });
}
