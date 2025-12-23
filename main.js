const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const axios = require('axios');

// Auto update function
async function performAutoGameUpdate() {
  console.log('=== AUTO-UPDATE FUNCTION CALLED ===');
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('game-update-status', 'Checking for updates...');
  }
  
  try {
    const baseUrl = 'http://46.250.226.112/updates';
    const selectedLanguage = 'EN'; // Default language
    

    

    
    // Get current version from a local file or default to 0
    // Try to get the actual game directory where the launcher was placed
    let gameDir;
    
    // Try PORTABLE_EXECUTABLE_DIR first (this should be the actual directory)
    if (process.env.PORTABLE_EXECUTABLE_DIR) {
      gameDir = process.env.PORTABLE_EXECUTABLE_DIR;
      console.log('Using PORTABLE_EXECUTABLE_DIR:', gameDir);
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `Using PORTABLE_EXECUTABLE_DIR: ${gameDir}`);
      }
    } else {
      // Fallback to executable directory
      const exePath = process.execPath;
      const exeDir = path.dirname(exePath);
      gameDir = exeDir;
      console.log('Using executable directory (fallback):', gameDir);
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `Using executable directory (fallback): ${gameDir}`);
      }
    }
    const versionFile = path.join(gameDir, 'game-version.txt');
    let currentVersion = 0;
    
    try {
      const versionData = await fs.readFile(versionFile, 'utf8');
      currentVersion = parseInt(versionData.trim()) || 0;
    } catch (error) {
      // Version file doesn't exist, start from 0
    }
    

    
    // Check for available updates starting from current version + 1
    const availableUpdates = [];
    let versionToCheck = currentVersion + 1;
    const maxVersionsToCheck = 50; // Prevent infinite loop
    
    for (let i = 0; i < maxVersionsToCheck; i++) {
      const updateUrl = `${baseUrl}/update-${versionToCheck}.zip`;
      
      try {
        const response = await axios.head(updateUrl);
        if (response.status === 200) {
          availableUpdates.push({
            version: versionToCheck,
            url: updateUrl,
            language: selectedLanguage
          });
          
        } else {
          break; // No more updates available
        }
      } catch (error) {
        break; // No more updates available
      }
      
      versionToCheck++;
    }
    
    if (availableUpdates.length > 0) {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `Found ${availableUpdates.length} updates available`);
      }
      
      // Download and install each update
      for (const update of availableUpdates) {
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('game-update-status', `Downloading update ${update.version}...`);
        }
        
        // Download the update
        const downloadPath = path.join(gameDir, 'game-update.zip');

        // Get file size first
        const headResponse = await axios.head(update.url);
        const totalSize = parseInt(headResponse.headers['content-length'] || 0);
        
        const response = await axios({
          method: 'GET',
          url: update.url,
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(downloadPath);
        let downloadedSize = 0;
        
        response.data.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (totalSize > 0) {
            const percent = Math.round((downloadedSize * 100) / totalSize);
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('game-update-progress', percent);
            }
          }
        });
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', () => {
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('game-update-progress', 100);
            }
            resolve();
          });
          writer.on('error', reject);
        });
        

        
                         // Extract the update
        const extractPath = gameDir; // Extract to game directory, not launcher directory

         
         try {
           const zip = new AdmZip(downloadPath);
           const zipEntries = zip.getEntries();

           

           
           // Extract the main update zip to the pack folder
           const packDir = path.join(extractPath, 'pack');
           await fs.ensureDir(packDir); // Create pack directory if it doesn't exist
           
           zip.extractAllTo(packDir, true);

           
           // Clean up the downloaded zip file
           await fs.remove(downloadPath);

         } catch (extractError) {
           console.error(`Auto-update: Extraction failed: ${extractError.message}`);
           console.error(`Auto-update: Extract error stack: ${extractError.stack}`);
           throw extractError;
         }
        
        // Verify the folder structure
        const packPath = path.join(extractPath, 'pack');
        const localizePath = path.join(extractPath, 'localize');
        const localizeTaiwanPath = path.join(localizePath, 'TAIWAN');
        const localizePackPath = path.join(localizeTaiwanPath, 'pack');
        

         
         const packExists = await fs.pathExists(packPath);
         const localizeExists = await fs.pathExists(localizePath);
         const localizeTaiwanExists = await fs.pathExists(localizeTaiwanPath);
         const localizePackExists = await fs.pathExists(localizePackPath);
         

         
         const structureValid = packExists && localizeExists && localizeTaiwanExists && localizePackExists;
         
         if (!structureValid) {
                    console.error('Auto-update: Invalid folder structure detected');
         // List what's actually in the extractPath
         const files = await fs.readdir(extractPath);
         console.log(`Auto-update: Files in extractPath: ${files.join(', ')}`);
           throw new Error('Invalid update folder structure');
         }
        
        // Download language-specific localization file
        const languageFile = `${selectedLanguage.toLowerCase()}.zip`;
        const languageUrl = `${baseUrl}/localize/${languageFile}`;
        
                 try {
          // Get language file size first
          const languageHeadResponse = await axios.head(languageUrl);
          const languageTotalSize = parseInt(languageHeadResponse.headers['content-length'] || 0);
          
          const languageResponse = await axios({
           method: 'GET',
           url: languageUrl,
           responseType: 'stream'
         });
         
         const languageDownloadPath = path.join(gameDir, 'language-update.zip');
         const languageWriter = fs.createWriteStream(languageDownloadPath);
         let languageDownloadedSize = 0;
         
         languageResponse.data.on('data', (chunk) => {
           languageDownloadedSize += chunk.length;
           if (languageTotalSize > 0) {
             const percent = Math.round((languageDownloadedSize * 100) / languageTotalSize);
             if (mainWindow && mainWindow.webContents) {
               mainWindow.webContents.send('game-update-progress', percent);
             }
           }
         });
         
         languageResponse.data.pipe(languageWriter);
         
         await new Promise((resolve, reject) => {
           languageWriter.on('finish', () => {
             if (mainWindow && mainWindow.webContents) {
               mainWindow.webContents.send('game-update-progress', 100);
             }
             resolve();
           });
           languageWriter.on('error', reject);
         });
          
          // Extract language files to localize/TAIWAN/pack/
          const languageZip = new AdmZip(languageDownloadPath);
          languageZip.extractAllTo(localizePackPath, true);
          
          // Clean up language download
          await fs.remove(languageDownloadPath);
          
          
        } catch (error) {
          console.warn(`Auto-update: Failed to download ${selectedLanguage} localization: ${error.message}`);
          // Continue with the update even if language file fails
        }
        
        // Update the version file
        await fs.writeFile(versionFile, update.version.toString());
        
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('game-update-status', `Update ${update.version} completed successfully`);
        }
        
      } // End of for loop
      
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', 'All updates completed successfully');
      }
      
    } else {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', 'No updates available');
      }
    } // End of if (availableUpdates.length > 0)
    
  } catch (error) {
    console.error('Auto-update failed:', error);
    console.error('Error stack:', error.stack);
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 450,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public/Logo.ico'),
    show: false,
    backgroundColor: '#000000',
    useContentSize: true
  });

  // Load the built React app
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadFile('dist/index.html');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  

}

