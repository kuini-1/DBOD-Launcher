import React, { useState, useEffect } from 'react';
import VersionDisplay from './VersionDisplay';
import LauncherUpdate from './LauncherUpdate';
import './LauncherUpdate.css';

function App() {
  const [gameStatus, setGameStatus] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Load saved language from localStorage, default to 'EN'
    return localStorage.getItem('selectedLanguage') || 'EN';
  });
  const [gameUpdateStatus, setGameUpdateStatus] = useState('');
  const [autoUpdateStatus, setAutoUpdateStatus] = useState('Checking for updates...');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  const languages = [
    { label: 'CN', value: 'chinese' },
    { label: 'KR', value: 'korean' },
    { label: 'EN', value: 'english' }
  ];

  // Auto-update functionality
  useEffect(() => {
    if (window.electronAPI) {
      // Game update event listeners
      window.electronAPI.onGameUpdateStatus((event, status) => {
        setGameUpdateStatus(status);
        
        // Update auto-update status and progress
        if (status && typeof status === 'string') {
          if (status.includes('Checking') || status.includes('Downloading') || status.includes('Installing') || status.includes('Found')) {
            setAutoUpdateStatus('🔄 Auto-updating...');
            setIsUpdating(true);
          } else if (status.includes('successfully') || status.includes('up to date') || status.includes('No updates')) {
            setAutoUpdateStatus('✅ Auto-updates ready');
            setIsUpdating(false);
            setUpdateProgress(0);
          }
        }
      });

      window.electronAPI.onGameUpdateProgress((event, progress) => {
        setUpdateProgress(progress);
      });
    }
  }, []);

  const handleLaunchGame = async () => {
    setGameStatus('Launching Dragon Ball Online...');
    
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.launchGame({
          exePath: 'DBO.exe',
          params: [] // No parameters for now, can be added in the future
        });
        
        if (result.success) {
          setGameStatus('Game launched successfully!');
        } else {
          setGameStatus(`Failed to launch game: ${result.message}`);
          console.error('Game launch error:', result.message);
        }
      } else {
        alert(`Launching Dragon Ball Online...\nPath: DBO.exe`);
      }
    } catch (error) {
      setGameStatus(`Error launching game: ${error.message}`);
      console.error('Game launch error:', error);
    }
  };



  const handleLanguageChange = async (language) => {
    const newLanguage = language.label;
    setSelectedLanguage(newLanguage);
    
    // Save the selected language to localStorage
    localStorage.setItem('selectedLanguage', newLanguage);
    
    setUpdateStatus(`Language changed to ${newLanguage}. Downloading ${language.value} language files...`);
    
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.downloadLanguageVersion(newLanguage, language.value);
        if (result.success) {
          setUpdateStatus(`${newLanguage} language files downloaded successfully!`);
          
          // After successful language download, trigger a game update to ensure all files are in sync
          try {
            if (window.electronAPI && window.electronAPI.triggerGameUpdate) {
              await window.electronAPI.triggerGameUpdate();
              setUpdateStatus(`${newLanguage} language files downloaded and game updated successfully!`);
            }
          } catch (updateError) {
            console.log('Game update after language change failed:', updateError);
            // Don't show error to user as language files were downloaded successfully
          }
        } else {
          setUpdateStatus(`Failed to download ${newLanguage} language files: ${result.message}`);
        }
      } else {
        setUpdateStatus(`Language changed to ${newLanguage} (language files download not available)`);
      }
    } catch (error) {
      setUpdateStatus(`Error downloading ${newLanguage} language files: ${error.message}`);
      console.error('Language download error:', error);
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <LauncherUpdate />
      <div className="w-80 h-full bg-gray-900 border border-gray-800 flex flex-col">
        {/* Drag Bar */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move flex-shrink-0" style={{ WebkitAppRegion: 'drag' }}>
          <div className="flex items-center space-x-2 h-full">
            <img src="Icon.png" alt="DBO Icon" className="w-8 h-8 rounded-full" />
            <VersionDisplay />
          </div>
          <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' }}>
            <button 
              onClick={handleMinimize}
              className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
            >
              <div className="w-3 h-0.5 bg-white"></div>
            </button>
            <button 
              onClick={handleClose}
              className="w-6 h-6 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
            >
              <div className="w-3 h-3 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 rotate-45"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 -rotate-45"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="hidden bg-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            {/* Discord Icon */}
            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="text-white font-semibold text-lg">Client</span>
          </div>
          <span className="text-white text-sm">Version</span>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900 p-4 space-y-3 flex-1 flex flex-col justify-center">
          {/* Single/Dual Buttons */}
          <div className="flex space-x-2">
            <button 
              disabled={isUpdating}
              onClick={handleLaunchGame}
              className={`flex-1 rounded-lg text-white py-2 px-4 transition-colors ${
                isUpdating 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Single
            </button>
            <button 
              disabled={isUpdating}
              className={`flex-1 rounded-lg text-white py-2 px-4 transition-colors ${
                isUpdating 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Dual
            </button>
          </div>

          {/* Close All Button */}
          <button 
            disabled={isUpdating}
            className={`w-full rounded-lg text-white py-2 px-4 transition-colors ${
              isUpdating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Close All
          </button>

          {/* Language Buttons */}
          <div className="flex space-x-2">
            {languages.map((language) => (
              <button
                key={language.value}
                disabled={isUpdating}
                onClick={() => handleLanguageChange(language)}
                className={`flex-1 py-2 px-4 text-white rounded-lg transition-colors ${
                  isUpdating
                    ? 'bg-gray-600 cursor-not-allowed'
                    : selectedLanguage === language.label
                      ? 'bg-red-400 border border-red-400 border-dashed'
                      : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>

          {/* Game Launch Status */}
          {gameStatus && (
            <div className={`text-white text-sm p-2 rounded text-center ${
              gameStatus.includes('successfully') 
                ? 'bg-green-600' 
                : gameStatus.includes('Failed') || gameStatus.includes('Error')
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}>
              {gameStatus}
            </div>
          )}

          {/* Language Update Status */}
          {updateStatus && (
            <div className={`text-white text-sm p-2 rounded text-center ${
              updateStatus.includes('successfully') 
                ? 'bg-green-600' 
                : updateStatus.includes('Failed') || updateStatus.includes('Error')
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}>
              {updateStatus}
            </div>
          )}

          {/* Auto Update Status */}
          <div className={`text-white text-sm p-2 rounded text-center ${
            autoUpdateStatus.includes('Checking') || autoUpdateStatus.includes('🔄') 
              ? 'bg-green-400' 
              : 'bg-green-800'
          }`}>
            {autoUpdateStatus}
          </div>

          {/* Progress Bar */}
          {isUpdating && (
            <div className="bg-gray-800 p-2 rounded">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
              <p className="text-white text-xs mt-1 text-center">
                Downloading... {Math.round(updateProgress)}%
              </p>
            </div>
          )}




        </div>
      </div>
    </div>
  );
}

export default App; 