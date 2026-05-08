/* ============================================================
   DeepScan AI — API Configuration
   Change BACKEND_URL to your deployed backend URL
   ============================================================ */

const CONFIG = {
  BACKEND_URL: (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === ''           // opened as file://
  )
    ? 'http://localhost:8001'
    : 'https://deepfake-detection-system-production.up.railway.app',
};