// Custom update configuration
const UPDATE_SERVER = 'http://46.250.226.112/launcher-updates';

// Custom update checker
async function checkForLauncherUpdates() {
  try {
    console.log('Checking for launcher updates...');
    
    const response = await axios.get(`${UPDATE_SERVER}/latest.json`);
    const latestInfo = response.data;
    
    // Get current version from package.json
    const packageJson = require('./package.json');
    const currentVersion = packageJson.version;
    
    if (latestInfo.version !== currentVersion) {
      console.log(`Update available: ${latestInfo.version}`);
      
      // Notify the UI
      if (mainWindow && mainWindow.webContents) {
        const updateInfo = {
          version: latestInfo.version,
          url: latestInfo.url
        };
        console.log('Sending update info to UI:', updateInfo);
        mainWindow.webContents.send('launcher-update-available', updateInfo);
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
    console.log('Downloading launcher update from:', updateUrl);
    
    // Notify UI that download is starting
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('launcher-update-progress', 0);
    }
    
    const response = await axios({
      method: 'GET',
      url: updateUrl,
      responseType: 'stream',
      timeout: 30000 // 30 second timeout
    });
    
    // Get the current launcher's directory (where the exe is located)
    let launcherDir;
    if (process.env.PORTABLE_EXECUTABLE_DIR) {
      launcherDir = process.env.PORTABLE_EXECUTABLE_DIR;
    } else {
      const exePath = process.execPath;
      launcherDir = path.dirname(exePath);
    }
    
    console.log('Launcher directory:', launcherDir);
    
    // Download to the launcher's own directory
    const downloadPath = path.join(launcherDir, 'DBOD-Launcher-new.exe');
    const writer = fs.createWriteStream(downloadPath);
    
    // Get total file size for progress
    const totalSize = parseInt(response.headers['content-length'] || 0);
    let downloadedSize = 0;
    
    response.data.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (totalSize > 0) {
        const percent = Math.round((downloadedSize * 100) / totalSize);
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('launcher-update-progress', percent);
        }
      }
    });
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('Download completed successfully');
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('launcher-update-progress', 100);
        }
        resolve();
      });
      writer.on('error', (error) => {
        console.error('Download write error:', error);
        reject(error);
      });
    });
    
    // Verify the downloaded file exists and has size
    const stats = await fs.stat(downloadPath);
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    console.log('Download completed, replacing launcher...');
    
    // Get the current executable path
    const currentExePath = process.execPath;
    const newExePath = path.join(launcherDir, 'DBOD-Launcher.exe');
    
    // Create a VBS script to handle the update silently
    const updateScript = path.join(launcherDir, 'update-launcher.vbs');
    const scriptContent = `Dim WShell, FSO
Set WShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

' Wait for launcher to close
WScript.Sleep 3000

' Try to delete old launcher if it exists (with error handling)
On Error Resume Next
If FSO.FileExists("${currentExePath}") Then
    FSO.DeleteFile "${currentExePath}"
    If Err.Number <> 0 Then
        ' If deletion fails, try to rename it first
        FSO.MoveFile "${currentExePath}", "${currentExePath}.old"
        If Err.Number <> 0 Then
            ' If rename also fails, just continue without deleting
            Err.Clear
        End If
    End If
End If
On Error Goto 0

' Delete target file if it exists (to avoid move error)
On Error Resume Next
If FSO.FileExists("${newExePath}") Then
    FSO.DeleteFile "${newExePath}"
    If Err.Number <> 0 Then
        ' If deletion fails, try to rename it first
        FSO.MoveFile "${newExePath}", "${newExePath}.old"
        If Err.Number <> 0 Then
            ' If rename also fails, just continue without deleting
            Err.Clear
        End If
    End If
End If
On Error Goto 0

' Move new launcher to correct name
If FSO.FileExists("${downloadPath}") Then
    FSO.MoveFile "${downloadPath}", "${newExePath}"
End If

' Start new launcher
If FSO.FileExists("${newExePath}") Then
    WShell.Run "${newExePath}", 0
End If

' Wait a moment then delete this script
WScript.Sleep 1000
FSO.DeleteFile WScript.ScriptFullName
`;
    
    await fs.writeFile(updateScript, scriptContent);
    
    // Also create a batch file as backup method
    const updateBatch = path.join(launcherDir, 'update-launcher.bat');
    const batchContent = `@echo off
timeout /t 3 /nobreak >nul

REM Try to delete old launcher (with error handling)
if exist "${currentExePath}" (
    del "${currentExePath}" 2>nul
    if errorlevel 1 (
        ren "${currentExePath}" "${path.basename(currentExePath)}.old" 2>nul
    )
)

REM Delete target file if it exists
if exist "${newExePath}" (
    del "${newExePath}" 2>nul
    if errorlevel 1 (
        ren "${newExePath}" "${path.basename(newExePath)}.old" 2>nul
    )
)

REM Move new launcher to correct name
if exist "${downloadPath}" (
    move "${downloadPath}" "${newExePath}"
)

REM Start new launcher
if exist "${newExePath}" (
    start "" "${newExePath}"
)

REM Clean up batch file
timeout /t 1 /nobreak >nul
del "%~f0"
`;
    
    await fs.writeFile(updateBatch, batchContent);
    
    console.log('Created update scripts, launching new version...');
    console.log('Update script path:', updateScript);
    console.log('Update batch path:', updateBatch);
    console.log('Current exe path:', currentExePath);
    console.log('New exe path:', newExePath);
    console.log('Download path:', downloadPath);
    
    // Try VBS first, if it fails, use batch file
    const { spawn } = require('child_process');
    const updateProcess = spawn('wscript', [updateScript], { 
      detached: true,
      stdio: 'ignore',
      cwd: launcherDir,
      windowsHide: true
    });
    
    console.log('VBS update script started with PID:', updateProcess.pid);
    
    console.log('Update script started with PID:', updateProcess.pid);
    
    // Log the current process info for debugging
    console.log('Current process name:', process.title);
    console.log('Current process ID:', process.pid);
    
    // Give the batch script a moment to start, then quit
    setTimeout(() => {
      console.log('Quitting current launcher...');
      app.quit();
    }, 1000);
    
  } catch (error) {
    console.error('Failed to download launcher update:', error);
    
    // Notify UI of error
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('launcher-update-error', error.message);
    }
    
    throw error; // Re-throw so the UI can handle it
  }
}

