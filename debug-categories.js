// Debug Categories Sorting - Temporary file
// Chạy trong console của browser để debug

console.log('=== DEBUGGING CATEGORIES SORTING ===');

// Test categories data
const testCategories = [
  { id: "pc", name: "Máy Tính PC" },
  { id: "mini-pc", name: "Máy Tính Mini PC" }, 
  { id: "laptop", name: "Máy Tính Laptop" },
  { id: "monitor", name: "Màn Hình Máy Tính" },
  { id: "keyboard", name: "Bàn Phím Máy Tính" },
  { id: "mouse", name: "Chuột Máy Tính" },
  { id: "printer", name: "Máy In" },
];

console.log('Original order:', testCategories.map(c => c.name));

// Test sorting
const sorted = testCategories.sort((a, b) => {
  return a.name.localeCompare(b.name, 'vi', { 
    sensitivity: 'base',
    numeric: true,
    ignorePunctuation: true
  });
});

console.log('Sorted order:', sorted.map(c => c.name));

// Expected order should be:
// Bàn Phím Máy Tính
// Chuột Máy Tính  
// Máy In
// Máy Tính Laptop
// Máy Tính Mini PC
// Máy Tính PC
// Màn Hình Máy Tính