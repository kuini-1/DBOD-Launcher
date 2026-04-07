/** UI + game-update-status IPC strings for EN / KR / CN (Simplified Chinese). */

const EN = {
  'ui.single': 'Single',
  'ui.dual': 'Dual',
  'ui.closeAll': 'Close All',
  'ui.iconAlt': 'DBO Icon',
  'ui.client': 'Client',
  'ui.version': 'Version',

  'version.title': 'DBOD - {{version}}',

  'autoUpdate.initial': 'Checking for updates...',
  'autoUpdate.busy': 'Updating...',
  'autoUpdate.ready': 'Auto-updates ready',
  'autoUpdate.issue': 'Auto-update issue: {{message}}',

  'ui.downloadProgress': 'Downloading... {{percent}}%',

  'launch.launching': 'Launching Dragon Ball Online...',
  'launch.success': 'Game launched successfully!',
  'launch.failed': 'Failed to launch game: {{message}}',
  'launch.error': 'Error launching game: {{message}}',
  'launch.devAlert': 'Launching Dragon Ball Online...\nPath: DBO.exe',

  'lang.filePack.chinese': 'Chinese',
  'lang.filePack.korean': 'Korean',
  'lang.filePack.english': 'English',
  'lang.changedDownloading':
    'Language changed to {{code}}. Downloading {{pack}} language files...',
  'lang.filesOk': '{{code}} language files downloaded successfully!',
  'lang.filesOkGameOk': '{{code}} language files downloaded and game updated successfully!',
  'lang.failed': 'Failed to download {{code}} language files: {{message}}',
  'lang.changedNoDownload': 'Language changed to {{code}} (language files download not available)',
  'lang.error': 'Error downloading {{code}} language files: {{message}}',

  'launcherUpdate.title': 'Launcher update',
  'launcherUpdate.version': 'Version {{version}}',
  'launcherUpdate.body': 'A new version of the launcher is available.',
  'launcherUpdate.downloading': 'Downloading... {{percent}}%',
  'launcherUpdate.error': 'Error: {{message}}',
  'launcherUpdate.updateNow': 'Update Now',
  'launcherUpdate.downloadingBtn': 'Downloading...',
  'launcherUpdate.downloadFailed': 'Download failed',

  'gameUpdate.autoChecking': 'Checking for updates...',
  'gameUpdate.usingPortableDir': 'Using portable directory: {{path}}',
  'gameUpdate.usingExecDir': 'Using executable directory: {{path}}',
  'gameUpdate.foundUpdates': 'Found {{count}} updates available',
  'gameUpdate.downloadingUpdateVersion': 'Downloading update {{version}}...',
  'gameUpdate.extractingUpdateVersion': 'Extracting update {{version}}...',
  'gameUpdate.updateVersionComplete': 'Update {{version}} completed successfully',
  'gameUpdate.allUpdatesComplete': 'All updates completed successfully',
  'gameUpdate.noUpdates': 'No updates available',
  'gameUpdate.autoFailed': 'Game auto-update failed: {{message}}',
  'gameUpdate.manualCheckingGame': 'Checking for game updates...',
  'gameUpdate.manualCheckingAvailable': 'Checking for available updates...',
  'gameUpdate.manualDownloadingGame': 'Downloading game update...',
  'gameUpdate.manualExtracting': 'Extracting game update...',
  'gameUpdate.downloadingLocalization': 'Downloading {{lang}} localization...',
  'gameUpdate.localizationOk': '{{lang}} localization downloaded successfully',
  'gameUpdate.manualInstalling': 'Installing game update...',
  'gameUpdate.manualStarting': 'Starting game update...',
};

