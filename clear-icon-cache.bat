@echo off
echo Clearing Windows Icon Cache...
echo.

echo Stopping Windows Explorer...
taskkill /f /im explorer.exe

echo Clearing icon cache...
del /s /q "%localappdata%\IconCache.db" 2>nul
del /s /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul
del /s /q "%localappdata%\Microsoft\Windows\Explorer\thumbcache*" 2>nul

echo Restarting Windows Explorer...
start explorer.exe

echo.
echo Icon cache cleared! The new icon should now appear.
echo If it still doesn't work, try:
echo 1. Restart your computer
echo 2. Or change the executable name slightly
echo.
pause 