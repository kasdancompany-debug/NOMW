/**
 * Strongly typed content contracts for The Northern Ontario Museum of Wonder.
 * Visual components consume these types; they must not invent animal facts.
 *
 * Epistemic rule: do not present uncertain scientific claims as facts.
 * Content requiring curator / knowledge-keeper / specialist review uses
 * `confidence: "needs-research"` or `status: "placeholder"`.
 */

export type ExhibitSlug =
  | "welcome"
  | "forest"
  | "water"
  | "sky"
  | "night"
  | "seasons"
  | "tracks"
  | "coexistence";

export type AnimalId = string;
export type HabitatId = string;
export type SceneId = string;
export type MediaId = string;

/** Seasonal activity / presence framing for exhibits. */
export type Season = "spring" | "summer" | "autumn" | "winter" | "year-round";

/** Broad activity windows — not precise ethology claims. */
export type TimeOfDay = "dawn" | "day" | "dusk" | "night" | "variable";

export type AnimalGroup =
  | "mammal"
  | "bird"
  | "fish"
  | "reptile"
  | "amphibian"
  | "insect";

/**
 * Conservation labels for UI. Regional listings change; default to research placeholders
 * until curators confirm against current COSEWIC / Ontario lists.
 */
export type ConservationStatus =
  | "needs-research"
  | "not-evaluated-placeholder"
  | "least-concern-placeholder"
  | "special-concern-placeholder"
  | "threatened-placeholder"
  | "endangered-placeholder"
  | "extirpated-placeholder";

export type ContentConfidence = "general-knowledge" | "needs-research";

export type PlaceholderStatus = "placeholder" | "approved";

/** Text that is explicitly unfinished or awaiting specialist review. */
export type PlaceholderText = {
  text: string;
  status: "placeholder";
  researchNote: string;
};

/** Measurement / range strings — placeholder until verified for exhibit copy. */
export type PlaceholderMetric = {
  display: string;
  status: "placeholder";
  researchNote: string;
};

export type MediaKind = "image" | "video" | "audio";

export type MediaPreloadHint = "none" | "metadata" | "auto";

export type MediaSourceVariant = {
  src: string;
  width?: number;
  type?: string;
  mediaMaxWidth?: number;
};

export type MediaAsset = {
  id: MediaId;
  kind: MediaKind;
  /** Path under /public, e.g. /media/animals/placeholders/moose-hero.webp */
  src: string;
  /** Human label for staff / QA (not necessarily visitor-facing). */
  label: string;
  alt?: string;
  poster?: string;
  durationMs?: number;
  loop?: boolean;
  volume?: number;
  credit?: string;
  attribution?: string;
  /** Visitor-facing caption line (optional) */
  caption?: string;
  /** WebVTT caption track under /public */
  captionsSrc?: string;
  /** Alternate still/file when primary fails to load */
  fallbackSrc?: string;
  /** Responsive / alternate sources */
  sources?: MediaSourceVariant[];
  /** Hint for players — prefer none/metadata at startup */
  preload?: MediaPreloadHint;
  /** True until final production media replaces the file. */
  placeholder: boolean;
};

export type AnimalFact = {
  id: string;
  text: string;
  confidence: ContentConfidence;
  /** Required when confidence is needs-research. */
  researchNote?: string;
};

export type TrackClue = {
  id: string;
  animalId: AnimalId;
  label: string;
  description: string;
  confidence: ContentConfidence;
  researchNote?: string;
  mediaId?: MediaId;
};

export type SoundClue = {
  id: string;
  animalId: AnimalId;
  label: string;
  description: string;
  confidence: ContentConfidence;
  researchNote?: string;
  mediaId?: MediaId;
};

export type Habitat = {
  id: HabitatId;
  name: string;
  summary: string;
  /** Northern Ontario context line for labels. */
  regionNote: string;
  /** Soft association list; exhibits may filter further. */
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

export type Animal = {
  id: AnimalId;
  commonName: string;
  scientificName: string;
  /**
   * Indigenous names require community consultation and correct language attribution.
   * Never invent spellings or meanings here.
   */
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

/**
 * Exhibit wiring / ops configuration (which animals and habitats an exhibit features).
 * Scene choreography remains on ExhibitContent.
 */
export type ExhibitConfiguration = {
  slug: ExhibitSlug;
  title: string;
  tagline?: string;
  featuredAnimalIds: AnimalId[];
  featuredHabitatIds: HabitatId[];
  defaultAmbientAudioId?: MediaId;
  idleTimeoutMs?: number;
  enabled: boolean;
};

/* ─── Exhibit experience types (scenes / shell) ─────────────────────────── */

export type HotspotRevealType = "animal" | "habitat" | "fact" | "scene" | "media";

export type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  hitSizePx?: number;
  reveals: {
    type: HotspotRevealType;
    targetId: string;
  };
};

export type SceneCtaAction =
  | "goToScene"
  | "openAnimal"
  | "openHabitat"
  | "playMedia"
  | "resetHome";

export type Scene = {
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
    action: SceneCtaAction;
    targetId?: string;
  }[];
  motion?: {
    preset?: string;
    respectReducedMotion: boolean;
  };
};

export type ExhibitIdleConfig = {
  timeoutMs?: number;
  returnToHome: boolean;
  attractSceneId?: SceneId;
};

export type ContentMeta = {
  version: string;
  updatedAt: string;
  notes?: string;
};

export type ExhibitContent = {
  slug: ExhibitSlug;
  title: string;
  tagline?: string;
  homeSceneId: SceneId;
  idle?: ExhibitIdleConfig;
  scenes: Scene[];
  /** Optional exhibit-local overrides; prefer shared catalogs. */
  animalIds?: AnimalId[];
  habitatIds?: HabitatId[];
  configuration?: ExhibitConfiguration;
  media: MediaAsset[];
  beatOrder?: SceneId[];
  meta?: ContentMeta;
};

export const EXHIBIT_SLUGS: readonly ExhibitSlug[] = [
  "welcome",
  "forest",
  "water",
  "sky",
  "night",
  "seasons",
  "tracks",
  "coexistence",
] as const;

export const SEASONS: readonly Season[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
  "year-round",
] as const;

export const ANIMAL_GROUPS: readonly AnimalGroup[] = [
  "mammal",
  "bird",
  "fish",
  "reptile",
  "amphibian",
  "insect",
] as const;

export function isExhibitSlug(value: string): value is ExhibitSlug {
  return (EXHIBIT_SLUGS as readonly string[]).includes(value);
}
