# Performance — Eight-Screen Museum Deployment

Guidance for keeping **The Northern Ontario Museum of Wonder** stable on eight concurrent 1920×1080 landscape kiosks, often on low-power mini-PCs, through long idle nights and multi-hour open days.

Companion docs: [MEDIA_GUIDELINES.md](./MEDIA_GUIDELINES.md), [KIOSK_REQUIREMENTS.md](./KIOSK_REQUIREMENTS.md), [OFFLINE_DEPLOYMENT.md](./OFFLINE_DEPLOYMENT.md), [TESTING.md](./TESTING.md).

---

## Goals

| Goal | Target |
|------|--------|
| Frame rate (active explore) | **30 fps** sustained on the design stage; **24 fps** floor under load |
| Attract / idle overnight | Poster stills preferred; motion loops only on the attract layer; no hidden video decode |
| Peak JS heap (single station) | Stable after warm-up; growth &lt; **~50 MB** across an 8-hour idle+reset cycle |
| Cold route paint | First meaningful paint within **~2 s** on target hardware (cached local media) |
| Audio | One ambient bed + at most one major clip; unload / silence on reset |

---

## Recommended media specs

### Images

| Property | Recommendation |
|----------|----------------|
| Format | **WebP** (quality ~75–82 for photos); PNG/SVG only when alpha or crisp UI is required |
| Full-bleed / poster | **1920×1080** (max **2560×1440** if proven on target GPU) |
| File size (full-bleed) | Prefer **≤ 400 KB**; hard ceiling **≤ 800 KB** |
| Animal / detail | Longest edge **800–1600 px**; **≤ 250 KB** typical |
| Do not ship | Camera RAW, unresized 4K/8K stills, huge transparent PNGs for soft washes |

Prefer opaque WebP environment plates over large translucent PNG stacks. Soft atmosphere can use CSS gradients / blend modes (cheaper) when the look still holds.

### Video

| Property | Recommendation |
|----------|----------------|
| Container | **MP4** |
| Codec | **H.264** Main (or Baseline if a kiosk GPU struggles) |
| Resolution | **1920×1080** for beds; avoid 4K on-device |
| Frame rate | **24 fps** preferred for ambience beds; **30 fps** max |
| Bitrate | Aim **6–12 Mbps** after encode tests; avoid sustained &gt; **15 Mbps** |
| Loop length | **8–20 s** seamless; shorter loops reduce decode window |
| Audio track | Prefer **silent** beds; drive ambience via Howler |
| Poster | **Required** WebP still (same framing) |
| File size (home loop) | Prefer **≤ 8 MB**; soft ceiling **≤ 15 MB** per bed |

Reduced motion / attract cover: show the poster; do not keep decoding under UI.

### Audio

| Property | Recommendation |
|----------|----------------|
| Format | **MP3** (CBR 128–192 kbps ambience; 96–128 kbps UI/calls) |
| Ambience | One looping bed per exhibit; unload on route leave / hard silence |
| Concurrent Howls | Ambient + one major; UI ticks are short and never duck forever |
| Memory | Prefer `html5: true` for long ambience; call `unload()` on unmount |

---

## Target frame rate & motion budget

- Design for **30 fps** comfort on Chromium kiosk builds.
- Prefer long, low-amplitude Framer drifts (**12–28 s** cycles) over high-frequency flicker.
- Cap simultaneous infinite motion: scenic beds + a few markers, not dozens of independent Infinity loops.
- Staff **force reduced motion** (and OS reduced-motion) must collapse continuous motion to static opacity/poses.
- Glass frost uses `--glass-blur: 8px` (was 18px). **Trade-off:** slightly less milky glass; much lower full-screen `backdrop-filter` cost on eight GPUs. Raise carefully only after endurance proof.

---

## Architecture notes (what the app does)

### Already mitigated (safe changes)

| Issue | Mitigation |
|-------|------------|
| Session clock hammering React | `KioskSessionProvider` ticks at **1 s** and buckets remaining time to whole seconds |
| All exhibits in one JS graph | `ExhibitPage` loads each exhibit via **`next/dynamic`** (`ssr: false`) so a station only parses its chunk |
| Video under attract | Shell sets `FullscreenMedia playbackActive={!showAttract}` → poster still; video unmounts |
| Exhibit work under attract | Exhibit children **unmount** while attract is showing (soft-reset already returned home) |
| Ambient veil spinning under attract | `AmbientOverlay animate={false}` when attract / reduced motion |
| Seasons stacking four habitats | `SeasonalHabitat` keeps **active + previous** only during crossfade |
| Glass blur cost | `--glass-blur` reduced **18px → 8px** |
| Audio fade timers | `localAudioManager` tracks / clears fade-duck timers; ambient hook clears on effect teardown |
| Video pause off-screen | `LocalVideo` keeps IntersectionObserver when `playWhenVisible` |

