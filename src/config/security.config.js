// src/config/security.config.js
import { validateEnvVariables } from '../utils/security';

// Validate environment variables on app start
export const initializeSecurityConfig = () => {
  // Check if required environment variables are set
  const isValid = validateEnvVariables();
  
  if (!isValid && process.env.NODE_ENV === 'production') {
    throw new Error('Missing required environment variables for production');
  }
  
  // Configure Content Security Policy
  if (process.env.NODE_ENV === 'production') {
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://firestore.googleapis.com https://firebase.googleapis.com;
      frame-src 'none';
      object-src 'none';
    `.replace(/\s+/g, ' ').trim();
    
    // Add CSP meta tag if not already present
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCsp) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', csp);
      document.head.appendChild(meta);
    }
  }
};

// Firebase config validation
export const validateFirebaseConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing Firebase config field: ${field}`);
    }
  }
  
  return true;
};

export default {
  initializeSecurityConfig,
  validateFirebaseConfig
};
