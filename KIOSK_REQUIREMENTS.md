# Kiosk Requirements

## Purpose

Eight wall-mounted landscape touchscreens present **The Northern Ontario Museum of Wonder**. Each unit is a dedicated interactive installation, not a shared desktop browser. This document is the operational and UX contract for kiosk behavior.

Default design target: **1920×1080** at **16:9**, scaled cleanly to other 16:9 panels.

---

## Hardware & Display Assumptions

| Item | Requirement |
|------|-------------|
| Orientation | Landscape only |
| Aspect ratio | 16:9 |
| Design resolution | 1920×1080 logical frame |
| Input | Finger / capacitive touch primary; no reliance on mouse or keyboard |
| Audio | Local speakers or headphone-free room audio per IT plan |
| Network | Not required during museum open hours |
| Browser | Locked Chromium or Edge in kiosk / fullscreen mode |

Scaling policy: maintain aspect ratio; prefer uniform scale-to-fit within the panel. Pillarbox/letterbox only if the physical panel differs slightly; never stretch non-uniformly.

---

## One Screen, One Exhibit

| Physical unit | Station ID | Route |
|---------------|------------|-------|
| Display 1 | `welcome` | `/exhibit/welcome` |
| Display 2 | `forest` | `/exhibit/forest` |
| Display 3 | `water` | `/exhibit/water` |
| Display 4 | `sky` | `/exhibit/sky` |
| Display 5 | `night` | `/exhibit/night` |
| Display 6 | `seasons` | `/exhibit/seasons` |
| Display 7 | `tracks` | `/exhibit/tracks` |
| Display 8 | `coexistence` | `/exhibit/coexistence` |

Startup: OS autologin (if used) + browser opens `/`, `/?station={id}`, or the assigned exhibit URL fullscreen. Visitors must not casually hop between stations. See [`docs/STATION_ASSIGNMENT.md`](./docs/STATION_ASSIGNMENT.md).

---

## Interaction Principles

1. **Touch-first** — All discoverable actions work with tap / press. No hover-only content.  
2. **Large targets** — Interactive hit areas minimum **~64×64 CSS pixels** (prefer 72–96 for primary CTAs).  
3. **No browser look** — No visible URL bar, tabs, scrollbars, text-carets, or default blue focus rings that read as “desktop web.” Custom focus/pressed states are allowed and encouraged for accessibility.  
4. **No accidental selection** — Disable text selection and callout magnifiers on long-press where platform allows.  
5. **No pinch zoom** — Disable viewport zooming and gesture zoom.  
6. **No external navigation** — No outbound links, no “open in new tab,” no OS-chrome escapes in visitor mode.  
7. **No login** — Zero accounts.  
8. **No required keyboard** — Staff panel must also be operable by touch.

---

## Global Shell Behaviors

### Viewport & chrome locks

Application CSS / meta must enforce:

- `viewport` with `width=device-width`, no user scaling (`maximum-scale=1`, `user-scalable=no`—paired with museum accessibility policy review).  
- `overflow: hidden` on `html`, `body`, and the exhibit shell.  
- `user-select: none` (and vendor prefixes as needed).  
- `-webkit-touch-callout: none` where applicable.  
- `touch-action: manipulation` (or stricter per control) to reduce double-tap zoom.  
- Hidden scrollbars; content should not scroll as a page. Internal carousels, if any, must be explicit gesture regions—not document scroll.

### Safe frame

- Layout composed for a 1920×1080 stage.  
- Keep primary CTAs away from extreme physical bezels (inner margin ≥ 48px recommended).  
- Avoid relying on the very top-left OS gesture corners if the panel OS uses edge gestures—prefer inward interactive zones.

### Sound

- Ambient audio only after first visitor touch when browsers require gesture unlock.  
- Idle reset stops cues and restores default ambient policy.  
- Global mute available in staff panel.  
- Levels must be content-driven defaults, overridable by staff.

### Motion

- Honor `prefers-reduced-motion: reduce` with non-essential animation disabled or replaced by fades/cuts.  
- Staff may force reduced-motion for QA.  
- Idle attract loops must also respect reduced motion.

---

## Idle & Attract Mode

### Defaults

| Setting | MVP default | Notes |
|---------|-------------|-------|
| Idle timeout | **90 seconds** without interaction | Tunable in `idle.config.ts`; per-exhibit override allowed |
| Warning (optional) | Last 10 seconds subtle dim / pulse | Must remain touch-dismissible |
| On idle | Return to exhibit `homeSceneId` | Clear overlays, stop cues, reset selection |
| Attract | Optional calm loop on home | No rapid flashing; museum-safe |

### Interaction that resets idle

- `pointerdown` / `touchstart` / `pointerup` on the exhibit stage  
- Successful control activation  

