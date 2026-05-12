"""
DeepScan AI — FastAPI Backend v9.0 (Ultra-Lightweight)
Pure OpenCV + NumPy deepfake detection
NO PyTorch, NO TensorFlow - Optimized for 512MB RAM
"""

import os
import tempfile
import shutil
import time
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from detector import analyze_video

# ── Directories ───────────────────────────────────────────────────────────────
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/avi", "video/quicktime",
    "video/x-msvideo", "video/x-matroska", "video/webm",
    "video/x-ms-wmv", "video/mpeg",
}

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".wmv", ".mpeg", ".mpg"}


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "=" * 55)
    print("  DeepScan AI -- Backend v8.0")
    print("  http://0.0.0.0:8080")
    print("  Docs: http://0.0.0.0:8080/docs")
    print("  EfficientNet-B4 + 5-Signal CV Fusion")
    print("=" * 55 + "\n")

    # Cleanup stale uploads older than 1 hour
    for f in UPLOAD_DIR.glob("*"):
        if f.is_file() and time.time() - f.stat().st_mtime > 3600:
            try:
                f.unlink()
            except Exception:
                pass
    yield


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DeepScan AI API",
    description="EfficientNet-B4 + 5-Signal CV Fusion deepfake detection",
    version="8.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "DeepScan AI",
        "version": "8.0.0",
        "status": "running",
        "stack": "Pure Python + EfficientNet-B4",
        "endpoints": {
            "health": "/health",
            "predict": "POST /api/predict/",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": "8.0.0",
        "detection_method": "EfficientNet-B4 + 5-Signal CV Fusion",
    }


@app.post("/api/predict/")
async def predict(
    upload_video_file: UploadFile = File(...),
    num_frames: int = Form(30)
):
    """
    Analyze a video for deepfake manipulation.

    - Accepts: MP4, AVI, MOV, MKV, WebM (max 100 MB)
    - Returns: verdict, confidence, 5-signal analysis breakdown
    - Uses EfficientNet-B4 for deep feature analysis
    """
    temp_path = None

    try:
        # ── Validate ──────────────────────────────────────────────────────────
        filename = upload_video_file.filename or ""
        ext = Path(filename).suffix.lower()

        content_type = upload_video_file.content_type or ""
        if content_type not in ALLOWED_VIDEO_TYPES and ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type '{content_type}'. Upload MP4, AVI, MOV, MKV or WebM.",
            )

        # ── Save to temp ──────────────────────────────────────────────────────
        suffix = ext if ext in ALLOWED_EXTENSIONS else ".mp4"
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=suffix, dir=UPLOAD_DIR
        ) as tmp:
            shutil.copyfileobj(upload_video_file.file, tmp)
            temp_path = tmp.name

        # Check size (100 MB)
        size_mb = os.path.getsize(temp_path) / (1024 * 1024)
        if size_mb > 100:
            raise HTTPException(status_code=413, detail="File exceeds 100 MB limit.")

        # Clamp num_frames between 10 and 60
        frames = max(10, min(60, num_frames))
        print(f"\n[RECEIVED] {filename} ({size_mb:.1f} MB) | frames: {frames}")

        # ── Analyze ───────────────────────────────────────────────────────────
        result = analyze_video(temp_path, num_frames=frames)
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                pass


# ── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info",
    )
