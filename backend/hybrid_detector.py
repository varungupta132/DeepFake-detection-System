"""
Hybrid Detector - Combines OpenCV (fast) + HuggingFace API (accurate)

Strategy:
1. Quick OpenCV checks (< 10 seconds)
2. If suspicious, verify with HuggingFace API (5-10 seconds)
3. Combine results for final verdict

Benefits:
- Fast for obvious real videos (OpenCV only)
- Accurate for suspicious videos (OpenCV + HF)
- No local model loading
- Fallback if HF API fails
"""

import time
from typing import Dict
from detector import analyze_video as opencv_analyze
from hf_detector import analyze_video_with_hf

def hybrid_analyze(video_path: str, num_frames: int = 30) -> Dict:
    """
    Hybrid analysis: OpenCV + HuggingFace
    
    Args:
        video_path: Path to video
        num_frames: Frames to analyze
    
    Returns:
        Combined analysis results
    """
    t0 = time.time()
    
    print("\n" + "="*60)
    print("HYBRID ANALYSIS: OpenCV + HuggingFace")
    print("="*60)
    
    # Step 1: Quick OpenCV analysis
    print("\n[STEP 1] Running OpenCV analysis...")
    opencv_result = opencv_analyze(video_path, num_frames=num_frames)
    opencv_time = time.time() - t0
    
    opencv_suspicious = opencv_result.get("analysis", {}).get("suspicious_score", 0)
    opencv_verdict = opencv_result.get("output", "REAL")
    
    print(f"[OPENCV] Verdict: {opencv_verdict}")
    print(f"[OPENCV] Suspicious Score: {opencv_suspicious:.1f}/100")
    print(f"[OPENCV] Time: {opencv_time:.1f}s")
    
    # Step 2: Decide if HuggingFace verification needed
    SUSPICIOUS_THRESHOLD = 30.0  # If score > 30, verify with HF
    
    if opencv_suspicious < SUSPICIOUS_THRESHOLD and opencv_verdict == "REAL":
        # Clearly real - no need for HF verification
        print(f"\n[DECISION] Video appears REAL (score: {opencv_suspicious:.1f})")
        print("[DECISION] Skipping HuggingFace verification (saves time)")
        
        return {
            **opencv_result,
            "detection_method": "OpenCV Only (Fast Path)",
            "hf_verification": "Not needed - clearly real",
            "processing_time": round(opencv_time, 2)
        }
    
    # Step 3: HuggingFace verification for suspicious videos
    print(f"\n[DECISION] Video suspicious (score: {opencv_suspicious:.1f})")
    print("[STEP 2] Running HuggingFace verification...")
    
    try:
        hf_t0 = time.time()
        hf_result = analyze_video_with_hf(video_path, num_frames=5)
        hf_time = time.time() - hf_t0
        
        if "error" in hf_result:
            # HF failed - use OpenCV result
            print(f"[HF] Failed: {hf_result['error']}")
            print("[DECISION] Using OpenCV result as fallback")
            
            return {
                **opencv_result,
                "detection_method": "OpenCV Only (HF API Failed)",
                "hf_verification": f"Failed: {hf_result['error']}",
                "processing_time": round(time.time() - t0, 2)
            }
        
        hf_verdict = hf_result.get("output", "REAL")
        hf_confidence = hf_result.get("confidence", 50.0)
        
        print(f"[HF] Verdict: {hf_verdict}")
        print(f"[HF] Confidence: {hf_confidence:.1f}%")
        print(f"[HF] Time: {hf_time:.1f}s")
        
        # Step 4: Combine results
        print("\n[STEP 3] Combining results...")
        final_result = combine_results(opencv_result, hf_result)
        final_result["processing_time"] = round(time.time() - t0, 2)
        
        print(f"[FINAL] Verdict: {final_result['output']}")
        print(f"[FINAL] Confidence: {final_result['confidence']:.1f}%")
        print(f"[FINAL] Total Time: {final_result['processing_time']:.1f}s")
        
        return final_result
        
    except Exception as e:
        print(f"[HF] Exception: {e}")
        print("[DECISION] Using OpenCV result as fallback")
        
        return {
            **opencv_result,
            "detection_method": "OpenCV Only (HF Exception)",
            "hf_verification": f"Exception: {str(e)}",
            "processing_time": round(time.time() - t0, 2)
        }


