# Content Model

## Purpose

All visitor-facing information for **The Northern Ontario Museum of Wonder** lives in typed local content modules (TypeScript or JSON that conforms to TypeScript types). Visual components receive structured props; they must not hardcode animal facts, habitat names, educational copy, or media filenames.

This model supports eight exhibits, placeholder media today, and clean replacement of finals later.

---

## Design Principles

1. **Content owns meaning; components own presentation.**  
2. **IDs are stable; labels are replaceable.** Prefer `animalId: "beaver"` over embedding display names in UI trees.  
3. **Media is referenced, never inlined as blobs.** Paths point into `/public/media/...`.  
4. **One schema family across exhibits.** Exhibits differ in composition, not in inventing one-off data shapes when shared types suffice.  
5. **Validate at load time.** Invalid content fails fast in development; production build should reject broken registry entries.

---

## Identity Vocabulary

```ts
type ExhibitSlug =
  | "welcome"
  | "forest"
  | "water"
  | "sky"
  | "night"
  | "seasons"
  | "tracks"
  | "coexistence";

type AnimalId = string;   // e.g. "moose", "beaver", "black-bear"
type HabitatId = string;  // e.g. "boreal-forest", "wetland", "shield-lake"
type SceneId = string;    // stable per-exhibit scene key
type MediaId = string;    // stable key into MediaAsset map
```

Slug list is closed for the MVP. Animal, habitat, scene, and media IDs are open enums as content grows.

---

## Core Types

Source of truth: `src/types/content.ts`.

### Epistemic rule

Do **not** present uncertain scientific claims as facts. Use:

- `confidence: "needs-research"` on `AnimalFact`, `TrackClue`, and `SoundClue`
- `status: "placeholder"` on `PlaceholderText` / `PlaceholderMetric`
- `[NEEDS RESEARCH]` prefix in unfinished visitor-facing strings
- Indigenous names only via `indigenousNamePlaceholder` until knowledge-keeper consultation is recorded

### MediaAsset

```ts
type MediaAsset = {
  id: MediaId;
  kind: "image" | "video" | "audio";
  src: string;                 // e.g. /media/animals/placeholders/moose-hero.PLACEHOLDER.webp
  label: string;               // staff-facing; include PLACEHOLDER when unfinished
  alt?: string;
  poster?: string;
  durationMs?: number;
  loop?: boolean;
  volume?: number;
  credit?: string;
  attribution?: string;
  placeholder: boolean;
};
```

### Animal

```ts
type Animal = {
  id: AnimalId;
  commonName: string;
  scientificName: string;
  indigenousNamePlaceholder: PlaceholderText;
  animalGroup: AnimalGroup;
  shortIntroduction: string;
  fullDescription: string;
  habitatIds: HabitatId[];
  activeSeasons: Season[];
  activeTimeOfDay: TimeOfDay[];
  diet: PlaceholderText;
  conservationStatus: ConservationStatus;
  northernOntarioRange: PlaceholderText;
  averageLength: PlaceholderMetric;
  averageHeight: PlaceholderMetric;
  averageWeight: PlaceholderMetric;
  lifespan: PlaceholderMetric;
  tracksDescription: PlaceholderText;
  callDescription: PlaceholderText;
  adaptationFacts: AnimalFact[];
  memorableFacts: AnimalFact[];
  coexistenceAdvice: PlaceholderText;
  heroImage: MediaAsset;
  galleryImages: MediaAsset[];
  silhouetteImage: MediaAsset;
  habitatVideo: MediaAsset;
  transparentAnimalImage: MediaAsset;
  callAudio: MediaAsset;
  ambientAudio: MediaAsset;
  captions: string[];
  attribution: string;
  featured: boolean;
  enabled: boolean;
};
```

Supporting types: `Habitat`, `Season`, `AnimalGroup`, `AnimalFact`, `TrackClue`, `SoundClue`, `ConservationStatus`, `ExhibitConfiguration`.

Initial catalog (22 species) lives under `src/content/animals/`. Habitats: `src/content/habitats/`. Validation: `src/lib/content/validate.ts` (runs via `src/content/database.ts`).

### Habitat

