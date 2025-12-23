# Build Guide - Creating the Game Launcher Executable


npm run dist:portable


This guide explains how to build the DBOD Launcher into a distributable executable that you can place in your game folder.

## 🛠️ Prerequisites

Make sure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 📦 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including electron-builder.

### Step 2: Build the Application

```bash
npm run build
```

This compiles the React application into the `dist/` folder.

## 🚀 Building the Executable

### Option 1: Portable Executable (Recommended for Game Folder)

This creates a single `.exe` file that you can place directly in your game folder:

```bash
npm run dist:portable
```

**Output**: `dist-electron/DBOD-Launcher.exe`

### Option 2: Windows Installer

This creates an installer that users can run to install the launcher:

```bash
npm run dist:win
```

**Output**: `dist-electron/DBOD Launcher Setup.exe`

### Option 3: All Platforms

This builds for all configured platforms:

```bash
npm run dist
```

## 📁 File Structure After Build

After building, you'll have:

```
dist-electron/
├── DBOD-Launcher.exe          (portable executable)
├── DBOD Launcher Setup.exe     (installer)
└── win-unpacked/              (unpacked files)
    ├── DBOD Launcher.exe
    ├── resources/
    └── ...
```

## 🎯 Using the Portable Executable

### For Game Folder Distribution:

1. **Copy the executable**: Copy `DBOD-Launcher.exe` to your game folder
2. **Place in game directory**: Put it in the same folder as your game files
3. **Run the launcher**: Users can double-click to run it

### Example Game Folder Structure:

```
Your Game Folder/
├── DBOD-Launcher.exe          (the launcher)
├── game-version.txt           (created by launcher)
├── pack/                      (game files)
├── localize/                  (localization files)
└── (other game files)
```

## ⚙️ Configuration Options

### Customizing the Build

Edit `electron-builder.json` to customize the build:

```json
{
  "appId": "com.dbod.launcher",
  "productName": "DBOD Launcher",
  "win": {
    "target": [
      {
        "target": "portable",
        "arch": ["x64"]
      }
    ],
    "icon": "public/Logo.ico"
  }
}
```

### Available Build Options:

- **`dist:portable`**: Single executable file
- **`dist:win`**: Windows installer
- **`dist`**: All platforms

## 🔧 Troubleshooting

### Common Build Issues:

1. **"electron-builder not found"**
   ```bash
   npm install electron-builder --save-dev
   ```

2. **"Icon file not found"**
   - Make sure `public/Logo.ico` exists
   - Or update the icon path in `electron-builder.json`

3. **"Build fails"**
   ```bash
   npm run build
   npm run dist:portable
   ```

4. **"Executable doesn't run"**
   - Check Windows Defender isn't blocking it
   - Try running as administrator
   - Check the console for error messages

### Development vs Production:

- **Development**: `npm start` (runs with DevTools)
- **Production**: Built executable (no DevTools)

## 📋 Build Checklist

Before building:

- [ ] All dependencies installed (`npm install`)
- [ ] React app builds successfully (`npm run build`)
- [ ] Icon file exists (`public/Logo.ico`)
- [ ] Update URL configured in `src/App.js`
- [ ] Test the launcher in development mode

## 🚀 Quick Build Commands

```bash
# Install dependencies
npm install

# Build React app
npm run build

# Create portable executable
npm run dist:portable

# The executable will be in: dist-electron/DBOD-Launcher.exe
```

## 📦 Distribution

### For Your Game:

1. **Build the executable**: `npm run dist:portable`
2. **Copy to game folder**: Copy `DBOD-Launcher.exe` to your game directory
3. **Test the launcher**: Run it to make sure it works
4. **Distribute**: Include the executable with your game files

### File Size:

- **Portable executable**: ~50-100MB (includes Electron runtime)
- **Unpacked folder**: ~200-300MB (for development)

## ⚠️ Important Notes

1. **First run**: The executable may take a moment to start on first run
2. **Antivirus**: Some antivirus software may flag the executable - this is normal for Electron apps
3. **Updates**: The launcher will create `game-version.txt` in its directory
4. **Permissions**: The launcher needs write permissions to its directory for updates

## 🎯 Final Steps

1. **Build the executable**: `npm run dist:portable`
2. **Test the executable**: Run it to make sure it works
3. **Copy to game folder**: Place `DBOD-Launcher.exe` in your game directory
4. **Test with updates**: Make sure the update system works with your server

Your game launcher is now ready for distribution! 