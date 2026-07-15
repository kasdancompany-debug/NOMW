# Floor printable — museum deploy / update day

## Before you leave the office

- [ ] `npm ci` and `npm run build:production` succeeded
- [ ] `npm run pack:deploy` staged `deploy/dist/nomow` (optional USB pack)
- [ ] `STAFF_PIN` chosen and stored in museum IT vault (not in git)
- [ ] Release version noted (`deploy/.release.json`)
- [ ] Deployment topology decided: **Option A** (8 mini-PCs) or **Option B** (1 LAN server)

## Per Windows machine (once)

- [ ] Node.js LTS installed (Option A every PC; Option B server only)
- [ ] Edge or Chrome installed
- [ ] Auto-logon configured for the kiosk Windows account
- [ ] `Configure-KioskPower.ps1` run elevated (no sleep / screensaver)
- [ ] Notifications / tips disabled for the kiosk user
- [ ] Touchscreen calibrated; landscape 1920×1080 confirmed
- [ ] Wired LAN verified (Option B) or localhost-only (Option A)
- [ ] Scheduled tasks created: start server at logon, launch station after delay, browser watchdog every 1–2 min

## Application install

- [ ] Copied standalone build to `C:\Museum\nomow\` (server + all Option A PCs)
- [ ] `STAFF_PIN` / `HOSTNAME` / `PORT` set in task or system environment
- [ ] Option A: `HOSTNAME=127.0.0.1` · Option B server: `HOSTNAME=0.0.0.0`
- [ ] Option B displays: `NOMOW_BASE_URL=http://<server-ip>:3000`

## Station mapping

- [ ] Display 1 → welcome (`launch-welcome`)
- [ ] Display 2 → forest
- [ ] Display 3 → water
- [ ] Display 4 → sky
- [ ] Display 5 → night
- [ ] Display 6 → seasons
- [ ] Display 7 → tracks
- [ ] Display 8 → coexistence

## Smoke test (each screen)

- [ ] `GET http://<host>:3000/api/health` returns `{ "ok": true }`
- [ ] Correct exhibit loads fullscreen (no Windows chrome)
- [ ] Touch targets respond; no OS edge gestures interfering
- [ ] Staff panel opens with PIN; mute / reduced motion work
- [ ] Idle → attract → tap-to-return works
- [ ] Power-cycle test: auto-login → server → browser → exhibit

## Sign-off

- [ ] Date / tech initials __________________
- [ ] Version deployed __________________
