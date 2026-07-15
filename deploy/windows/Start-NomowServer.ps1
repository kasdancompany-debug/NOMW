# Starts the local Next.js standalone server for a museum station or LAN host.
# Install layout (default): C:\Museum\nomow\server.js
#
# Option A (mini-PC, local only):
#   $env:HOSTNAME = "127.0.0.1"
# Option B (museum server):
#   $env:HOSTNAME = "0.0.0.0"

param(
  [string]$InstallDir = $(if ($env:NOMOW_INSTALL_DIR) { $env:NOMOW_INSTALL_DIR } else { "C:\Museum\nomow" }),
  [string]$HostnameBind = $(if ($env:HOSTNAME) { $env:HOSTNAME } else { "127.0.0.1" }),
  [int]$Port = $(if ($env:PORT) { [int]$env:PORT } else { 3000 })
)

$ErrorActionPreference = "Stop"
$server = Join-Path $InstallDir "server.js"
if (-not (Test-Path $server)) {
  throw "Missing $server — copy the standalone build to $InstallDir first. See DEPLOYMENT.md."
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "Node.js is not on PATH. Install Node.js LTS on this machine."
}

$env:HOSTNAME = $HostnameBind
$env:PORT = "$Port"
if (-not $env:STAFF_PIN) {
  Write-Warning "STAFF_PIN is not set. Staff PIN verification will use the build fallback."
}

Write-Host "[nomow] Starting server: $server"
Write-Host "[nomow] Bind: HOSTNAME=$HostnameBind PORT=$Port"
Set-Location $InstallDir
& node $server
