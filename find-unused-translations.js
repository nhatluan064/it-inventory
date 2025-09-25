// Script to find unused translation keys
const fs = require('fs');
const path = require('path');

// Read the translations file
const translationsPath = './src/components/Translations.js';
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Extract all translation keys from Vietnamese translations
const viTranslationsMatch = translationsContent.match(/vi:\s*{([\s\S]*?)},\s*\/\/.*\s*en:/);
if (!viTranslationsMatch) {
  console.log('Could not find Vietnamese translations');
  process.exit(1);
}

const viContent = viTranslationsMatch[1];

const keyMatches = viContent.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm);

if (!keyMatches) {
  console.log('Could not extract keys');
  process.exit(1);
}

const allKeys = keyMatches.map(match => match.replace(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/, '$1'));

console.log(`Found ${allKeys.length} translation keys`);

// Function to search for key usage in files
function searchInDirectory(dir, extensions = ['.js', '.jsx']) {
  let files = [];
  
  function readDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        readDir(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  readDir(dir);
  return files;
}

// Get all JS/JSX files
const jsFiles = searchInDirectory('./src');
console.log(`Scanning ${jsFiles.length} files...`);

// Read all file contents
let allFileContent = '';
for (const file of jsFiles) {
  if (file !== translationsPath) { // Don't include the translations file itself
    try {
      allFileContent += fs.readFileSync(file, 'utf8') + '\n';
    } catch (err) {
      console.log(`Error reading ${file}: ${err.message}`);
    }
  }
}

// Check which keys are unused
const unusedKeys = [];
const usedKeys = [];

for (const key of allKeys) {
  // Check if key is used in t() calls or as string literals
  const patterns = [
    new RegExp(`t\\(["'\`]${key}["'\`]`, 'g'),
    new RegExp(`t\\(['"]${key}['"]`, 'g'),
    new RegExp(`["'\`]${key}["'\`]`, 'g'),
    new RegExp(`'${key}'`, 'g'),
    new RegExp(`"${key}"`, 'g'),
    new RegExp(`\`${key}\``, 'g')
  ];
  
  let isUsed = false;
  for (const pattern of patterns) {
    if (pattern.test(allFileContent)) {
      isUsed = true;
      break;
    }
  }
  
  if (isUsed) {
    usedKeys.push(key);
  } else {
    unusedKeys.push(key);
  }
}

console.log(`\n=== TRANSLATION USAGE REPORT ===`);
console.log(`Total keys: ${allKeys.length}`);
console.log(`Used keys: ${usedKeys.length}`);
console.log(`Unused keys: ${unusedKeys.length}`);

if (unusedKeys.length > 0) {
  console.log(`\n=== UNUSED TRANSLATION KEYS ===`);
  unusedKeys.forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });
  
  console.log(`\n=== RECOMMENDATION ===`);
  console.log(`You can safely remove these ${unusedKeys.length} unused translation keys to reduce bundle size.`);
} else {
  console.log(`\n✅ All translation keys are being used!`);
}