const fs = require('fs');
const path = require('path');

// This script helps convert PNG to ICO for launcher icon
console.log('Icon Conversion Helper');
console.log('=====================');
console.log('');
console.log('Available icon files in public/ folder:');
console.log('- Logo.ico (263KB) - Ready to use');
console.log('- launcher.png (39KB) - Needs conversion');
console.log('- Icon.png (24KB) - Needs conversion');
console.log('');
console.log('To use your PNG as the launcher icon:');
console.log('1. Convert PNG to ICO using an online converter');
console.log('2. Replace public/Logo.ico with your converted file');
console.log('3. Or rename your ICO file to Logo.ico');
console.log('');
console.log('Recommended ICO specifications:');
console.log('- Size: 256x256 pixels (or multiple sizes)');
console.log('- Format: ICO (Windows icon format)');
console.log('- File: public/Logo.ico');
console.log('');
console.log('Current configuration uses: public/Logo.ico');
console.log('Build with: npm run dist:portable'); 