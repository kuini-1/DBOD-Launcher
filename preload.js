const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Custom launcher update functions
  checkLauncherUpdate: () => ipcRenderer.invoke('check-launcher-update'),
  downloadLauncherUpdate: (updateUrl) => ipcRenderer.invoke('download-launcher-update', updateUrl),
  
  // App version function
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // GitHub auto-update functions (disabled for custom updates)
  // checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  // downloadUpdate: () => ipcRenderer.invoke('download-update'),
  
  // Game functions
  launchGame: (config) => ipcRenderer.invoke('launch-game', config),
  openGameDirectory: () => ipcRenderer.invoke('open-game-directory'),
  
  // Language version download
  downloadLanguageVersion: (language) => ipcRenderer.invoke('download-language-version', language),
  
  // Game update functions
  checkGameUpdate: (updateUrl) => ipcRenderer.invoke('check-game-update', updateUrl),
  downloadGameUpdate: (updateUrl) => ipcRenderer.invoke('download-game-update', updateUrl),
  extractGameUpdate: (downloadPath, selectedLanguage, baseUrl) => ipcRenderer.invoke('extract-game-update', downloadPath, selectedLanguage, baseUrl),
  installGameUpdate: () => ipcRenderer.invoke('install-game-update'),
  performGameUpdate: (baseUrl, selectedLanguage) => ipcRenderer.invoke('perform-game-update', baseUrl, selectedLanguage),
  getAvailableUpdates: (baseUrl, selectedLanguage) => ipcRenderer.invoke('get-available-updates', baseUrl, selectedLanguage),
  triggerGameUpdate: () => ipcRenderer.invoke('trigger-game-update'),
  
  // Window control functions
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Custom launcher update event listeners
  onLauncherUpdateAvailable: (callback) => ipcRenderer.on('launcher-update-available', callback),
  onLauncherUpdateProgress: (callback) => ipcRenderer.on('launcher-update-progress', callback),
  onLauncherUpdateError: (callback) => ipcRenderer.on('launcher-update-error', callback),
  
  // GitHub update event listeners (disabled for custom updates)
  // onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  // onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
  // onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
  // onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  // onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
  // onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
  
  // Game update event listeners
  onGameUpdateStatus: (callback) => ipcRenderer.on('game-update-status', callback),
  onGameUpdateProgress: (callback) => ipcRenderer.on('game-update-progress', callback),
  
  // Remove all listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 