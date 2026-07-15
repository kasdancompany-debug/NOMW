# Staff-safe exit from kiosk browser (does not unlock Windows).
# Bind to a Scheduled Task with a secret hotkey or run from a USB staff stick.

. "$PSScriptRoot\..\common\NomowKiosk.ps1"

Write-Host "[nomow] Closing museum kiosk browser windows..."
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  ($_.Name -eq "msedge.exe" -or $_.Name -eq "chrome.exe") -and
  $_.CommandLine -and
  $_.CommandLine -like "*NomowKiosk*" -and
  $_.CommandLine -like "*--kiosk*"
} | ForEach-Object {
  Write-Host "  Stopping PID $($_.ProcessId)"
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Write-Host "[nomow] Kiosk browser closed. Node server left running."
Write-Host "[nomow] To stop the server: end the Start-NomowServer task / service."
