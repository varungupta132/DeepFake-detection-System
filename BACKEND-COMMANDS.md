# 🐍 Backend Management - Quick Reference

## 🚀 **Setup Backend as Permanent Service (One-Time Setup):**

```bash
# Pull latest code
cd ~/DeepScan-AI
git pull origin main

# Make script executable
chmod +x setup-backend-service.sh

# Run setup
./setup-backend-service.sh
```

**This will:**
- ✅ Stop any existing backend processes
- ✅ Create systemd service
- ✅ Enable auto-start on boot
- ✅ Start the backend
- ✅ Backend will restart automatically if it crashes

---

## 📋 **Daily Commands:**

### **Check if Backend is Running:**
```bash
sudo systemctl status deepscan-backend
```

### **Start Backend:**
```bash
sudo systemctl start deepscan-backend
```

### **Stop Backend:**
```bash
sudo systemctl stop deepscan-backend
```

### **Restart Backend:**
```bash
sudo systemctl restart deepscan-backend
```

### **View Backend Logs:**
```bash
# Real-time logs
sudo journalctl -u deepscan-backend -f

# Last 50 lines
sudo journalctl -u deepscan-backend -n 50

# Or view log file
tail -f ~/DeepScan-AI/backend/backend.log
```

---

## 🔍 **Check What's Running:**

### **Quick Check:**
```bash
# Check backend service
sudo systemctl status deepscan-backend

# Check if Python is running
ps aux | grep "python main.py" | grep -v grep

# Check port 8080
sudo netstat -tulpn | grep :8080

# Test backend
curl http://localhost:8080/health
```

### **Complete Check:**
```bash
# Check all services
sudo systemctl status deepscan-backend nginx

# Check all ports
sudo netstat -tulpn | grep -E ":80|:8080"

# Check memory
free -h

# Check disk
df -h
```

---

## 🆘 **Troubleshooting:**

### **Backend Not Running:**
```bash
# Check status
sudo systemctl status deepscan-backend

# View errors
sudo journalctl -u deepscan-backend -n 50

# Restart
sudo systemctl restart deepscan-backend
```

### **Port 8080 Already in Use:**
```bash
# Find what's using it
sudo lsof -i :8080

# Kill old process
pkill -f "python main.py"

# Start service
sudo systemctl start deepscan-backend
```

### **Backend Crashes:**
```bash
# View crash logs
sudo journalctl -u deepscan-backend -n 100

# Check Python errors
tail -50 ~/DeepScan-AI/backend/backend.log

# Restart
sudo systemctl restart deepscan-backend
```

---

## 🔄 **Update Backend Code:**

```bash
# Stop service
sudo systemctl stop deepscan-backend

# Pull latest code
cd ~/DeepScan-AI
git pull origin main

# Update dependencies (if needed)
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Start service
sudo systemctl start deepscan-backend

# Check status
sudo systemctl status deepscan-backend
```

---

## ✅ **Expected Output (Working):**

```bash
$ sudo systemctl status deepscan-backend

● deepscan-backend.service - DeepScan AI Backend Service
     Loaded: loaded (/etc/systemd/system/deepscan-backend.service; enabled)
     Active: active (running) since Tue 2026-05-12 04:00:00 UTC; 30min ago
   Main PID: 12345 (python)
      Tasks: 1 (limit: 1131)
     Memory: 180.0M
        CPU: 5.234s
     CGroup: /system.slice/deepscan-backend.service
             └─12345 /home/ubuntu/DeepScan-AI/backend/venv/bin/python main.py
```

```bash
$ curl http://localhost:8080/health

{"status":"healthy","version":"9.0.0","detection_method":"Pure OpenCV + 5-Signal CV Fusion"}
```

---

## 📊 **Monitor Backend (Real-time):**

```bash
# Watch service status
watch -n 2 'sudo systemctl status deepscan-backend --no-pager | head -15'

# Watch logs
sudo journalctl -u deepscan-backend -f

# Watch system resources
top
```

---

**Backend will now run permanently and restart automatically! 🎉**
