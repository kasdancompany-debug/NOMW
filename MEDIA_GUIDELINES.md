# Media Guidelines

## Purpose

Media makes the room feel like a museum installation: cinematic environments, tactile feedback cues, and animal presence. All assets are **local** under `/public/media`. This guide standardizes formats, folders, naming, placeholders, and replacement so final deliveries drop in without rewriting UI.

Companion docs: `CONTENT_MODEL.md` (IDs and references), `PROJECT_ARCHITECTURE.md` (pipeline), `KIOSK_REQUIREMENTS.md` (playback constraints).

---

## Principles

1. **Local only** — No CDN, YouTube, or live streams required at runtime.  
2. **ID-stable** — Content references `MediaId`; filenames can change if `src` is updated. Prefer not renaming once finals land.  
3. **Poster everything video** — Every video has a still for instant paint and reduced-motion fallback.  
4. **Placeholders first** — Ship labeled placeholders; replace files + flip `placeholder` flag.  
5. **Weight budget** — Eight concurrent kiosks and limited PC hardware; optimize aggressively.  
6. **Museum-safe** — No strobing, no startling max-volume defaults, respect reduced motion.

---

## Directory Layout

```
public/media/
├── images/
│   ├── _placeholders/
│   ├── brand/
│   ├── welcome/
│   ├── forest/
│   ├── water/
│   ├── sky/
│   ├── night/
│   ├── seasons/
│   ├── tracks/
│   ├── coexistence/
│   ├── animals/
│   └── habitats/
├── video/
│   ├── _placeholders/
│   ├── welcome/
│   ├── forest/
│   ├── water/
│   ├── sky/
│   ├── night/
│   ├── seasons/
│   ├── tracks/
│   └── coexistence/
└── audio/
    ├── _placeholders/
    ├── ambience/
    ├── ui/
    ├── animals/
    └── exhibits/
        ├── welcome/
        ├── forest/
        └── ...
```

Rules:

- Exhibit-specific art lives under that exhibit’s folder.  
- Shared animal portraits and calls live under `images/animals` and `audio/animals`.  
- `_placeholders` holds generic branded stand-ins used until finals exist.

---

## Naming Conventions

Pattern:

```
{subject}-{role}-{variant}.{ext}
```

Examples:

| Asset | Filename |
|-------|----------|
| Moose portrait | `moose-portrait-01.webp` |
| Forest home loop | `forest-home-loop.mp4` |
| Forest home poster | `forest-home-poster.webp` |
| Beaver call | `beaver-call-01.mp3` |
| UI confirm soft | `ui-tap-soft.mp3` |
| Night ambience | `night-ambience-loop.mp3` |

Use lowercase, kebab-case, no spaces. Include a numeric suffix when variants exist.

Content `MediaId` may match the descriptive stem (`moose-portrait-01`) for clarity.

---

## Images

### Formats

| Use | Preferred | Notes |
|-----|-----------|-------|
| Photographic / environment | **WebP** (or high-quality JPEG fallback) | Transparency → WebP/PNG |
| UI icons / simple flat art | SVG or WebP | SVG for crisp simple shapes |
| Placeholders | SVG or WebP | Branded, clearly temporary |

### Resolution targets (16:9 / 1920×1080 stage)

| Role | Pixel guidance |
|------|----------------|
| Full-bleed still / poster | 1920×1080 (up to 2560×1440 if detail needs it and weight allows) |
| Animal hero crop | Longest edge 1600–2400px |
| Portrait / detail | ~800–1200px on longest edge |
| Icon / silhouettes | As needed @2x for sharpness |

Do not ship unresized camera RAW or 8K stills in the kiosk build.

### Visual direction

- Real place, species, or atmospheric photography preferred as the main visual idea.  
- Avoid generic stock that could be any forest museum anywhere when Northern Ontario reference art exists.  
- Full-bleed environments should read as edge-to-edge planes, not inset polaroids (unless an exhibit’s interaction metaphor requires evidence-style framing—e.g. tracks).

### Alt text

Informative images need `alt` in the `MediaAsset` record. Decorative loop frames may use empty alt only when purely atmospheric and duplicated by visible titles—prefer real alt when animals are identifiable.

---

## Video

### Formats

| Property | MVP standard |
|----------|----------------|
| Container | **MP4** |
| Video codec | **H.264** (Baseline/Main) for maximum kiosk GPU/CPU compatibility |
| Audio in video | Prefer **silent** loops for backgrounds; use Howler for audible beds when possible |
| Alternative | WebM/VP9 optional later—not required for MVP |

### Roles

| Role | Spec |
|------|------|
| Background loop | 1920×1080, 15–30fps, seamless loop, muted, ≤ ~15–25 Mbps peak preferred; aim lower (8–12 Mbps) after encode tests |
| Story beat / reveal | Short (5–20s), poster required, tap to replay |
| Reduced motion | Show poster still; do not autoplay large motion |

