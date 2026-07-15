# The Northern Ontario Museum of Wonder

Interactive touchscreen installation for eight landscape kiosk displays. Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, and Howler.js. Designed for offline museum operation at 1920×1080 (16:9).

Architecture source of truth:

- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)
- [CONTENT_MODEL.md](./CONTENT_MODEL.md)
- [KIOSK_REQUIREMENTS.md](./KIOSK_REQUIREMENTS.md)
- [MEDIA_GUIDELINES.md](./MEDIA_GUIDELINES.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Option A/B museum install, Windows kiosk, station scripts, health check
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — production-readiness audit status (complete / gaps / risks)
- [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md) — build, LAN serve, offline verify, power-loss recovery
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — touchscreen accessibility accommodations and limitations
- [TESTING.md](./TESTING.md) — Playwright commands and physical touchscreen checklist
- [PERFORMANCE.md](./PERFORMANCE.md) — eight-kiosk perf audit, media budgets, endurance tests, mini-PC sizing

Physical screen → route map: [exhibit.map.json](./exhibit.map.json)

**Visual MVP (demonstration focus):** `/exhibit/welcome`, `/exhibit/forest`, and `/exhibit/night` carry the polished room feel. Other exhibits remain scaffolds for the full eight-station floor.

---

## Start the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to `/exhibit/welcome`.

Production-style local serve:

```bash
npm run build:production
npm run start:standalone
```

Or `npm start` after `npm run build` for an in-place smoke test. USB/share pack: `npm run pack:deploy`.

Floor install (eight stations, Windows kiosk): [DEPLOYMENT.md](./DEPLOYMENT.md).  
Air-gapped / SW verify: [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md).

Other scripts: `npm run lint`, `npm run format`, `npm run test:e2e` (see [TESTING.md](./TESTING.md)).

---

## Open a specific exhibit

| Exhibit | URL |
|---------|-----|
| Welcome | [/exhibit/welcome](http://localhost:3000/exhibit/welcome) |
| Forest | [/exhibit/forest](http://localhost:3000/exhibit/forest) |
| Water | [/exhibit/water](http://localhost:3000/exhibit/water) |
| Sky | [/exhibit/sky](http://localhost:3000/exhibit/sky) |
| Night | [/exhibit/night](http://localhost:3000/exhibit/night) |
| Seasons | [/exhibit/seasons](http://localhost:3000/exhibit/seasons) |
| Tracks | [/exhibit/tracks](http://localhost:3000/exhibit/tracks) |
| Coexistence | [/exhibit/coexistence](http://localhost:3000/exhibit/coexistence) |

On the museum floor, each kiosk browser should launch fullscreen to its assigned URL (see `exhibit.map.json`).

---

## How media files are organized

All runtime media is local under `public/media/` (served as `/media/...`):

```
public/media/
  animals/     # portraits, silhouettes, species stills
  ambience/    # looping environmental beds (often referenced as audio)
  habitats/    # habitat stills / environment plates
  icons/       # UI / signage marks
  museum/      # brand and room identity assets
  sounds/      # UI cues, animal calls, one-shots
  video/       # background loops and short cinematic clips
```

Content modules reference media by stable `MediaId` and a `src` path (for example `/media/animals/moose-portrait-01.webp`). Prefer changing files + content paths over editing visual components. Mark unfinished assets with `placeholder: true`. Details: `MEDIA_GUIDELINES.md` and `CONTENT_MODEL.md`.

Path helper: `import { mediaUrl } from "@/lib/media/paths"`.

---

## How to add an animal

1. Add a new entry with `defineAnimal(...)` in the appropriate file under `src/content/animals/` (`mammals.ts`, `birds.ts`, `fish.ts`, or `reptiles.ts`).
2. Use research placeholders for uncertain fields (`diet`, metrics, Indigenous names, coexistence advice, etc.). Mark unfinished claims with `confidence: "needs-research"` or `status: "placeholder"`.
3. Placeholder media paths are generated automatically (e.g. `/media/animals/placeholders/moose-hero.PLACEHOLDER.webp`).
4. Reference the animal from `src/content/config/exhibitConfigurations.ts` when an exhibit should feature it.
5. Importing the content database runs runtime validation (duplicate IDs, missing refs) and logs development warnings.
6. Do **not** hardcode names, facts, or file paths inside React visual components—read from content.

See `CONTENT_MODEL.md` and `src/types/content.ts` for the full shapes.

---

## How to enter staff mode

- **Direct URL (technicians):** [http://localhost:3000/staff](http://localhost:3000/staff)
- **On-exhibit gesture (floor):** five taps in the top-right 80×80px zone within 2 seconds (configured in `src/content/config/staff.config.ts`). Gesture wiring lands with the kiosk shell polish pass; the `/staff` route is available now.

Staff UI is not linked from visitor chrome.

---

## How kiosk inactivity reset works

1. Any visitor `pointerdown` / `touchstart` (and keyboard for QA) updates `lastInteractionAt` in the idle Zustand store.
2. Default timeout is **90 seconds** (`src/content/config/idle.config.ts`). An exhibit may override via `ExhibitContent.idle.timeoutMs`.
3. When idle fires, the shell increments a reset token and returns UI state to the exhibit `homeSceneId` (clears selections / detail layers).
4. Refresh or process restart also boots to home—visitor exploration is not persisted.

Hook: `useIdleMonitor` in `src/hooks/useIdleMonitor.ts`, used by `ExhibitShell`.

---

## Project structure (high level)

```
src/
  app/exhibit/*/page.tsx   # eight kiosk routes
  app/staff/               # hidden staff panel
  app/dev/design-system/      # design system preview (development only)
  app/dev/museum-simulator/   # eight-station floor simulator (development only)
  components/              # visual system + exhibit shell
  content/                 # animals, habitats, exhibits, config registry
  hooks/ lib/ stores/      # idle, audio, motion, media helpers
  styles/tokens.css        # design tokens (source of truth)
  types/                   # shared content contracts
public/media/              # local images, video, audio
```

### Design system preview

With the dev server running, open [http://localhost:3000/dev/design-system](http://localhost:3000/dev/design-system). The route returns 404 in production builds.

### Museum floor simulator

Open [http://localhost:3000/dev/museum-simulator](http://localhost:3000/dev/museum-simulator) to preview all eight exhibits as 16:9 iframes of the real `/exhibit/…` routes. Reset, attract, mute, reduced motion, media failure, and offline simulation drive production session/media logic (see `ACCESSIBILITY.md` / offline docs for floor behaviour). Development only — 404 in production.

### Exhibit shell

All eight stations use `ExhibitShell` with a per-route `ExhibitConfig` (`src/content/config/exhibitConfigs.ts`). The shell provides fullscreen chrome (title strip, sound, restart, idle/attract, staff gesture, touch feedback, error boundary, loading) without forcing a single scene layout — swap `ExhibitExperience` for a custom composition per exhibit.

### Kiosk session

`KioskSessionProvider` + `useKioskSession` manage inactivity (pointer/touch/keyboard), per-exhibit timeouts, warning overlay, soft reset via registered handlers (no page reload), attract mode, persistent local settings, and a health heartbeat in `localStorage`. Development builds show a remaining-time indicator; production does not.

### Attract mode

`AttractMode` + `TouchToExplorePrompt` (`src/components/attract/`) render a cinematic idle screen from each exhibit’s `config.attract` (background, title, invitation). Exit touches are absorbed so they do not activate exhibit UI; ambient audio stays off unless `allowAmbientAudio` is explicitly true.

Path aliases (see `tsconfig.json`): `@/*`, `@/components/*`, `@/content/*`, `@/hooks/*`, `@/lib/*`, `@/stores/*`, `@/styles/*`, `@/types/*`, `@/utils/*`.

---

## Notes

- Full cinematic interfaces are intentionally not built yet—this scaffold establishes structure, content contracts, and kiosk foundations.
- No internet is required at runtime once dependencies are installed and media is local.
