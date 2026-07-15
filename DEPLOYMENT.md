# Museum deployment — eight touchscreen stations

How to install **The Northern Ontario Museum of Wonder** for floor operation on Windows landscape kiosks (1920×1080).

| Doc | Role |
|-----|------|
| **This file** | Topology, Windows kiosk setup, updates, checklists |
| [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md) | Air-gap / offline build & SW verification |
| [PERFORMANCE.md](./PERFORMANCE.md) | Media budgets, endurance, mini-PC sizing |
| [docs/STATION_ASSIGNMENT.md](./docs/STATION_ASSIGNMENT.md) | Slug ↔ display mapping |
| [deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md) | Printable install checklist |
| [deploy/RECOVERY_CHECKLIST.md](./deploy/RECOVERY_CHECKLIST.md) | Printable recovery checklist |

Station map: [exhibit.map.json](./exhibit.map.json).

---

## Topology options

### Option A — One mini-PC per screen (recommended)

Each touchscreen has its own Windows mini-PC. That PC runs:

1. Local Node standalone server (`server.js`) bound to **127.0.0.1:3000**
2. Edge or Chrome in **kiosk mode** opening that station's exhibit URL

**Pros:** Failure domain is one display; no LAN dependency at visitor time; matches [PERFORMANCE.md](./PERFORMANCE.md) guidance.  
**Cons:** Eight copies of the app to update; eight Node installs.

```text
[Touch LCD] → [Mini-PC A] → node 127.0.0.1:3000 → Edge kiosk → /exhibit/welcome
[Touch LCD] → [Mini-PC B] → node 127.0.0.1:3000 → Edge kiosk → /exhibit/forest
… (eight total)
```

### Option B — One local museum server + eight displays

One Windows (or Linux) host on a **private museum LAN** runs a single Node server bound to **0.0.0.0:3000**. Each display PC (or thin client) only runs a kiosk browser pointed at:

`http://<server-ip>:3000/exhibit/<slug>`

**Pros:** One place to update the application.  
**Cons:** Server or switch outage darkens all eight screens; eight browsers still load media over LAN — prefer **wired** gigabit, fixed IPs, UPS on the server.

```text
                    ┌─────────────────────────┐
                    │  Museum server          │
                    │  HOSTNAME=0.0.0.0:3000  │
                    └───────────┬─────────────┘
                                │ private LAN
        ┌───────────┬───────────┼───────────┬───────────┐
     Display1 …  Display8  (browser kiosk only)
```

**Hybrid:** Option A on the floor with USB/share updates still pushes the same standalone folder to each PC.

---

## Production build

On a build machine (office laptop / CI):

```bash
npm ci
npm run build:production
# optional USB / share pack:
npm run pack:deploy
```

| Output | Purpose |
|--------|---------|
| `.next/standalone/` | Floor runtime (`server.js` + `public/` + `.next/static/`) |
| `deploy/.release.json` | Version / build timestamp |
| `deploy/dist/nomow/` | Clean copy for USB (after `pack:deploy`) |
| `deploy/dist/windows/` | Kiosk scripts copy (after `pack:deploy`) |

Environment template: [.env.example](./.env.example).

Critical variables:

| Variable | Option A | Option B (server) | Option B (display) |
|----------|----------|-------------------|--------------------|
| `STAFF_PIN` | Set on each PC | Set on server | — |
| `HOSTNAME` | `127.0.0.1` | `0.0.0.0` | — |
| `PORT` | `3000` | `3000` | — |
| `NOMOW_BASE_URL` | `http://127.0.0.1:3000` | — | `http://192.168.x.x:3000` |

