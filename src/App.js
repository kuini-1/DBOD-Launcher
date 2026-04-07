import React, { useState, useEffect } from 'react';
import VersionDisplay from './VersionDisplay';
import LauncherUpdate from './LauncherUpdate';
import { useI18n } from './i18n/I18nContext';
import { translateKey } from './i18n/translations';
import { isValidGameUpdateStatusPayload } from '../shared/gameUpdateStatusIpc';
import './LauncherUpdate.css';

function autoBannerClass(tone, updating) {
  if (tone === 'error') return 'bg-red-600';
  if (updating) return 'bg-green-400';
  return 'bg-green-800';
}

function userMessageBannerClass(tone) {
  if (tone === 'success') return 'bg-green-600';
  if (tone === 'error') return 'bg-red-600';
  return 'bg-blue-600';
}

function App() {
  const { t, setLocale } = useI18n();
  const [gameStatus, setGameStatus] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'EN';
  });
  const [autoIpc, setAutoIpc] = useState({
    key: 'autoUpdate.initial',
    params: {},
    tone: 'info',
    updating: false,
  });
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  const languages = [
    { label: 'CN', value: 'chinese' },
    { label: 'KR', value: 'korean' },
    { label: 'EN', value: 'english' },
  ];

  useEffect(() => {
    setLocale(selectedLanguage);
  }, [selectedLanguage, setLocale]);

  useEffect(() => {
    if (!window.electronAPI?.getGameVersionFile) return;
    window.electronAPI.getGameVersionFile().then((res) => {
      if (res?.success && res.locale && ['EN', 'KR', 'CN'].includes(res.locale)) {
        setSelectedLanguage(res.locale);
        setLocale(res.locale);
        localStorage.setItem('selectedLanguage', res.locale);
      }
    });
  }, [setLocale]);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onGameUpdateStatus((event, payload) => {
      if (!isValidGameUpdateStatusPayload(payload)) return;
      const { key, params, tone, updating } = payload;
      setAutoIpc({ key, params: params || {}, tone, updating });
      setIsUpdating(Boolean(updating));
      if (!updating) {
        setUpdateProgress(0);
      }
    });

    window.electronAPI.onGameUpdateProgress((event, progress) => {
      setUpdateProgress(progress);
    });
  }, []);

  const handleLaunchGame = async () => {
    setGameStatus({
      key: 'launch.launching',
      params: {},
      tone: 'info',
    });

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.launchGame({
          exePath: 'DBO.exe',
          params: [],
        });

        if (result.success) {
          setGameStatus({
            key: 'launch.success',
            params: {},
            tone: 'success',
          });
        } else {
          setGameStatus({
            key: 'launch.failed',
            params: { message: result.message },
            tone: 'error',
          });
          console.error('Game launch error:', result.message);
        }
      } else {
        alert(t('launch.devAlert'));
      }
    } catch (error) {
      setGameStatus({
        key: 'launch.error',
        params: { message: error.message },
        tone: 'error',
      });
      console.error('Game launch error:', error);
    }
  };

  const handleLanguageChange = async (language) => {
    const newLanguage = language.label;
    setSelectedLanguage(newLanguage);
    setLocale(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);

    const packKey = `lang.filePack.${language.value}`;
    setUpdateStatus({
      key: 'lang.changedDownloading',
      params: {
        code: newLanguage,
        pack: translateKey(newLanguage, packKey),
      },
      tone: 'info',
    });

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.downloadLanguageVersion(
          newLanguage,
          language.value
        );
        if (result.success) {
          setUpdateStatus({
            key: 'lang.filesOk',
            params: { code: newLanguage },
            tone: 'success',
          });

          try {
            if (window.electronAPI.triggerGameUpdate) {
              await window.electronAPI.triggerGameUpdate();
              setUpdateStatus({
                key: 'lang.filesOkGameOk',
                params: { code: newLanguage },
                tone: 'success',
              });
            }
          } catch (updateError) {
            console.log('Game update after language change failed:', updateError);
          }
        } else {
          setUpdateStatus({
            key: 'lang.failed',
            params: { code: newLanguage, message: result.message },
            tone: 'error',
          });
        }
      } else {
        setUpdateStatus({
          key: 'lang.changedNoDownload',
          params: { code: newLanguage },
          tone: 'info',
        });
      }
    } catch (error) {
      setUpdateStatus({
        key: 'lang.error',
        params: { code: newLanguage, message: error.message },
        tone: 'error',
      });
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

  const autoLine = t(autoIpc.key, autoIpc.params);

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <LauncherUpdate />
      <div className="w-80 h-full bg-gray-900 border border-gray-800 flex flex-col">
        <div
          className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move flex-shrink-0"
          style={{ WebkitAppRegion: 'drag' }}
        >
          <div className="flex items-center space-x-2 h-full">
            <img src="Icon.png" alt={t('ui.iconAlt')} className="w-8 h-8 rounded-full" />
            <VersionDisplay />
          </div>
          <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' }}>
            <button
              type="button"
              onClick={handleMinimize}
              className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
            >
              <div className="w-3 h-0.5 bg-white"></div>
            </button>
            <button
              type="button"
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

        <div className="hidden bg-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="text-white font-semibold text-lg">{t('ui.client')}</span>
          </div>
          <span className="text-white text-sm">{t('ui.version')}</span>
        </div>

        <div className="bg-gray-900 p-4 space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex space-x-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleLaunchGame}
              className={`flex-1 rounded-lg text-white py-2 px-4 transition-colors ${
                isUpdating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {t('ui.single')}
            </button>
            <button
              type="button"
              disabled={isUpdating}
              className={`flex-1 rounded-lg text-white py-2 px-4 transition-colors ${
                isUpdating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {t('ui.dual')}
            </button>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            className={`w-full rounded-lg text-white py-2 px-4 transition-colors ${
              isUpdating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {t('ui.closeAll')}
          </button>

          <div className="flex space-x-2">
            {languages.map((language) => (
              <button
                type="button"
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

          {gameStatus && (
            <div
              className={`text-white text-sm p-2 rounded text-center ${userMessageBannerClass(
                gameStatus.tone
              )}`}
            >
              {t(gameStatus.key, gameStatus.params)}
            </div>
          )}

          {updateStatus && (
            <div
              className={`text-white text-sm p-2 rounded text-center ${userMessageBannerClass(
                updateStatus.tone
              )}`}
            >
              {t(updateStatus.key, updateStatus.params)}
            </div>
          )}

          <div
            className={`text-white text-sm p-2 rounded text-center ${autoBannerClass(
              autoIpc.tone,
              autoIpc.updating
            )}`}
          >
            {autoLine}
          </div>

          {isUpdating && (
            <div className="bg-gray-800 p-2 rounded">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
              <p className="text-white text-xs mt-1 text-center">
                {t('ui.downloadProgress', { percent: Math.round(updateProgress) })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
