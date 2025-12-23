#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get current version
const currentVersion = package.version;
console.log(`Current version: ${currentVersion}`);

// Parse version parts
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Get command line argument
const bumpType = process.argv[2] || 'patch';

let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update package.json
package.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

console.log(`Version bumped to: ${newVersion}`);
console.log('');
console.log('Next steps:');
console.log('1. Commit your changes:');
console.log(`   git add .`);
console.log(`   git commit -m "Bump version to ${newVersion}"`);
console.log('');
console.log('2. Create a tag:');
console.log(`   git tag v${newVersion}`);
console.log(`   git push origin v${newVersion}`);
console.log('');
console.log('3. Publish to GitHub:');
console.log('   npm run publish:github');
console.log('');
console.log('Or let GitHub Actions handle it automatically when you push the tag!'); 