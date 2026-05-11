/* ============================================================
   DeepScan AI — app.js  v6.0
   Pure Vanilla JS, no frameworks
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────
let selectedFile = null;

// ── View Management ────────────────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (name === 'upload') resetUploadUI();
}

// ── Navbar scroll blur ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger menu ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (mobileMenu && mobileMenu.classList.contains('open')) {
    if (!mobileMenu.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// ── Upload Zone ─────────────────────────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');

if (uploadZone) {
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('.file-remove')) return;
    fileInput.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-active');
  });

  uploadZone.addEventListener('dragleave', (e) => {
    if (!uploadZone.contains(e.relatedTarget)) {
      uploadZone.classList.remove('drag-active');
    }
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-active');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  });
}

if (fileInput) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
  });
}

const fileRemoveBtn = document.getElementById('fileRemove');
if (fileRemoveBtn) {
  fileRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFile();
  });
}

const ACCEPTED_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/webm', 'video/avi', 'video/x-matroska',
  'video/mpeg', 'video/x-ms-wmv'
];
const MAX_SIZE_MB = 100;

function handleFileSelect(file) {
  const isValidType = ACCEPTED_TYPES.includes(file.type) ||
    /\.(mp4|mov|avi|webm|mkv|wmv|mpeg|mpg)$/i.test(file.name);

  if (!isValidType) {
    showToast('Unsupported file type. Please upload MP4, MOV, AVI, WebM or MKV.', 'error');
    return;
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) {
    showToast(`File too large (${sizeMB.toFixed(1)} MB). Maximum is ${MAX_SIZE_MB} MB.`, 'error');
    return;
  }

  selectedFile = file;

  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');

  fileName.textContent = file.name;
  fileSize.textContent = sizeMB < 1
    ? `${(file.size / 1024).toFixed(1)} KB`
    : `${sizeMB.toFixed(2)} MB`;

  fileInfo.classList.add('visible');
  uploadZone.classList.add('has-file');
  if (analyzeBtn) analyzeBtn.disabled = false;

  showToast(`"${file.name}" ready for analysis.`, 'success');
}

function clearFile() {
  selectedFile = null;
  if (fileInput) fileInput.value = '';
  const fi = document.getElementById('fileInfo');
  if (fi) fi.classList.remove('visible');
  if (uploadZone) uploadZone.classList.remove('has-file');
  if (analyzeBtn) analyzeBtn.disabled = true;
}

function resetUploadUI() {
  clearFile();
  const pp = document.getElementById('progressPanel');
  if (pp) pp.classList.remove('visible');
  const pb = document.getElementById('progressBar');
  if (pb) pb.style.width = '0%';
  document.querySelectorAll('.stage-item').forEach(s => {
    s.classList.remove('active', 'done');
  });
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '';
    analyzeBtn.style.pointerEvents = '';
  }
  const backBtn = document.querySelector('.upload-actions .btn-secondary');
  if (backBtn) {
    backBtn.style.opacity = '';
    backBtn.style.pointerEvents = '';
  }
}

// ── Analysis ─────────────────────────────────────────────────────────────────
const STAGES = [
  'Uploading video',
  'Extracting frames',
  'Detecting faces',
  'Running AI analysis',
  'Generating report'
];

const STAGE_DURATIONS = [700, 900, 800, 1100, 500];

async function startAnalysis() {
  if (!selectedFile) {
    showToast('Please select a video file first.', 'error');
    return;
  }

  // Lock UI
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.6';
    analyzeBtn.style.pointerEvents = 'none';
  }
  const backBtn = document.querySelector('.upload-actions .btn-secondary');
  if (backBtn) {
    backBtn.style.opacity = '0.4';
    backBtn.style.pointerEvents = 'none';
  }

  // ── Wake up backend if sleeping ──────────────────────────────────────────
  const isAwake = await wakeUpBackend();
  if (!isAwake) {
    // Unlock UI
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.style.opacity = '';
      analyzeBtn.style.pointerEvents = '';
    }
    if (backBtn) {
      backBtn.style.opacity = '';
      backBtn.style.pointerEvents = '';
    }
    showToast('Could not connect to server. Please try again in a moment.', 'error');
    return;
  }

  const progressPanel = document.getElementById('progressPanel');
  if (progressPanel) progressPanel.classList.add('visible');

  // Run stage animation + real fetch in parallel
  let data;
  try {
    const [result] = await Promise.all([
      fetchPrediction(selectedFile),
      animateStages()
    ]);
    data = result;
  } catch (err) {
    if (progressPanel) progressPanel.classList.remove('visible');
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.style.opacity = '';
      analyzeBtn.style.pointerEvents = '';
    }
    if (backBtn) {
      backBtn.style.opacity = '';
      backBtn.style.pointerEvents = '';
    }
    showToast(err.message || 'Analysis failed. Is the backend running on port 8001?', 'error');
    return;
  }

  await sleep(400);
  renderResults(data);
  showView('results');
}

// ── Wake up backend (handles cold start / sleep) ──────────────────────────────
// Pings /health up to 5 times with 6s gap — total max wait ~30s
async function wakeUpBackend() {
  const baseUrl = (window.CONFIG && window.CONFIG.BACKEND_URL) ? window.CONFIG.BACKEND_URL : (
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
      ? 'http://localhost:8001'
      : 'https://deepfake-detection-system-1-9le8.onrender.com'
  );

  // If localhost — no sleep issue, skip wakeup
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) return true;

  showToast('Connecting to server... please wait', 'info');

  const MAX_TRIES  = 5;
  const RETRY_GAP  = 6000; // 6 seconds between tries

  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      const res = await fetch(baseUrl + '/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5s per attempt
      });
      if (res.ok) {
        if (i > 0) showToast('Server is ready!', 'success');
        return true;
      }
    } catch (_) {
      // Server not yet awake — wait and retry
    }
    if (i < MAX_TRIES - 1) {
      showToast(`Server is starting up... (${i + 1}/${MAX_TRIES})`, 'info');
      await sleep(RETRY_GAP);
    }
  }
  return false; // gave up after 5 tries
}

async function fetchPrediction(file) {
  const frameCount = parseInt(document.getElementById('frameSlider')?.value || '30');
  const formData = new FormData();
  formData.append('upload_video_file', file);
  formData.append('num_frames', frameCount.toString());

  const backendUrl = (window.CONFIG && window.CONFIG.BACKEND_URL) ? window.CONFIG.BACKEND_URL : (
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
      ? 'http://localhost:8001'
      : 'https://deepfake-detection-system-1-9le8.onrender.com'
  );

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 3 * 60 * 1000);

  let response;
  try {
    response = await fetch(backendUrl + '/api/predict/', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out (3 min). Please try again.');
    }
    throw new Error(
      'Cannot reach backend server. ' +
      (backendUrl.includes('localhost')
        ? 'Make sure the backend is running: cd node-backend && node server.js'
        : 'The server may be starting up — please wait 30 seconds and try again.')
    );
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    let msg = `Server error (${response.status})`;
    try {
      const errBody = await response.json();
      msg = errBody.detail || errBody.message || msg;
    } catch (_) {}
    if (response.status === 413) msg = 'File too large. Maximum size is 100MB.';
    if (response.status === 500) msg = 'Backend processing error. Please try a different video.';
    throw new Error(msg);
  }

  return response.json();
}

async function animateStages() {
  const items = document.querySelectorAll('.stage-item');
  const bar   = document.getElementById('progressBar');
  const total = STAGES.length;

  for (let i = 0; i < total; i++) {
    if (items[i]) items[i].classList.add('active');
    if (bar) bar.style.width = `${Math.round(((i + 0.5) / total) * 100)}%`;
    await sleep(STAGE_DURATIONS[i]);
    if (items[i]) {
      items[i].classList.remove('active');
      items[i].classList.add('done');
    }
    if (bar) bar.style.width = `${Math.round(((i + 1) / total) * 100)}%`;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Results Rendering ─────────────────────────────────────────────────────────
function renderResults(data) {
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const isReal     = (data.output || '').toUpperCase() === 'REAL';
  const confidence = parseFloat(data.confidence) || 0;
  const probs      = data.probabilities || { real: 0, fake: 0 };
  const analysis   = data.analysis || {};
  const videoInfo  = analysis.video_info || {};
  const warnings   = analysis.warning_flags || [];
  const verdict    = isReal ? 'REAL' : 'FAKE';
  const vc         = isReal ? 'real' : 'fake';

  // ── 1. Verdict Card ────────────────────────────────────────────────────
  const verdictCard = el('div', `glass-card verdict-card ${vc} animate-slide-up`);
  verdictCard.style.animationDelay = '0s';
  verdictCard.innerHTML = `
    <div class="verdict-left">
      <div class="verdict-label">Detection Verdict</div>
      <div class="verdict-text ${vc}">${verdict}</div>
      <div class="verdict-confidence">
        Confidence: <strong>${confidence.toFixed(1)}%</strong>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        <span class="tag ${isReal ? 'tag-green' : 'tag-red'}">
          ${isReal ? '✓ Authentic' : '⚠ Manipulated'}
        </span>
        <span class="tag tag-purple" style="font-size:0.7rem">
          v${data.model_version || '6.0.0'}
        </span>
      </div>
    </div>
    <div class="verdict-probs">
      <div class="prob-row">
        <div class="prob-label">
          <span class="text-green">Real</span>
          <span>${parseFloat(probs.real || 0).toFixed(1)}%</span>
        </div>
        <div class="prob-bar-wrap">
          <div class="prob-bar real" style="width:${parseFloat(probs.real || 0).toFixed(1)}%"></div>
        </div>
      </div>
      <div class="prob-row" style="margin-top:12px">
        <div class="prob-label">
          <span class="text-red">Fake</span>
          <span>${parseFloat(probs.fake || 0).toFixed(1)}%</span>
        </div>
        <div class="prob-bar-wrap">
          <div class="prob-bar fake" style="width:${parseFloat(probs.fake || 0).toFixed(1)}%"></div>
        </div>
      </div>
    </div>
  `;
  grid.appendChild(verdictCard);

  // ── 2. Confidence Circle ───────────────────────────────────────────────
  const circumference = 2 * Math.PI * 65;
  const offset = circumference - (confidence / 100) * circumference;

  const circleCard = el('div', 'glass-card confidence-card animate-slide-up');
  circleCard.style.animationDelay = '0.08s';
  circleCard.innerHTML = `
    <div class="confidence-circle-wrap">
      <svg class="confidence-svg" viewBox="0 0 160 160">
        <circle class="confidence-track" cx="80" cy="80" r="65"/>
        <circle class="confidence-fill ${vc}" id="confFill"
          cx="80" cy="80" r="65"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${circumference.toFixed(2)}"/>
      </svg>
      <div class="confidence-center">
        <div class="confidence-pct ${isReal ? 'text-green' : 'text-red'}">${confidence.toFixed(0)}%</div>
        <div class="confidence-sub">Confidence</div>
      </div>
    </div>
    <h3>Model Confidence</h3>
    <span class="tag ${isReal ? 'tag-green' : 'tag-red'}">${verdict}</span>
  `;
  grid.appendChild(circleCard);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = document.getElementById('confFill');
    if (fill) fill.style.strokeDashoffset = offset.toFixed(2);
  }));

  // ── 3. Deepfake-Specific Signals ───────────────────────────────────────
  const deepfakeSignals = [
    {
      label: 'Deep Feature Score',
      value: parseFloat(analysis.deep_feature_score) || 0,
      desc: 'EfficientNet-B4 feature inconsistency across frames',
    },
    {
      label: 'Texture Variance',
      value: parseFloat(analysis.texture_variance) || 0,
      desc: 'Face sharpness inconsistency (blurry/erratic = suspicious)',
    },
    {
      label: 'Blend Seam',
      value: parseFloat(analysis.blend_seam) || 0,
      desc: 'Face boundary blending artifact (face-swap signature)',
    },
    {
      label: 'Color Mismatch',
      value: parseFloat(analysis.color_mismatch) || 0,
      desc: 'Face vs background color/lighting inconsistency',
    },
    {
      label: 'Temporal Flicker',
      value: parseFloat(analysis.temporal_flicker) || 0,
      desc: 'Frame-to-frame face texture flickering',
    },
  ];

  const signalsCard = el('div', 'glass-card metrics-card animate-slide-up');
  signalsCard.style.animationDelay = '0.16s';
  signalsCard.innerHTML = `
    <h3>Deepfake Detection Signals</h3>
    <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:18px">
      Higher score = stronger deepfake indicator
    </p>
    <div class="metric-list">
      ${deepfakeSignals.map((m, i) => {
        const v = m.value;
        // For inverted signals: high value = suspicious = red
        const barClass = v >= 60 ? 'low' : v >= 30 ? 'mid' : 'high';
        const valColor = v >= 60 ? 'var(--red)' : v >= 30 ? 'var(--amber)' : 'var(--green)';
        return `
          <div class="metric-item">
            <div class="metric-header">
              <span class="metric-name">${m.label}</span>
              <span class="metric-value" style="color:${valColor}">${v.toFixed(1)}</span>
            </div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:5px">${m.desc}</div>
            <div class="metric-bar-wrap">
              <div class="metric-bar ${barClass}" style="width:${v}%;--delay:${i * 0.06}s"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  grid.appendChild(signalsCard);

  // ── 4. Informational Signals ───────────────────────────────────────────
  const infoSignals = [
    { label: 'Temporal Consistency', value: parseFloat(analysis.temporal_consistency) || 0, invert: false },
    { label: 'Face Quality',         value: parseFloat(analysis.face_quality) || 0,         invert: false },
    { label: 'Motion Naturalness',   value: parseFloat(analysis.motion_naturalness) || 0,   invert: false },
  ];

  const infoCard = el('div', 'glass-card metrics-card animate-slide-up');
  infoCard.style.animationDelay = '0.24s';
  infoCard.innerHTML = `
    <h3>Video Quality Signals</h3>
    <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:18px">
      Informational only — do not affect verdict
    </p>
    <div class="metric-list">
      ${infoSignals.map((m, i) => {
        const v = m.value;
        const barClass = m.invert
          ? (v >= 35 ? 'low' : v >= 20 ? 'mid' : 'high')
          : (v >= 65 ? 'high' : v >= 40 ? 'mid' : 'low');
        const valColor = m.invert
          ? (v >= 35 ? 'var(--red)' : v >= 20 ? 'var(--amber)' : 'var(--green)')
          : (v >= 65 ? 'var(--green)' : v >= 40 ? 'var(--amber)' : 'var(--red)');
        return `
          <div class="metric-item">
            <div class="metric-header">
              <span class="metric-name">${m.label}</span>
              <span class="metric-value" style="color:${valColor}">${v.toFixed(1)}</span>
            </div>
            <div class="metric-bar-wrap">
              <div class="metric-bar ${barClass}" style="width:${Math.min(100,v)}%;--delay:${i * 0.06}s"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  grid.appendChild(infoCard);

  // ── 5. Suspicious Score + Warnings ────────────────────────────────────
  const suspScore = parseFloat(analysis.suspicious_score) || 0;
  const suspClass = suspScore >= 60 ? 'tag-red' : suspScore >= 35 ? 'tag-amber' : 'tag-green';
  const suspLabel = suspScore >= 60 ? 'High Risk' : suspScore >= 35 ? 'Moderate' : 'Low Risk';
  const suspColor = suspScore >= 60 ? 'var(--red)' : suspScore >= 35 ? 'var(--amber)' : 'var(--green)';
  const suspBarClass = suspScore >= 60 ? 'low' : suspScore >= 35 ? 'mid' : 'high';

  const suspCard = el('div', 'glass-card info-card animate-slide-up');
  suspCard.style.animationDelay = '0.32s';
  suspCard.innerHTML = `
    <h3>Suspicion Index</h3>
    <div style="display:flex;align-items:center;gap:20px;margin:16px 0">
      <div style="font-size:3rem;font-weight:900;color:${suspColor};line-height:1">
        ${suspScore.toFixed(1)}
      </div>
      <div>
        <span class="tag ${suspClass}">${suspLabel}</span>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:6px">
          Composite deepfake risk score (0–100)
        </div>
      </div>
    </div>
    <div class="metric-bar-wrap">
      <div class="metric-bar ${suspBarClass}" style="width:${suspScore}%"></div>
    </div>
    ${warnings.length > 0 ? `
      <div style="margin-top:20px">
        <div style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em">
          Warning Flags
        </div>
        ${warnings.map(w => `
          <div class="warning-item">
            <svg class="warning-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            ${w}
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="no-warnings" style="margin-top:16px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        No warning flags detected
      </div>
    `}
  `;
  grid.appendChild(suspCard);

  // ── 6. Video Info ──────────────────────────────────────────────────────
  const resolution = videoInfo.width && videoInfo.height
    ? `${videoInfo.width} × ${videoInfo.height}` : 'N/A';
  const fps      = videoInfo.fps ? `${videoInfo.fps} fps` : 'N/A';
  const duration = videoInfo.duration_sec ? `${videoInfo.duration_sec}s` : 'N/A';
  const frames   = videoInfo.frames_analyzed
    ? `${videoInfo.frames_analyzed} / ${videoInfo.total_frames || '?'}` : 'N/A';

  const videoCard = el('div', 'glass-card info-card animate-slide-up');
  videoCard.style.animationDelay = '0.40s';
  videoCard.innerHTML = `
    <h3>Video Information</h3>
    <div class="info-grid" style="margin-top:16px">
      <div class="info-item">
        <div class="info-label">Resolution</div>
        <div class="info-value">${resolution}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Frame Rate</div>
        <div class="info-value">${fps}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Duration</div>
        <div class="info-value">${duration}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Frames Analyzed</div>
        <div class="info-value">${frames}</div>
      </div>
    </div>
  `;
  grid.appendChild(videoCard);

  // ── 7. Processing Details ──────────────────────────────────────────────
  const procCard = el('div', 'glass-card processing-card animate-slide-up');
  procCard.style.animationDelay = '0.48s';
  procCard.innerHTML = `
    <h3>Processing Details</h3>
    <div class="processing-details">
      <div class="processing-item">
        <div class="processing-label">Processing Time</div>
        <div class="processing-value">${parseFloat(data.processing_time || 0).toFixed(2)}s</div>
      </div>
      <div class="processing-item">
        <div class="processing-label">Detection Method</div>
        <div class="processing-value" style="font-size:0.82rem">${data.detection_method || 'N/A'}</div>
      </div>
      <div class="processing-item">
        <div class="processing-label">Model Version</div>
        <div class="processing-value">${data.model_version || 'N/A'}</div>
      </div>
    </div>
  `;
  grid.appendChild(procCard);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

// ── Toast Notifications ───────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span>${message}</span>
    <button class="toast-close" aria-label="Dismiss">✕</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  toast.style.transition = 'all 0.3s ease';
  setTimeout(() => toast.remove(), 300);
}
