#!/bin/bash

# ============================================================
# DeepScan AI - Quick EC2 Setup Script
# Run this on your EC2 instance
# ============================================================

set -e

echo "============================================================"
echo "  🚀 DeepScan AI - Quick Setup for EC2"
echo "  IP: 32.194.89.63"
echo "============================================================"
echo ""

# Update system
echo "📦 Step 1/7: Updating system..."
sudo apt update -y
sudo apt upgrade -y

# Install Python
echo "🐍 Step 2/7: Installing Python 3..."
sudo apt install -y python3 python3-pip python3-venv

# Install Git
echo "📥 Step 3/7: Installing Git..."
sudo apt install -y git

# Install OpenCV dependencies
echo "📦 Step 4/7: Installing OpenCV dependencies..."
sudo apt install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev

# Install screen for background process
echo "📺 Step 5/7: Installing screen..."
sudo apt install -y screen

# Clone repository
echo "📂 Step 6/7: Cloning repository..."
cd ~
if [ -d "DeepScan-AI" ]; then
    echo "⚠️  Repository exists, pulling latest..."
    cd DeepScan-AI
    git pull
else
    echo "Enter your GitHub repository URL:"
    echo "Example: https://github.com/username/repo.git"
    read -p "URL: " REPO_URL
    git clone "$REPO_URL" DeepScan-AI
    cd DeepScan-AI
fi

# Setup backend
echo "🔧 Step 7/7: Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create directories
mkdir -p temp_uploads processed_media

echo ""
echo "============================================================"
echo "  ✅ Setup Complete!"
echo "============================================================"
echo ""
echo "🌐 Your Backend URLs:"
echo "   - API: http://32.194.89.63:8080"
echo "   - Health: http://32.194.89.63:8080/health"
echo "   - Docs: http://32.194.89.63:8080/docs"
echo ""
echo "🚀 To start backend:"
echo "   cd ~/DeepScan-AI/backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "📺 To run in background (recommended):"
echo "   screen -S backend"
echo "   cd ~/DeepScan-AI/backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo "   # Press Ctrl+A then D to detach"
echo ""
echo "============================================================"