const KR = {
  'ui.single': '싱글',
  'ui.dual': '듀얼',
  'ui.closeAll': '모두 닫기',
  'ui.iconAlt': 'DBO 아이콘',
  'ui.client': '클라이언트',
  'ui.version': '버전',

  'version.title': 'DBOD - {{version}}',

  'autoUpdate.initial': '업데이트 확인 중...',
  'autoUpdate.busy': '업데이트 중...',
  'autoUpdate.ready': '자동 업데이트 준비 완료',
  'autoUpdate.issue': '자동 업데이트 문제: {{message}}',

  'ui.downloadProgress': '다운로드 중... {{percent}}%',

  'launch.launching': '드래곤볼 온라인 실행 중...',
  'launch.success': '게임이 성공적으로 실행되었습니다!',
  'launch.failed': '게임 실행 실패: {{message}}',
  'launch.error': '게임 실행 오류: {{message}}',
  'launch.devAlert': '드래곤볼 온라인 실행 중...\n경로: DBO.exe',

  'lang.filePack.chinese': '중국어',
  'lang.filePack.korean': '한국어',
  'lang.filePack.english': '영어',
  'lang.changedDownloading': '언어가 {{code}}(으)로 변경되었습니다. {{pack}} 언어 파일을 다운로드하는 중...',
  'lang.filesOk': '{{code}} 언어 파일 다운로드가 완료되었습니다!',
  'lang.filesOkGameOk': '{{code}} 언어 파일 다운로드 및 게임 업데이트가 완료되었습니다!',
  'lang.failed': '{{code}} 언어 파일 다운로드 실패: {{message}}',
  'lang.changedNoDownload': '언어가 {{code}}(으)로 변경되었습니다 (언어 파일 다운로드를 사용할 수 없음)',
  'lang.error': '{{code}} 언어 파일 다운로드 오류: {{message}}',

  'launcherUpdate.title': '런처 업데이트',
  'launcherUpdate.version': '버전 {{version}}',
  'launcherUpdate.body': '런처의 새 버전을 사용할 수 있습니다.',
  'launcherUpdate.downloading': '다운로드 중... {{percent}}%',
  'launcherUpdate.error': '오류: {{message}}',
  'launcherUpdate.updateNow': '지금 업데이트',
  'launcherUpdate.downloadingBtn': '다운로드 중...',
  'launcherUpdate.downloadFailed': '다운로드 실패',

  'gameUpdate.autoChecking': '업데이트 확인 중...',
  'gameUpdate.usingPortableDir': '포터블 디렉터리 사용: {{path}}',
  'gameUpdate.usingExecDir': '실행 파일 디렉터리 사용: {{path}}',
  'gameUpdate.foundUpdates': '사용 가능한 업데이트 {{count}}개',
  'gameUpdate.downloadingUpdateVersion': '업데이트 {{version}} 다운로드 중...',
  'gameUpdate.extractingUpdateVersion': '업데이트 {{version}} 압축 해제 중...',
  'gameUpdate.updateVersionComplete': '업데이트 {{version}}이(가) 완료되었습니다',
  'gameUpdate.allUpdatesComplete': '모든 업데이트가 완료되었습니다',
  'gameUpdate.noUpdates': '사용 가능한 업데이트 없음',
  'gameUpdate.autoFailed': '게임 자동 업데이트 실패: {{message}}',
  'gameUpdate.manualCheckingGame': '게임 업데이트 확인 중...',
  'gameUpdate.manualCheckingAvailable': '사용 가능한 업데이트 확인 중...',
  'gameUpdate.manualDownloadingGame': '게임 업데이트 다운로드 중...',
  'gameUpdate.manualExtracting': '게임 업데이트 압축 해제 중...',
  'gameUpdate.downloadingLocalization': '{{lang}} 로컬라이제이션 다운로드 중...',
  'gameUpdate.localizationOk': '{{lang}} 로컬라이제이션 다운로드 완료',
  'gameUpdate.manualInstalling': '게임 업데이트 설치 중...',
  'gameUpdate.manualStarting': '게임 업데이트 시작...',
};

