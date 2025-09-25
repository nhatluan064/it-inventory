#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps developers set up their environment correctly
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 IT Inventory - Environment Setup');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('💡 If you need to reconfigure, delete .env and run this script again');
  rl.close();
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found');
  rl.close();
  process.exit(1);
}

console.log('📋 Setting up your Firebase configuration...\n');

const questions = [
  { key: 'REACT_APP_FIREBASE_API_KEY', prompt: 'Firebase API Key: ' },
  { key: 'REACT_APP_FIREBASE_AUTH_DOMAIN', prompt: 'Firebase Auth Domain (yourproject.firebaseapp.com): ' },
  { key: 'REACT_APP_FIREBASE_PROJECT_ID', prompt: 'Firebase Project ID: ' },
  { key: 'REACT_APP_FIREBASE_STORAGE_BUCKET', prompt: 'Firebase Storage Bucket (yourproject.appspot.com): ' },
  { key: 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID', prompt: 'Firebase Messaging Sender ID: ' },
  { key: 'REACT_APP_FIREBASE_APP_ID', prompt: 'Firebase App ID: ' },
  { key: 'REACT_APP_FIREBASE_MEASUREMENT_ID', prompt: 'Firebase Measurement ID (optional): ' }
];

let config = {};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.prompt, (answer) => {
      config[question.key] = answer.trim();
      resolve();
    });
  });
}

async function setupEnvironment() {
  console.log('Please provide your Firebase configuration values:\n');
  
  for (const question of questions) {
    await askQuestion(question);
  }
  
  // Read .env.example template
  let envTemplate = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace placeholders with actual values
  for (const [key, value] of Object.entries(config)) {
    const placeholder = key.replace('REACT_APP_', '').toLowerCase() + '_here';
    envTemplate = envTemplate.replace(`your_${placeholder}`, value || '');
  }
  
  // Write .env file
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('\n✅ Environment setup complete!');
  console.log(`📄 Created .env file at: ${envPath}`);
  console.log('\n🚨 Important Security Notes:');
  console.log('1. Never commit .env file to Git');
  console.log('2. Keep your API keys secure');
  console.log('3. Use different configs for dev/staging/production');
  console.log('\n🚀 You can now run: npm start');
  
  rl.close();
}

setupEnvironment().catch(error => {
  console.error('❌ Setup failed:', error);
  rl.close();
  process.exit(1);
});
