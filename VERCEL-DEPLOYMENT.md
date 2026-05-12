# 🎨 DeepScan AI - Vercel Frontend Deployment Guide

## 📋 Prerequisites
- GitHub account
- Vercel account (free tier is enough)
- Your repository: `https://github.com/varungupta132/DeepFake-detection-System`

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Sign Up / Login to Vercel**

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** (if new) or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### **STEP 2: Import Your Project**

1. After login, you'll see the **Vercel Dashboard**
2. Click the **"Add New..."** button (top right)
3. Select **"Project"**
4. You'll see **"Import Git Repository"** page

---

### **STEP 3: Connect Your GitHub Repository**

1. In the search box, type: `DeepFake-detection-System`
2. Find your repository: **`varungupta132/DeepFake-detection-System`**
3. Click **"Import"** button next to it

**If you don't see your repository:**
- Click **"Adjust GitHub App Permissions"**
- Select **"All repositories"** or select specific repository
- Click **"Save"**
- Go back to Vercel and refresh

---

### **STEP 4: Configure Project Settings**

On the **"Configure Project"** page:

#### **Project Name:**
```
deepscan-ai
```
(or any name you prefer - this will be your URL: `deepscan-ai.vercel.app`)

#### **Framework Preset:**
```
Other
```
(We're using vanilla HTML/CSS/JS, no framework)

#### **Root Directory:**
```
frontend
```
⚠️ **IMPORTANT:** Click **"Edit"** next to Root Directory and type `frontend`

#### **Build Settings:**
- **Build Command:** Leave empty (or type: `echo "No build needed"`)
- **Output Directory:** Leave empty (or type: `.`)
- **Install Command:** Leave empty

#### **Environment Variables:**
- No environment variables needed (backend URL is hardcoded in app.js)

---

### **STEP 5: Deploy**

1. Click the big **"Deploy"** button
2. Wait 30-60 seconds while Vercel:
   - Clones your repository
   - Deploys the `frontend` folder
   - Generates a live URL

3. You'll see:
   - 🎉 **"Congratulations!"** message
   - Your live URL: `https://deepscan-ai.vercel.app` (or similar)

---

### **STEP 6: Test Your Deployment**

1. Click **"Visit"** button or copy the URL
2. Your frontend should open
3. Open **Browser DevTools** (F12)
4. Go to **"Console"** tab
5. Try uploading a video
6. Check if it connects to: `http://32.194.89.63` (port 80)

---

## 🔧 **Post-Deployment Configuration**

### **Enable Auto-Deploy:**

Vercel automatically enables auto-deploy by default. Every time you push to GitHub, Vercel will redeploy.

To verify:
1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** tab
3. Go to **"Git"** section
4. Make sure **"Production Branch"** is set to `main`

---

### **Custom Domain (Optional):**

If you want a custom domain like `deepscan.ai`:

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## 🌐 **Your URLs After Deployment:**

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | `https://deepscan-ai.vercel.app` |
| **Backend (EC2)** | `http://32.194.89.63` |
| **API Health** | `http://32.194.89.63/health` |
| **API Predict** | `http://32.194.89.63/api/predict/` |

---

## ⚠️ **Troubleshooting:**

### **Issue 1: "Cannot reach backend" error**

**Cause:** Browser blocking HTTP requests from HTTPS site (Mixed Content)

**Solution:**
Your frontend will be on HTTPS (`https://deepscan-ai.vercel.app`), but backend is on HTTP (`http://32.194.89.63`). Modern browsers block this.

**Fix Options:**

#### **Option A: Use HTTPS for Backend (Recommended)**
1. Get a domain name (e.g., from Namecheap, GoDaddy)
2. Point domain to EC2 IP: `32.194.89.63`
3. Install SSL certificate using Let's Encrypt (free)
4. Update `app.js` to use: `https://api.deepscan.ai`

#### **Option B: Allow Mixed Content (Temporary)**
1. In browser, click the **lock icon** in address bar
2. Click **"Site settings"**
3. Find **"Insecure content"** → Set to **"Allow"**
4. Refresh page

⚠️ **Note:** Option B is only for testing. For production, use Option A.

---

### **Issue 2: 404 Not Found on page refresh**

**Cause:** Vercel doesn't know how to handle client-side routing

**Solution:** Already configured in `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### **Issue 3: Old version still showing**

**Cause:** Browser cache or Vercel cache

**Solution:**
1. Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
2. Or clear browser cache
3. Or open in Incognito/Private mode

---

## 🔄 **How to Redeploy (Update Frontend):**

### **Method 1: Push to GitHub (Auto-Deploy)**
```bash
# Make changes to your code
git add .
git commit -m "Update frontend"
git push varun main
```
Vercel will automatically detect the push and redeploy (takes 30-60 seconds).

---

### **Method 2: Manual Redeploy from Vercel Dashboard**
1. Go to **Vercel Dashboard** → Your Project
2. Click **"Deployments"** tab
3. Click **"..."** menu on latest deployment
4. Click **"Redeploy"**
5. Confirm

---

## 📊 **Deployment Checklist:**

- [ ] GitHub repository is public or Vercel has access
- [ ] Root directory set to `frontend`
- [ ] Backend URL in `app.js` is `http://32.194.89.63` (no port)
- [ ] EC2 backend is running (check: `http://32.194.89.63/health`)
- [ ] Nginx is running on EC2 (port 80)
- [ ] Security group allows port 80 (HTTP)
- [ ] Vercel deployment successful
- [ ] Frontend loads without errors
- [ ] Can upload and analyze videos

---

## 🎯 **Expected Result:**

After successful deployment:
1. Frontend opens at: `https://deepscan-ai.vercel.app`
2. You can upload a video
3. Video is sent to: `http://32.194.89.63/api/predict/`
4. Backend processes it and returns results
5. Results are displayed on frontend

---

## 📞 **Need Help?**

If you face any issues during deployment, share:
1. Screenshot of Vercel deployment page
2. Browser console errors (F12 → Console tab)
3. Network errors (F12 → Network tab)

---

**Good luck with your deployment! 🚀**
