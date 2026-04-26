/* ============================================================
   DeepGuard AI — API Configuration
   Change BACKEND_URL to your deployed backend URL
   ============================================================ */

const CONFIG = {
  BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://deepfake-detection-system-production.up.railway.app',
};