### Trade-offs (polish kept where possible)

| Change | Visual / UX impact | Why kept |
|--------|--------------------|----------|
| Unmount exhibit during attract | Brief remount cost when a visitor dismisses attract | Stops hours of Framer + media work while idle; soft-reset already cleared visitor state |
| Glass blur 8px | Frosted panels are slightly clearer | Eight concurrent backdrop blurs dominate GPU on mini-PCs |
| Seasons two-layer mount | Crossfade unchanged for consecutive seasons | Idle GPU/DOM no longer holds four SVG skies |

Do **not** strip attract kenburns or marker pulse without a staff sign-off — those are floor polish. Prefer pausing them when covered or when reduced motion is on.

### Remaining watchlist

| Area | Risk | Guidance |
|------|------|----------|
| Infinite Framer loops (Forest / Night / Sky / Attract) | Continuous compositor work while that screen is active | Acceptable for **visible** scenes; keep attract-only loops off when not in attract |
| Large transparent overlays | Overdraw | Prefer solid + mix-blend over multi-megabyte alpha PNGs |
| Client components | Most of the kiosk UI is `"use client"` (touch, Howler, Framer) | Keep content/config modules server-safe; dynamic-import heavy exhibits |
| Route loading | Chunk download + hydrate | Prefer lean exhibit entry; defer profile / quiz panels until opened |
| Repeated inactivity resets | Leaked listeners / Howls / timers | Soft-reset + `silenceStationAudio` + unmount paths must stay idempotent |

---

## Unnecessary client components (policy)

Use `"use client"` only when the module needs:

- Browser APIs, touch, Howler, Framer Motion, Zustand subscriptions, or session providers

Keep **content**, **config**, **pure helpers**, and **types** free of client boundaries so they can be imported into lean chunks. Prefer splitting a heavy client leaf with `next/dynamic` rather than marking an entire route tree as one client monolith (already the direction for `ExhibitPage`).

---

## Route loading time

Checklist per station:

1. Browser launches **assigned** `/exhibit/{slug}` (not a gallery of all eight).
2. Measure **Time to first meaningful paint** of the home scene poster/bed.
3. Confirm Network panel: only that station’s JS chunk + shared shell load on cold start.
4. Warm reload (offline SW): paint should be faster; media from Cache Storage when registered.

Dev aid: `/dev/museum-simulator` loads eight iframes — **not** a floor performance model. Use it for behavior, not for FPS budgets.

---

## Memory testing procedure

Run on **one physical or representative mini-PC** with the same Chromium build as the floor.

### Setup

1. Build standalone (`npm run build` → `prepare:standalone` → `start:standalone`).
2. Open the station URL fullscreen; unlock audio once; mute if room is quiet.
3. Open Chromium **Task Manager** (Shift+Esc) **or** DevTools → **Memory** / **Performance**.
4. Note baselines after 2 minutes of home scene (JS heap, GPU process, decoder).

### Short probe (15–30 min)

1. Explore each major path (profiles, quizzes, seasons wheel, night list).
2. Trigger **idle → warning → soft-reset → attract** at least **10 times**.
3. Record heap after each reset cycle.
4. Pass if heap returns near baseline (± ~30 MB) and no audio continues after mute/reset.

### Tools

- DevTools **Performance** → record 10 s active + 10 s attract; check FPS / long tasks.
- DevTools **Memory** → heap snapshot before/after 20 resets.
- OS Task Manager → Chromium **GPU** and **total** private bytes.

---

## 8-hour endurance test

**Purpose:** Prove overnight idle + repeated visitor sessions on a single station.

| Step | Action |
|------|--------|
| 0 | Cold start assigned exhibit; note memory |
| 1 | 30 min active exploration (varied paths) |
| 2 | Leave in **attract** for **4 hours** (lights as for overnight) |
| 3 | Dismiss attract; explore 20 min; let idle reset ≥ **20 times** |
| 4 | Attract again for remaining time to **8 hours** total |
| 5 | Final explore + soft reset; capture heap + screenshot of home |

**Pass criteria**

