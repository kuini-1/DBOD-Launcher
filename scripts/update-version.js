#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Update the version in VersionDisplay.js
const versionDisplayPath = path.join(__dirname, '..', 'src', 'VersionDisplay.js');
let versionDisplayContent = fs.readFileSync(versionDisplayPath, 'utf8');

// Update the default version
const defaultVersionRegex = /useState\('([^']+)'\)/;
if (defaultVersionRegex.test(versionDisplayContent)) {
  versionDisplayContent = versionDisplayContent.replace(defaultVersionRegex, `useState('${package.version}')`);
  fs.writeFileSync(versionDisplayPath, versionDisplayContent);
  console.log(`✅ Updated default version to ${package.version} in VersionDisplay.js`);
} else {
  console.log('⚠️  Could not find default version in VersionDisplay.js');
}

console.log(`🎯 Current app version: ${package.version}`);
console.log('');
console.log('The version will now be automatically displayed as:');
console.log(`DBOD - ${package.version}`);
console.log('');
console.log('📝 Note: No need to update CURRENT_VERSION anymore!');
console.log('The launcher now reads version directly from package.json'); 