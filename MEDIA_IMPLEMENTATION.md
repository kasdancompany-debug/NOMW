# Media Implementation

Local media layer for The Northern Ontario Museum of Wonder kiosk app. Companion to [`MEDIA_GUIDELINES.md`](./MEDIA_GUIDELINES.md).

## Architecture

| Piece | Role |
|-------|------|
| `LocalImage` | Responsive stills, lazy load, fallback chain, captions / attribution |
| `LocalVideo` | Muted autoplay, posters, no browser controls, loop, lazy src attach, VTT tracks |
| `useLocalAudio` + `localAudioManager` | Howler playback with **one prominent clip per station** |
| `FullscreenMedia` | Exhibit atmosphere plane built on `LocalImage` / `LocalVideo` |
| `MediaAsset` fields | `poster`, `fallbackSrc`, `captionsSrc`, `sources`, `preload`, `caption`, `attribution` |

All runtime media is served from `/public/media` — offline capable, no CDN required.

---

## Recommended formats

| Kind | Container / codec | Notes |
|------|-------------------|--------|
| Images | **WebP** (JPEG fallback) | PNG/WebP for transparency |
| Video | **MP4 / H.264** | Progressive; prefer **silent** loops for backgrounds |
| Audio | **MP3** | Universal Howler support |
| Captions | **WebVTT** (`.vtt`) | Pair with `MediaAsset.captionsSrc` |

Optional later: WebM/VP9 as an alternate `sources[]` entry — not required for MVP.

---

## Dimensions (16:9 kiosk, 1920×1080 stage)

| Role | Target pixels | Max if detail needs it |
|------|---------------|------------------------|
| Full-bleed still / poster | **1920×1080** | 2560×1440 |
| Animal hero | Longest edge **1600–2000px** | 2400px |
| Portrait / evidence crop | Longest edge **800–1200px** | — |
| Silhouette / UI still | As needed @2× | — |
| Background / story video | **1920×1080** | Avoid 4K on-device |

Do not ship camera RAW or unresized masters in the floor build.

---

## Compression & bitrate targets

### Images (WebP)

| Role | Quality guidance | File-size target |
|------|------------------|------------------|
| Full-bleed environment | q **72–82** | **≤ 350–600 KB** typical; hard ceiling ~1.2 MB |
| Animal hero | q **75–85** | **≤ 250–450 KB** |
| Portrait / detail | q **70–80** | **≤ 120–250 KB** |
| Poster (from video frame) | q **70–78** | **≤ 200–400 KB** |

Prefer `srcset` widths near **960 / 1440 / 1920** for full-bleed assets.

### Video (H.264 MP4)

| Role | Frame rate | Target bitrate | File-size heuristic |
|------|------------|----------------|---------------------|
| Background loop (15–45s seamless) | **24 fps** (15–30 OK) | **6–10 Mbps** average | ~8–15 MB per 15s @1080p |
| Story / reveal (5–20s) | 24–30 fps | **4–8 Mbps** | Keep short; poster always required |
| Peak | — | Prefer **≤ 12–15 Mbps** peak | Retest on floor PCs |

Encode tips:

- `yuv420p`, progressive, fast-start (`moov` atom at front).
- Mute ambience video tracks (audio beds stay in Howler).
- Match first/last frame for clean loops.
- No >3 large-field flashes per second.

### Audio (MP3)

| Role | Spec | Level | Size |
|------|------|-------|------|
| Ambience loop | 128–160 kbps stereo or mono | Asset volume **0.15–0.30** | Keep under ~2–4 MB/min |
| Animal call (one-shot) | 128 kbps | Asset volume **0.25–0.35** | Usually **≤ 400 KB** |
| UI tick | 96–128 kbps | Very quiet | **≤ 40 KB** |

---

## Player behaviour (museum requirements)

1. **Roles** — `ambient` · `call` · `narration` · `ui` (legacy `prominent` = call). Major clips (`call` / `narration`) are mutually exclusive; ambient ducks with fade; `ui` never interrupts major.
2. **Optional Listen** — animal sounds never autoplay; use `ListenControl` / `useLocalAudio` with caption + playing indicator.
3. **Global mute** — `SoundControl` + persisted `nomow.kiosk.settings.v1`; Listen may unmute as intentional visitor intent.
4. **Per-exhibit ceilings** — `ExhibitAudioConfig.volume` / role volumes; room defaults in `MUSEUM_AUDIO` (~0.45 master).
5. **Fade in/out** — Howler fades on ambient and major starts/stops (`silenceStationAudio` on reset / route / error).
6. **Videos loop cleanly** when `loop: true` (default for beds).
7. **No visible browser controls** — `controls={false}`, PiP disabled.
8. **Meaning without sound** — captions (`caption` text and/or VTT), posters, and UI copy remain.
9. **Safe autoplay** — video autoplay only when **muted** + `playsInline`; audio requires unlock gesture.
10. **Failed media** — never show a broken browser icon; fall back to `fallbackSrc` → poster → branded SVG plane.
11. **Startup weight** — default image lazy load; video `preload="metadata"` or `"none"` until near viewport; audio one-shots default `preload="none"`.

---

## Preload matrix

| Media | Startup default | When to raise |
|-------|-----------------|---------------|
| Full-bleed exhibit video | `metadata`, attached on mount for the active station | Only the current exhibit |
| Offscreen / overlay video | `none` until in view (`LocalVideo` lazy) | When visitor opens overlay |
| Image heroes | Lazy, unless `priority` | LCP / first viewport |
| Ambient audio | `metadata` after unlock | Active exhibit only |
| Call / quiz audio | `none` | On first play intent |

---

## Caption & attribution metadata

On `MediaAsset`:

- `caption` — short visitor-facing line  
- `captionsSrc` — `/media/.../*.vtt` for `<track kind="captions">`  
- `attribution` / `credit` — media credit under or on the frame  
- `alt` — required for informative stills  

UI helpers: `MediaMeta`, props on `LocalImage` / `LocalVideo`.

---

## Authoring checklist before floor lock

- [ ] Every video has a poster WebP  
- [ ] Background videos are silent + loop-tested  
- [ ] Calls use `preload: "none"` and room-safe `volume`  
- [ ] Placeholder flags cleared when finals replace files  
- [ ] File sizes within the targets above on a cold start of one exhibit  
- [ ] Muted station still communicates the same story beats  

---

## Key source files

- `src/components/media/LocalImage.tsx`  
- `src/components/media/LocalVideo.tsx`  
- `src/hooks/useLocalAudio.ts`  
- `src/lib/media/audioManager.ts`  
- `src/lib/media/config.ts`  
- `src/types/media.ts` / `src/types/content.ts` (`MediaAsset`)
