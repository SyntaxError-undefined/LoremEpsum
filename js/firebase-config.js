const runtimeEnv = window.__EVENTFLOW_ENV__ || {};
window.EVENTFLOW_FIREBASE_CONFIG = window.EVENTFLOW_FIREBASE_CONFIG || window.__EVENTFLOW_FIREBASE_CONFIG__ || {
  apiKey: runtimeEnv.FIREBASE_API_KEY || '',
  authDomain: runtimeEnv.FIREBASE_AUTH_DOMAIN || '',
  projectId: runtimeEnv.FIREBASE_PROJECT_ID || '',
  storageBucket: runtimeEnv.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: runtimeEnv.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: runtimeEnv.FIREBASE_APP_ID || ''
};
