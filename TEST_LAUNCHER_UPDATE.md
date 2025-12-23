# Launcher Update Test Guide

This guide helps you test the launcher update functionality.

## 🧪 Test Setup

### 1. Current Setup
- **Launcher version**: 1.0.1 (in package.json)
- **Server version**: 1.0.2 (in latest.json)

### 2. Server Configuration
Make sure your `latest.json` on the server has:
```json
{
  "version": "1.0.2",
  "url": "http://46.250.226.112/launcher-updates/DBOD-Launcher.exe",
  "notes": "Test update"
}
```

### 3. Test Process

1. **Build current launcher:**
   ```bash
   npm run dist:portable
   ```

2. **Run the launcher** - It should show "DBOD - 1.0.1"

3. **Check for updates** - The launcher should detect version 1.0.2 is available

4. **Click "Update Now"** - Should show progress bar and download

5. **Verify replacement** - The new launcher should replace the old one

## 🔍 What Should Happen

### Download Process:
1. Downloads `DBOD-Launcher-new.exe` to launcher directory
2. Creates `update-launcher.bat` script
3. Launches batch script to replace launcher
4. Current launcher quits
5. Batch script waits 2 seconds
6. Deletes old launcher
7. Moves new launcher to correct name
8. Starts new launcher
9. Deletes batch script

### File Structure After Update:
```
launcher-folder/
├── DBOD-Launcher.exe (new version)
├── game-version.txt
├── pack/
└── localize/
```

## 🐛 Debug Steps

If update doesn't work:

1. **Check console logs** for error messages
2. **Verify server URL** is accessible
3. **Check file permissions** in launcher directory
4. **Look for batch file** in launcher directory
5. **Check if new exe** was downloaded

## 📋 Expected Behavior

✅ **Launcher shows version 1.0.1**  
✅ **Update popup appears** when 1.0.2 is available  
✅ **Progress bar shows** download progress  
✅ **Launcher quits** after download  
✅ **New launcher starts** automatically  
✅ **Version shows 1.0.2** in new launcher  

## ⚠️ Troubleshooting

### If launcher doesn't update:
1. Check server `latest.json` has correct version
2. Verify download URL is accessible
3. Check launcher directory has write permissions
4. Look for error messages in console

### If launcher crashes:
1. Check if batch script was created
2. Verify file paths in batch script
3. Check if new exe was downloaded
4. Look for permission issues

The update should now work like the game updates - replacing the launcher in its own directory! 