// Auto-updater configuration (for GitHub method - disabled for custom updates)
// autoUpdater.autoDownload = false;
// autoUpdater.autoInstallOnAppQuit = true;

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Launcher: Checking for updates...');
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-status', 'Checking for launcher updates...');
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Launcher: Update available:', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Launcher: No updates available:', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-not-available', info);
  }
});

autoUpdater.on('error', (err) => {
  console.error('Launcher: Update error:', err);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-error', err.message);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log('Launcher: Download progress:', progressObj.percent);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-progress', progressObj.percent);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Launcher: Update downloaded:', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-downloaded', info);
  }
  // Auto install update
  autoUpdater.quitAndInstall();
});

// IPC handlers for custom launcher updates
ipcMain.handle('check-launcher-update', async () => {
  await checkForLauncherUpdates();
});

ipcMain.handle('download-launcher-update', async (event, updateUrl) => {
  console.log('Download launcher update called with URL:', updateUrl);
  if (!updateUrl) {
    throw new Error('Update URL is required');
  }
  await downloadLauncherUpdate(updateUrl);
});

// Get app version from package.json
ipcMain.handle('get-app-version', () => {
  try {
    const packageJson = require('./package.json');
    return packageJson.version;
  } catch (error) {
    console.error('Failed to get app version:', error);
    return '1.0.0';
  }
});

