# Testing — Northern Ontario Museum of Wonder

Automated end-to-end coverage uses **Playwright** against the real Next.js app (same routes, session, and exhibit components as production).

Related: `ACCESSIBILITY.md`, `OFFLINE_DEPLOYMENT.md`, `KIOSK_REQUIREMENTS.md`.

---

## Prerequisites

```bash
npm ci
npx playwright install chromium
```

Ensure staff PIN env exists for local API checks (dev fallback `2468` also works when unset):

```bash
# optional
copy .env.example .env.local
```

---

## Exact commands

### Run the full e2e suite

```bash
npm run test:e2e
```

Starts (or reuses) `npm run dev` on `http://127.0.0.1:3000`, viewport **1920×1080**, touch enabled.

### Interactive UI mode

```bash
npm run test:e2e:ui
```

### Single file / grep

```bash
npx playwright test tests/e2e/exhibits.spec.ts
npx playwright test tests/e2e/staff.spec.ts
npx playwright test --grep "attract"
npx playwright test --grep "@smoke"
```

### Headed (watch the kiosk)

```bash
npx playwright test --headed --workers=1
```

### Report

```bash
npx playwright show-report playwright-report
```

### CI-style (fresh server, retries)

```bash
set CI=1
npm run test:e2e
```

(On Unix: `CI=1 npm run test:e2e`)

---

## What the suite covers

| Requirement | Spec file |
|-------------|-----------|
| All eight exhibit routes load | `exhibits.spec.ts` |
| Exhibits at 1920×1080 | `exhibits.spec.ts` |
| No horizontal/vertical browser scrollbars | `exhibits.spec.ts` |
| Attract exits on touch | `attract-idle.spec.ts` |
| Inactivity soft-resets each exhibit | `attract-idle.spec.ts` |
| No visitor external links | `accessibility.spec.ts` |
| Touch targets ≥ 64px | `accessibility.spec.ts` |
| Reduced motion disables major scenic motion | `accessibility.spec.ts` |
| Drag interactions have tap alternatives | `accessibility.spec.ts` |
| Failed media → fallback | `accessibility.spec.ts` |
| Animal profiles open/close | `animal-profiles.spec.ts` |
| Audio stops on soft-reset | `audio-reset.spec.ts` |
| Staff hold gesture + wrong PIN rejected | `staff.spec.ts` |
| Station assignment persists | `station.spec.ts` |
| Works without network (post-load) | `offline.spec.ts` |

Helpers live in `tests/e2e/helpers/kiosk.ts` (settings seed, station seed, touch audit).

---

## Physical touchscreen checklist

Run on a floor kiosk or a 1920×1080 capacitive display after `npm run build` + `npm start` (or standalone). Mark each item.

### Bring-up

- [ ] Station boots to the correct `/exhibit/{slug}` (or completes station setup once).
- [ ] Fullscreen kiosk browser — no OS chrome, no scrollbars.
- [ ] Touch anywhere exits attract (`Touch to Explore`) with one press.
- [ ] Volume / **Sound on · Sound off** is visible and readable from ~1 m.

### Per exhibit (repeat for all eight)

- [ ] Heading and primary CTA respond within one tap.
- [ ] No empty dead zones; soft media miss shows branded fallback, not a broken icon.
- [ ] Optional Listen / call still shows a **Caption** when muted or audio is missing.
- [ ] Idle warning appears after ~90 s (or staff-configured timeout); **Keep exploring** renews the session.
- [ ] After full idle reset, the exhibit returns to a clean home (profile closed, activity rewound).

### Interaction & motion

- [ ] Gloves / less precise finger still hit primary buttons (≥64×64 px feel).
- [ ] Sky: **Look left / Look right** (or bird name chips) work without swiping.
- [ ] Night: **Explore by list** works without dragging the flashlight.
- [ ] Forest / seasons / tracks: can advance with taps (dots / labels), not drag alone.
- [ ] Staff: force **reduced motion** — ambient thrash stops; explore paths remain available.

### Staff & security

- [ ] Hold museum lockup ~6 s → PIN pad (visitors should not notice progress).
- [ ] Wrong PIN rejected; correct PIN opens staff panel.
- [ ] Staff diagnostics show network / offline status; visitor UI does not.
- [ ] Clear local settings (hold) returns volume/mute/timeouts to defaults.

### Offline / resilience

- [ ] Disconnect ethernet/Wi‑Fi after warm cache — exhibit still responds.
- [ ] Power-cycle PC — station returns to assigned exhibit without internet.
- [ ] Rename or remove a media file under `public/media` — exhibit does not crash.

### Audio room-share

- [ ] Two stations playing optional ambience stay room-safe (not loud).
- [ ] Soft-reset / attract silences prominent calls.

---

## Notes for authors

- Prefer shortening idle via `nomow.kiosk.settings.v1` in tests — do not fork reset logic.
- Production builds 404 `/dev/*`; do not rely on the museum simulator in CI unless `NODE_ENV=development`.
- Placeholder media files will often exercise the real fallback path even without the simulator flag.
