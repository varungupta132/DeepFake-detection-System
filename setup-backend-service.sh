#!/bin/bash

# Setup Backend as Systemd Service (Runs Permanently)

echo "=========================================="
echo "DeepScan AI - Backend Service Setup"
echo "=========================================="
echo ""

# Stop any existing backend processes
echo "[1/4] Stopping existing backend processes..."
pkill -f "python main.py" || true
sleep 2
echo "✓ Done"
echo ""

# Create systemd service file
echo "[2/4] Creating systemd service..."
sudo tee /etc/systemd/system/deepscan-backend.service > /dev/null <<EOF
[Unit]
Description=DeepScan AI Backend Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/DeepScan-AI/backend
Environment="PATH=/home/ubuntu/DeepScan-AI/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/home/ubuntu/DeepScan-AI/backend/venv/bin/python main.py
Restart=always
RestartSec=10
StandardOutput=append:/home/ubuntu/DeepScan-AI/backend/backend.log
StandardError=append:/home/ubuntu/DeepScan-AI/backend/backend.log

[Install]
WantedBy=multi-user.target
EOF
echo "✓ Service file created"
echo ""

# Reload systemd and enable service
echo "[3/4] Enabling service..."
sudo systemctl daemon-reload
sudo systemctl enable deepscan-backend.service
echo "✓ Service enabled (will start on boot)"
echo ""

# Start service
echo "[4/4] Starting service..."
sudo systemctl start deepscan-backend.service
sleep 3
echo "✓ Service started"
echo ""

echo "=========================================="
echo "Service Status:"
echo "=========================================="
sudo systemctl status deepscan-backend.service --no-pager
echo ""

echo "=========================================="
echo "Testing Backend:"
echo "=========================================="
curl -s http://localhost:8080/health
echo ""
echo ""

echo "=========================================="
echo "✓ Backend Service Setup Complete!"
echo "=========================================="
echo ""
echo "Useful Commands:"
echo "  Check status:   sudo systemctl status deepscan-backend"
echo "  Stop service:   sudo systemctl stop deepscan-backend"
echo "  Start service:  sudo systemctl start deepscan-backend"
echo "  Restart:        sudo systemctl restart deepscan-backend"
echo "  View logs:      sudo journalctl -u deepscan-backend -f"
echo "  View log file:  tail -f ~/DeepScan-AI/backend/backend.log"
echo ""
