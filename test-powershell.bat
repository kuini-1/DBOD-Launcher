@echo off
echo Testing PowerShell execution...
powershell -ExecutionPolicy Bypass -Command "Write-Host 'PowerShell is working'; Start-Sleep -Seconds 2"
echo Test complete.
pause 