# ⚡ QUICK VERCEL DEPLOYMENT (5 Minutes)

## 🎯 **Simple 5-Step Process:**

---

### **STEP 1: Go to Vercel**
```
https://vercel.com
```
- Click **"Sign Up"** or **"Login"**
- Choose **"Continue with GitHub"**

---

### **STEP 2: Import Project**
- Click **"Add New..."** → **"Project"**
- Search: `DeepFake-detection-System`
- Click **"Import"** on your repository

---

### **STEP 3: Configure**
```
Project Name: deepscan-ai
Framework: Other
Root Directory: frontend  ⚠️ IMPORTANT!
Build Command: (leave empty)
Output Directory: (leave empty)
```

---

### **STEP 4: Deploy**
- Click **"Deploy"** button
- Wait 30-60 seconds
- Done! 🎉

---

### **STEP 5: Test**
- Click **"Visit"** to open your site
- Try uploading a video
- Check if it works!

---

## ⚠️ **IMPORTANT NOTES:**

### **Mixed Content Warning:**
Your frontend will be on **HTTPS** (Vercel), but backend is on **HTTP** (EC2).

**Browsers will block HTTP requests from HTTPS sites!**

**Quick Fix (For Testing):**
1. Open your Vercel site
2. Click the **lock icon** in address bar
3. Click **"Site settings"**
4. Find **"Insecure content"** → Set to **"Allow"**
5. Refresh page

**Proper Fix (For Production):**
- Get a domain name
- Add SSL certificate to EC2 backend
- Use HTTPS for backend

---

## 🔗 **Your URLs:**

| What | URL |
|------|-----|
| Frontend | `https://your-project.vercel.app` |
| Backend | `http://32.194.89.63` |
| Health Check | `http://32.194.89.63/health` |

---

## 🆘 **Common Issues:**

### **"Cannot reach backend"**
- Check if EC2 backend is running
- Check browser console for CORS/Mixed Content errors
- Allow insecure content in browser settings

### **"404 Not Found"**
- Make sure Root Directory is set to `frontend`
- Redeploy from Vercel dashboard

### **Old version showing**
- Hard refresh: **Ctrl + Shift + R**
- Or open in Incognito mode

---

**That's it! Your frontend will be live in 5 minutes! 🚀**