Do not require continuous contact; each intentional touch extends the session.

### Recovery after refresh or app restart

- Always boot into exhibit home (or attract), never mid-modal deadlock.  
- Clear transient Zustand visitor state.  
- Videos at start / poster; audio awaiting gesture unless staff-unlocked environment.

---

## Visual & UX Constraints (Installation Feel)

Aligned with museum installation goals:

- First viewport reads as **one cinematic composition**, not a dashboard.  
- Brand present at hero strength on welcome; exhibit titles strong but not overpowering brand language where welcome is concerned.  
- Prefer full-bleed environmental media as the visual plane.  
- Avoid hover tooltips, tiny icon clusters, dense metadata strips, and card grids in heroes.  
- Cards only when they are the actual interaction container.  
- Sections/scenes: one job, one headline, one short support line when text is needed.

---

## Accessibility (Kiosk Context)

| Concern | Approach |
|---------|----------|
| Touch size | ≥ 64px targets |
| Contrast | Text and icons meet WCAG AA against backgrounds or scrims |
| Motion | Reduced-motion path for every major transition |
| Screen readers | Best-effort semantics; primary users are standing visitors—do not sacrifice installation clarity for website IA |
| Seizure safety | No large-field strobing; video loops vetted |

If museum policy requires fixed zoom accessibility modes for certain programs, that is an ops exception, not visitor self-service pinch zoom.

---

## Staff Control Panel

### Access

Hidden from visitors. Primary path:

1. **Press and hold** the museum lockup for **six seconds**, then enter a **four-digit PIN**.  
2. Recovery landing `/staff` opens the same PIN gate.

PIN is configured with `STAFF_PIN` (server env). See [`docs/STAFF_PANEL.md`](./docs/STAFF_PANEL.md) for variables, controls, and client-side PIN limitations.

No visible “Staff” button in visitor chrome.

### MVP capabilities

- Current exhibit ID, app version, route, session status, time until reset  
- Screen resolution, online/offline, media loading, audio status  
- Reduced-motion toggle, volume, inactivity timeout, attract delay  
- Restart exhibit, reload application, enter/exit fullscreen  
- Clear local settings, open diagnostics, return to exhibit  

### Safety

- Staff overlay must be dismissible with a large touch control.  
- Auto-close staff panel after extended inactivity (e.g. 2 minutes).  
- No dangerous OS or browser shell controls are exposed.

---

## Browser / OS Kiosk Checklist (Ops)

Technicians should configure each PC approximately as follows (exact flags depend on chosen browser):

- [ ] Autostart browser to assigned exhibit URL  
- [ ] Fullscreen / kiosk mode enabled  
- [ ] Navigation gestures / swipe-to-nav disabled where possible  
- [ ] System notifications suppressed  
- [ ] Sleep / screensaver disabled during open hours  
- [ ] Volume set to museum baseline; speakers tested  
- [ ] Offline: confirm app and `/media` load with network disconnected  
- [ ] Crash recovery: browser / watchdog reopens the same URL  
- [ ] Time sync optional; not required for MVP content  

Document final OS image in museum IT runbooks (outside this repo if preferred).

---

## Error & Empty States

| Situation | Visitor experience |
|-----------|--------------------|
| Unknown slug | Calm recovery → configured home / staff guidance, not a website 404 |
| Missing media | Branded placeholder (content `placeholder: true`) |
| Runtime exception in a scene | Catch at exhibit boundary; offer large “Return home” control |
| Audio blocked | Silent visual experience; unlock on first touch |

Never show stack traces on the floor.

---

## Playwright Kiosk Tests (Required Coverage)

Automated interaction tests should verify:

1. Each of the eight exhibit routes loads.  
2. Idle path resets UI to home (use shortened timeout in test config).  
3. Primary controls are present and meet minimum bounding-box size.  
4. Staff route loads; visitor exhibit does not show staff chrome by default.  
5. Refresh returns to a home-like state.  
6. `prefers-reduced-motion` does not break navigation between scenes.  

Use touch/pointer events rather than hover chains.

---

## Security & Privacy (Floor)

- No PII collection in MVP.  
- No cookies required for visitor flow.  
- Staff panel is obscurity-based access, not strong authentication; physical room access is the real boundary. If stronger auth is later required, add a local PIN—still no cloud login.

---

## Acceptance Criteria

A kiosk build is ready for floor trial when:

1. A visitor can explore and, after inactivity, returns to a calm home without staff help.  
2. Refresh and process restart look intentional, not broken.  
3. There is no scrollbar, text selection, pinch zoom, or outbound link in visitor mode.  
4. Touch targets feel generous on a real 1920×1080 panel.  
5. Staff can mute, reset, and identify the exhibit without visitors discovering the control surface.  
6. The machine operates with the network cable unplugged.
