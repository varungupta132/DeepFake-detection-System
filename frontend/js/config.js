/* ============================================================
   DeepGuard AI — API Configuration
   Change BACKEND_URL to your deployed backend URL
   ============================================================ */

const CONFIG = {
  // Local development
  // BACKEND_URL: 'http://localhost:8000',

  // Production — replace with your Railway/Render URL after deploying backend
  BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://deepguard-backend.up.railway.app',  // ← update this after Railway deploy
};
