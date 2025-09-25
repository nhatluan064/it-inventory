# 🚀 Quick Setup Guide

## For New Developers Cloning This Project

### 1. Clone & Install

```bash
git clone <repository-url>
cd it-inventory
npm install
```

### 2. Environment Setup

```bash
npm run setup-env
```

**OR** manually create `.env` file:

```bash
cp .env.example .env
# Then edit .env with your Firebase keys
```

### 3. Firebase Keys Required

Get these from your Firebase Console:

- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID
- Measurement ID (optional)

### 4. Start Development

```bash
npm start
```

## File Structure

- `.env.example` - Template (committed to Git)
- `.env` - Your actual config (NOT committed, gitignored)
- `scripts/setup-env.js` - Interactive setup script

## Security Notes

- ✅ `.env.example` is safe to commit (no real keys)
- ❌ `.env` should NEVER be committed (contains real keys)
- 🔒 Each developer has their own `.env` file