Copy standalone contents to e.g. `C:\Museum\nomow\` so `C:\Museum\nomow\server.js` exists.

---

## Health-check endpoint

```http
GET /api/health
```

Example response:

```json
{
  "ok": true,
  "service": "nomow",
  "name": "Northern Ontario Museum of Wonder",
  "version": "0.1.0",
  "uptimeSec": 128,
  "timestamp": "2026-07-15T17:00:00.000Z"
}
```

Use from:

- Station launch scripts (`Wait-NomowHealthy`) before opening the browser
- Browser watchdog after power loss
- LAN monitors (Option B)

Does **not** expose the staff PIN.

---

## Station URLs

| Display | Slug | Path | Launcher |
|---------|------|------|----------|
| 1 | welcome | `/exhibit/welcome` | `deploy/windows/stations/launch-welcome.cmd` |
| 2 | forest | `/exhibit/forest` | `launch-forest.cmd` |
| 3 | water | `/exhibit/water` | `launch-water.cmd` |
| 4 | sky | `/exhibit/sky` | `launch-sky.cmd` |
| 5 | night | `/exhibit/night` | `launch-night.cmd` |
| 6 | seasons | `/exhibit/seasons` | `launch-seasons.cmd` |
| 7 | tracks | `/exhibit/tracks` | `launch-tracks.cmd` |
| 8 | coexistence | `/exhibit/coexistence` | `launch-coexistence.cmd` |

Or: `powershell -File deploy\windows\Launch-Station.ps1 -Station forest`.

---

## Windows kiosk deployment

Scripts live under [`deploy/windows/`](./deploy/windows/).

### 1. Automatic login

Use a dedicated **local** Windows account (e.g. `MuseumKiosk`) with minimal privileges.

Options (IT chooses one):

1. **Settings → Accounts → Sign-in options** — disable password requirement for local accounts where policy allows, **or**
2. `netplwiz` → uncheck "Users must enter a user name and password", **or**
3. Sysinternals **Autologon** (stores encrypted secret in registry).

Ensure the account cannot casually install software. Pair with physical case locks.

### 2. Launch Edge or Chrome in kiosk mode

Prefer **Microsoft Edge** on Windows museum images.

Launchers call shared helpers in `deploy/windows/common/NomowKiosk.ps1`, which start the browser with:

- `--kiosk <exhibit-url>`
- Edge: `--edge-kiosk-type=fullscreen`
- Isolated profile: `%LOCALAPPDATA%\NomowKiosk\browser-profile`
- `--no-first-run`, `--disable-session-crashed-bubble`
- Long `--check-for-update-interval` to reduce update prompts
- `--autoplay-policy=no-user-gesture-required` (muted video beds; audio still respects in-app unlock)

Set `NOMOW_BROWSER=edge` or `chrome` if both are installed.

### 3. Launch the correct exhibit URL

Each PC's **logon** scheduled task should run **only that station's** script, e.g.:

```text
C:\Museum\scripts\stations\launch-forest.cmd
```

Do not point every screen at `/` unless you intend staff one-time station assignment ([docs/STATION_ASSIGNMENT.md](./docs/STATION_ASSIGNMENT.md)).

### 4. Fullscreen flags

Covered by `--kiosk` (+ Edge fullscreen kiosk type). Hide the taskbar via full-screen kiosk; optionally use Shell Launcher / Assigned Access for harder lockdown (IT).

### 5. Disabling sleep

Run **elevated once** per PC:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Museum\scripts\Configure-KioskPower.ps1
```

This sets AC/DC monitor/standby/hibernate timeouts to **0** and prefers High performance when available.

### 6. Disabling screen saver

The same script sets `ScreenSaveActive=0` for the current user and enables a no-lock-screen policy key. Confirm under **Settings → Personalization → Lock screen → Screen saver → None**.

### 7. Restoring after power loss

Recommended Task Scheduler layout (Option A example):

| Task | Trigger | Action |
|------|---------|--------|
| `NOMOW-Server` | At logon | `Start-NomowServer.cmd` (restart on failure) |
| `NOMOW-Browser` | At logon, delay 15–30 s | `stations\launch-<slug>.cmd` |
| `NOMOW-BrowserWatchdog` | Every 1–2 minutes | `Restart-KioskBrowserIfNeeded.ps1 -Station <slug>` |

`launch-*.ps1` waits for `/api/health` before opening the browser so a race after boot is less likely.

Option B: start the **server** task on the museum host first; display PCs only run browser + watchdog with `NOMOW_BASE_URL` set.

Also use a small UPS so abrupt power cuts do not corrupt the SSD.

### 8. Automatic browser restart after failure

`Restart-KioskBrowserIfNeeded.ps1` checks for a kiosk process using the `NomowKiosk` profile; if missing, relaunches the station URL. Register it as a repeating scheduled task.

### 9. Local network configuration

| Mode | Network |
|------|---------|
| Option A | NIC may be unplugged at runtime; app is local. Keep NIC for IT deploy windows if desired. |
| Option B | Private VLAN/switch; **fixed IP** for server; DHCP reservations for display PCs; no guest Wi‑Fi route to the kiosk VLAN; block outbound internet if policy requires air-gap |

Firewall (Option B server): allow **inbound TCP 3000** only from the museum display subnet.

### 10. Touch calibration

1. Windows **Settings → Bluetooth & devices → Touch** / **Tablet PC Settings → Calibrate** (UI varies by OEM).
2. Confirm landscape orientation locked; rotation lock **on**.
3. Disable edge swipe / Windows gesture bars where they conflict with full-bleed UI (OEM / GPO).
4. Walk the [TESTING.md](./TESTING.md) physical touchscreen checklist once per panel.

