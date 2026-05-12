# 🚀 Simple EC2 Deployment Commands

## ⚡ Quick Deploy (Copy-Paste These Commands)

### **STEP 1: Connect to EC2**
```bash
ssh -i "deepfake-ke.pem" ubuntu@32.194.89.63
```

---

### **STEP 2: Run These Commands One by One**

```bash
# Go to project directory
cd ~/DeepScan-AI

# Pull latest code
git pull origin main

# If pull fails, use this:
git fetch origin
git reset --hard origin/main

# Update Nginx config
sudo cp nginx-config.conf /etc/nginx/sites-available/deepscan

# Test Nginx
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check if backend is running
ps aux | grep "python main.py" | grep -v grep
```

**If backend is NOT running, start it:**
```bash
cd ~/DeepScan-AI/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &
```

---

### **STEP 3: Test Everything**

```bash
# Test frontend
curl http://localhost/

# Test health
curl http://localhost/health

# Test from outside
curl http://32.194.89.63/health
```

---

## 🌐 **Your URLs:**

Open these in your browser:

- **Frontend**: http://32.194.89.63
- **Health Check**: http://32.194.89.63/health
- **API Docs**: http://32.194.89.63/docs

---

## ✅ **What Changed:**

1. ✅ Frontend now served from EC2 (not Vercel)
2. ✅ Backend API on same server
3. ✅ No Mixed Content issues
4. ✅ No CORS issues
5. ✅ Everything on one URL: `http://32.194.89.63`

---

## 🔧 **Useful Commands:**

```bash
# View Nginx logs
sudo tail -f /var/log/nginx/access.log

# View backend logs
tail -f ~/DeepScan-AI/backend/backend.log

# Restart Nginx
sudo systemctl restart nginx

# Check backend status
ps aux | grep python

# Stop backend
pkill -f "python main.py"

# Start backend
cd ~/DeepScan-AI/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &
```

---

## 🆘 **If Something Goes Wrong:**

### **502 Bad Gateway:**
Backend is not running. Start it:
```bash
cd ~/DeepScan-AI/backend
source venv/bin/activate
python main.py
```

### **Frontend not loading:**
Check Nginx:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### **API not working:**
Check backend logs:
```bash
tail -f ~/DeepScan-AI/backend/backend.log
```

---

**That's it! Your complete project is now on EC2! 🎉**