// IPC handlers for GitHub updates (disabled for custom updates)
// ipcMain.handle('check-for-updates', () => {
//   try {
//     autoUpdater.checkForUpdates();
//   } catch (error) {
//     console.error('Update check failed:', error);
//   }
// });

// ipcMain.handle('download-update', () => {
//   try {
//     autoUpdater.downloadUpdate();
//   } catch (error) {
//     console.error('Update download failed:', error);
//   }
// });

ipcMain.handle('download-language-version', async (event, languageCode, languageName) => {
  try {
    console.log(`Downloading ${languageCode} (${languageName}) language files...`);
    
    // Get the launcher's directory
    let launcherDir;
    if (process.env.PORTABLE_EXECUTABLE_DIR) {
      launcherDir = process.env.PORTABLE_EXECUTABLE_DIR;
    } else {
      const exePath = process.execPath;
      launcherDir = path.dirname(exePath);
    }
    
    // Define the language file mapping
    const languageFileMap = {
      'EN': 'en',
      'KR': 'kr', 
      'CN': 'cn'
    };
    
    const languageFileName = languageFileMap[languageCode] || languageCode.toLowerCase();
    const baseUrl = 'http://46.250.226.112/updates';
    const languageUrl = `${baseUrl}/localize/${languageFileName}.zip`;
    
    console.log(`Downloading language file from: ${languageUrl}`);
    
    // Download the language file
    const response = await axios({
      method: 'GET',
      url: languageUrl,
      responseType: 'stream',
      timeout: 30000
    });
    
    // Get file size for progress
    const totalSize = parseInt(response.headers['content-length'] || 0);
    let downloadedSize = 0;
    
    // Create the localize/TAIWAN directory structure
    const localizePath = path.join(launcherDir, 'localize');
    const taiwanPath = path.join(localizePath, 'TAIWAN');
    const packPath = path.join(taiwanPath, 'pack');
    
    await fs.ensureDir(localizePath);
    await fs.ensureDir(taiwanPath);
    await fs.ensureDir(packPath);
    
    // Download to temporary file
    const downloadPath = path.join(launcherDir, `language-${languageCode}.zip`);
    const writer = fs.createWriteStream(downloadPath);
    
    response.data.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (totalSize > 0) {
        const percent = Math.round((downloadedSize * 100) / totalSize);
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('game-update-progress', percent);
        }
      }
    });
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', () => {
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('game-update-progress', 100);
        }
        resolve();
      });
      writer.on('error', reject);
    });
    
    // Extract the language files to localize/TAIWAN/pack/
    console.log(`Extracting language files to: ${packPath}`);
    const languageZip = new AdmZip(downloadPath);
    languageZip.extractAllTo(packPath, true);
    
    // Clean up the downloaded zip file
    await fs.remove(downloadPath);
    
    console.log(`${languageCode} language files downloaded and extracted successfully`);
    
    return { 
      success: true, 
      message: `${languageCode} language files downloaded and extracted successfully`,
      languageCode,
      languageName,
      packPath
    };
    
  } catch (error) {
    console.error(`Failed to download ${languageCode} language files:`, error);
    return { 
      success: false, 
      message: `Failed to download ${languageCode} language files: ${error.message}` 
    };
  }
});

