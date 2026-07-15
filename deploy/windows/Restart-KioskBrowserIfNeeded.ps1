# Restarts the kiosk browser if it has exited. Run from Task Scheduler every 1–2 minutes.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("welcome","forest","water","sky","night","seasons","tracks","coexistence")]
  [string]$Station,

  [ValidateSet("edge","chrome","auto")]
  [string]$Browser = "auto"
)

$ErrorActionPreference = "Continue"
. "$PSScriptRoot\..\common\NomowKiosk.ps1"

$url = Get-NomowExhibitUrl -Station $Station
$profileHint = "NomowKiosk"

$running = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  ($_.Name -eq "msedge.exe" -or $_.Name -eq "chrome.exe") -and
  $_.CommandLine -and
  $_.CommandLine -like "*$profileHint*" -and
  $_.CommandLine -like "*--kiosk*"
}

if ($running) {
  exit 0
}

Write-Host "[nomow] Kiosk browser not running — relaunching $Station"
$null = Wait-NomowHealthy -TimeoutSec 30
Start-NomowKioskBrowser -Url $url -Browser $Browser
