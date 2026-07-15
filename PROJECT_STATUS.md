# Project status — Northern Ontario Museum of Wonder

**Audit date:** 2026-07-15  
**Scope:** Codebase production-readiness review (architecture, TypeScript, lint, kiosk systems, docs, tests).  
**Honest limit:** This audit was **not** run on museum installation hardware. Capacitive touchscreens, Edge/Chrome OS kiosk mode, speaker levels, overnight endurance, and thermal/mini-PC behaviour are **unvalidated** here unless explicitly noted as Playwright/dev-machine checks.

| Check | Result (this audit) |
|-------|---------------------|
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Pass (no ESLint errors) |
| Playwright suite | Present (37 tests listed) — not re-executed end-to-end in this status write-up |
| Physical kiosk / 8-hour soak | **Not tested** |

Companion docs: [README.md](./README.md), [DEPLOYMENT.md](./DEPLOYMENT.md), [PERFORMANCE.md](./PERFORMANCE.md), [TESTING.md](./TESTING.md), [ACCESSIBILITY.md](./ACCESSIBILITY.md), [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md).

---

## Complete

Implemented in code and exerciseable on a development machine (browser + local Node):

- **Architecture** — Next.js App Router, `output: "standalone"`, eight exhibit routes, shared `ExhibitShell`, dynamic per-exhibit chunks, `KioskProviders` stack (session, station gate, SW register, audio lifecycle, staff host).
- **Station assignment** — `?station=`, persisted assignment, setup screen, cross-station bounce, staff reassignment (`docs/STATION_ASSIGNMENT.md`).
- **Attract mode** — Full-viewport attract, gesture absorbed on exit, exhibit tree unmounted while attract is showing, Ken Burns / layered landscapes when no final video bed.
- **Inactivity soft-reset** — Warning overlay, one soft-reset per idle cycle, handler registry, home scene restore, audio silence via `AudioLifecycleGuard`.
- **Staff access** — Logo hold → PIN pad → panel (mute, volume, reduced motion, timeouts, restart, analytics, fullscreen API, clear settings). Server PIN verify at `POST /api/staff/verify`.
- **Local analytics** — Aggregate counters in `localStorage` (no visitor PII); staff export (`docs/ANALYTICS.md`).
- **Media soft-fail** — Missing images/video/audio degrade to branded fallback / still / silent miss without crashing the station.
- **Offline-oriented build** — Vendored fonts, unoptimized local images, production service worker, standalone pack scripts, health endpoint `GET /api/health`.
- **Reduced-motion path** — OS preference + staff force; collapses continuous motion; night list explore; video stills.
- **Visual MVP (Welcome / Forest / Night)** — Layered placeholder landscapes, silhouettes, labelled placeholder badges, attract beds, forest carousel + size compare, night flashlight.
- **Windows deploy tooling** — Option A/B docs, station launch scripts, power/screensaver helper, browser watchdog, checklists under `deploy/`.
- **Accessibility foundations** — Documented contrast/touch tokens, captions hooks, drag alternatives on key interactions (`ACCESSIBILITY.md`).
- **Performance mitigations (code)** — 1s session clock, dynamic imports, attract pause of underlay work, glass blur reduced, seasons two-layer crossfade, audio fade timer cleanup (`PERFORMANCE.md`).
- **Error boundary** — Per-exhibit boundary with return-to-start + audio silence.
- **TypeScript / ESLint** — Clean as of this audit.
- **Defects fixed in this audit** — Production PIN no longer falls back to `2468`; soft-reset always closes the animal profile store; shell background `imageSrc`/`posterSrc` wired; Howler `onstop` no longer races major-slot notify; Tracks drag `pointercancel` handled; analytics `endSession(reason?)` signature aligned.

---

## Working but Requires Physical Testing

These behaviours exist in software or deploy scripts but **have not been validated on installation hardware** in this audit:

