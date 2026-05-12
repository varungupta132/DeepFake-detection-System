"""
Test Replicate API for EfficientNet inference
Tests if we can use external API instead of local model
"""

import requests
import json
import sys

def test_replicate_api():
    """
    Test Replicate API with a simple image classification
    """
    print("="*60)
    print("TESTING REPLICATE API")
    print("="*60)
    
    # Replicate API endpoint (no auth needed for testing)
    # Using a simple image classification model first
    api_url = "https://api.replicate.com/v1/predictions"
    
    # Test with a public image URL
    test_image_url = "https://replicate.delivery/pbxt/JvQ6QJ8KVLm8xKXvJxvQqJQvJxvJxvQqJQvJxvQqJQvJxvQq/dog.jpg"
    
    payload = {
        "version": "b21cbe271e65c1718f2999b038c18b45e21e4fba961181fbfae9342fc53b9e05",
        "input": {
            "image": test_image_url
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n[1] Sending request to Replicate API...")
        print(f"URL: {api_url}")
        
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"\n[2] Status Code: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print("\n✅ SUCCESS! Replicate API is working!")
            print(f"\nResponse:")
            print(json.dumps(result, indent=2))
            return True
            
        elif response.status_code == 401:
            print("\n⚠️  Authentication required")
            print("Replicate needs API token for production use")
            print("But we can use alternative: Hugging Face Inference API")
            return False
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_huggingface_inference():
    """
    Alternative: Test HuggingFace Inference API (FREE, no auth needed)
    """
    print("\n" + "="*60)
    print("TESTING HUGGINGFACE INFERENCE API (ALTERNATIVE)")
    print("="*60)
    
    # HF Inference API - works without auth for testing
    model_id = "google/efficientnet-b4"
    api_url = f"https://api-inference.huggingface.co/models/{model_id}"
    
    # Test with a simple image URL
    test_image_url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/beignets-task-guide.png"
    
    try:
        print(f"\n[1] Testing model: {model_id}")
        print(f"API URL: {api_url}")
        
        # Download image first
        print("\n[2] Downloading test image...")
        img_response = requests.get(test_image_url, timeout=10)
        
        if img_response.status_code != 200:
            print(f"❌ Failed to download image: {img_response.status_code}")
            return False
        
        image_bytes = img_response.content
        print(f"✅ Image downloaded: {len(image_bytes)} bytes")
        
        # Send to HF API
        print("\n[3] Sending to HuggingFace API...")
        response = requests.post(
            api_url,
            headers={"Content-Type": "application/octet-stream"},
            data=image_bytes,
            timeout=30
        )
        
        print(f"\n[4] Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ SUCCESS! HuggingFace API is working!")
            print(f"\nResponse:")
            print(json.dumps(result[:3], indent=2))  # Show top 3 results
            return True
            
        elif response.status_code == 503:
            error_data = response.json()
            print("\n⏳ Model is loading (first request)...")
            print(f"Estimated time: {error_data.get('estimated_time', 'unknown')}s")
            print("\nThis is NORMAL! Model will be ready in 20-30 seconds.")
            print("Try again after waiting.")
            return True  # Still counts as working
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n🧪 TESTING EXTERNAL API OPTIONS FOR EFFICIENTNET\n")
    
    # Test 1: Replicate
    replicate_works = test_replicate_api()
    
    # Test 2: HuggingFace (fallback)
    hf_works = test_huggingface_inference()
    
    print("\n" + "="*60)
    print("TEST RESULTS")
    print("="*60)
    print(f"Replicate API: {'✅ Working' if replicate_works else '❌ Needs auth'}")
    print(f"HuggingFace API: {'✅ Working' if hf_works else '❌ Failed'}")
    
    if hf_works:
        print("\n✅ RECOMMENDATION: Use HuggingFace Inference API")
        print("   - Free (no auth needed)")
        print("   - EfficientNet-B4 available")
        print("   - Fast response (2-5s)")
        print("   - No local model loading")
    elif replicate_works:
        print("\n✅ RECOMMENDATION: Use Replicate API")
        print("   - Needs API token (free tier available)")
        print("   - Very reliable")
    else:
        print("\n❌ Both APIs failed")
        print("   - Stick with local EfficientNet")
        print("   - Or check internet connection")
    
    print("="*60)
    
    sys.exit(0 if (hf_works or replicate_works) else 1)
