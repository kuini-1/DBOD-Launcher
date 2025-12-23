const fs = require('fs');
const path = require('path');

console.log('Icon Resize Script');
console.log('==================');
console.log('');
console.log('This script can resize your icon to 256x256 pixels');
console.log('');
console.log('Requirements:');
console.log('1. Install sharp: npm install sharp');
console.log('2. Have your icon file ready');
console.log('');
console.log('Usage:');
console.log('1. npm install sharp');
console.log('2. node resize-icon-script.js');
console.log('');
console.log('The script will:');
console.log('- Read public/Logo.ico');
console.log('- Resize to 256x256 pixels');
console.log('- Save as public/Logo-fixed.ico');
console.log('');
console.log('Then you can:');
console.log('- Replace public/Logo.ico with public/Logo-fixed.ico');
console.log('- Run: npm run dist:portable');
console.log('');
console.log('Note: This requires the sharp library to be installed');
console.log('If you prefer manual resizing, use the resize-icon.js guide instead');

// Uncomment the code below if you install sharp:
/*
const sharp = require('sharp');

async function resizeIcon() {
  try {
    console.log('Resizing icon to 256x256...');
    
    await sharp('public/Logo.ico')
      .resize(256, 256)
      .toFile('public/Logo-fixed.ico');
    
    console.log('Icon resized successfully!');
    console.log('Replace public/Logo.ico with public/Logo-fixed.ico');
    
  } catch (error) {
    console.error('Error resizing icon:', error.message);
    console.log('Try manual resizing instead');
  }
}

resizeIcon();
*/ 