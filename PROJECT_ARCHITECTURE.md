# Project Architecture

## Overview

**The Northern Ontario Museum of Wonder** is a local-first, production-ready interactive museum installation built with Next.js. It runs on eight wall-mounted landscape touchscreens (default target **1920×1080**, scalable 16:9). Each display hosts a dedicated exhibit route. The product is not a conventional website: it is a cinematic, tactile, offline-capable kiosk application.

This document defines the technical architecture for the MVP and the structure that subsequent implementation should follow. Interface build-out comes after content model, kiosk, and media contracts are agreed.

---

## Goals

| Goal | Meaning |
|------|---------|
| Local-first | No required internet during museum hours; all media and content ship with the app |
| Kiosk-native | No browser chrome cues, no hover-only UX, large touch targets, auto-idle reset |
| Content-driven | Animals, habitats, copy, and media paths live in data files—not in visual components |
| Recoverable | Refresh / process restart restores a clean exhibit home state |
| Maintainable | Clear module boundaries; staff can swap media and tune exhibits without rewriting UI |
| Accessible motion | Respect `prefers-reduced-motion`; motion enhances presence, never blocks understanding |

---

## Technology Stack

| Layer | Choice | Role |
|-------|--------|------|
| Framework | Next.js (App Router) | Routing, layouts, static export or local server deploy |
| Language | TypeScript (strict) | Typed content models and UI contracts |
| Styling | Tailwind CSS | Layout, typography, 16:9-safe spacing, touch utilities |
| Motion | Framer Motion | Scene transitions, micro-interactions, reduced-motion variants |
| Client state | Zustand | Idle timer, audio session, staff panel, per-exhibit UI state |
| Audio | Howler.js | Controlled, overlapping-safe ambient and cue playback |
| Video | HTML5 `<video>` | Looping backgrounds, short cinematic clips |
| Content | Local JSON / TypeScript modules | Exhibit copy, animals, hotspots, media references |
| Tests | Playwright | Touch / kiosk interaction flows |
| Quality | ESLint + Prettier | Consistent code style |

**Out of scope for MVP:** auth, CMS, remote analytics dashboards, live APIs, mouse-first web nav.

---

## Deployment Model

Recommended production shape:

1. **Build** as a static export (`output: 'export'`) *or* a local Node server on each kiosk PC—choose one deployment path per museum IT constraints and lock it before install week.
2. **Serve** only from the local machine or LAN (no public internet dependency).
3. **Full-screen Chromium / Edge kiosk mode** per display (kiosk flags, disabled gestures—see `KIOSK_REQUIREMENTS.md`).
4. **One route per physical screen.** Mapping is configuration, not hardcoded in React trees.

```
kiosk-01  →  /exhibit/welcome
kiosk-02  →  /exhibit/forest
kiosk-03  →  /exhibit/water
kiosk-04  →  /exhibit/sky
kiosk-05  →  /exhibit/night
kiosk-06  →  /exhibit/seasons
kiosk-07  →  /exhibit/tracks
kiosk-08  →  /exhibit/coexistence
```

Optional: startup scripts open the correct URL per machine via `exhibit.map.json` or environment config.

---

## Repository Layout (Target)

```
/
├── PROJECT_ARCHITECTURE.md
├── CONTENT_MODEL.md
├── KIOSK_REQUIREMENTS.md
├── MEDIA_GUIDELINES.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts
├── .eslintrc / eslint.config
├── prettier.config
│
├── public/
│   └── media/
│       ├── images/
│       ├── video/
│       └── audio/
│
├── content/
│   ├── exhibits/
│   │   ├── welcome.ts
│   │   ├── forest.ts
│   │   ├── water.ts
│   │   ├── sky.ts
│   │   ├── night.ts
│   │   ├── seasons.ts
│   │   ├── tracks.ts
│   │   └── coexistence.ts
│   ├── animals/
│   ├── habitats/
│   └── config/
│       ├── exhibits.registry.ts
│       ├── idle.config.ts
│       └── staff.config.ts
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root shell: kiosk CSS, fonts, providers
│   │   ├── page.tsx                   # Redirect or staff landing (not public nav)
│   │   ├── exhibit/
│   │   │   ├── layout.tsx             # Shared exhibit chrome (idle, audio, staff)
│   │   │   └── [slug]/page.tsx        # Dynamic exhibit host
│   │   └── staff/
│   │   │   └── page.tsx               # Hidden staff control panel
│   │
│   ├── components/
│   │   ├── kiosk/                     # TouchButton, IdleOverlay, SafeFrame, etc.
│   │   ├── media/                     # LocalImage, LocalVideo, AmbientAudio
│   │   ├── exhibit/                   # Scene shells composed from content
│   │   └── staff/                     # Staff panel UI
│   │
│   ├── exhibits/
│   │   ├── welcome/
│   │   ├── forest/
│   │   ├── water/
│   │   ├── sky/
│   │   ├── night/
│   │   ├── seasons/
│   │   ├── tracks/
│   │   └── coexistence/
│   │
│   ├── lib/
│   │   ├── content/                   # Loaders, validators, registry helpers
│   │   ├── media/                     # Path helpers, Howler manager
│   │   ├── idle/                      # Inactivity reset
│   │   ├── motion/                    # Reduced-motion helpers
│   │   └── kiosk/                     # Viewport lock, selection prevent, etc.
│   │
│   ├── stores/
│   │   ├── idle.store.ts
│   │   ├── audio.store.ts
│   │   ├── exhibit-ui.store.ts
│   │   └── staff.store.ts
│   │
│   ├── types/
│   │   └── content.ts                 # Shared TypeScript content types
│   │
│   └── styles/
│       └── kiosk.css                  # no scrollbars, no selection, touch rules
│
└── tests/
    └── e2e/
        ├── idle.spec.ts
        ├── touch-targets.spec.ts
        └── exhibits.spec.ts
```

