# Custom Launcher Update System (No GitHub Required)

This guide shows how to set up a custom update server for your launcher without exposing your code.

## 🚀 Quick Setup

### Step 1: Set up Custom Update Server

Create a simple web server with this structure:
```
your-server.com/
├── launcher-updates/
│   ├── latest.json
│   ├── DBOD-Launcher-1.0.1.exe
│   ├── DBOD-Launcher-1.0.2.exe
│   └── DBOD-Launcher-1.0.3.exe
└── game-updates/
    ├── update-1.zip
    ├── update-2.zip
    └── localize/
        ├── en.zip
        ├── kr.zip
        └── cn.zip
```

### Step 2: Create Update Metadata

Create `latest.json` on your server:
```json
{
  "version": "1.0.3",
  "url": "https://your-server.com/launcher-updates/DBOD-Launcher-1.0.3.exe",
  "notes": "Bug fixes and improvements",
  "pub_date": "2024-01-15T10:00:00Z",
  "signature": "your-signature-here"
}
```

### Step 3: Update Launcher Code

Replace the GitHub auto-updater with custom update logic.

## 🔧 Implementation

### Custom Update Handler

Add this to your `main.js`:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Custom update configuration
const UPDATE_SERVER = 'https://your-server.com/launcher-updates';
const CURRENT_VERSION = '1.0.0'; // Update this when you release

// Custom update checker
async function checkForLauncherUpdates() {
  try {
    console.log('Checking for launcher updates...');
    
    const response = await axios.get(`${UPDATE_SERVER}/latest.json`);
    const latestInfo = response.data;
    
    if (latestInfo.version !== CURRENT_VERSION) {
      console.log(`Update available: ${latestInfo.version}`);
      
      // Notify the UI
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('launcher-update-available', {
          version: latestInfo.version,
          url: latestInfo.url,
          notes: latestInfo.notes
        });
      }
    } else {
      console.log('Launcher is up to date');
    }
  } catch (error) {
    console.error('Failed to check for launcher updates:', error);
  }
}

// Download and install launcher update
async function downloadLauncherUpdate(updateUrl) {
  try {
    console.log('Downloading launcher update...');
    
    const response = await axios({
      method: 'GET',
      url: updateUrl,
      responseType: 'stream'
    });
    
    const downloadPath = path.join(app.getPath('temp'), 'launcher-update.exe');
    const writer = fs.createWriteStream(downloadPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Launch the new version
    const { spawn } = require('child_process');
    spawn(downloadPath, [], { detached: true });
    
    // Quit current version
    app.quit();
    
  } catch (error) {
    console.error('Failed to download launcher update:', error);
  }
}

// IPC handlers for custom updates
ipcMain.handle('check-launcher-update', async () => {
  await checkForLauncherUpdates();
});

ipcMain.handle('download-launcher-update', async (event, updateUrl) => {
  await downloadLauncherUpdate(updateUrl);
});
```

### Update Your UI

Add update buttons to your React app:

```javascript
// In your React component
const [launcherUpdate, setLauncherUpdate] = useState(null);

useEffect(() => {
  window.electronAPI.onLauncherUpdateAvailable((updateInfo) => {
    setLauncherUpdate(updateInfo);
  });
}, []);

const handleLauncherUpdate = async () => {
  if (launcherUpdate) {
    await window.electronAPI.downloadLauncherUpdate(launcherUpdate.url);
  }
};

// In your JSX
{launcherUpdate && (
  <div className="update-notification">
    <h3>Launcher Update Available</h3>
    <p>Version {launcherUpdate.version}</p>
    <p>{launcherUpdate.notes}</p>
    <button onClick={handleLauncherUpdate}>
      Download Update
    </button>
  </div>
)}
```

## 📦 Release Process

### 1. Build Your Launcher
```bash
npm run dist:portable
```

### 2. Upload to Your Server
- Upload `DBOD-Launcher.exe` to `your-server.com/launcher-updates/`
- Update `latest.json` with new version info

### 3. Update Version in Code
- Update `CURRENT_VERSION` in `main.js`
- Rebuild and distribute

## 🔒 Security Benefits

1. **Code stays private** - No need to expose your source code
2. **Full control** - You control the update server
3. **Custom authentication** - Add your own security measures
4. **No GitHub dependency** - Works with any web server

## 🛠️ Server Requirements

Your server needs:
- HTTPS support (required for Electron)
- Static file hosting
- JSON file serving
- Large file download support

## 📋 Example Server Setup

### Using Apache:
```apache
# .htaccess
<Files "latest.json">
    Header set Content-Type "application/json"
</Files>
```

### Using Nginx:
```nginx
location /launcher-updates/ {
    alias /path/to/your/updates/;
    add_header Content-Type application/octet-stream;
}
```

## 🎯 Advantages

✅ **Code stays private**  
✅ **Full control over updates**  
✅ **Custom security measures**  
✅ **No GitHub dependency**  
✅ **Works with any hosting**  

## ⚠️ Considerations

- You need to host the update files yourself
- Need to manage version numbers manually
- More setup required than GitHub
- Need to handle server security

This approach gives you complete control while keeping your code private! 