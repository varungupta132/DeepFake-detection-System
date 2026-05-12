#!/bin/bash

# DeepScan AI - Complete EC2 Deployment Script
# This script deploys both backend and frontend on EC2

set -e  # Exit on error

echo "=========================================="
echo "DeepScan AI - Full EC2 Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Update repository
echo -e "${YELLOW}[1/7] Updating repository...${NC}"
cd ~/DeepScan-AI
git fetch origin
git reset --hard origin/main
echo -e "${GREEN}✓ Repository updated${NC}"
echo ""

# Step 2: Update Nginx configuration
echo -e "${YELLOW}[2/7] Updating Nginx configuration...${NC}"
sudo cp ~/DeepScan-AI/nginx-config.conf /etc/nginx/sites-available/deepscan
echo -e "${GREEN}✓ Nginx config updated${NC}"
echo ""

# Step 3: Test Nginx configuration
echo -e "${YELLOW}[3/7] Testing Nginx configuration...${NC}"
sudo nginx -t
echo -e "${GREEN}✓ Nginx config is valid${NC}"
echo ""

# Step 4: Reload Nginx
echo -e "${YELLOW}[4/7] Reloading Nginx...${NC}"
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# Step 5: Check if backend is running
echo -e "${YELLOW}[5/7] Checking backend status...${NC}"
if pgrep -f "python main.py" > /dev/null; then
    echo -e "${GREEN}✓ Backend is already running${NC}"
else
    echo -e "${YELLOW}Starting backend...${NC}"
    cd ~/DeepScan-AI/backend
    source venv/bin/activate
    nohup python main.py > backend.log 2>&1 &
    sleep 3
    if pgrep -f "python main.py" > /dev/null; then
        echo -e "${GREEN}✓ Backend started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start backend${NC}"
        exit 1
    fi
fi
echo ""

# Step 6: Test endpoints
echo -e "${YELLOW}[6/7] Testing endpoints...${NC}"

# Test frontend
if curl -s http://localhost/ | grep -q "DeepScan"; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}✗ Frontend test failed${NC}"
fi

# Test health endpoint
if curl -s http://localhost/health | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health endpoint is working${NC}"
else
    echo -e "${RED}✗ Health endpoint test failed${NC}"
fi
echo ""

# Step 7: Display URLs
echo -e "${YELLOW}[7/7] Deployment complete!${NC}"
echo ""
echo "=========================================="
echo -e "${GREEN}✓ DeepScan AI is now live!${NC}"
echo "=========================================="
echo ""
echo "Your URLs:"
echo "  Frontend:    http://32.194.89.63"
echo "  Health:      http://32.194.89.63/health"
echo "  API Docs:    http://32.194.89.63/docs"
echo "  API Predict: http://32.194.89.63/api/predict/"
echo ""
echo "Useful commands:"
echo "  View Nginx logs:   sudo tail -f /var/log/nginx/access.log"
echo "  View backend logs: tail -f ~/DeepScan-AI/backend/backend.log"
echo "  Restart Nginx:     sudo systemctl restart nginx"
echo "  Check backend:     ps aux | grep python"
echo ""
echo "=========================================="
