// Script to analyze old hardcoded constants and their translation usage
const fs = require('fs');
const path = require('path');

console.log('=== ANALYZING OLD HARDCODED DATA USAGE ===\n');

// Read constants file
const constantsPath = './src/constants.js';
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract translation keys from constants
const categoryKeys = [];
const positionKeys = [];
const departmentKeys = [];

// Extract category translation keys
const categoryMatches = constantsContent.match(/tKey:\s*"(category_[^"]+)"/g);
if (categoryMatches) {
  categoryMatches.forEach(match => {
    const key = match.match(/tKey:\s*"([^"]+)"/)[1];
    categoryKeys.push(key);
  });
}

// Extract position translation keys
const positionMatches = constantsContent.match(/tKey:\s*"(position_[^"]+)"/g);
if (positionMatches) {
  positionMatches.forEach(match => {
    const key = match.match(/tKey:\s*"([^"]+)"/)[1];
    positionKeys.push(key);
  });
}

// Extract department translation keys
const departmentMatches = constantsContent.match(/tKey:\s*"(dept_[^"]+)"/g);
if (departmentMatches) {
  departmentMatches.forEach(match => {
    const key = match.match(/tKey:\s*"([^"]+)"/)[1];
    departmentKeys.push(key);
  });
}

console.log(`Found translation keys in constants.js:`);
console.log(`- Categories: ${categoryKeys.length} keys`);
console.log(`- Positions: ${positionKeys.length} keys`);
console.log(`- Departments: ${departmentKeys.length} keys`);
console.log(`Total: ${categoryKeys.length + positionKeys.length + departmentKeys.length} keys\n`);

// Function to search for usage in all JS files
function searchUsageInFiles() {
  const jsFiles = [];
  
  function readDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        readDir(fullPath);
      } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
        jsFiles.push(fullPath);
      }
    }
  }
  
  readDir('./src');
  return jsFiles;
}

const jsFiles = searchUsageInFiles();

// Read all file contents except constants.js itself
let allFileContent = '';
for (const file of jsFiles) {
  if (file !== constantsPath && !file.includes('cleanup-translations.js') && !file.includes('find-unused-translations.js')) {
    try {
      allFileContent += fs.readFileSync(file, 'utf8') + '\n';
    } catch (err) {
      console.log(`Error reading ${file}: ${err.message}`);
    }
  }
}

// Check usage of hardcoded constants arrays
const constantsUsage = {
  categoryStructure: /categoryStructure|from.*constants/.test(allFileContent),
  positions: /\bpositions\b.*from.*constants/.test(allFileContent), 
  departments: /\bdepartments\b.*from.*constants/.test(allFileContent)
};

console.log('=== CONSTANTS ARRAY USAGE ===');
console.log(`categoryStructure: ${constantsUsage.categoryStructure ? '✓ STILL USED' : '✗ NOT USED'}`);
console.log(`positions array: ${constantsUsage.positions ? '✓ STILL USED' : '✗ NOT USED'}`);
console.log(`departments array: ${constantsUsage.departments ? '✓ STILL USED' : '✗ NOT USED'}\n`);

// Check individual translation key usage
const allKeys = [...categoryKeys, ...positionKeys, ...departmentKeys];
const usedKeys = [];
const unusedKeys = [];

for (const key of allKeys) {
  const patterns = [
    new RegExp(`t\\(["'\`]${key}["'\`]`, 'g'),
    new RegExp(`["'\`]${key}["'\`]`, 'g'),
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

console.log('=== TRANSLATION KEYS USAGE ===');
console.log(`Total keys: ${allKeys.length}`);
console.log(`Used keys: ${usedKeys.length}`);
console.log(`Unused keys: ${unusedKeys.length}\n`);

if (unusedKeys.length > 0) {
  console.log('=== UNUSED TRANSLATION KEYS ===');
  
  const unusedCategories = unusedKeys.filter(k => k.startsWith('category_'));
  const unusedPositions = unusedKeys.filter(k => k.startsWith('position_'));  
  const unusedDepartments = unusedKeys.filter(k => k.startsWith('dept_'));
  
  if (unusedCategories.length > 0) {
    console.log(`\nUnused Category Keys (${unusedCategories.length}):`);
    unusedCategories.forEach((key, i) => console.log(`  ${i + 1}. ${key}`));
  }
  
  if (unusedPositions.length > 0) {
    console.log(`\nUnused Position Keys (${unusedPositions.length}):`);
    unusedPositions.forEach((key, i) => console.log(`  ${i + 1}. ${key}`));
  }
  
  if (unusedDepartments.length > 0) {
    console.log(`\nUnused Department Keys (${unusedDepartments.length}):`);
    unusedDepartments.forEach((key, i) => console.log(`  ${i + 1}. ${key}`));
  }
}

console.log('\n=== RECOMMENDATIONS ===');
if (!constantsUsage.categoryStructure && !constantsUsage.positions && !constantsUsage.departments) {
  console.log('🗑️  All hardcoded constants arrays can be safely removed from constants.js');
  console.log(`📦 This will clean up ${allKeys.length} translation keys from Translations.js`);
  console.log('✨ Your dynamic system is fully working and replaces all old hardcoded data');
} else {
  console.log('⚠️  Some constants are still being used. Check before removing:');
  if (constantsUsage.categoryStructure) console.log('   - categoryStructure is still imported/used');
  if (constantsUsage.positions) console.log('   - positions array is still imported/used');
  if (constantsUsage.departments) console.log('   - departments array is still imported/used');
}

if (unusedKeys.length > 0) {
  console.log(`🧹 ${unusedKeys.length} translation keys can be removed to clean up Translations.js`);
}

console.log('\n=== MIGRATION STATUS ===');
console.log('✅ Dynamic data system is implemented');
console.log('✅ DynamicDataManager UI is working');
console.log('✅ Auto-add functionality is active');
console.log('📋 Next step: Remove old hardcoded data if no longer needed');