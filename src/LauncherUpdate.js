import React, { useState, useEffect } from 'react';
import { useI18n } from './i18n/I18nContext';

const LauncherUpdate = () => {
  const { t } = useI18n();
  const [launcherUpdate, setLauncherUpdate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    window.electronAPI.onLauncherUpdateAvailable((event, updateInfo) => {
      console.log('Launcher update available:', updateInfo);
      setLauncherUpdate(updateInfo);
    });

    window.electronAPI.onLauncherUpdateProgress((event, progress) => {
      console.log('Download progress:', progress);
      setDownloadProgress(progress);
    });

    window.electronAPI.onLauncherUpdateError((event, error) => {
      console.error('Download error:', error);
      setDownloadError(error);
      setIsDownloading(false);
    });

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
      } catch (error) {
        console.error('Failed to download launcher update:', error);
        setIsDownloading(false);
        setDownloadError(error.message || t('launcherUpdate.downloadFailed'));
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
          <h3>{t('launcherUpdate.title')}</h3>
          <p className="update-version">
            {t('launcherUpdate.version', { version: launcherUpdate.version })}
          </p>
        </div>
        <div className="update-content">
          <p>{t('launcherUpdate.body')}</p>

          {isDownloading && (
            <div className="download-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {t('launcherUpdate.downloading', { percent: downloadProgress })}
              </p>
            </div>
          )}

          {downloadError && (
            <div className="download-error">
              <p>{t('launcherUpdate.error', { message: downloadError })}</p>
            </div>
          )}
        </div>
        <div className="update-actions">
          <button
            type="button"
            className="update-button"
            onClick={handleLauncherUpdate}
            disabled={isDownloading}
          >
            {isDownloading ? t('launcherUpdate.downloadingBtn') : t('launcherUpdate.updateNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LauncherUpdate;
