# Incremental Game Update System Guide

This guide explains how to set up your update server for the incremental game update system with language-specific localization files.

## 📁 Server File Structure

Your update server should have this structure:

```
your-server.com/
└── updates/
    ├── update-1.zip
    ├── update-2.zip
    ├── update-3.zip
    └── localize/
        ├── en.zip
        ├── kr.zip
        └── cn.zip
```

## 📦 Update File Naming Convention

**IMPORTANT**: All update files must be named exactly as follows:

### Game Updates:
- `update-1.zip` (first update)
- `update-2.zip` (second update)
- `update-3.zip` (third update)
- And so on...

### Language Localization Files:
- `en.zip` (English localization)
- `kr.zip` (Korean localization)
- `cn.zip` (Chinese localization)

The system will automatically check for updates starting from version 1 and continue until it finds no more updates. For each update, it will also download the appropriate language file based on the user's selected language.

## 🔧 How to Prepare Your Update Files

### Step 1: Create Your Update Zip Files

1. **For the first update (update-1.zip):**
   - Create a zip file with your game files
   - Include the folder structure:
     ```
     pack/
     └── (your game files)
     localize/
     └── pack/
         └── (base localization files)
     ```

2. **For subsequent updates (update-2.zip, update-3.zip, etc.):**
   - Only include the **new or changed files**
   - Use the same folder structure
   - The system will merge these with existing files

### Step 2: Create Language-Specific Localization Files

For each language, create a zip file with the localization files:

1. **en.zip** (English):
   ```
   (localization files for English)
   ```

2. **kr.zip** (Korean):
   ```
   (localization files for Korean)
   ```

3. **cn.zip** (Chinese):
   ```
   (localization files for Chinese)
   ```

### Step 3: Upload to Your Server

Upload your files to your web server:

```
your-server.com/updates/update-1.zip
your-server.com/updates/update-2.zip
your-server.com/updates/update-3.zip
your-server.com/updates/localize/en.zip
your-server.com/updates/localize/kr.zip
your-server.com/updates/localize/cn.zip
```

### Step 4: Update the Launcher

Edit `src/App.js` and change the base URL (around line 50):

```javascript
const baseUrl = 'https://your-server.com/updates';
```

## 🚀 Example Update Scenarios

### Scenario 1: New User (Version 0) with English Selected
- User has no game files, language set to EN
- System downloads: update-1.zip, update-2.zip, update-3.zip
- System downloads: en.zip for each update
- User gets all updates with English localization

### Scenario 2: Existing User (Version 2) with Korean Selected
- User already has updates 1 and 2, language set to KR
- System downloads: update-3.zip
- System downloads: kr.zip
- User gets only the new update with Korean localization

### Scenario 3: Up-to-date User (Version 3)
- User has all available updates
- System shows: "Game is already up to date"

## 📋 Server Requirements

Your web server must:

1. **Serve static files** (Apache, Nginx, etc.)
2. **Allow HEAD requests** (for checking file existence)
3. **Support large file downloads** (for zip files)
4. **Have proper CORS headers** (if needed)

## 🔍 Testing Your Setup

### Quick Test with Local Server

1. **Create test updates:**
   ```bash
   # Create update-1.zip with your game files
   # Create update-2.zip with additional files
   # Create en.zip, kr.zip, cn.zip with localization files
   ```

2. **Start local server:**
   ```bash
   python -m http.server 8000
   ```

3. **Update the launcher URL:**
   ```javascript
   const baseUrl = 'http://localhost:8000/updates';
   ```

4. **Test the launcher:**
   - Run the launcher
   - Select a language (EN, KR, CN)
   - Click "Update Game"
   - Check that all updates are downloaded with correct language files

## 📊 Version Tracking

The system automatically creates a `game-version.txt` file in the launcher directory to track the current version:

```
launcher-directory/
├── game-version.txt  (contains current version number)
├── pack/            (game files)
└── localize/        (localization files)
    └── pack/        (language-specific files)
```

## ⚠️ Important Notes

1. **Never skip version numbers** - If you have update-1.zip and update-3.zip, the system will stop at update-1.zip
2. **Always test updates** - Test each update file before uploading
3. **Backup your files** - Keep backups of your update files
4. **Monitor server logs** - Check server logs for download issues
5. **Language files are optional** - If a language file fails to download, the update will continue without it

## 🛠️ Troubleshooting

### Common Issues:

1. **"Failed to download game update"**
   - Check file exists on server
   - Verify URL is accessible
   - Check server permissions

2. **"Invalid update folder structure"**
   - Ensure zip files have correct structure
   - Check that pack/ and localize/pack/ folders exist

3. **"Failed to download language localization"**
   - Check language file exists (en.zip, kr.zip, cn.zip)
   - Verify language file is in /localize/ folder
   - Check server permissions for language files

4. **Updates not downloading**
   - Verify file naming (update-1.zip, update-2.zip, etc.)
   - Check server allows HEAD requests
   - Verify base URL is correct

## 📈 Production Deployment

For production:

1. **Use HTTPS** for security
2. **Set up CDN** for faster downloads
3. **Monitor bandwidth** usage
4. **Implement version checking** on server side
5. **Add rollback functionality** if needed

## 🎯 Quick Start Checklist

- [ ] Create update-1.zip with your game files
- [ ] Create en.zip, kr.zip, cn.zip with localization files
- [ ] Upload to your server at `/updates/update-1.zip`
- [ ] Upload language files to `/updates/localize/`
- [ ] Update the base URL in `src/App.js`
- [ ] Test the launcher with different languages
- [ ] Create update-2.zip when you have new files
- [ ] Upload update-2.zip to server
- [ ] Test incremental update with language selection

The system is now ready to handle incremental updates with language-specific localization automatically! 