ipcMain.handle('launch-game', async (event, gameConfig) => {
  try {
    const { exePath, params } = gameConfig;
    
    // Get the launcher's directory
    let launcherDir;
    if (process.env.PORTABLE_EXECUTABLE_DIR) {
      launcherDir = process.env.PORTABLE_EXECUTABLE_DIR;
    } else {
      const exePath = process.execPath;
      launcherDir = path.dirname(exePath);
    }
    
    // Resolve the executable path relative to the launcher directory
    let resolvedExePath;
    if (path.isAbsolute(exePath)) {
      resolvedExePath = exePath;
    } else {
      resolvedExePath = path.join(launcherDir, exePath);
    }
    
    console.log('Launcher directory:', launcherDir);
    console.log('Resolved exe path:', resolvedExePath);
    
    // Check if the file exists
    const fs = require('fs');
    if (!fs.existsSync(resolvedExePath)) {
      return { 
        success: false, 
        message: `Game executable not found at: ${resolvedExePath}` 
      };
    }
    
    // Launch the game executable with parameters
    const gameProcess = spawn(resolvedExePath, params, {
      detached: true,
      stdio: 'ignore',
      cwd: path.dirname(resolvedExePath) // Set working directory to game directory
    });

    // Unref the child process so it doesn't stay attached to the parent
    gameProcess.unref();

    return { success: true, message: 'Game launched successfully' };
  } catch (error) {
    console.error('Game launch error:', error);
    return { success: false, message: `Failed to launch game: ${error.message}` };
  }
});

ipcMain.handle('open-game-directory', () => {
  shell.openPath('C:\\Program Files\\Dragon Ball Online');
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Game Update functionality
ipcMain.handle('check-game-update', async (event, updateUrl) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Checking for game updates...');
    }
    
    // In a real implementation, you would check the server for available updates
    // For now, we'll simulate checking for updates
    const response = await axios.head(updateUrl);
    const hasUpdate = response.status === 200;
    
    return { 
      success: true, 
      hasUpdate,
      message: hasUpdate ? 'Game update available' : 'Game is up to date'
    };
  } catch (error) {
    return { 
      success: false, 
      hasUpdate: false,
      message: `Failed to check for game updates: ${error.message}` 
    };
  }
});

