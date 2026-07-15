@echo off
REM Start NOMOW standalone Node server (Option A default: localhost bind)
setlocal
if "%NOMOW_INSTALL_DIR%"=="" set NOMOW_INSTALL_DIR=C:\Museum\nomow
if "%HOSTNAME%"=="" set HOSTNAME=127.0.0.1
if "%PORT%"=="" set PORT=3000
REM Set STAFF_PIN in System Environment or uncomment:
REM set STAFF_PIN=2468

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-NomowServer.ps1" %*
