# Launch one station browser in kiosk mode after the app is healthy.
#
# Default: every TV opens Welcome (shared start). Pass -Direct so this
# display boots straight into its assigned exhibit area.
# Guests may freely navigate any /exhibit/* from any screen.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("welcome","forest","water","sky","night","seasons","tracks","coexistence")]
  [string]$Station,

  [ValidateSet("edge","chrome","auto")]
  [string]$Browser = "auto",

  [int]$HealthTimeoutSec = 90,

  # Open this station's exhibit immediately instead of Welcome.
  [switch]$Direct
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\common\NomowKiosk.ps1"

$bootStation = if ($Direct -or $Station -eq "welcome") { $Station } else { "welcome" }
$url = Get-NomowExhibitUrl -Station $bootStation

$ok = Wait-NomowHealthy -TimeoutSec $HealthTimeoutSec
if (-not $ok) {
  Write-Warning "[nomow] Launching browser anyway — server may still be starting."
}

Write-Host "[nomow] Boot $($bootStation) (preferred area: $Station)$(if ($Direct) { ' · direct' } else { ' · shared Welcome start' })"
Start-NomowKioskBrowser -Url $url -Browser $Browser
