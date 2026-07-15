@echo off
REM Station: seasons
setlocal
if "%NOMOW_BASE_URL%"=="" set NOMOW_BASE_URL=http://127.0.0.1:3000
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch-seasons.ps1" %*
