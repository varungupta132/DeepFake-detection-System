# 🔧 EC2 Troubleshooting Guide

## ❌ Current Issue: Frontend shows 500 Error

### **Quick Fix - Run These Commands:**

```bash
# Make fix script executable
chmod +x ~/DeepScan-AI/fix-nginx.sh

# Run the fix script
~/DeepScan-AI/fix-nginx.sh
```

---

## 🔍 **Manual Fix (If Script Doesn't Work):**

### **Step 1: Check Nginx Error Logs**
```bash
sudo tail -20 /var/log/nginx/error.log
```

### **Step 2: Verify Frontend Files Exist**
```bash
ls -la ~/DeepScan-AI/frontend/
```

You should see:
- `index.html`
- `css/` folder
- `js/` folder
- `pages/` folder

### **Step 3: Fix Nginx Configuration**

```bash
# Remove old config
sudo rm -f /etc/nginx/sites-enabled/deepscan
sudo rm -f /etc/nginx/sites-enabled/default

# Copy new config
sudo cp ~/DeepScan-AI/nginx-config.conf /etc/nginx/sites-available/deepscan

# Create symlink
sudo ln -sf /etc/nginx/sites-available/deepscan /etc/nginx/sites-enabled/deepscan

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### **Step 4: Check Permissions**
```bash
# Make sure Nginx can read frontend files
sudo chmod -R 755 ~/DeepScan-AI/frontend/
```

### **Step 5: Test Again**
```bash
# Test health
curl http://localhost/health

# Test frontend
curl http://localhost/
```

---

## 🆘 **Common Issues & Solutions:**

### **Issue 1: 500 Internal Server Error**

**Cause:** Nginx can't access frontend files

**Solution:**
```bash
# Check if files exist
ls -la ~/DeepScan-AI/frontend/index.html

# Fix permissions
sudo chmod -R 755 ~/DeepScan-AI/frontend/

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

---

### **Issue 2: 502 Bad Gateway**

**Cause:** Backend is not running

**Solution:**
```bash
# Check if backend is running
ps aux | grep "python main.py" | grep -v grep

# If not running, start it
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py

# Or run in background
nohup python main.py > backend.log 2>&1 &
```

---

### **Issue 3: 404 Not Found**

**Cause:** Nginx config not loaded properly

**Solution:**
```bash
# Check which config is active
sudo nginx -T | grep "server_name"

# Reload Nginx
sudo systemctl reload nginx

# Or restart Nginx
sudo systemctl restart nginx
```

---

### **Issue 4: Port 8080 Already in Use**

**Cause:** Multiple backend instances running

**Solution:**
```bash
# Find all Python processes
ps aux | grep python

# Kill old backend process
pkill -f "python main.py"

# Wait 2 seconds
sleep 2

# Start fresh
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py
```

---

### **Issue 5: Nginx Won't Start**

**Cause:** Configuration error

**Solution:**
```bash
# Test config
sudo nginx -t

# Check what's wrong
sudo systemctl status nginx

# View detailed logs
sudo journalctl -u nginx -n 50
```

---

## 🔍 **Diagnostic Commands:**

```bash
# Check all running processes
ps aux | grep -E "python|nginx"

# Check ports in use
sudo netstat -tulpn | grep -E ":80|:8080"

# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -T

# View Nginx access log
sudo tail -f /var/log/nginx/access.log

# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# View backend log
tail -f ~/DeepScan-AI/backend/backend.log

# Check disk space
df -h

# Check memory usage
free -h

# Check system load
top
```

---

## 🎯 **Complete Reset (Nuclear Option):**

If nothing works, start fresh:

```bash
# Stop everything
sudo systemctl stop nginx
pkill -f "python main.py"

# Remove old configs
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/deepscan

# Pull fresh code
cd ~/DeepScan-AI
git fetch origin
git reset --hard origin/main

# Copy new config
sudo cp nginx-config.conf /etc/nginx/sites-available/deepscan
sudo ln -sf /etc/nginx/sites-available/deepscan /etc/nginx/sites-enabled/deepscan

# Test and start Nginx
sudo nginx -t
sudo systemctl start nginx

# Start backend
cd ~/DeepScan-AI/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &

# Wait 3 seconds
sleep 3

# Test
curl http://localhost/health
curl http://localhost/
```

---

## ✅ **Expected Results:**

### **Health Check:**
```bash
curl http://localhost/health
```
**Should return:**
```json
{"status":"healthy","version":"9.0.0","detection_method":"Pure OpenCV + 5-Signal CV Fusion"}
```

### **Frontend:**
```bash
curl http://localhost/
```
**Should return:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DeepScan AI — Deepfake Detection</title>
    ...
```

---

## 📞 **Still Not Working?**

Share these outputs:

```bash
# 1. Nginx error log
sudo tail -20 /var/log/nginx/error.log

# 2. Backend status
ps aux | grep python

# 3. Nginx config test
sudo nginx -t

# 4. File permissions
ls -la ~/DeepScan-AI/frontend/

# 5. Port status
sudo netstat -tulpn | grep -E ":80|:8080"
```

---

**Good luck! 🚀**
