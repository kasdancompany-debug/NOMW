# Shared helpers for Northern Ontario Museum of Wonder Windows kiosk scripts.
# Dot-source: . "$PSScriptRoot\..\common\NomowKiosk.ps1"

$script:NomowDefaultInstall = "C:\Museum\nomow"
$script:NomowDefaultPort = 3000
$script:NomowStationMap = @{
  welcome      = "/exhibit/welcome"
  forest       = "/exhibit/forest"
  water        = "/exhibit/water"
  sky          = "/exhibit/sky"
  night        = "/exhibit/night"
  seasons      = "/exhibit/seasons"
  tracks       = "/exhibit/tracks"
  coexistence  = "/exhibit/coexistence"
}

function Get-NomowBaseUrl {
  if ($env:NOMOW_BASE_URL) { return $env:NOMOW_BASE_URL.TrimEnd("/") }
  $hostName = if ($env:HOSTNAME) { $env:HOSTNAME } else { "127.0.0.1" }
  if ($hostName -eq "0.0.0.0") { $hostName = "127.0.0.1" }
  $port = if ($env:PORT) { $env:PORT } else { $script:NomowDefaultPort }
  return "http://${hostName}:${port}"
}

function Get-NomowExhibitUrl {
  param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("welcome","forest","water","sky","night","seasons","tracks","coexistence")]
    [string]$Station
  )
  $base = Get-NomowBaseUrl
  return "$base$($script:NomowStationMap[$Station])"
}

function Resolve-NomowBrowserPath {
  param(
    [ValidateSet("edge","chrome","auto")]
    [string]$Browser = "auto"
  )

  $pref = if ($env:NOMOW_BROWSER) { $env:NOMOW_BROWSER.ToLowerInvariant() } else { $Browser }

  $edgeCandidates = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
  )
  $chromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )

  function First-Existing($paths) {
    foreach ($p in $paths) { if (Test-Path $p) { return $p } }
    return $null
  }

  if ($pref -eq "edge") { return First-Existing $edgeCandidates }
  if ($pref -eq "chrome") { return First-Existing $chromeCandidates }

  $edge = First-Existing $edgeCandidates
  if ($edge) { return $edge }
  return First-Existing $chromeCandidates
}

function Wait-NomowHealthy {
  param(
    [string]$BaseUrl = (Get-NomowBaseUrl),
    [int]$TimeoutSec = 90,
    [int]$IntervalSec = 2
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  $health = "$BaseUrl/api/health"
  while ((Get-Date) -lt $deadline) {
    try {
      $resp = Invoke-WebRequest -Uri $health -UseBasicParsing -TimeoutSec 3
      if ($resp.StatusCode -eq 200) {
        Write-Host "[nomow] Healthy: $health"
        return $true
      }
    } catch {
      # server still starting
    }
    Start-Sleep -Seconds $IntervalSec
  }
  Write-Warning "[nomow] Health check timed out: $health"
  return $false
}

function Start-NomowKioskBrowser {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [ValidateSet("edge","chrome","auto")]
    [string]$Browser = "auto",
    [string]$UserDataDir = ""
  )

  $exe = Resolve-NomowBrowserPath -Browser $Browser
  if (-not $exe) {
    throw "Neither Microsoft Edge nor Google Chrome was found."
  }

  $isEdge = $exe -match "msedge\.exe$"
  if (-not $UserDataDir) {
    $UserDataDir = Join-Path $env:LOCALAPPDATA "NomowKiosk\browser-profile"
  }
  New-Item -ItemType Directory -Force -Path $UserDataDir | Out-Null

  $args = @(
    "--user-data-dir=$UserDataDir",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-session-crashed-bubble",
    "--disable-features=TranslateUI,PopupBlocking",
    "--check-for-update-interval=31536000",
    "--autoplay-policy=no-user-gesture-required",
    "--kiosk",
    $Url
  )

  if ($isEdge) {
    $args = @("--edge-kiosk-type=fullscreen") + $args
  }

  Write-Host "[nomow] Launching kiosk: $exe"
  Write-Host "[nomow] URL: $Url"
  Start-Process -FilePath $exe -ArgumentList $args
}

function Stop-NomowKioskBrowsers {
  # Ends kiosk browser processes started for this museum (staff maintenance exit path).
  Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.ProcessName -in @("msedge", "chrome") -and
    $_.Path -and (
      $_.CommandLine -like "*NomowKiosk*" -or
      $_.CommandLine -like "*--kiosk*"
    )
  } | ForEach-Object {
    try { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } catch {}
  }

  # Fallback when CommandLine is unavailable without elevation:
  # Prefer staff exit via Ctrl+Alt+Shift+Q only if IT enables an exit scheduled task.
  Write-Host "[nomow] If browsers remain, use the staff exit scheduled task or Task Manager."
}
