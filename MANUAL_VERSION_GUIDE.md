# Manual Version Update Workflow

This guide shows how to update your launcher version manually (no npm bump commands needed).

## 🚀 Your Simple Workflow

### 1. Update Version in package.json
```json
{
  "version": "1.0.2"  // Just change this number
}
```

### 2. Update VersionDisplay.js (if needed)
```javascript
const [version, setVersion] = useState('1.0.2');  // Match package.json
```

### 3. Build and Upload
```bash
# Build the executable
npm run dist:portable

# Upload to your VPS:
# - DBOD-Launcher.exe → launcher-updates/
# - Update latest.json
```

### 4. Update latest.json on Server
```json
{
  "version": "1.0.2",
  "url": "http://46.250.226.112/launcher-updates/DBOD-Launcher.exe",
  "notes": "Bug fixes and improvements"
}
```

## 📋 What You Need to Update

### When you want a new version:

1. **package.json** - Change version number
2. **src/VersionDisplay.js** - Change default version (optional, auto-updates)
3. **latest.json on server** - Update version and notes

### That's it! No npm commands needed.

## 🎯 Example

**Current version:** 1.0.1

**Want to update to 1.0.2:**

1. **Edit package.json:**
   ```json
   {
     "version": "1.0.2"
   }
   ```

2. **Build:**
   ```bash
   npm run dist:portable
   ```

3. **Upload to VPS:**
   - Upload `DBOD-Launcher.exe` to `launcher-updates/`
   - Update `latest.json`:
   ```json
   {
     "version": "1.0.2",
     "url": "http://46.250.226.112/launcher-updates/DBOD-Launcher.exe",
     "notes": "New features added"
   }
   ```

4. **Launcher shows:** `DBOD - 1.0.2`

## ⚡ Benefits

✅ **No npm commands needed**  
✅ **Simple manual control**  
✅ **Works with your VPS workflow**  
✅ **Version displays automatically**  
✅ **Updates work automatically**  

## 🔧 Commands You Actually Use

```bash
# Build executable
npm run dist:portable

# That's it! No bump commands needed
```

## 📁 Server Structure

```
your-vps.com/
├── launcher-updates/
│   ├── latest.json
│   └── DBOD-Launcher.exe
└── updates/
    ├── update-1.zip
    └── localize/
```

## 🎯 Result

Your launcher will automatically:
- Show `DBOD - 1.0.2` in the title bar
- Check for updates by comparing with `latest.json`
- Download and install updates when available

**No complex automation needed!** Just update the version numbers and upload files. 