### 11. Hiding operating system notifications

- **Settings → System → Notifications** → Off (or only critical).
- Disable tips, suggestions, Whats new, sticky keys prompts.
- Focus assist / Do not disturb **Alarms only** or Always.
- Optional GPO: turn off Windows Update restart notifications during open hours; schedule patch windows.
- `Configure-KioskPower.ps1` sets quiet-hours related keys where available — verify on your Windows build.

### 12. Safely exiting kiosk mode for staff

Visitors must not discover an exit. Staff options:

1. Run `deploy\windows\Exit-KioskMode.ps1` from a USB stick or RDP session (kills Nomow kiosk browser only; Node keeps running).
2. IT-bound scheduled task with a **non-obvious** hotkey (document in the vault, not on the bezel).
3. Staff panel PIN remains for **in-app** controls (mute, assignment) — it does **not** drop to the desktop by design.

Re-enter floor mode by running the station `launch-*.cmd` or rebooting so logon tasks fire.

### 13. Application update procedure

1. Build: `npm run build:production` (and optionally `npm run pack:deploy`).
2. Copy new files to each `C:\Museum\nomow\` (Option A) or the single server folder (Option B). Prefer rename-swap:
   - Stop Node task → replace folder → start Node task.
3. Restart or kill kiosk browsers so they pick up new HTML/JS (watchdog will relaunch).
4. Staff panel → **Reload application** once per station if the service worker shell looks stale (see [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md)).
5. Smoke: `/api/health` version field, correct exhibit, staff PIN, idle → attract.
6. Record version on [deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md).

Media-only hotfixes can replace files under `public/media` inside the deploy folder; still hard-refresh / SW reload after large media changes.

---

## Quick start — Option A (one PC)

```bat
REM 1) Copy deploy\dist\nomow → C:\Museum\nomow
REM 2) Copy deploy\dist\windows → C:\Museum\scripts
set STAFF_PIN=2468
set HOSTNAME=127.0.0.1
set PORT=3000
C:\Museum\scripts\Start-NomowServer.cmd
REM New window / task after health:
C:\Museum\scripts\stations\launch-forest.cmd
```

## Quick start — Option B

**Server:**

```bat
set STAFF_PIN=2468
set HOSTNAME=0.0.0.0
set PORT=3000
C:\Museum\scripts\Start-NomowServer-LAN.cmd
```

**Each display:**

```bat
set NOMOW_BASE_URL=http://192.168.10.10:3000
C:\Museum\scripts\stations\launch-welcome.cmd
```

---

## Deployment checklist

Printable copy: [deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md).

Summary:

- [ ] Production build + PIN vaulted
- [ ] Topology A or B chosen
- [ ] Auto-logon, power, screensaver, notifications
- [ ] Server + station launchers + watchdog scheduled
- [ ] Health OK on all targets
- [ ] Eight exhibits mapped to eight displays
- [ ] Power-cycle proof on at least one station

---

## Recovery checklist

Printable copy: [deploy/RECOVERY_CHECKLIST.md](./deploy/RECOVERY_CHECKLIST.md).

Summary:

- [ ] Wait for auto-recovery / check `/api/health`
- [ ] Restart server task if unhealthy
- [ ] Relaunch or wait for browser watchdog
- [ ] Option B: restore server before displays
- [ ] Staff reload if SW stale after update + outage

---

## Script index

| Script | Purpose |
|--------|---------|
| `scripts/build-production.mjs` | `npm run build:production` |
| `scripts/pack-deploy.mjs` | `npm run pack:deploy` |
| `deploy/windows/Start-NomowServer.ps1` | Run standalone Node |
| `deploy/windows/Start-NomowServer.cmd` | Option A bind helper |
| `deploy/windows/Start-NomowServer-LAN.cmd` | Option B bind `0.0.0.0` |
| `deploy/windows/Launch-Station.ps1` | Generic station browser launch |
| `deploy/windows/stations/launch-*.cmd` | Eight fixed exhibit launchers |
| `deploy/windows/Restart-KioskBrowserIfNeeded.ps1` | Watchdog |
| `deploy/windows/Configure-KioskPower.ps1` | Sleep / screensaver |
| `deploy/windows/Exit-KioskMode.ps1` | Staff browser exit |

---

## Related

- [KIOSK_REQUIREMENTS.md](./KIOSK_REQUIREMENTS.md) — UX / chrome locks
- [docs/STAFF_PANEL.md](./docs/STAFF_PANEL.md) — PIN and diagnostics
- [TESTING.md](./TESTING.md) — e2e + physical checks