ipcMain.handle('get-available-updates', async (event, baseUrl, selectedLanguage) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Checking for available updates...');
    }
    
    // Get current version from a local file or default to 0
    const gameDir = path.dirname(app.getPath('exe')); // Use the directory where the launcher executable is located
    const versionFile = path.join(gameDir, 'game-version.txt');
    let currentVersion = 0;
    
    try {
      const versionData = await fs.readFile(versionFile, 'utf8');
      currentVersion = parseInt(versionData.trim()) || 0;
    } catch (error) {
      // Version file doesn't exist, start from 0
    }
    
    // Check for available updates starting from current version + 1
    const availableUpdates = [];
    let versionToCheck = currentVersion + 1;
    const maxVersionsToCheck = 50; // Prevent infinite loop
    
    for (let i = 0; i < maxVersionsToCheck; i++) {
      const updateUrl = `${baseUrl}/update-${versionToCheck}.zip`;
      
      try {
        const response = await axios.head(updateUrl);
        if (response.status === 200) {
          availableUpdates.push({
            version: versionToCheck,
            url: updateUrl,
            language: selectedLanguage
          });
        } else {
          break; // No more updates available
        }
      } catch (error) {
        break; // No more updates available
      }
      
      versionToCheck++;
    }
    
    return {
      success: true,
      currentVersion,
      availableUpdates,
      message: `Found ${availableUpdates.length} updates available`
    };
  } catch (error) {
    return {
      success: false,
      currentVersion: 0,
      availableUpdates: [],
      message: `Failed to check for updates: ${error.message}`
    };
  }
});

ipcMain.handle('download-game-update', async (event, updateUrl) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Downloading game update...');
    }

    const gameDir = path.dirname(app.getPath('exe')); // Use the directory where the launcher executable is located
    const downloadPath = path.join(gameDir, 'game-update.zip');
    
    // Download the update file
    const response = await axios({
      method: 'GET',
      url: updateUrl,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('game-update-progress', percent);
          }
        }
      }
    });

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve({ 
          success: true, 
          downloadPath,
          message: 'Game update downloaded successfully' 
        });
      });
      writer.on('error', reject);
    });
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to download game update: ${error.message}` 
    };
  }
});

ipcMain.handle('extract-game-update', async (event, downloadPath, selectedLanguage, baseUrl) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Extracting game update...');
    }

    const gameDir = path.dirname(app.getPath('exe')); // Use the directory where the launcher executable is located
    const extractPath = gameDir;
    
    // Extract the zip file
    const zip = new AdmZip(downloadPath);
    zip.extractAllTo(extractPath, true);
    
    // Clean up the downloaded zip file
    await fs.remove(downloadPath);
    
    // Verify the folder structure
    const packPath = path.join(extractPath, 'pack');
    const localizePath = path.join(extractPath, 'localize');
    const localizeTaiwanPath = path.join(localizePath, 'TAIWAN');
    const localizePackPath = path.join(localizeTaiwanPath, 'pack');
    
    const structureValid = await fs.pathExists(packPath) && 
                          await fs.pathExists(localizePath) && 
                          await fs.pathExists(localizeTaiwanPath) &&
                          await fs.pathExists(localizePackPath);
    
    if (!structureValid) {
      throw new Error('Invalid update folder structure');
    }
    
    // Download language-specific localization file
    const languageFile = `${selectedLanguage.toLowerCase()}.zip`;
    const languageUrl = `${baseUrl}/localize/${languageFile}`;
    
    try {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `Downloading ${selectedLanguage} localization...`);
      }
      
      const languageResponse = await axios({
        method: 'GET',
        url: languageUrl,
        responseType: 'stream'
      });
      
      const languageDownloadPath = path.join(gameDir, 'language-update.zip');
      const languageWriter = fs.createWriteStream(languageDownloadPath);
      languageResponse.data.pipe(languageWriter);
      
      await new Promise((resolve, reject) => {
        languageWriter.on('finish', resolve);
        languageWriter.on('error', reject);
      });
      
      // Extract language files to localize/TAIWAN/pack/
      const languageZip = new AdmZip(languageDownloadPath);
      languageZip.extractAllTo(localizePackPath, true);
      
      // Clean up language download
      await fs.remove(languageDownloadPath);
      
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `${selectedLanguage} localization downloaded successfully`);
      }
    } catch (error) {
      console.warn(`Failed to download ${selectedLanguage} localization: ${error.message}`);
      // Continue with the update even if language file fails
    }
    
    return { 
      success: true, 
      message: 'Game update extracted successfully',
      packPath,
      localizePath,
      localizeTaiwanPath,
      localizePackPath
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to extract game update: ${error.message}` 
    };
  }
});

