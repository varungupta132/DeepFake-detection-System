"""
HuggingFace Inference API Integration
Uses pre-trained deepfake detection models from HuggingFace
No local model loading - all processing on HF servers
"""

import os
import cv2
import numpy as np
import requests
import base64
from io import BytesIO
from PIL import Image
from typing import Dict, List

# HuggingFace API Configuration
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")  # Optional - free tier works without token
HF_API_URL = "https://api-inference.huggingface.co/models/"

# Model options (choose one)
MODELS = {
    "deepfake_detector": "dima806/deepfake_vs_real_image_detection",
    "ai_detector": "umm-maybe/AI-image-detector",
    "sdxl_detector": "Organika/sdxl-detector",
}

def query_huggingface(image_bytes: bytes, model_name: str = "deepfake_detector") -> Dict:
    """
    Query HuggingFace Inference API with image
    
    Args:
        image_bytes: Image as bytes
        model_name: Model to use (from MODELS dict)
    
    Returns:
        Dict with predictions
    """
    model_id = MODELS.get(model_name, MODELS["deepfake_detector"])
    api_url = HF_API_URL + model_id
    
    headers = {}
    if HF_API_TOKEN:
        headers["Authorization"] = f"Bearer {HF_API_TOKEN}"
    
    try:
        response = requests.post(
            api_url,
            headers=headers,
            data=image_bytes,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"HF API Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"HF API Exception: {e}")
        return None


def extract_key_frames(video_path: str, num_frames: int = 5) -> List[np.ndarray]:
    """Extract key frames from video for analysis"""
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames <= 0:
        cap.release()
        return []
    
    # Sample frames evenly
    frame_indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
    frames = []
    
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
        ret, frame = cap.read()
        if ret and frame is not None:
            frames.append(frame)
    
    cap.release()
    return frames


def frame_to_bytes(frame: np.ndarray) -> bytes:
    """Convert OpenCV frame to bytes for API"""
    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # Convert to PIL Image
    pil_image = Image.fromarray(rgb_frame)
    # Convert to bytes
    buffer = BytesIO()
    pil_image.save(buffer, format="JPEG", quality=85)
    return buffer.getvalue()


def analyze_video_with_hf(video_path: str, num_frames: int = 5) -> Dict:
    """
    Analyze video using HuggingFace API
    
    Args:
        video_path: Path to video file
        num_frames: Number of frames to analyze
    
    Returns:
        Dict with analysis results
    """
    print(f"\n[HF] Analyzing video with HuggingFace API...")
    
    # Extract frames
    frames = extract_key_frames(video_path, num_frames)
    if not frames:
        return {
            "error": "Could not extract frames from video",
            "output": "REAL",
            "confidence": 50.0
        }
    
    print(f"[HF] Extracted {len(frames)} frames")
    
    # Analyze each frame
    results = []
    for i, frame in enumerate(frames):
        print(f"[HF] Analyzing frame {i+1}/{len(frames)}...")
        
        # Convert frame to bytes
        image_bytes = frame_to_bytes(frame)
        
        # Query HuggingFace API
        prediction = query_huggingface(image_bytes)
        
        if prediction:
            results.append(prediction)
            print(f"[HF] Frame {i+1} result: {prediction}")
        else:
            print(f"[HF] Frame {i+1} failed")
    
    if not results:
        return {
            "error": "HuggingFace API failed for all frames",
            "output": "REAL",
            "confidence": 50.0,
            "note": "Falling back to local OpenCV analysis"
        }
    
    # Aggregate results
    return aggregate_hf_results(results)


def aggregate_hf_results(results: List[Dict]) -> Dict:
    """
    Aggregate predictions from multiple frames
    
    HF models return format like:
    [
        {"label": "REAL", "score": 0.95},
        {"label": "FAKE", "score": 0.05}
    ]
    """
    fake_scores = []
    real_scores = []
    
    for result in results:
        if isinstance(result, list):
            for pred in result:
                label = pred.get("label", "").upper()
                score = pred.get("score", 0.0)
                
                if "FAKE" in label or "AI" in label or "GENERATED" in label:
                    fake_scores.append(score)
                elif "REAL" in label or "AUTHENTIC" in label:
                    real_scores.append(score)
    
    # Calculate average scores
    avg_fake = np.mean(fake_scores) if fake_scores else 0.0
    avg_real = np.mean(real_scores) if real_scores else 0.0
    
    # Determine verdict
    if avg_fake > avg_real:
        verdict = "FAKE"
        confidence = avg_fake * 100
    else:
        verdict = "REAL"
        confidence = avg_real * 100
    
    return {
        "output": verdict,
        "confidence": round(confidence, 2),
        "probabilities": {
            "fake": round(avg_fake * 100, 2),
            "real": round(avg_real * 100, 2)
        },
        "frames_analyzed": len(results),
        "model": "HuggingFace Inference API",
        "detection_method": "Deep Learning (Remote)"
    }


# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python hf_detector.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    result = analyze_video_with_hf(video_path, num_frames=5)
    
    import json
    print(json.dumps(result, indent=2))
