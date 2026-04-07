import React, { useState, useEffect } from 'react';
import { useI18n } from './i18n/I18nContext';

const VersionDisplay = () => {
  const { t } = useI18n();
  const [version, setVersion] = useState('1.0.1');

  useEffect(() => {
    const getVersion = async () => {
      try {
        if (window.electronAPI && window.electronAPI.getAppVersion) {
          const appVersion = await window.electronAPI.getAppVersion();
          setVersion(appVersion);
        } else {
          const response = await fetch('/package.json');
          if (response.ok) {
            const packageData = await response.json();
            setVersion(packageData.version);
          }
        }
      } catch (error) {
        console.log('Could not load version automatically, using default');
      }
    };

    getVersion();
  }, []);

  return (
    <span className="text-white font-semibold text-sm">{t('version.title', { version })}</span>
  );
};

export default VersionDisplay;