```ts
type Habitat = {
  id: HabitatId;
  name: string;
  summary: string;
  regionNote: string;
  animalIds: AnimalId[];
  typicalSeasons: Season[];
  media: {
    ambientImage?: MediaAsset;
    ambientVideo?: MediaAsset;
    ambientAudio?: MediaAsset;
  };
  captions?: string[];
  attribution?: string;
  enabled: boolean;
};
```

### Hotspot

Touch targets placed in a scene (map pin, tree hollow, track imprint).

```ts
type Hotspot = {
  id: string;
  label: string;                // accessibility / staff; may be visual-only on screen
  /** Normalized 0–1 coordinates within the scene stage */
  x: number;
  y: number;
  /** Minimum hit area in CSS pixels; default 64 */
  hitSizePx?: number;
  reveals: {
    type: "animal" | "habitat" | "fact" | "scene" | "media";
    targetId: string;
  };
};
```

### Scene

A scene is a full-viewport (or full-stage) state within an exhibit.

```ts
type Scene = {
  id: SceneId;
  title?: string;
  subtitle?: string;
  body?: string;
  background?: {
    image?: MediaId;
    video?: MediaId;
    audio?: MediaId;
  };
  hotspots?: Hotspot[];
  animalIds?: AnimalId[];
  habitatIds?: HabitatId[];
  cta?: {
    label: string;
    action: "goToScene" | "openAnimal" | "openHabitat" | "playMedia" | "resetHome";
    targetId?: string;
  }[];
  motion?: {
    /** Logical choreography key understood by that exhibit package */
    preset?: string;
    respectReducedMotion: boolean;
  };
};
```

### ExhibitContent

Top-level document per exhibit file.

```ts
type ExhibitContent = {
  slug: ExhibitSlug;
  title: string;
  tagline?: string;
  homeSceneId: SceneId;
  idle?: {
    timeoutMs?: number;
    returnToHome: boolean;
    attractSceneId?: SceneId;
  };
  scenes: Scene[];
  /** Exhibit-local overrides / inclusions; global animals may also be imported */
  animals?: Animal[];
  habitats?: Habitat[];
  media: MediaAsset[];
  /** Optional ordered narrative beat IDs for staff QA */
  beatOrder?: SceneId[];
};
```

---

## File Organization

```
content/
├── config/
│   ├── exhibits.registry.ts
│   ├── idle.config.ts
│   └── staff.config.ts
├── animals/
│   ├── index.ts                 # aggregates shared animals
│   ├── moose.ts
│   ├── beaver.ts
│   └── ...
├── habitats/
│   ├── index.ts
│   ├── boreal-forest.ts
│   └── ...
└── exhibits/
    ├── welcome.ts
    ├── forest.ts
    ├── water.ts
    ├── sky.ts
    ├── night.ts
    ├── seasons.ts
    ├── tracks.ts
    └── coexistence.ts
```

**Shared vs local**

- Animals and habitats that appear in multiple exhibits live under `content/animals` and `content/habitats`.
- Exhibit files import what they need and may add exhibit-only scenes, hotspots, and media.
- Exhibit files may also declare thin local animal “cards” only if the creature is unique to that installation—and still use the same `Animal` type.

---

## Exhibit Intent (Content Lens)

These intents guide copy and media lists; they are not separate schemas.

| Slug | Primary content question |
|------|--------------------------|
| `welcome` | What is this room? How do I begin exploring? |
| `forest` | Who lives in the boreal / forest habitats of Northern Ontario? |
| `water` | How do lakes, rivers, and wetlands shape life here? |
| `sky` | What moves through air—birds, insects, weather cues? |
| `night` | What changes after dark—sound, eyeshine, nocturnal life? |
| `seasons` | How do habitats and animals transform across the year? |
| `tracks` | What stories do prints, signs, and evidence tell? |
| `coexistence` | How do people and wildlife share this landscape? |

Copy tone: wonder-led, accurate enough for museum floor use, short enough for standing visitors. Prefer one idea per scene.

---

## Content → UI Contract

```
ExhibitContent
    │
    ├─ scenes[] ───────────► Exhibit package chooses layout + motion
    ├─ animals[] ──────────► Detail layers / comparators / cards (non-card UI unless interactive container)
    ├─ habitats[] ─────────► Atmosphere layers, maps, ambient beds
    └─ media[] ────────────► LocalImage / LocalVideo / Howler via MediaId
```

