@echo off
echo Cleaning up stuck launcher update...

echo Current directory: %CD%
echo.

echo Checking for files:
if exist "DBOD-Launcher.exe" (
    echo Found: DBOD-Launcher.exe
) else (
    echo Not found: DBOD-Launcher.exe
)

if exist "DBOD-Launcher-new.exe" (
    echo Found: DBOD-Launcher-new.exe
) else (
    echo Not found: DBOD-Launcher-new.exe
)

if exist "update-launcher.bat" (
    echo Found: update-launcher.bat
) else (
    echo Not found: update-launcher.bat
)

echo.
echo Checking for running processes:
tasklist /FI "IMAGENAME eq DBOD-Launcher.exe" 2>NUL

echo.
echo To manually complete the update:
echo 1. Close any running launcher
echo 2. Delete DBOD-Launcher.exe
echo 3. Rename DBOD-Launcher-new.exe to DBOD-Launcher.exe
echo 4. Delete update-launcher.bat
echo 5. Start the new launcher

pause 