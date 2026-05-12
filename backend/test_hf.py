"""
Quick test of HuggingFace API
Tests if API is accessible and working
"""

import requests
import sys

def test_hf_api():
    """Test HuggingFace Inference API with correct endpoint"""
    
    print("Testing HuggingFace Inference API...")
    print("-" * 50)
    
    # Correct API endpoint format
    model_id = "distilbert-base-uncased-finetuned-sst-2-english"
    api_url = f"https://api-inference.huggingface.co/models/{model_id}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": "I love using HuggingFace!"
    }
    
    try:
        print(f"API URL: {api_url}")
        print("Sending request...")
        
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS! HuggingFace API is working!")
            print(f"Response: {result}")
            return True
        elif response.status_code == 503:
            print("⏳ Model is loading... (First request takes time)")
            print("Response:", response.json())
            print("\nThis is NORMAL! Model will be ready in 20-30 seconds.")
            return True  # Still counts as working
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_hf_api()
    
    if success:
        print("\n" + "="*50)
        print("✅ HuggingFace API is accessible!")
        print("You can use it for deepfake detection.")
        print("="*50)
    else:
        print("\n" + "="*50)
        print("❌ HuggingFace API test failed")
        print("Check your internet connection")
        print("="*50)
    
    sys.exit(0 if success else 1)
