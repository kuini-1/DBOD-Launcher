/**
 * Shared keys + payload shape for game-update-status IPC (main + renderer).
 * tone: display color hint; updating: whether download/extract is in progress.
 */

const KEYS = {
  AUTO_CHECKING: 'gameUpdate.autoChecking',
  USING_PORTABLE_DIR: 'gameUpdate.usingPortableDir',
  USING_EXEC_DIR: 'gameUpdate.usingExecDir',
  FOUND_UPDATES: 'gameUpdate.foundUpdates',
  DOWNLOADING_UPDATE_VERSION: 'gameUpdate.downloadingUpdateVersion',
  EXTRACTING_UPDATE_VERSION: 'gameUpdate.extractingUpdateVersion',
  UPDATE_VERSION_COMPLETE: 'gameUpdate.updateVersionComplete',
  ALL_UPDATES_COMPLETE: 'gameUpdate.allUpdatesComplete',
  NO_UPDATES: 'gameUpdate.noUpdates',
  AUTO_FAILED: 'gameUpdate.autoFailed',
  MANUAL_CHECKING_GAME: 'gameUpdate.manualCheckingGame',
  MANUAL_CHECKING_AVAILABLE: 'gameUpdate.manualCheckingAvailable',
  MANUAL_DOWNLOADING_GAME: 'gameUpdate.manualDownloadingGame',
  MANUAL_EXTRACTING: 'gameUpdate.manualExtracting',
  DOWNLOADING_LOCALIZATION: 'gameUpdate.downloadingLocalization',
  LOCALIZATION_OK: 'gameUpdate.localizationOk',
  MANUAL_INSTALLING: 'gameUpdate.manualInstalling',
  MANUAL_STARTING: 'gameUpdate.manualStarting',
};

const TONE = {
  INFO: 'info',
  PROGRESS: 'progress',
  SUCCESS: 'success',
  ERROR: 'error',
};

function isValidPayload(payload) {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.key === 'string' &&
    typeof payload.tone === 'string'
  );
}

module.exports = {
  GAME_UPDATE_STATUS_KEYS: KEYS,
  GAME_UPDATE_TONE: TONE,
  isValidGameUpdateStatusPayload: isValidPayload,
};