- No crashed tab / frozen touch
- Attract dismiss still works after long idle
- Ambient stops on reset; no overlapping beds after 20 resets
- FPS on home scene ≥ **24** when touched after long attract
- Heap growth from step 0 → 5 **&lt; ~80 MB** (investigate if higher)

Optional automation: advance idle via museum simulator `advanceIdleClock` messages on a spare box; physical display still preferred once.

---

## 24-hour endurance test

**Purpose:** Multi-day floor confidence (power + thermal + leak).

| Step | Action |
|------|--------|
| 0 | Same cold start as 8-hour |
| 1 | Schedule a scripted day: **15 min active / 45 min attract** repeating, **or** real visitor traffic |
| 2 | Force ≥ **100** inactivity soft-resets across the day |
| 3 | Leave overnight attract (~8–12 h continuous) |
| 4 | Morning: dismiss, full explore, staff mute on/off, reduced-motion toggle |
| 5 | Capture heap, GPU process, disk (if SW cache), and any Chromium crash dumps |

**Pass criteria**

- Completes **24 h** without manual restart
- Soft-reset recovery remains correct (home scene, audio silence, attract exit suppress)
- No unbounded growth: heap / GPU roughly **bounded** after warm-up (flat trend line after hour 2)
- Thermals: mini-PC surface temp within vendor guidance under enclosed kiosk

Fail → capture Performance profile + heap snapshot before reboot; check for abandoned Howls, video elements still in DOM under attract, and timer counts via DevTools.

---

## Low-power mini-PC requirements

Sized for **one station = one Chromium instance** local media. Prefer **eight machines** (or eight discrete GPUs/iGPUs) over one PC driving eight 1080p browsers.

| Spec | Minimum | Recommended |
|------|---------|-------------|
| CPU | 4 cores (modern low-power x86 or equivalent) | 6–8 cores / recent U-series |
| RAM | **8 GB** | **16 GB** |
| Storage | 64 GB SSD with media + standalone build | 128 GB+ SSD |
| GPU | Capable H.264 1080p decode; avoid software decode | Dedicated or strong iGPU with VAAPI/DXVA |
| Display out | One 1920×1080 @ 60 Hz | Native panel timing; no upscale from 720p OS |
| OS | Locked-down Windows / Linux kiosk image | Autologon + Chromium/Edge kiosk flags |
| Network | Optional LAN for deploy only | Air-gap OK at runtime (see OFFLINE_DEPLOYMENT) |
| Power | UPS / clean shutdown preferred | Prevent mid-write corruption of cache |

### Anti-patterns

- One mini-PC running **eight** fullscreen Chromium windows at 1080p video beds.
- 4K loops or &gt;30 fps ambience on Celeron-class iGPU.
- Large transparent WebM/PNG full-bleed stacks plus heavy blur.

### Suggested Chromium flags (validate per image)

Examples staff often use (adjust to IT policy): `--kiosk`, `--noerrdialogs`, `--disable-session-crashed-bubble`, `--autoplay-policy=no-user-gesture-required` only if museum policy accepts always-on muted video; audio still follows first-gesture unlock in-app where implemented.

---

## Recovery after repeated inactivity resets

Expected sequence:

1. Soft-reset → home scene + handler cleanup + analytics session end  
2. Audio → `silenceStationAudio` / ambient suppress  
3. Attract → exhibit tree unmounted; shell bed paused to poster  
4. Visitor tap → attract exit suppress (~450 ms) → remount home → unlock on intentional explore touch  

If recovery fails after many cycles, check:

- Duplicate ambient Howls (register without unload)
- Fade timers still pausing a freshly remounted bed (`clearPendingTimers`)
- Pointer capture stuck (`useSmoothPointer` / hold buttons)
- Station still decoding video while `data-attract="true"`

---

## Regression checklist (PR / media drop)

- [ ] New full-bleed image ≤ size/resolution budgets above  
- [ ] New video has poster, H.264 1080p ≤ bitrate budget, silent if bed  
- [ ] No new Infinity animation without reduced-motion branch  
- [ ] No new `backdrop-filter` larger than token glass blur without measuring  
- [ ] Attract path: no hidden playing `<video>`  
- [ ] Soft-reset silence verified once in DevTools  
- [ ] Dynamic import for any new heavy exhibit leaf  

---

## Related commands

```bash
npm run build
npm run prepare:standalone
npm run start:standalone
npm run test:e2e
```

Use the museum simulator for multi-station **behavior**; use a single physical unit for **FPS / memory** budgets.