| Area | Why physical testing is required |
|------|----------------------------------|
| Capacitive touch / gloves / palm rejection | Playwright uses Chromium `hasTouch` only |
| 64px+ targets on all exhibits | Automated check currently strongest on Forest |
| Edge/Chrome `--kiosk` fullscreen | OS flags + Scheduled Tasks; app does not replace the OS shell |
| Auto-logon / power-loss recovery | Windows tasks + Node start race |
| Audio loudness / ducking across room speakers | Levels are code defaults only |
| Attract / idle timings on floor distraction | 90s defaults; staff can override |
| Service worker cache after true offline (Node down) | e2e “offline” still uses the local Next server |
| Eight concurrent mini-PCs | Performance document procedures only |
| 8-hour / 24-hour endurance | Documented; not executed here |
| Staff logo-hold reliability on each brand surface | Synthetic pointer in e2e only |
| Touch calibration / rotation lock / gesture edges | OEM Windows settings |
| Fullscreen API vs exclusive kiosk | Staff panel can enter Fullscreen API — not OS kiosk |

---

## Placeholder Content

Intentional stand-ins that should be replaced before curator sign-off:

- Illustrated welcome atlas SVG shapes (not cartography)
- Layered CSS/SVG habitat landscapes for Welcome / Forest / Night attract and stages
- Species silhouettes (moose, bear, wolf, caribou, deer, lynx, human) marked “PLACEHOLDER SILHOUETTE”
- Meet-the-animals sequence reduced to a short MVP set (moose → wolf → lynx)
- Explore-the-room UI framed as a **three-station demonstration**; other stations listed as “arriving next”
- Water, Sky, Seasons, Tracks, Coexistence exhibits — interaction scaffolds exist; not the visual MVP focus
- Many animal fields still `status: "placeholder"` or `[NEEDS RESEARCH]` copy in content modules
- Conservation / coexistence safety wording flagged for authority review
- Quiz / track / clue prose awaiting naturalist review (`src/content/clues`, exhibit content)

---

## Missing Media

Under `public/media/` today (aside from `.gitkeep` and a few labelled SVG habitat plates):

| Expected finals | Status |
|-----------------|--------|
| Photographic habitat stills (WebP) | Missing (placeholder paths soft-fail) |
| Background loops (H.264 MP4) + posters | Missing |
| Animal portraits / cutouts | Missing |
| Ambient beds (MP3) | Missing |
| Animal calls / UI ticks (MP3) | Missing |
| Caption tracks (VTT) where planned | Missing |

Content references `/media/.../placeholders/*.PLACEHOLDER.*`. Soft-fail keeps the app up; the floor will still look and sound like a **prototype** until finals land. Follow [MEDIA_GUIDELINES.md](./MEDIA_GUIDELINES.md) and [PERFORMANCE.md](./PERFORMANCE.md) size budgets.

---

## Missing Scientific Review

Do **not** treat on-screen facts as installation-ready until reviewed:

- Species measurements, diets, ranges, and conservation labels marked placeholder / needs-research
- Track and call identification copy
- “How Big Is the North?” comparative figures (two of three marked awaiting curator figures)
- Coexistence encounter / safety directives — require local wildlife authority + museum educator approval
- Migration / nesting / seasonal timing notes in bird and habitat content
- Any silhouette scale ratios presented as “relative visual only,” not metrology

---

## Missing Accessibility Review

Code accommodations exist; a formal a11y sign-off has **not** been completed:

- Contrast measurement against WCAG on final photography/glass overlays
- Standing-distance readability on actual 1920×1080 panels
- Screen-reader / switch-access policy for a museum floor (often limited by design)
- Caption completeness once audio/video finals arrive
- Reduced-motion QA on every exhibit with infinite Framer loops
- Touch target audit on water / sky / seasons / tracks / coexistence (not only forest)
- Review of `user-scalable=no` and kiosk lock trade-offs with museum accessibility stakeholders

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) and the physical checklist in [TESTING.md](./TESTING.md).

---

## Deployment Tasks