const CN = {
  'ui.single': '单开',
  'ui.dual': '双开',
  'ui.closeAll': '全部关闭',
  'ui.iconAlt': 'DBO 图标',
  'ui.client': '客户端',
  'ui.version': '版本',

  'version.title': 'DBOD - {{version}}',

  'autoUpdate.initial': '正在检查更新...',
  'autoUpdate.busy': '正在更新...',
  'autoUpdate.ready': '自动更新已就绪',
  'autoUpdate.issue': '自动更新出现问题：{{message}}',

  'ui.downloadProgress': '正在下载... {{percent}}%',

  'launch.launching': '正在启动龙珠在线...',
  'launch.success': '游戏启动成功！',
  'launch.failed': '启动游戏失败：{{message}}',
  'launch.error': '启动游戏出错：{{message}}',
  'launch.devAlert': '正在启动龙珠在线...\n路径：DBO.exe',

  'lang.filePack.chinese': '中文',
  'lang.filePack.korean': '韩语',
  'lang.filePack.english': '英语',
  'lang.changedDownloading': '语言已切换为 {{code}}。正在下载 {{pack}} 语言文件...',
  'lang.filesOk': '{{code}} 语言文件下载成功！',
  'lang.filesOkGameOk': '{{code}} 语言文件已下载并完成游戏更新！',
  'lang.failed': '下载 {{code}} 语言文件失败：{{message}}',
  'lang.changedNoDownload': '语言已切换为 {{code}}（无法下载语言文件）',
  'lang.error': '下载 {{code}} 语言文件出错：{{message}}',

  'launcherUpdate.title': '启动器更新',
  'launcherUpdate.version': '版本 {{version}}',
  'launcherUpdate.body': '有新版本的启动器可用。',
  'launcherUpdate.downloading': '正在下载... {{percent}}%',
  'launcherUpdate.error': '错误：{{message}}',
  'launcherUpdate.updateNow': '立即更新',
  'launcherUpdate.downloadingBtn': '正在下载...',
  'launcherUpdate.downloadFailed': '下载失败',

  'gameUpdate.autoChecking': '正在检查更新...',
  'gameUpdate.usingPortableDir': '使用便携目录：{{path}}',
  'gameUpdate.usingExecDir': '使用可执行文件目录：{{path}}',
  'gameUpdate.foundUpdates': '发现 {{count}} 个可用更新',
  'gameUpdate.downloadingUpdateVersion': '正在下载更新 {{version}}...',
  'gameUpdate.extractingUpdateVersion': '正在解压更新 {{version}}...',
  'gameUpdate.updateVersionComplete': '更新 {{version}} 已成功完成',
  'gameUpdate.allUpdatesComplete': '所有更新已成功完成',
  'gameUpdate.noUpdates': '没有可用更新',
  'gameUpdate.autoFailed': '游戏自动更新失败：{{message}}',
  'gameUpdate.manualCheckingGame': '正在检查游戏更新...',
  'gameUpdate.manualCheckingAvailable': '正在检查可用更新...',
  'gameUpdate.manualDownloadingGame': '正在下载游戏更新...',
  'gameUpdate.manualExtracting': '正在解压游戏更新...',
  'gameUpdate.downloadingLocalization': '正在下载 {{lang}} 本地化...',
  'gameUpdate.localizationOk': '{{lang}} 本地化下载成功',
  'gameUpdate.manualInstalling': '正在安装游戏更新...',
  'gameUpdate.manualStarting': '正在开始游戏更新...',
};

export const translations = { EN, KR, CN };

export const LOCALES = ['EN', 'KR', 'CN'];

export function normalizeLocale(raw) {
  const u = String(raw || 'EN').toUpperCase();
  return LOCALES.includes(u) ? u : 'EN';
}

export function translateKey(locale, key, params) {
  const loc = normalizeLocale(locale);
  const table = translations[loc] || translations.EN;
  const fallback = translations.EN;
  let template = table[key] ?? fallback[key] ?? key;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((k) => {
      template = template.split(`{{${k}}}`).join(String(params[k] ?? ''));
    });
  }
  return template;
}
