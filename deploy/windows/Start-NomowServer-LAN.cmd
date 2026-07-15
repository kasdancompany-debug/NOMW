@echo off
REM Option B — museum LAN host (binds all interfaces)
setlocal
if "%NOMOW_INSTALL_DIR%"=="" set NOMOW_INSTALL_DIR=C:\Museum\nomow
set HOSTNAME=0.0.0.0
if "%PORT%"=="" set PORT=3000
REM set STAFF_PIN=2468

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-NomowServer.ps1" %*