1. Set production `STAFF_PIN` on every Node host (no development fallback in production).
2. Choose topology **Option A** (mini-PC per screen) or **Option B** (LAN server) — [DEPLOYMENT.md](./DEPLOYMENT.md).
3. `npm run build:production` → copy standalone to `C:\Museum\nomow\` (or pack via `npm run pack:deploy`).
4. Configure Windows auto-logon, `Configure-KioskPower.ps1`, notifications off, touch calibration.
5. Schedule Node server + station `launch-*.cmd` + browser watchdog; verify `GET /api/health`.
6. Warm each origin once so the service worker can cache shell + media when files exist.
7. Assign stations (`/?station=…` or direct `/exhibit/{slug}`) and lock OS kiosk flags.
8. Complete [deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md) and keep [deploy/RECOVERY_CHECKLIST.md](./deploy/RECOVERY_CHECKLIST.md) at the desk.
9. Drop final media under `public/media` (or deployed `public/media`) and rebuild or hot-swap with staff reload.
10. Run physical smoke: touch, attract, idle reset, staff PIN, mute, reduced motion, power cycle.

---

## Known Risks

| Risk | Severity | Notes |
|------|----------|-------|
| OS kiosk escape (taskbar, gestures, USB) | High | App cannot fully prevent; deploy scripts + IT lockdown required |
| Missing media → soft placeholders forever | High | Visitors see labelled prototypes if finals never ship |
| Unreviewed scientific / safety copy | High | Especially coexistence + conservation |
| Eight concurrent Chromium + video beds | Medium | Prefer one PC per display; soak-test per [PERFORMANCE.md](./PERFORMANCE.md) |
| SW stale after updates | Medium | Staff “Reload application” / clear site data |
| Attract unmount vs local component state | Medium | Soft-reset + remount recover most; profile close now forced in provider |
| Four-digit staff PIN | Medium | Deterrence only — document in staff vault |
| `softResetOnError` renews idle via `noteInteraction` | Low | May delay attract during unstable sessions |
| Dual ambient fade paths (manager + hook) | Low | Rapid reset edge cases |
| Documentation drift (`PROJECT_ARCHITECTURE.md` export options) | Low | Standalone is the floor path |

---

## Recommended Next Actions

1. **Install finals for Welcome / Forest / Night media** (still + optional loops + one moose portrait + night ambience) so demos stop reading as pure CSS.
2. **Run Playwright green** on CI (`npm run test:e2e`) and expand coverage: correct staff PIN unlock, analytics export, production SW path.
3. **Physical pilot on one mini-PC + one panel** — touch, kiosk flags, audio, power-loss, 8-hour attract idle — before buying eight identical kits.
4. **Curator / naturalist content pass** clearing `[NEEDS RESEARCH]` and coexistence safety text.
5. **Accessibility stakeholder review** with final art and glass overlays.
6. **Set and vault `STAFF_PIN`**, rotate from any shared bring-up values.
7. **Finish remaining five exhibits visually** only after the three-station demo is signed as the room feel.
8. **Align `PROJECT_ARCHITECTURE.md`** with standalone-only deployment to reduce operator confusion.

---

## Defects fixed during this audit

| Issue | Fix |
|-------|-----|
| Production PIN fell back to `2468` | `resolveStaffPin()` returns empty in production without env; API denies |
| Profile overlay could survive attract idle | `softReset` closes `useAnimalProfileStore` (+ home scene) even if UI unmounted |
| Shell backgrounds unwired | `defaultBackground.imageSrc` / `posterSrc` set from placeholder media |
| Howler `onstop` raced major playback | `useLocalAudio` no longer calls `notifyEnded` on stop |
| Tracks drag stuck on cancel | `onPointerCancel` clears drag state |
| `endSession` signature mismatch | Accepts optional `reason` |
| Staff docs understated PIN fallback | `docs/STAFF_PANEL.md` updated |

---

*This file records status as of the audit date. Update it when media, content, hardware validation, or test evidence changes.*
