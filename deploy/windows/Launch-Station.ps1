# Launch one station browser in kiosk mode after the app is healthy.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("welcome","forest","water","sky","night","seasons","tracks","coexistence")]
  [string]$Station,

  [ValidateSet("edge","chrome","auto")]
  [string]$Browser = "auto",

  [int]$HealthTimeoutSec = 90
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\common\NomowKiosk.ps1"

$url = Get-NomowExhibitUrl -Station $Station
$ok = Wait-NomowHealthy -TimeoutSec $HealthTimeoutSec
if (-not $ok) {
  Write-Warning "[nomow] Launching browser anyway — server may still be starting."
}

Start-NomowKioskBrowser -Url $url -Browser $Browser
