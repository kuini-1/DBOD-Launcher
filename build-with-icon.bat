@echo off
echo Building DBOD Launcher with icon...
echo.

echo Step 1: Building launcher...
npm run dist:portable

echo.
echo Step 2: Clearing icon cache...
taskkill /f /im explorer.exe 2>nul
del /s /q "%localappdata%\IconCache.db" 2>nul
del /s /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul
del /s /q "%localappdata%\Microsoft\Windows\Explorer\thumbcache*" 2>nul
start explorer.exe

echo.
echo Build complete! The new icon should now appear.
echo If the icon still doesn't update:
echo 1. Restart your computer
echo 2. Or run: clear-icon-cache.bat
echo.
pause 