def combine_results(opencv_result: Dict, hf_result: Dict) -> Dict:
    """
    Combine OpenCV and HuggingFace results
    
    Strategy:
    - If both agree: High confidence
    - If disagree: Weight HF more (70% HF, 30% OpenCV)
    - HF is more accurate but OpenCV provides context
    """
    opencv_verdict = opencv_result.get("output", "REAL")
    opencv_conf = opencv_result.get("confidence", 50.0)
    opencv_susp = opencv_result.get("analysis", {}).get("suspicious_score", 0)
    
    hf_verdict = hf_result.get("output", "REAL")
    hf_conf = hf_result.get("confidence", 50.0)
    
    # Both agree
    if opencv_verdict == hf_verdict:
        # Boost confidence when both agree
        combined_conf = min(95.0, (opencv_conf + hf_conf) / 2 + 10)
        
        return {
            "output": opencv_verdict,
            "confidence": round(combined_conf, 2),
            "probabilities": {
                "real": round(100 - combined_conf if opencv_verdict == "FAKE" else combined_conf, 2),
                "fake": round(combined_conf if opencv_verdict == "FAKE" else 100 - combined_conf, 2)
            },
            "analysis": {
                **opencv_result.get("analysis", {}),
                "hf_confidence": hf_conf,
                "agreement": "Both models agree",
                "warning_flags": opencv_result.get("analysis", {}).get("warning_flags", []) + 
                                ["Both OpenCV and HuggingFace agree on verdict"]
            },
            "model_version": "Hybrid 1.0",
            "detection_method": "OpenCV + HuggingFace (Agreement)",
            "opencv_verdict": opencv_verdict,
            "hf_verdict": hf_verdict
        }
    
    # Disagree - weight HF more (70% HF, 30% OpenCV)
    else:
        # HF is more accurate, so trust it more
        if hf_verdict == "FAKE":
            # HF says fake, OpenCV says real
            # Weight: 70% HF fake confidence + 30% OpenCV suspicious score
            fake_score = (hf_conf * 0.7) + (opencv_susp * 0.3)
            final_verdict = "FAKE" if fake_score > 50 else "REAL"
            final_conf = fake_score if final_verdict == "FAKE" else (100 - fake_score)
        else:
            # HF says real, OpenCV says fake
            # Weight: 70% HF real confidence + 30% (100 - OpenCV suspicious)
            real_score = (hf_conf * 0.7) + ((100 - opencv_susp) * 0.3)
            final_verdict = "REAL" if real_score > 50 else "FAKE"
            final_conf = real_score if final_verdict == "REAL" else (100 - real_score)
        
        return {
            "output": final_verdict,
            "confidence": round(final_conf, 2),
            "probabilities": {
                "real": round(100 - final_conf if final_verdict == "FAKE" else final_conf, 2),
                "fake": round(final_conf if final_verdict == "FAKE" else 100 - final_conf, 2)
            },
            "analysis": {
                **opencv_result.get("analysis", {}),
                "hf_confidence": hf_conf,
                "agreement": "Models disagree - weighted decision",
                "warning_flags": opencv_result.get("analysis", {}).get("warning_flags", []) + 
                                [f"OpenCV: {opencv_verdict}, HuggingFace: {hf_verdict} (weighted 70% HF)"]
            },
            "model_version": "Hybrid 1.0",
            "detection_method": "OpenCV + HuggingFace (Weighted)",
            "opencv_verdict": opencv_verdict,
            "hf_verdict": hf_verdict
        }


# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python hybrid_detector.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    result = hybrid_analyze(video_path, num_frames=30)
    
    import json
    print("\n" + "="*60)
    print("FINAL RESULT:")
    print("="*60)
    print(json.dumps(result, indent=2))
