# Floor printable — power loss / freeze recovery

## Immediate (visitor-facing screen dark or stuck)

1. [ ] Note which station (welcome / forest / …).
2. [ ] Wait 60 seconds — auto-logon + server + browser watchdog may still be starting.
3. [ ] If Windows desktop is visible: run station launch script or wait for watchdog task.
4. [ ] If browser shows an error page: confirm `http://127.0.0.1:3000/api/health` (Option A) or server LAN health (Option B).
5. [ ] Soft recovery: Task Manager → end `msedge`/`chrome` kiosk → watchdog relaunches, or run `deploy\windows\stations\launch-<slug>.cmd`.

## Server not healthy

1. [ ] Confirm Node process is running (`server.js`).
2. [ ] Restart scheduled task **Start-NomowServer** (or reboot PC).
3. [ ] Confirm `C:\Museum\nomow\server.js` exists and `public\` + `.next\static\` are present.
4. [ ] Check `PORT` not conflicting; try `http://127.0.0.1:3000/api/health`.
5. [ ] Option B: ping museum server from a display PC; verify switch / fixed IP.

## After power loss (all stations)

1. [ ] UPS / power restored; wait for full boot of each mini-PC (or the LAN server first in Option B).
2. [ ] Option B: verify server health before expecting displays to work.
3. [ ] Each display: fullscreen exhibit, correct slug, touch OK.
4. [ ] Staff panel → glance at offline / SW / heartbeat if diagnosing overnight issues.
5. [ ] If SW shell looks stale after an update during outage: Staff → **Reload application**, or clear site data once for the kiosk origin.

## Audio / session oddities after many idle resets

1. [ ] Mute toggle in staff panel, then unmute.
2. [ ] Soft reset / Back to start.
3. [ ] If needed: Exit kiosk (`Exit-KioskMode.ps1`) → relaunch station → visitor session clean.

## Staff exit (maintenance only)

1. [ ] Run `deploy\windows\Exit-KioskMode.ps1` (or IT hotkey task).
2. [ ] Do maintenance / RDP as configured.
3. [ ] Relaunch station script or reboot so visitors return to kiosk mode.

## Escalation

- [ ] Capture `/api/health` JSON, Windows Event Viewer Application errors, and which station failed.
- [ ] Re-copy last known-good `deploy/dist/nomow` if disk corruption suspected.
- [ ] See [DEPLOYMENT.md](../DEPLOYMENT.md) and [OFFLINE_DEPLOYMENT.md](../OFFLINE_DEPLOYMENT.md).
