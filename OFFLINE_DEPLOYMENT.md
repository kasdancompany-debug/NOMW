# Offline deployment — Northern Ontario Museum of Wonder

This application is designed to run **without internet** during museum hours. Content, fonts, media, and app code are local. Internet is optional for initial install and content updates only.

## Architecture (local-first)

| Concern | Approach |
|---------|----------|
| App code | Next.js `output: "standalone"` + production service worker cache |
| Content | TypeScript modules under `src/content` (bundled at build) |
| Media | Files under `public/media` (served locally, cached by SW after first load) |
| Fonts | Vendored `.woff2` via `next/font/local` — no Google Fonts / CDN |
| Images | `images.unoptimized: true` — no remote image optimizer |
| Staff PIN | Local `POST /api/staff/verify` (Node on the kiosk or LAN) |
| Offline UX | Staff panel shows network + service-worker cache status only |

Visitor UI never depends on a CDN, remote API, or external font stylesheet.

---

## 1. How to build

On a networked build machine (office laptop or CI):

```bash
npm ci
npm run build
npm run prepare:standalone
```

This produces:

- `.next/standalone/` — Node server + copied `public/` + `.next/static/`
- Service worker at `public/sw.js` (included in the standalone `public` copy)
- Web app manifest at `public/manifest.webmanifest`

Copy the **entire** `.next/standalone` folder to each kiosk PC or to a museum LAN share.

**Environment for production build / run:**

```bash
# Preferred (server-only, not in the browser bundle)
STAFF_PIN=2468

# Optional air-gap / SW-shell recovery fallback (extractable from JS — use carefully)
# NEXT_PUBLIC_STAFF_PIN=2468
```

Set `STAFF_PIN` in the kiosk process environment or a local `.env` next to `server.js` if your host loads dotenv; otherwise set machine env vars / NSSM service env.

---

## 2. How to run it locally (dev & prod smoke)

### Development (build machine)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The service worker is **not** registered in development (avoids fighting HMR).

### Production smoke on one PC

```bash
npm run build
npm run prepare:standalone
cd .next/standalone
set HOSTNAME=127.0.0.1
set PORT=3000
set STAFF_PIN=2468
node server.js
```

Or from the repo root after a normal build:

```bash
set STAFF_PIN=2468
npm start
```

(`npm start` uses `.next` in-place; standalone is preferred for floor deploy.)

---

## 3. How to serve it on a museum LAN

**Recommended:** one Node process **per kiosk PC** (isolates failure domains):

1. Install Node.js LTS on each station (or a portable Node runtime on the USB image).
2. Copy `.next/standalone` to e.g. `C:\Museum\nomow\`.
3. Create a Windows service / scheduled task that runs at logon:

   ```text
   node C:\Museum\nomow\server.js
   ```

   with env:

   ```text
   HOSTNAME=127.0.0.1
   PORT=3000
   STAFF_PIN=<four digits>
   ```

4. Launch Chromium / Edge in kiosk mode to `http://127.0.0.1:3000/` (or the station’s exhibit path — see `docs/STATION_ASSIGNMENT.md`).

**Optional shared LAN host:** run one standalone server on a museum PC with `HOSTNAME=0.0.0.0` and point each display’s browser at `http://<server-ip>:3000/exhibit/<slug>`. Prefer wired LAN. App still must not call the public internet.

**PWA install (where appropriate):** Chromium can install the manifest (`display: standalone`) for a chrome-less window. Kiosk flags remain the primary floor setup — see `KIOSK_REQUIREMENTS.md`.

---

## 4. How to update content

| Change | Steps |
|--------|--------|
| Copy / animal / exhibit text | Edit `src/content/**`, rebuild, redeploy standalone folder |
| Media files | Replace files under `public/media/...` matching content paths, rebuild **or** copy into deployed `standalone/public/media` and hard-refresh / clear SW cache |
| Staff PIN | Change `STAFF_PIN` env on the station; restart Node |
| App version | Rebuild from git tag / release branch; replace standalone; restart |

After replacing `sw.js` or major assets, staff should **Reload application** from the staff panel (or clear site data once) so the new service worker activates.

Analytics and kiosk settings live in `localStorage` on each browser profile and are not overwritten by content deploys.

---

## 5. How to verify offline operation

1. Build and run production (`npm start` or standalone).
2. Load each exhibit once so `/_next/static` and essential `/media` enter the cache.
3. Open the **staff panel** → Status / Diagnostics:
   - **Network / offline** should show readiness (e.g. `Offline (local OK) · SW cache ready` when the NIC has no upstream internet).
4. Disconnect ethernet/Wi‑Fi (or use DevTools → Network → Offline).
5. Confirm:
   - Exhibit UI still responds (cached shell + local Node if still running).
   - Optional media that 404s shows the branded fallback — **never** a broken-image icon.
   - No requests leave the machine to CDNs (`fonts.googleapis.com`, image CDNs, analytics pixels).
6. Soft-fail check: rename a placeholder media file under `public/media` and reload — experience continues with fallback planes / silent audio miss.

Visitor UI must not show offline banners; only staff diagnostics do.

---

## 6. How to recover after power loss

1. PC boots → Node service starts `server.js` → kiosk browser opens the exhibit URL.
2. If the browser loads before Node is ready, reload after a few seconds (or use a delayed shell script).
3. Session state resets via the kiosk soft-reset / attract flow — visitors always land on a clean home.
4. Staff settings and aggregate analytics restore from `localStorage` on that browser profile.
5. If the disk image is healthy but the SW shell is stale: Staff panel → **Reload application** (hold), or open Chromium settings → clear cache for the kiosk origin once.
6. If media folders were on a removable drive that failed to mount: exhibits remain usable; optional media falls back. Remount drive and reload.

**Heartbeat:** staff diagnostics show last heartbeat / reset count for floor checks after overnight power events.

---

## Checklist — no runtime CDN / remote deps

- [ ] `next.config.ts` has `images.unoptimized: true` and no `assetPrefix` to a CDN
- [ ] Fonts load from `src/assets/fonts/*.woff2` (not `next/font/google`)
- [ ] Content imports are local modules (no CMS fetch at runtime)
- [ ] Media paths resolve under `/media/...` on the same origin
- [ ] Production registers `/sw.js` (app + media cache)
- [ ] Staff Network / offline row visible; visitor UI has no connectivity banner

---

## Related docs

- `DEPLOYMENT.md` — Option A/B Windows kiosk install, station scripts, health check, checklists
- `PROJECT_ARCHITECTURE.md` — stack and kiosk mapping
- `KIOSK_REQUIREMENTS.md` — browser flags and touch behaviour
- `MEDIA_GUIDELINES.md` / `MEDIA_IMPLEMENTATION.md` — packing media
- `docs/STAFF_PANEL.md` — PIN and staff controls
- `docs/STATION_ASSIGNMENT.md` — which PC opens which exhibit
- `docs/ANALYTICS.md` — local aggregate counters
