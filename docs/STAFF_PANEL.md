# Staff control panel

Hidden technician UI for The Northern Ontario Museum of Wonder kiosks.

## Access

1. **Press and hold** the museum lockup (attract title, shell brand line, or Welcome `MuseumTitle`) for **six seconds**.
2. Enter the **four-digit PIN** on the pad.
3. Use **Return to exhibit** when finished. The panel also auto-closes after two minutes of staff inactivity.

Deep link `/staff` opens the same PIN gate (recovery landing only).

## PIN configuration

| Variable | Where | Notes |
|----------|--------|--------|
| `STAFF_PIN` | Server / deployment env (preferred) | Four digits. Checked in `POST /api/staff/verify`. **Not** shipped in the browser bundle when only this is set. **Required in production** — if unset (and no public fallback), every PIN is denied. |
| `NEXT_PUBLIC_STAFF_PIN` | Build-time public env | Offline/air-gap fallback only. |
| Development fallback | `staffConfig.developmentPinFallback` (`2468`) | Used **only** when `NODE_ENV !== "production"` and neither env is set. |

Copy `.env.example` → `.env.local` (or your host’s secret store) and set `STAFF_PIN` before floor deploy.

### Limitations of client-side PIN protection

- This is **deterrence for casual visitors**, not high security.
- Anyone with physical access, debugging tools, or the client bundle can eventually recover a `NEXT_PUBLIC_*` PIN or brute-force a four-digit pad (rate-limited lightly only).
- Prefer `STAFF_PIN` so verification runs on the local Next server (`next start` on the kiosk PC still counts as server-side).
- Do **not** reuse museum security codes or building alarm codes.
- Rotate the PIN if a station is compromised or staff leave.

## Panel controls

| Area | Controls |
|------|----------|
| Status | Exhibit ID, app version, route, session phase, time until reset / attract, resolution, **Network / offline** (connectivity + service-worker cache), media loading, audio, fullscreen |
| Settings | Reduced-motion cycle, volume + mute, inactivity timeout, attract delay |
| Actions | Restart exhibit, reload app (hold), enter/exit fullscreen, clear local settings (hold), diagnostics, **analytics**, return to exhibit |

Dangerous OS / browser tooling (task manager, file system, DevTools launchers, shell escapes) are intentionally **not** exposed.

## Analytics (staff view)

Aggregate **counts only** on this station (`nomow.kiosk.analytics.v1`). No visitor names, faces, photos, free-text answers, or advertising identifiers.

Staff can review totals (sessions, average duration, top animals / activities / calls, resets, errors) and **Export JSON**. Clearing local settings also clears analytics.

See `docs/ANALYTICS.md` for the replaceable `AnalyticsService` interface.

## Local settings cleared by “Clear local settings”

- `nomow.kiosk.settings.v1`
- `nomow.kiosk.heartbeat.v1`
- `nomow.kiosk.station.v1` (station assignment — returns the PC to first-launch setup)
- `nomow.kiosk.analytics.v1` (aggregate event counts)

Then defaults are restored (volume, mute, motion preference, timeout overrides).