### Technical constraints

- Always provide `poster`.  
- `playsInline`, `loop` for beds; `preload` strategy: `metadata` or controlled preload per exhibit mount.  
- Avoid 4K masters on-device unless hardware is proven. Deliver 1080p derivatives for floor.  
- No hard cuts every few frames that could shimmer on large panels.  
- Seam loops: first/last frames matched; silence pops removed.

### Content safety

- No flashing >3 distinct large-field flashes per second.  
- Night exhibit: avoid extreme flicker “lightning” loops as default ambience.

---

## Audio (Howler.js)

### Formats

| Prefer | Acceptable |
|--------|------------|
| **MP3** (universal) | WAV for rare short UI clicks if tiny; AAC/M4A if toolchain requires |

### Roles & levels

| Role | Guidance |
|------|----------|
| Ambience loop | Soft bed; default volume often **0.15–0.35** |
| Animal call | One-shot; duck ambience slightly if needed |
| UI feedback | Very short (<0.4s), subtle; never sharp clipping |
| Narrative VO (if any) | Clear, moderate; staff-tunable |

Store suggested `volume` on `MediaAsset`. Staff panel can scale globally.

### Authoring tips

- Loop points must be clean (no breath click at seam).  
- Normalize loudness across ambience beds so walking between kiosks is not jarring.  
- Keep peak levels museum-safe; leave headroom for room speaker EQ.  
- Preload ambience for the active exhibit; unload on idle full reset / route leave if memory tight.

### Autoplay policy

Expect **first visitor gesture** to unlock audio. Visual experience must stand alone if sound is blocked.

---

## Placeholders

Until finals arrive:

1. Use files in `*/_placeholders/`.  
2. Mark assets `placeholder: true` in content.  
3. Placeholders should feel on-brand (color, typography vibe) but obviously unfinished to staff—not broken browser icons.  
4. Maintain a staff-readable checklist by filtering `placeholder: true`.

### Replacement checklist

- [ ] Drop final into the correct folder  
- [ ] Update `src` / `poster` if filename changed  
- [ ] Verify encode plays on target kiosk browser offline  
- [ ] Set `placeholder: false`  
- [ ] Confirm Howler / video cleanup still works  
- [ ] Re-check filesize budget for that exhibit  

Keep the same `MediaId` whenever possible.

---

## Performance Budgets (MVP Targets)

Per exhibit home scene (initial):

| Type | Soft budget |
|------|-------------|
| Background video | ≤ ~15 MB when possible; hard-cap investigate if >40 MB |
| Ambience audio loop | ≤ ~4 MB |
| Hero still / poster | ≤ ~500 KB–1.5 MB WebP |
| Concurrent decoded videos | Prefer **one** full-bleed video at a time |

Whole app under `/public/media` should remain installable on modest local SSD images. Revisit budgets after first real encode pass on target hardware.

---

## Credits & Rights

- Store optional `credit` on `MediaAsset` for staff/ops.  
- Do not present dense credit typography in visitor heroes.  
- Ensure museum has rights for public display and local duplication across eight machines.  
- Keep a rights log outside or beside content if legal requires it (`content/config/rights.md` optional).

---

## Reduced Motion Mapping

| Full motion | Reduced motion |
|-------------|----------------|
| Video loop | Static poster / still |
| Parallax / drift | Static composition |
| Long choreographies | Instant cut or short fade |
| Audio-reactive motion | Disabled; audio optional |

Content may set `motion.respectReducedMotion: true` (default). Exhibit packages must implement the fallback.

---

## QA Checklist (Per Asset Batch)

- [ ] Plays offline on kiosk browser  
- [ ] Correct folder + kebab-case name  
- [ ] Linked from content via stable `MediaId`  
- [ ] Poster present for every video  
- [ ] Alt text for informative images  
- [ ] Loop seams clean (video/audio)  
- [ ] Volume defaults sane  
- [ ] No strobe / seizure risk  
- [ ] Placeholder flags accurate  
- [ ] Filesize within soft budget or consciously accepted |

---

## Anti-Patterns

- Hotlinking Unsplash/YouTube in components.  
- 4K ProRes in `/public`.  
- Videos without posters.  
- Different filenames in content vs disk with no update process.  
- Using UI components to hardcode `/media/...` paths for animal-specific art (paths belong in content).  
- Loud default UI ticks that dominate ambience.

---

## Success Criteria

1. A media producer can deliver finals into `/public/media` using these names/folders without app surgery beyond content `src` updates.  
2. Every video has a poster and a reduced-motion still path.  
3. Audio is controllable, local, and idle-safe.  
4. Placeholder inventory is queryable from content.  
5. Target PCs play home scenes smoothly at 1920×1080 in kiosk mode.
