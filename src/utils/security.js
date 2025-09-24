// src/utils/security.js
// Security utilities and input validation

export const inputValidation = {
  // Serial number validation
  serialNumber: {
    pattern: /^[A-Z0-9-_]+$/i,
    maxLength: 50,
    minLength: 3,
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Serial number is required' };
      }
      if (value.length < inputValidation.serialNumber.minLength) {
        return { isValid: false, error: 'Serial number too short' };
      }
      if (value.length > inputValidation.serialNumber.maxLength) {
        return { isValid: false, error: 'Serial number too long' };
      }
      if (!inputValidation.serialNumber.pattern.test(value)) {
        return { isValid: false, error: 'Invalid characters in serial number' };
      }
      return { isValid: true };
    }
  },

  // Equipment name validation
  equipmentName: {
    maxLength: 100,
    minLength: 2,
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Equipment name is required' };
      }
      const trimmed = value.trim();
      if (trimmed.length < inputValidation.equipmentName.minLength) {
        return { isValid: false, error: 'Equipment name too short' };
      }
      if (trimmed.length > inputValidation.equipmentName.maxLength) {
        return { isValid: false, error: 'Equipment name too long' };
      }
      return { isValid: true };
    }
  },

  // Price validation
  price: {
    min: 0,
    max: 999999999,
    validate: (value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return { isValid: false, error: 'Invalid price format' };
      }
      if (numValue < inputValidation.price.min) {
        return { isValid: false, error: 'Price cannot be negative' };
      }
      if (numValue > inputValidation.price.max) {
        return { isValid: false, error: 'Price too large' };
      }
      return { isValid: true };
    }
  },

  // Quantity validation
  quantity: {
    min: 1,
    max: 10000,
    validate: (value) => {
      const numValue = parseInt(value);
      if (isNaN(numValue) || !Number.isInteger(numValue)) {
        return { isValid: false, error: 'Quantity must be a whole number' };
      }
      if (numValue < inputValidation.quantity.min) {
        return { isValid: false, error: 'Quantity must be at least 1' };
      }
      if (numValue > inputValidation.quantity.max) {
        return { isValid: false, error: 'Quantity too large' };
      }
      return { isValid: true };
    }
  }
};

// XSS Prevention
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
};

// SQL Injection Prevention (for any future backend queries)
export const sanitizeForQuery = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/['";\\]/g, '') // Remove SQL special characters
    .trim();
};

// File upload validation (if needed)
export const validateFileUpload = (file, allowedTypes = ['application/json'], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large' };
  }
  
  return { isValid: true };
};

// Rate limiting for API calls (client-side)
export class RateLimiter {
  constructor(maxCalls = 10, windowMs = 60000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = new Map();
  }

  isAllowed(key = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.calls.has(key)) {
      this.calls.set(key, []);
    }
    
    const callTimes = this.calls.get(key);
    
    // Remove old calls outside the window
    const validCalls = callTimes.filter(time => time > windowStart);
    
    if (validCalls.length >= this.maxCalls) {
      return false;
    }
    
    validCalls.push(now);
    this.calls.set(key, validCalls);
    
    return true;
  }
}

// Security headers for development
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

// Environment variable validation
export const validateEnvVariables = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

const securityUtils = {
  inputValidation,
  sanitizeInput,
  sanitizeForQuery,
  validateFileUpload,
  RateLimiter,
  securityHeaders,
  validateEnvVariables
};

export default securityUtils;