ipcMain.handle('install-game-update', async (event, version) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Installing game update...');
    }

    const gameDir = path.dirname(app.getPath('exe')); // Use the directory where the launcher executable is located
    const packPath = path.join(gameDir, 'pack');
    const localizePath = path.join(gameDir, 'localize');
    
    // Move files to their final locations
    // This would depend on your game's file structure
    // For now, we'll just verify the files are in place
    
    const packExists = await fs.pathExists(packPath);
    const localizeExists = await fs.pathExists(localizePath);
    
    if (!packExists || !localizeExists) {
      throw new Error('Update files not found in expected locations');
    }
    
    // Update the version file
    const versionFile = path.join(gameDir, 'game-version.txt');
    await fs.writeFile(versionFile, version.toString());
    
    return { 
      success: true, 
      message: `Game update ${version} installed successfully` 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to install game update: ${error.message}` 
    };
  }
});

ipcMain.handle('perform-game-update', async (event, baseUrl, selectedLanguage) => {
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('game-update-status', 'Starting game update...');
    }

    // Step 1: Get available updates
    const updatesResult = await ipcMain.handle('get-available-updates', event, baseUrl, selectedLanguage);
    if (!updatesResult.success) {
      return updatesResult;
    }

    if (updatesResult.availableUpdates.length === 0) {
      return {
        success: true,
        message: 'Game is already up to date'
      };
    }

    // Step 2: Download and install each update
    for (const update of updatesResult.availableUpdates) {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('game-update-status', `Downloading update ${update.version}...`);
      }

      // Download the update
      const downloadResult = await ipcMain.handle('download-game-update', event, update.url);
      if (!downloadResult.success) {
        return downloadResult;
      }

      // Extract the update with language-specific localization
      const extractResult = await ipcMain.handle('extract-game-update', event, downloadResult.downloadPath, selectedLanguage, baseUrl);
      if (!extractResult.success) {
        return extractResult;
      }

      // Install the update
      const installResult = await ipcMain.handle('install-game-update', event, update.version);
      if (!installResult.success) {
        return installResult;
      }
    }

    return { 
      success: true, 
      message: `Game updated successfully! Applied ${updatesResult.availableUpdates.length} updates with ${selectedLanguage} localization.` 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Game update failed: ${error.message}` 
    };
  }
});

app.whenReady().then(() => {
  createWindow();

  // Auto-check for updates on startup
  try {
    // Auto-check for launcher updates (only in production)
    if (process.env.NODE_ENV !== 'development') {
      setTimeout(checkForLauncherUpdates, 3000); // Wait 3 seconds after startup
    }
    
    // Auto-check for game updates (always run)
    console.log('Starting auto-update check in 3 seconds...');
    setTimeout(performAutoGameUpdate, 3000); // Wait 3 seconds after startup
    
    // Set up periodic update checks (every hour)
    setInterval(performAutoGameUpdate, 60 * 60 * 1000); // Check every hour
    setInterval(checkForLauncherUpdates, 60 * 60 * 1000); // Check launcher updates every hour
  } catch (error) {
    console.error('Startup update check failed:', error);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
