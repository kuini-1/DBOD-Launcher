# Automatic Version Display System (Simplified)

This guide explains how the automatic version display system works in your launcher.

## 🚀 How It Works

The version is automatically displayed as **"DBOD - 1.0.0"** and updates automatically when you change the version in `package.json`.

## 📋 Components

### 1. VersionDisplay Component (`src/VersionDisplay.js`)
- Automatically reads the version from `package.json`
- Displays as "DBOD - {version}"
- Updates automatically when version changes

### 2. Main Process Handler (`main.js`)
- Reads version directly from `package.json` (no hardcoded constant)
- Compares with server's `latest.json` for updates

### 3. Preload Bridge (`preload.js`)
- Exposes `getAppVersion()` function to renderer

### 4. Update Script (`scripts/update-version.js`)
- Updates VersionDisplay.js default version
- Runs before every build

## 🔧 Usage

### Display the Version
The version is now automatically displayed in the title bar:
```
DBOD - 1.0.0
```

### Update Version
To update the version:

1. **Bump version** (automatically updates all files):
   ```bash
   npm run bump:patch  # 1.0.0 → 1.0.1
   npm run bump:minor  # 1.0.0 → 1.1.0
   npm run bump:major  # 1.0.0 → 2.0.0
   ```

2. **Build** (automatically updates version display):
   ```bash
   npm run build
   npm run dist:portable
   ```

3. **Manual update** (if needed):
   ```bash
   npm run update-version
   ```

## 📦 What Gets Updated Automatically

When you run `npm run bump:patch` (or minor/major):

1. **package.json** - Version number (single source of truth)
2. **VersionDisplay.js** - Default version state
3. **All build scripts** - Version is updated before building

## 🎯 Example Workflow

```bash
# 1. Bump version (updates package.json and all related files)
npm run bump:patch

# 2. Build (automatically updates version display)
npm run build

# 3. Create executable
npm run dist:portable

# 4. The launcher will now show: "DBOD - 1.0.1"
```

## 🔍 Files Modified

### package.json (Single Source of Truth)
```json
{
  "version": "1.0.1"  // Only place you need to update
}
```

### main.js (No hardcoded version)
```javascript
// Gets version directly from package.json
const packageJson = require('./package.json');
const currentVersion = packageJson.version;
```

### src/VersionDisplay.js
```javascript
const [version, setVersion] = useState('1.0.1');  // Updated automatically
```

### src/App.js
```javascript
// Now displays: "DBOD - 1.0.1"
<VersionDisplay />
```

## ⚡ Simplified Features

✅ **Single source of truth** - Only `package.json`  
✅ **Version displayed automatically**  
✅ **Updates when you bump version**  
✅ **No hardcoded constants**  
✅ **Works with custom update system**  
✅ **No manual editing required**  

## 🛠️ Commands Reference

```bash
# Bump version and update all files
npm run bump:patch    # 1.0.0 → 1.0.1
npm run bump:minor    # 1.0.0 → 1.1.0  
npm run bump:major    # 1.0.0 → 2.0.0

# Update version display only
npm run update-version

# Build with automatic version update
npm run build
npm run dist:portable
```

## 🎯 Result

Your launcher title bar will now automatically show:
```
DBOD - 1.0.0
```

And when you update the version, it will automatically change to:
```
DBOD - 1.0.1
```

## 🔒 Server Setup

You only need to maintain `latest.json` on your server:

```json
{
  "version": "1.0.1",
  "url": "http://46.250.226.112/launcher-updates/DBOD-Launcher-1.0.1.exe",
  "notes": "Bug fixes and improvements"
}
```

**No need to update anything in your code!** The launcher reads its current version from `package.json` and compares it with the server's `latest.json`. 