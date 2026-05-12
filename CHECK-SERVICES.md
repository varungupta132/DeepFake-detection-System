# 🔍 Check What's Running on EC2

## 📊 **Quick Status Check:**

```bash
# Check all services
sudo systemctl status deepscan-backend nginx
```

---

## 🐍 **Check Backend:**

### **Method 1: Check Systemd Service**
```bash
# Check if service is running
sudo systemctl status deepscan-backend

# View service logs
sudo journalctl -u deepscan-backend -n 50

# Follow logs in real-time
sudo journalctl -u deepscan-backend -f
```

### **Method 2: Check Process**
```bash
# Check if Python backend is running
ps aux | grep "python main.py" | grep -v grep

# More detailed info
ps aux | grep python
```

### **Method 3: Check Port 8080**
```bash
# Check what's using port 8080
sudo netstat -tulpn | grep :8080

# Or using lsof
sudo lsof -i :8080
```

### **Method 4: Test Backend Directly**
```bash
# Test health endpoint
curl http://localhost:8080/health

# Test from outside
curl http://32.194.89.63/health
```

---

## 🌐 **Check Nginx:**

### **Check Nginx Status**
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx process
ps aux | grep nginx
```

### **Check Port 80**
```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Or using lsof
sudo lsof -i :80
```

### **Test Nginx**
```bash
# Test configuration
sudo nginx -t

# Test frontend
curl http://localhost/

# Test from outside
curl http://32.194.89.63/
```

---

## 📋 **Check All Ports:**

```bash
# List all listening ports
sudo netstat -tulpn

# Or using ss (faster)
sudo ss -tulpn

# Check specific ports
sudo netstat -tulpn | grep -E ":80|:8080|:443|:22"
```

---

## 🔧 **Check System Resources:**

### **Memory Usage**
```bash
# Check memory
free -h

# Detailed memory info
cat /proc/meminfo | head -20
```

### **CPU Usage**
```bash
# Real-time monitoring
top

# Or use htop (if installed)
htop

# Quick CPU check
uptime
```

### **Disk Usage**
```bash
# Check disk space
df -h

# Check directory sizes
du -sh ~/DeepScan-AI/*
```

### **Running Processes**
```bash
# All processes
ps aux

# Python processes only
ps aux | grep python

# Nginx processes
ps aux | grep nginx

# Sort by memory usage
ps aux --sort=-%mem | head -20

# Sort by CPU usage
ps aux --sort=-%cpu | head -20
```

---

## 🚀 **Backend Service Management:**

### **Start Backend**
```bash
sudo systemctl start deepscan-backend
```

### **Stop Backend**
```bash
sudo systemctl stop deepscan-backend
```

### **Restart Backend**
```bash
sudo systemctl restart deepscan-backend
```

### **Check Backend Status**
```bash
sudo systemctl status deepscan-backend
```

### **Enable Auto-Start on Boot**
```bash
sudo systemctl enable deepscan-backend
```

### **Disable Auto-Start**
```bash
sudo systemctl disable deepscan-backend
```

### **View Backend Logs**
```bash
# View systemd logs
sudo journalctl -u deepscan-backend -n 100

# Follow logs in real-time
sudo journalctl -u deepscan-backend -f

# View log file
tail -f ~/DeepScan-AI/backend/backend.log

# View last 50 lines
tail -50 ~/DeepScan-AI/backend/backend.log
```

---

## 🌐 **Nginx Management:**

### **Start Nginx**
```bash
sudo systemctl start nginx
```

### **Stop Nginx**
```bash
sudo systemctl stop nginx
```

### **Restart Nginx**
```bash
sudo systemctl restart nginx
```

### **Reload Nginx (without downtime)**
```bash
sudo systemctl reload nginx
```

### **Check Nginx Status**
```bash
sudo systemctl status nginx
```

### **View Nginx Logs**
```bash
# Access log (all requests)
sudo tail -f /var/log/nginx/access.log

# Error log
sudo tail -f /var/log/nginx/error.log

# Last 50 lines
sudo tail -50 /var/log/nginx/access.log
sudo tail -50 /var/log/nginx/error.log
```

---

## 🔍 **Complete System Check:**

Run this comprehensive check:

```bash
echo "=========================================="
echo "SYSTEM STATUS CHECK"
echo "=========================================="
echo ""

echo "1. Backend Service:"
sudo systemctl status deepscan-backend --no-pager | head -10
echo ""

echo "2. Nginx Service:"
sudo systemctl status nginx --no-pager | head -10
echo ""

echo "3. Ports in Use:"
sudo netstat -tulpn | grep -E ":80|:8080"
echo ""

echo "4. Python Processes:"
ps aux | grep python | grep -v grep
echo ""

echo "5. Memory Usage:"
free -h
echo ""

echo "6. Disk Usage:"
df -h | grep -E "Filesystem|/$"
echo ""

echo "7. Backend Health:"
curl -s http://localhost:8080/health
echo ""
echo ""

echo "8. Frontend Health:"
curl -s http://localhost/health
echo ""
echo ""

echo "=========================================="
echo "CHECK COMPLETE"
echo "=========================================="
```

---

## 🆘 **Troubleshooting:**

### **Backend Not Running:**
```bash
# Check why it failed
sudo systemctl status deepscan-backend

# View error logs
sudo journalctl -u deepscan-backend -n 50

# Try starting manually
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py
```

### **Port Already in Use:**
```bash
# Find what's using the port
sudo lsof -i :8080

# Kill the process (replace PID)
sudo kill -9 <PID>

# Or kill all Python processes
pkill -f "python main.py"
```

### **Service Won't Start:**
```bash
# Check service file
cat /etc/systemd/system/deepscan-backend.service

# Reload systemd
sudo systemctl daemon-reload

# Try starting again
sudo systemctl start deepscan-backend
```

---

## 📊 **Monitoring Dashboard (One Command):**

```bash
watch -n 2 'echo "=== SERVICES ===" && sudo systemctl status deepscan-backend nginx --no-pager | grep Active && echo "" && echo "=== PORTS ===" && sudo netstat -tulpn | grep -E ":80|:8080" && echo "" && echo "=== MEMORY ===" && free -h | grep Mem && echo "" && echo "=== BACKEND HEALTH ===" && curl -s http://localhost:8080/health'
```

Press `Ctrl+C` to exit.

---

## ✅ **Expected Output (Everything Working):**

```bash
# Backend service
● deepscan-backend.service - DeepScan AI Backend Service
   Active: active (running)

# Nginx service
● nginx.service - A high performance web server
   Active: active (running)

# Ports
tcp  0.0.0.0:80    LISTEN  1234/nginx
tcp  0.0.0.0:8080  LISTEN  5678/python

# Backend health
{"status":"healthy","version":"9.0.0","detection_method":"Pure OpenCV + 5-Signal CV Fusion"}
```

---

**Use these commands to monitor your EC2 server! 🚀**
