# 🚀 DeepScan AI - AWS EC2 Deployment Guide

## ✅ Instance Details
- **Public IP**: `32.194.89.63`
- **Instance ID**: `i-080f24a1f9a33edf7`
- **Key Pair**: `deepfake-ke`
- **Region**: us-east-1

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Connect to EC2 via SSH**

#### **Windows (Using Git Bash or WSL):**

1. Open **Git Bash** or **PowerShell**
2. Navigate to where your `deepfake-ke.pem` file is saved
3. Run these commands:

```bash
# Set correct permissions for key file
chmod 400 deepfake-ke.pem

# Connect to EC2
ssh -i deepfake-ke.pem ubuntu@32.194.89.63
```

#### **If you get "Permission denied" error:**
```bash
# Use this command instead
ssh -i "deepfake-ke.pem" ubuntu@32.194.89.63
```

---

### **STEP 2: Run Deployment Script**

Once connected to EC2, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3 python3-pip python3-venv git

# Install OpenCV dependencies
sudo apt install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev

# Clone your repository
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git DeepScan-AI
cd DeepScan-AI/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install --upgrade pip
pip install -r requirements.txt

# Create directories
mkdir -p temp_uploads processed_media

# Start backend
python main.py
```

---

### **STEP 3: Keep Backend Running (Background Process)**

To keep backend running even after closing SSH:

```bash
# Install screen
sudo apt install -y screen

# Start a new screen session
screen -S backend

# Run backend
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py

# Detach from screen: Press Ctrl+A then D
# To reattach: screen -r backend
```

---

## 🌐 **Your Backend URLs:**

- **API Base**: `http://32.194.89.63:8080`
- **Health Check**: `http://32.194.89.63:8080/health`
- **API Docs**: `http://32.194.89.63:8080/docs`
- **Predict Endpoint**: `http://32.194.89.63:8080/api/predict/`

---

## 🎨 **Frontend Update:**

Your frontend will be updated to use: `http://32.194.89.63:8080`

---

## 🔧 **Useful Commands:**

```bash
# Check if backend is running
curl http://32.194.89.63:8080/health

# View backend logs
cd ~/DeepScan-AI/backend
tail -f nohup.out

# Stop backend
pkill -f "python main.py"

# Restart backend
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py
```

---

## ⚠️ **Troubleshooting:**

### **Can't connect via SSH?**
- Check if `.pem` file has correct permissions: `chmod 400 deepfake-ke.pem`
- Verify security group has SSH (port 22) rule

### **Backend not accessible?**
- Check if port 8080 is in security group rules
- Verify backend is running: `ps aux | grep python`

### **Out of memory?**
- t3.micro has only 1GB RAM
- Monitor with: `free -h`
- Consider upgrading to t3.small if needed

---

## 📞 **Need Help?**

If you face any issues, share the error message!
