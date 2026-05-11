#!/bin/bash
set -e

echo "Installing Python and dependencies..."
apt-get update
apt-get install -y python3 python3-pip libgl1 libglib2.0-0

echo "Installing Python packages..."
pip3 install -r backend/requirements.txt

echo "Installing Node packages..."
cd node-backend
npm install

echo "Build complete!"
