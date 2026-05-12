#!/bin/bash

# Fix Nginx Configuration for DeepScan AI

echo "=========================================="
echo "Fixing Nginx Configuration"
echo "=========================================="
echo ""

# Remove old symlink if exists
echo "[1/5] Removing old symlink..."
sudo rm -f /etc/nginx/sites-enabled/deepscan
echo "✓ Done"
echo ""

# Copy config to sites-available
echo "[2/5] Copying Nginx config..."
sudo cp ~/DeepScan-AI/nginx-config.conf /etc/nginx/sites-available/deepscan
echo "✓ Done"
echo ""

# Create symlink
echo "[3/5] Creating symlink..."
sudo ln -sf /etc/nginx/sites-available/deepscan /etc/nginx/sites-enabled/deepscan
echo "✓ Done"
echo ""

# Test Nginx config
echo "[4/5] Testing Nginx configuration..."
sudo nginx -t
echo ""

# Reload Nginx
echo "[5/5] Reloading Nginx..."
sudo systemctl reload nginx
echo "✓ Done"
echo ""

echo "=========================================="
echo "Testing endpoints..."
echo "=========================================="
echo ""

# Test health
echo "Health check:"
curl -s http://localhost/health
echo ""
echo ""

# Test frontend
echo "Frontend check:"
curl -s http://localhost/ | head -20
echo ""
echo ""

echo "=========================================="
echo "✓ Configuration updated!"
echo "=========================================="
echo ""
echo "Your URLs:"
echo "  Frontend: http://32.194.89.63"
echo "  Health:   http://32.194.89.63/health"
echo ""
