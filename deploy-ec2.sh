#!/bin/bash

# ============================================================
# DeepScan AI - AWS EC2 Deployment Script
# Automatic setup for Ubuntu 24.04 LTS
# ============================================================

set -e  # Exit on any error

echo "============================================================"
echo "  DeepScan AI - EC2 Deployment Starting..."
echo "============================================================"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Python 3.12 and pip
echo "🐍 Installing Python 3.12..."
sudo apt install -y python3 python3-pip python3-venv

# Install Git
echo "📥 Installing Git..."
sudo apt install -y git

# Install system dependencies for OpenCV
echo "📦 Installing OpenCV dependencies..."
sudo apt install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev

# Clone repository
echo "📂 Cloning DeepScan AI repository..."
cd ~
if [ -d "DeepScan-AI" ]; then
    echo "⚠️  Repository already exists, pulling latest changes..."
    cd DeepScan-AI
    git pull
else
    # Replace with your GitHub repository URL
    read -p "Enter your GitHub repository URL: " REPO_URL
    git clone "$REPO_URL" DeepScan-AI
    cd DeepScan-AI
fi

# Create virtual environment
echo "🔧 Creating Python virtual environment..."
cd backend
python3 -m venv venv

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating upload directories..."
mkdir -p temp_uploads
mkdir -p processed_media

# Get EC2 public IP
echo "🌐 Getting EC2 public IP..."
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "✅ Your EC2 Public IP: $EC2_IP"

echo ""
echo "============================================================"
echo "  ✅ Installation Complete!"
echo "============================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start the backend server:"
echo "   cd ~/DeepScan-AI/backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "2. Update frontend with this IP: $EC2_IP"
echo "   Replace 'YOUR_EC2_PUBLIC_IP' with: $EC2_IP"
echo ""
echo "3. Backend will run on: http://$EC2_IP:8080"
echo "   API docs: http://$EC2_IP:8080/docs"
echo ""
echo "============================================================"