Content stays under `/content`. Presentation stays under `/src`. Media stays under `/public/media`. Do not import animal facts as string literals inside exhibit visual components.

---

## Application Shell

```
┌─────────────────────────────────────────────────────────────┐
│  Root layout                                                │
│  • fonts, CSS variables, kiosk global locks                 │
│  • providers (Zustand hydration if needed)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Exhibit layout                                       │  │
│  │  • idle monitor                                       │  │
│  │  • audio session lifecycle                            │  │
│  │  • hidden staff gesture entry                         │  │
│  │  • 1920×1080 safe frame / scale wrapper               │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Exhibit experience (per slug)                  │  │  │
│  │  │  loads content[slug] → renders scenes           │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Routing

| Route | Purpose |
|-------|---------|
| `/` | Optional redirect to default exhibit or blank hold screen |
| `/exhibit/[slug]` | One of the eight exhibits (`welcome`, `forest`, `water`, `sky`, `night`, `seasons`, `tracks`, `coexistence`) |
| `/staff` | Hidden staff panel (not linked from visitor UI) |

Invalid slugs render a controlled recovery screen that returns to that kiosk’s configured exhibit home—never a public site 404 experience.

---

## Module Responsibilities

### `content/`

- Source of truth for exhibit structure, animal profiles, hotspot definitions, scene copy, and media IDs/paths.
- Validated against TypeScript types in `src/types/content.ts`.
- Swap-friendly: replace a media path or animal entry without touching Framer Motion trees.

### `src/exhibits/<name>/`

- Exhibit-specific scene compositions and interaction choreography.
- Consume typed content props only.
- Own local animation timelines; emit nothing that requires network.

### `src/components/kiosk/`

- Shared primitives: large touch controls, focus rings tuned for touch, fullscreen frame, idle warning/return.

### `src/components/media/`

- Thin wrappers around images, video, and Howler audio.
- Handle loading placeholders, poster frames, mute/unmute policy, and cleanup on unmount / idle reset.

### `src/lib/`

- Pure helpers: idle timers, reduced-motion detection, content registry lookups, media URL builders (`/media/...`).

### `src/stores/`

| Store | Owns |
|-------|------|
| `idle` | Last interaction timestamp, countdown, reset signal |
| `audio` | Current ambient bed, one-shot cues, global mute |
| `exhibit-ui` | Open layers, selected animal/habitat IDs, scene index |
| `staff` | Diagnostics visibility, force-reset, audio override |

Prefer Zustand for cross-component client state. Prefer React local state for ephemeral, component-scoped animation flags.

---

## Exhibit Registry

Central registry (e.g. `content/config/exhibits.registry.ts`) maps slug → module:

```ts
type ExhibitDefinition = {
  slug: ExhibitSlug;
  title: string;
  homeSceneId: string;
  idleTimeoutMs: number;      // may override global default
  contentModule: string;      // logical key / import map
  mediaBucket: string;        // e.g. "forest"
};
```

The page host resolves the slug, loads content, selects the exhibit package, and mounts it inside the shared shell. This keeps route wiring thin and makes exhibit addition a registry + folder + content file change.

---

## State, Idle Reset, and Recovery

### Idle

1. Any pointer/touch activity updates `lastInteractionAt`.
2. After configurable inactivity (global default; per-exhibit override), the shell:
   - fades / stops non-ambient audio cues,
   - closes overlays and detail layers,
   - returns to the exhibit `homeSceneId`,
   - optional gentle “attract” loop if defined by that exhibit.

### Refresh / restart

- On load, stores initialize to home defaults (no persistence of visitor exploration unless staff explicitly enables debug persist).
- Media elements start from poster / frame 0.
- Audio starts only after a visitor touch (browser autoplay policy) unless staff forces unlocked audio in controlled environments.

### Clean teardown

Every scene and media component must stop Howler sounds and pause videos on unmount and on idle reset to avoid leaked playback across scenes.

---

## Audio Architecture (Howler)

- Single **AudioManager** (Zustand + Howler helper) owns:
  - ambient loop (low volume bed),
  - transient cues (animal calls, UI confirmations),
  - global mute / staff volume.
- Concurrent cue limits to avoid muddy overlap.
- Prefer preloading exhibit-critical beds when the exhibit mounts; unload when leaving exhibit route or on idle full reset as configured.
- All audio file paths come from content media references.

---

## Video Architecture

- Background loops: muted, `playsInline`, `loop`, poster image required.
- Short storytelling clips: tap-to-play / tap-to-replay; never auto-blast volume without user gesture unless kiosk browser is pre-unlocked.
- Prefer MVP-friendly codecs (see `MEDIA_GUIDELINES.md`).
- No YouTube / remote embeds.

---

## Styling System

- CSS variables for brand palette, typography, and motion durations.
- Design for **one composition per viewport**, museum-premium, landscape-first.
- Shared kiosk CSS:
  - `overflow: hidden` on shell,
  - `user-select: none`,
  - `touch-action` tuned to prevent pinch-zoom,
  - hide scrollbars globally,
  - minimum interactive hit areas (~64×64 CSS pixels).
- Scale strategy: design at 1920×1080 logical frame; scale uniformly to fit other 16:9 physical displays (letterbox only if necessary; prefer contain-within-safe-area).

---

## Staff Control Panel

- Route: `/staff` (also openable via a **hidden multi-tap or corner chord** on the exhibit shell—details in `KIOSK_REQUIREMENTS.md`).
- Capabilities (MVP):
  - Force return to home,
  - Mute / unmute / volume,
  - Reload exhibit,
  - Show exhibit ID, build version, idle timeout,
  - Toggle reduced-motion override for QA,
  - Soft reboot instructions (if needed) displayed as guidance only.
- Not discoverable in visitor UI copy or visible chrome.

---

## Testing Strategy

Playwright e2e focuses on kiosk behavior, not marketing SEO:

- Each exhibit route mounts without console errors.
- Touch targets meet minimum size checks where feasible.
- Idle timeout returns to home state.
- Staff route is reachable by deep link; visitor shell does not expose it.
- Reduced-motion paths do not throw.
- Refresh restores home, not a mid-explore deadlock.

Unit/integration tests for content loaders and schema validation are encouraged once Zod (or equivalent) is introduced.

---

## Environment & Config

| Config | Purpose |
|--------|---------|
| `NEXT_PUBLIC_DEFAULT_EXHIBIT` | Optional machine default slug |
| `idle.config.ts` | Global idle timeout + attract behavior |
| `staff.config.ts` | Gesture pattern / PIN-less access policy for staff |
| `exhibit.map.json` (optional) | Physical screen → slug mapping for ops |

Secrets are unnecessary for MVP. Do not introduce cloud keys into the kiosk build.

---

## Build Sequence (Agreed Order)

1. **Docs** (this file + content, kiosk, media) — current step  
2. Scaffold Next.js app, Tailwind, ESLint, Prettier, Playwright  
3. Shared types + content registry + placeholder content for eight exhibits  
4. Kiosk shell (safe frame, idle, no-select, staff entry)  
5. Media primitives (image / video / Howler)  
6. Exhibit-by-exhibit experiences driven by content  
7. Staff panel + ops hardening  
8. Media replacement pass (placeholders → finals)  

---

## Non-Goals (MVP)

- Shared cross-kiosk multiplayer sync  
- Online CMS editing from the floor  
- Account / login / personalization  
- External outbound navigation or QR flows that require network  
- Hover-only educational layers  
- Pixel-perfect print / portrait mode  

---

## Success Criteria for Architecture

The architecture is successful when:

1. A designer can change animal copy and media paths in `/content` without editing motion components.  
2. A technician can assign any of the eight routes to a screen and get a stable, idle-resetting experience.  
3. The app recovers from refresh to a calm home state.  
4. All assets resolve locally under `/public/media`.  
5. Exhibits feel like distinct installations while sharing one shell, one content contract, and one media pipeline.