Rules:

- UI may filter and sort content for interaction state.
- UI may not invent educational facts not present in content.
- Missing media with `placeholder: true` renders a branded placeholder surface, never a broken-image icon.
- Optional fields must be handled; exhibits should degrade gracefully (e.g. no audio → silent ambient).

---

## Registry

```ts
type ExhibitRegistryEntry = {
  slug: ExhibitSlug;
  title: string;
  // dynamic import path or static import map key
  load: () => Promise<ExhibitContent>;
};
```

`getExhibit(slug)` returns validated `ExhibitContent` or a typed error for the shell recovery UI.

---

## Validation Rules (MVP)

Implement as TypeScript types first; add runtime validation (e.g. Zod) when scaffolding the app.

| Rule | Severity |
|------|----------|
| `slug` matches filename / registry | Error |
| `homeSceneId` exists in `scenes` | Error |
| All `MediaId` references resolve in `media[]` or shared media pool | Error |
| All `animalIds` / `habitatIds` resolve | Error |
| Hotspot `x`,`y` in `[0, 1]` | Error |
| Interactive CTA labels non-empty | Error |
| `alt` present on informative images | Warning |
| `placeholder: true` assets logged for ops checklist | Info |

---

## Placeholder Strategy

Until final art arrives:

```ts
{
  id: "moose-hero",
  kind: "image",
  src: "/media/images/_placeholders/animal-hero.svg",
  alt: "Placeholder portrait for moose",
  placeholder: true
}
```

When final media is ready:

1. Drop file into the correct `/public/media/...` folder (see `MEDIA_GUIDELINES.md`).  
2. Update `src` (and poster / duration as needed).  
3. Set `placeholder: false` or remove the flag.  
4. Do not change the `id` if UI and hotspots already reference it.

Stable IDs are the swap mechanism.

---

## Localization (Future Hook)

MVP is English-only. Structure fields as plain strings for now. If bilingual support is required later, prefer:

```ts
type LocalizedString = { en: string; fr?: string };
```

Do not split eight exhibits into parallel FR files unless museum policy requires a full separate skin.

---

## Staff-Visible Metadata (Optional)

```ts
type ContentMeta = {
  version: string;       // e.g. "0.1.0-mvp"
  updatedAt: string;     // ISO date
  notes?: string;        // "Awaiting final night ambient loop"
};
```

Attach optionally to `ExhibitContent` so the staff panel can show content version vs app build version.

---

## Example Shape (Illustrative)

```ts
export const forestExhibit: ExhibitContent = {
  slug: "forest",
  title: "Forest",
  tagline: "Step into the boreal.",
  homeSceneId: "forest-home",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "forest-home",
      title: "Forest",
      background: {
        image: "forest-home-still",
        video: "forest-home-loop",
        audio: "forest-ambience"
      },
      hotspots: [
        {
          id: "hs-moose",
          label: "Moose",
          x: 0.32,
          y: 0.58,
          hitSizePx: 72,
          reveals: { type: "animal", targetId: "moose" }
        }
      ],
      cta: [{ label: "Explore deeper", action: "goToScene", targetId: "forest-canopy" }]
    }
  ],
  animals: [/* imported or inline Animal records */],
  habitats: [/* ... */],
  media: [
    {
      id: "forest-home-loop",
      kind: "video",
      src: "/media/video/forest/home-loop.mp4",
      poster: "/media/images/forest/home-poster.webp",
      loop: true,
      placeholder: true
    }
  ]
};
```

---

## Anti-Patterns

- Embedding long copy strings inside JSX for animals.  
- Using image filenames as the only identifier (`moose.png` as ID).  
- Different ad-hoc shapes per exhibit for the same concept (e.g. five kinds of “fact”).  
- Remote URLs in `src`.  
- Content that assumes hover (`onMouseEnter` reveals as the only path).  

---

## Success Criteria

1. Swapping a media file requires a content path edit and/or file drop—not a component rewrite.  
2. Shared animals can appear in forest and tracks without duplicated factual drift (single source module).  
3. Exhibit packages can be developed in parallel against the same TypeScript contracts.  
4. Placeholder flags produce an ops list of unfinished assets.
