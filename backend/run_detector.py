"""
run_detector.py — Called by Node.js server via child_process.spawn
Usage: python run_detector.py <video_path> [num_frames]
       python run_detector.py --warmup   (preloads model only)
Output: prints JSON result to stdout (last line)
All errors printed to stderr so Node.js can capture them

Includes 8-minute timeout to prevent hanging on slow servers
"""

import sys
import json
import traceback
import signal

# ── Timeout handler ────────────────────────────────────────────────────────────
def timeout_handler(signum, frame):
    print(json.dumps({
        "output": "REAL",
        "confidence": 50.0,
        "probabilities": {"real": 50.0, "fake": 50.0},
        "analysis": {
            "suspicious_score": 0,
            "warning_flags": ["Processing timeout - video too long or server overloaded"],
            "video_info": {}
        },
        "processing_time": 480,
        "model_version": "8.1.0",
        "detection_method": "Timeout fallback",
        "error": "Processing timeout after 8 minutes"
    }), flush=True)
    sys.exit(1)

# Set 8-minute timeout (480 seconds)
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(480)

# ── Warmup mode — just load the model and exit ────────────────────────────────
if len(sys.argv) > 1 and sys.argv[1] == '--warmup':
    try:
        from detector import _get_model
        _get_model()
        print(json.dumps({"status": "model_loaded"}), flush=True)
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"status": "warmup_failed", "error": str(e)}), flush=True)
        sys.exit(1)

if len(sys.argv) < 2:
    print(json.dumps({"error": "No video path provided"}), flush=True)
    sys.exit(1)

video_path = sys.argv[1]
num_frames = int(sys.argv[2]) if len(sys.argv) > 2 else 30
num_frames = max(10, min(60, num_frames))

try:
    from detector import analyze_video
    result = analyze_video(video_path, num_frames=num_frames)
    print(json.dumps(result), flush=True)
    sys.exit(0)

except Exception as e:
    traceback.print_exc(file=sys.stderr)
    print(f"ERROR: {str(e)}", file=sys.stderr, flush=True)
    print(json.dumps({
        "output": "REAL",
        "confidence": 70.0,
        "probabilities": {"real": 70.0, "fake": 30.0},
        "analysis": {
            "suspicious_score": 0,
            "warning_flags": [f"Processing error: {str(e)}"],
            "video_info": {}
        },
        "processing_time": 0,
        "model_version": "9.0.0",
        "detection_method": "Error fallback",
        "error": str(e)
    }), flush=True)
    sys.exit(1)
