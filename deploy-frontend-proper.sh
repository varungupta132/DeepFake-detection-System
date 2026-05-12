#!/bin/bash

# Deploy Frontend to Proper Web Directory

echo "=========================================="
echo "DeepScan AI - Frontend Deployment"
echo "=========================================="
echo ""

# Create web directory
echo "[1/6] Creating web directory..."
sudo mkdir -p /var/www/deepscan
echo "✓ Done"
echo ""

# Copy frontend files
echo "[2/6] Copying frontend files..."
sudo cp -r ~/DeepScan-AI/frontend/* /var/www/deepscan/
echo "✓ Done"
echo ""

# Set proper permissions
echo "[3/6] Setting permissions..."
sudo chown -R www-data:www-data /var/www/deepscan
sudo chmod -R 755 /var/www/deepscan
echo "✓ Done"
echo ""

# Update Nginx config
echo "[4/6] Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/deepscan > /dev/null <<'EOF'
server {
    listen 80;
    server_name 32.194.89.63;

    # Root directory for frontend
    root /var/www/deepscan;
    index index.html;

    # Serve frontend files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for video processing
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
        
        # Increase max body size for video uploads
        client_max_body_size 100M;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8080/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # API docs
    location /docs {
        proxy_pass http://127.0.0.1:8080/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
EOF
echo "✓ Done"
echo ""

# Enable site
echo "[5/6] Enabling site..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/deepscan /etc/nginx/sites-enabled/deepscan
echo "✓ Done"
echo ""

# Test and reload Nginx
echo "[6/6] Testing and reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx
echo "✓ Done"
echo ""

echo "=========================================="
echo "Testing deployment..."
echo "=========================================="
echo ""

# Test health
echo "Health check:"
curl -s http://localhost/health
echo ""
echo ""

# Test frontend
echo "Frontend check:"
if curl -s http://localhost/ | grep -q "DeepScan"; then
    echo "✓ Frontend is working!"
else
    echo "✗ Frontend test failed"
fi
echo ""

echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Your URLs:"
echo "  Frontend: http://32.194.89.63"
echo "  Health:   http://32.194.89.63/health"
echo "  API Docs: http://32.194.89.63/docs"
echo ""
echo "Open http://32.194.89.63 in your browser!"
echo ""
