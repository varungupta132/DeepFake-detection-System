# 🚀 DeepScan AI - Complete EC2 Deployment (Backend + Frontend)

## 📋 Current Setup
- **EC2 IP**: `32.194.89.63`
- **Backend**: Already running on port 8080
- **Nginx**: Already installed and running on port 80
- **Goal**: Serve frontend from EC2 + Backend API from same server

---

## 🎯 **Architecture:**

```
User Browser
    ↓
http://32.194.89.63 (Port 80)
    ↓
Nginx (Reverse Proxy)
    ├── / → Frontend (HTML/CSS/JS)
    └── /api/* → Backend (Port 8080)
```

**Benefits:**
- ✅ No Mixed Content issues (both on same domain)
- ✅ No CORS issues
- ✅ Single IP address for everything
- ✅ Fast communication (no external calls)

---

## 🛠️ **DEPLOYMENT STEPS:**

### **STEP 1: Connect to EC2**

```bash
ssh -i "deepfake-ke.pem" ubuntu@32.194.89.63
```

---

### **STEP 2: Update Repository on EC2**

```bash
# Go to project directory
cd ~/DeepScan-AI

# Pull latest changes
git pull origin main

# If pull fails, force update
git fetch origin
git reset --hard origin/main
```

---

### **STEP 3: Update Nginx Configuration**

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/deepscan
```

**Replace entire content with this:**

```nginx
server {
    listen 80;
    server_name 32.194.89.63;

    # Root directory for frontend
    root /home/ubuntu/DeepScan-AI/frontend;
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
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### **STEP 4: Test and Reload Nginx**

```bash
# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

---

### **STEP 5: Update Frontend to Use Relative URLs**

The frontend should use relative URLs (no IP address) since it's on the same server.

```bash
# Edit app.js on EC2
nano ~/DeepScan-AI/frontend/js/app.js
```

**Find this line (around line 233):**
```javascript
const backendUrl = 'http://32.194.89.63';
```

**Change to:**
```javascript
const backendUrl = '';  // Empty = same server
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### **STEP 6: Verify Backend is Running**

```bash
# Check if backend is running
ps aux | grep "python main.py" | grep -v grep

# If not running, start it
cd ~/DeepScan-AI/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &

# Check process
ps aux | grep "python main.py" | grep -v grep
```

---

### **STEP 7: Test Everything**

```bash
# Test frontend
curl http://localhost/

# Test health endpoint
curl http://localhost/health

# Test from outside
curl http://32.194.89.63/
curl http://32.194.89.63/health
```

---

## 🌐 **Your URLs After Deployment:**

| What | URL | Description |
|------|-----|-------------|
| **Frontend** | `http://32.194.89.63` | Main website |
| **Health Check** | `http://32.194.89.63/health` | Backend health |
| **API Docs** | `http://32.194.89.63/docs` | FastAPI docs |
| **API Predict** | `http://32.194.89.63/api/predict/` | Video analysis |

---

## ✅ **Benefits of This Setup:**

1. ✅ **No Mixed Content** - Everything on HTTP (same protocol)
2. ✅ **No CORS Issues** - Same origin
3. ✅ **Single URL** - Easy to remember
4. ✅ **Fast** - No external network calls
5. ✅ **Simple** - One server to manage

---

## 🔧 **Useful Commands:**

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check backend logs
tail -f ~/DeepScan-AI/backend/backend.log

# Restart Nginx
sudo systemctl restart nginx

# Restart backend
pkill -f "python main.py"
cd ~/DeepScan-AI/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &

# Check what's running on port 80
sudo netstat -tulpn | grep :80

# Check what's running on port 8080
sudo netstat -tulpn | grep :8080
```

---

## 🆘 **Troubleshooting:**

### **Frontend not loading:**
```bash
# Check if files exist
ls -la ~/DeepScan-AI/frontend/

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### **API not working:**
```bash
# Check if backend is running
ps aux | grep python

# Check backend logs
tail -f ~/DeepScan-AI/backend/backend.log

# Test backend directly
curl http://localhost:8080/health
```

### **502 Bad Gateway:**
```bash
# Backend is not running, start it
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py
```

---

## 📊 **Deployment Checklist:**

- [ ] SSH into EC2
- [ ] Pull latest code
- [ ] Update Nginx config
- [ ] Test Nginx config
- [ ] Reload Nginx
- [ ] Update frontend app.js (use relative URL)
- [ ] Verify backend is running
- [ ] Test frontend: `http://32.194.89.63`
- [ ] Test health: `http://32.194.89.63/health`
- [ ] Upload a video and test complete flow

---

**This is the proper production setup! Everything on one server! 🚀**
