# Exercise every exhibit route and record kiosk health over a long floor run.
param(
  [string]$BaseUrl = "http://127.0.0.1:3000",
  [double]$Hours = 8,
  [int]$IntervalSeconds = 60,
  [int]$RequestTimeoutSeconds = 15,
  [int]$MaximumFailures = 3,
  [string]$LogPath = "$PSScriptRoot\logs\kiosk-soak.csv",
  [switch]$Once
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/api/health",
  "/exhibit/welcome",
  "/exhibit/forest",
  "/exhibit/night",
  "/exhibit/water",
  "/exhibit/sky",
  "/exhibit/seasons",
  "/exhibit/tracks",
  "/exhibit/coexistence"
)

$logDirectory = Split-Path -Parent $LogPath
if (-not (Test-Path $logDirectory)) {
  New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
}

if (-not (Test-Path $LogPath)) {
  "timestamp,route,status,elapsedMs,browserMemoryMb,error" | Set-Content -Path $LogPath
}

$deadline = (Get-Date).AddHours($Hours)
$failures = 0

Write-Host "[nomow] Starting kiosk soak: $Hours hour(s), every $IntervalSeconds second(s)."
Write-Host "[nomow] Log: $LogPath"

do {
  $browserMemoryMb = [math]::Round(
    ((Get-Process msedge, chrome -ErrorAction SilentlyContinue |
      Measure-Object WorkingSet64 -Sum).Sum / 1MB),
    1
  )

  foreach ($route in $routes) {
    $started = Get-Date
    $status = 0
    $errorText = ""
    try {
      $response = Invoke-WebRequest `
        -Uri "$($BaseUrl.TrimEnd('/'))$route" `
        -UseBasicParsing `
        -TimeoutSec $RequestTimeoutSeconds
      $status = [int]$response.StatusCode
      if ($status -lt 200 -or $status -ge 400) {
        throw "HTTP $status"
      }
    }
    catch {
      $failures += 1
      $errorText = $_.Exception.Message.Replace('"', "'").Replace(",", ";")
      Write-Warning "[nomow] $route failed: $errorText"
    }

    $elapsedMs = [math]::Round(((Get-Date) - $started).TotalMilliseconds)
    $timestamp = (Get-Date).ToString("o")
    "$timestamp,$route,$status,$elapsedMs,$browserMemoryMb,`"$errorText`"" |
      Add-Content -Path $LogPath
  }

  if ($failures -ge $MaximumFailures) {
    throw "Kiosk soak stopped after $failures request failures. See $LogPath."
  }

  if ($Once) { break }
  Start-Sleep -Seconds $IntervalSeconds
} while ((Get-Date) -lt $deadline)

Write-Host "[nomow] Soak complete with $failures failure(s)."
