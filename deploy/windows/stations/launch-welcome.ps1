# Station launcher — welcome
# Option A: NOMOW_BASE_URL=http://127.0.0.1:3000 (default)
# Option B: set NOMOW_BASE_URL=http://<museum-server-ip>:3000 before running
$ErrorActionPreference = "Stop"
& "$PSScriptRoot\..\Launch-Station.ps1" -Station welcome @args
