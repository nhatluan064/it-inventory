import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeSecurityConfig } from './config/security.config';

// Initialize security configuration
try {
  initializeSecurityConfig();
} catch (error) {
  console.error('Security configuration failed:', error);
  if (process.env.NODE_ENV === 'production') {
    // In production, we might want to show a fallback UI
    document.body.innerHTML = '<div style="text-align:center;padding:50px;">Application configuration error. Please contact support.</div>';
    throw error;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
