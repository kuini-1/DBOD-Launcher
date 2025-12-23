import React, { useState, useEffect } from 'react';

const LauncherUpdate = () => {
  const [launcherUpdate, setLauncherUpdate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    // Listen for launcher update notifications
    window.electronAPI.onLauncherUpdateAvailable((event, updateInfo) => {
      console.log('Launcher update available:', updateInfo);
      setLauncherUpdate(updateInfo);
    });

    // Listen for download progress
    window.electronAPI.onLauncherUpdateProgress((event, progress) => {
      console.log('Download progress:', progress);
      setDownloadProgress(progress);
    });

    // Listen for download errors
    window.electronAPI.onLauncherUpdateError((event, error) => {
      console.error('Download error:', error);
      setDownloadError(error);
      setIsDownloading(false);
    });

    // Clean up listeners
    return () => {
      window.electronAPI.removeAllListeners('launcher-update-available');
      window.electronAPI.removeAllListeners('launcher-update-progress');
      window.electronAPI.removeAllListeners('launcher-update-error');
    };
  }, []);

  const handleLauncherUpdate = async () => {
    if (launcherUpdate && !isDownloading) {
      console.log('Starting launcher update with URL:', launcherUpdate.url);
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);
      try {
        if (!launcherUpdate.url) {
          throw new Error('Update URL is missing');
        }
        await window.electronAPI.downloadLauncherUpdate(launcherUpdate.url);
        // The app will quit and restart with the new version
      } catch (error) {
        console.error('Failed to download launcher update:', error);
        setIsDownloading(false);
        setDownloadError(error.message || 'Download failed');
      }
    }
  };

  if (!launcherUpdate || !launcherUpdate.version || !launcherUpdate.url) {
    console.log('Invalid launcher update info:', launcherUpdate);
    return null;
  }

  return (
    <div className="launcher-update-overlay">
      <div className="launcher-update-modal">
        <div className="update-header">
          <h3>🚀 Launcher Update</h3>
          <p className="update-version">Version {launcherUpdate.version}</p>
        </div>
        <div className="update-content">
          <p>A new version of the launcher is available.</p>
          
          {isDownloading && (
            <div className="download-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">Downloading... {downloadProgress}%</p>
            </div>
          )}
          
          {downloadError && (
            <div className="download-error">
              <p>Error: {downloadError}</p>
            </div>
          )}
        </div>
        <div className="update-actions">
          <button 
            className="update-button"
            onClick={handleLauncherUpdate}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Update Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LauncherUpdate; 