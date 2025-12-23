import React, { useState, useEffect } from 'react';

const VersionDisplay = () => {
  const [version, setVersion] = useState('1.0.1');

  useEffect(() => {
    // Try to get version from package.json
    const getVersion = async () => {
      try {
        // In Electron, we can access the package.json through the main process
        if (window.electronAPI && window.electronAPI.getAppVersion) {
          const appVersion = await window.electronAPI.getAppVersion();
          setVersion(appVersion);
        } else {
          // Fallback: try to fetch package.json
          const response = await fetch('/package.json');
          if (response.ok) {
            const packageData = await response.json();
            setVersion(packageData.version);
          }
        }
      } catch (error) {
        console.log('Could not load version automatically, using default');
        // Keep the default version
      }
    };

    getVersion();
  }, []);

  return (
    <span className="text-white font-semibold text-sm">
      DBOD - {version}
    </span>
  );
};

export default VersionDisplay; 