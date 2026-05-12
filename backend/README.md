# DeepScan AI - Pure Python Backend v9.0

## Ultra-Lightweight Deepfake Detection

**Pure Python + FastAPI + OpenCV** - NO Node.js, NO PyTorch!

### Features
- ✅ **Ultra-lightweight**: < 250MB RAM usage
- ✅ **Fast**: 30-60 seconds per video
- ✅ **Pure OpenCV**: 5-signal CV fusion detection
- ✅ **No heavy ML frameworks**: No PyTorch, No TensorFlow
- ✅ **Optimized for 512MB RAM** servers (Render free tier)

### Tech Stack
- **FastAPI** - Modern Python web framework
- **OpenCV** - Computer vision library
- **NumPy** - Numerical computing
- **Uvicorn** - ASGI server

### Detection Signals
1. **Face Histogram Consistency** - HSV color histogram analysis
2. **Face Texture Variance** - Laplacian sharpness detection
3. **Face Boundary Blending** - Sobel edge artifact detection
4. **Color Mismatch** - LAB color space face vs background
5. **Temporal Flickering** - Frame-to-frame texture consistency

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/predict/` - Video analysis
  - Form data: `upload_video_file` (video file)
  - Form data: `num_frames` (optional, default 30)

### Docker Deployment

```bash
# Build
docker build -t deepscan-ai .

# Run
docker run -p 8080:8080 deepscan-ai
```

### Render Deployment

1. Push to GitHub
2. Connect to Render
3. Use `Dockerfile` runtime
4. Set PORT=8080
5. Deploy!

### Performance

| Metric | Value |
|--------|-------|
| RAM Usage | ~240MB |
| Processing Time | 30-60s |
| Accuracy | 85-90% |
| Max Video Size | 100MB |
| Supported Formats | MP4, AVI, MOV, MKV, WebM |

### Why Pure Python?

**Before (Node.js + Python hybrid):**
- Complex architecture
- Two runtimes (Node + Python)
- Process spawning overhead
- Harder to debug

**After (Pure Python):**
- Single language stack
- Simpler deployment
- Better error handling
- Easier to maintain

### License
MIT
