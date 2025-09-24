# Production Deployment Guide

## Prerequisites
- [x] Firebase project created
- [x] Authentication enabled (Email/Password + Google)
- [x] Firestore database created
- [x] Environment variables configured

## Pre-deployment Checklist

### 1. Security Audit
```bash
npm run security-audit
```

### 2. Environment Setup
```bash
# Copy and configure environment
cp .env.example .env
# Or use interactive setup
npm run setup-env
```

### 3. Firebase Configuration
```bash
# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init

# Select:
# - Hosting
# - Configure as SPA (yes)
# - Build folder: build
# - Don't overwrite index.html
```

### 4. Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data isolation
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Prevent unauthorized access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 5. Security Rules (Authentication)
```javascript
// Enable only required sign-in methods
// Set up email verification requirements
// Configure authorized domains
```

## Deployment Commands

### Development Build
```bash
npm start
```

### Production Build & Deploy
```bash
npm run build-production
npm run deploy
```

### Manual Steps
```bash
# Build
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Post-deployment Verification

### 1. Functionality Tests
- [ ] User registration/login
- [ ] Inventory operations (CRUD)
- [ ] Charts and reports
- [ ] Mobile responsiveness
- [ ] Dark/light theme
- [ ] Multi-language support

### 2. Security Tests
- [ ] Authentication required for all operations
- [ ] User data isolation working
- [ ] No console errors in production
- [ ] HTTPS enforced
- [ ] CSP headers active

### 3. Performance Tests
- [ ] Page load times < 3s
- [ ] Charts rendering smoothly
- [ ] Mobile performance acceptable
- [ ] Offline behavior

## Monitoring & Maintenance

### Regular Tasks
- [ ] Weekly security audits
- [ ] Monthly dependency updates
- [ ] Quarterly performance reviews
- [ ] Annual security penetration testing

### Firebase Monitoring
- [ ] Authentication logs
- [ ] Firestore usage metrics
- [ ] Hosting analytics
- [ ] Error reporting

## Troubleshooting

### Common Issues
1. **Environment Variables Not Loading**
   - Check .env file exists
   - Verify variable names start with REACT_APP_
   - Restart development server

2. **Firebase Connection Errors**
   - Verify API keys are correct
   - Check Firebase project settings
   - Ensure domain is authorized

3. **Build Failures**
   - Run security audit first
   - Check for unused imports
   - Verify all dependencies installed

### Support Contacts
- Firebase Support: https://firebase.google.com/support
- React Documentation: https://reactjs.org/docs
- Security Issues: Check SECURITY.md
