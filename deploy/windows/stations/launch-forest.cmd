@echo off
REM Station: forest
setlocal
if "%NOMOW_BASE_URL%"=="" set NOMOW_BASE_URL=http://127.0.0.1:3000
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch-forest.ps1" %*
