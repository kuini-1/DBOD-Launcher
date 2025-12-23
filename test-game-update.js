const fs = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');

// Test script to create a sample game update zip file
async function createTestUpdate() {
  try {
    console.log('Creating test game update...');
    
    // Create temporary directories
    const tempDir = path.join(__dirname, 'temp-test-update');
    const packDir = path.join(tempDir, 'pack');
    const localizeDir = path.join(tempDir, 'localize');
    const localizePackDir = path.join(localizeDir, 'pack');
    
    // Create the folder structure
    await fs.ensureDir(packDir);
    await fs.ensureDir(localizeDir);
    await fs.ensureDir(localizePackDir);
    
    // Create some sample files
    await fs.writeFile(path.join(packDir, 'test-file.txt'), 'This is a test file in pack folder');
    await fs.writeFile(path.join(localizePackDir, 'localization.txt'), 'This is a test localization file');
    
    // Create the zip file
    const zip = new AdmZip();
    zip.addLocalFolder(tempDir, '');
    
    const outputPath = path.join(__dirname, 'test-game-update.zip');
    zip.writeZip(outputPath);
    
    // Clean up temp directory
    await fs.remove(tempDir);
    
    console.log('✅ Test game update created successfully!');
    console.log(`📁 File: ${outputPath}`);
    console.log('📂 Folder structure:');
    console.log('  - pack/');
    console.log('    - test-file.txt');
    console.log('  - localize/');
    console.log('    - pack/');
    console.log('      - localization.txt');
    console.log('');
    console.log('To test the update functionality:');
    console.log('1. Place this zip file on a web server');
    console.log('2. Update the URL in App.js (line ~50) to point to your zip file');
    console.log('3. Run the launcher and click "Update Game"');
    console.log('4. Check that the files are extracted to the launcher directory');
    
  } catch (error) {
    console.error('❌ Error creating test update:', error);
  }
}

// Function to verify the update structure
async function verifyUpdateStructure(updatePath) {
  try {
    console.log('Verifying update structure...');
    
    const packPath = path.join(updatePath, 'pack');
    const localizePath = path.join(updatePath, 'localize');
    const localizePackPath = path.join(localizePath, 'pack');
    
    const packExists = await fs.pathExists(packPath);
    const localizeExists = await fs.pathExists(localizePath);
    const localizePackExists = await fs.pathExists(localizePackPath);
    
    console.log(`📁 pack/ exists: ${packExists}`);
    console.log(`📁 localize/ exists: ${localizeExists}`);
    console.log(`📁 localize/pack/ exists: ${localizePackExists}`);
    
    if (packExists && localizeExists && localizePackExists) {
      console.log('✅ Update structure is valid!');
      return true;
    } else {
      console.log('❌ Update structure is invalid!');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying structure:', error);
    return false;
  }
}

// Function to extract and test the update
async function testUpdateExtraction(zipPath, extractPath) {
  try {
    console.log('Testing update extraction...');
    
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    
    const isValid = await verifyUpdateStructure(extractPath);
    
    if (isValid) {
      console.log('✅ Update extraction test successful!');
    } else {
      console.log('❌ Update extraction test failed!');
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Error testing extraction:', error);
    return false;
  }
}

// Run the test
if (require.main === module) {
  createTestUpdate().then(() => {
    console.log('\n🎯 Quick Test Instructions:');
    console.log('1. Run: npm install (to install new dependencies)');
    console.log('2. Run: npm run build');
    console.log('3. Run: npm start');
    console.log('4. Click "Update Game" button');
    console.log('5. Check the launcher directory for extracted files');
  });
}

module.exports = { createTestUpdate, verifyUpdateStructure, testUpdateExtraction }; 