import type { AnimalId } from "@/types/content";

export type ForestProfileTab = "meet" | "size" | "habitat" | "food" | "survival";

export type ForestMode = "explore" | "compare" | "tracks";

export type ForestAnimalPresentation = {
  animalId: AnimalId;
  /** Typical adult shoulder / withers height used for the visual scale. */
  shoulderHeightM: number;
  /**
   * Shoulder / withers height relative to a standing adult human (= 1.0 ≈ 1.7 m).
   * Used for size compare + hero scale — visual guide, not a certified metric.
   */
  relativeHeight: number;
  /**
   * Fraction of the silhouette artwork from ground to withers.
   * Antlered species are < 1 so antlers can extend above the shoulder line.
   */
  bodyProportion?: number;
  /** Intrinsic transparent PNG width ÷ height; prevents width constraints changing scale. */
  artworkAspectRatio: number;
  /** Short habitat line for the Habitat tab (museum-safe). */
  habitatBlurb: string;
  /** Food / diet line — soft wording; detailed claims stay needs-research. */
  foodBlurb: string;
  /** Survival / adaptation tease. */
  survivalBlurb: string;
};

export type TrackChallenge = {
  id: string;
  prompt: string;
  clue: string;
  correctAnimalId: AnimalId;
  options: AnimalId[];
};

export const FOREST_EXHIBIT_TITLE = "Giants of the Forest";
export const FOREST_EXHIBIT_SUBTITLE = "Meet the great travelers of the boreal";

export const forestProfileTabs: { id: ForestProfileTab; label: string }[] = [
  { id: "meet", label: "Meet" },
  { id: "size", label: "Size" },
  { id: "habitat", label: "Habitat" },
  { id: "food", label: "Food" },
  { id: "survival", label: "Survival" },
];

/**
 * Standing adult human = 1.0 (≈ 1.7 m).
 * Quadruped values are typical shoulder / withers height ÷ 1.7 m.
 */
export const HUMAN_RELATIVE_HEIGHT = 1;
export const HUMAN_REFERENCE_HEIGHT_M = 1.7;

function relativeShoulderHeight(shoulderHeightM: number): number {
  return shoulderHeightM / HUMAN_REFERENCE_HEIGHT_M;
}

/**
 * Artwork height needed so the withers land at `relativeHeight`.
 * Antlers extend above; bodyProportion is ground→withers share of the PNG.
 */
export function forestSilhouetteDisplayHeight(
  relativeHeight: number,
  bodyProportion = 1,
  stagePx: number,
): number {
  const proportion = Math.min(1, Math.max(0.35, bodyProportion));
  return Math.max(48, (relativeHeight / proportion) * stagePx);
}

export const forestAnimals: ForestAnimalPresentation[] = [
  {
    animalId: "moose",
    // Typical adult midpoint: about 1.9 m at the shoulder.
    shoulderHeightM: 1.9,
    relativeHeight: relativeShoulderHeight(1.9),
    // Anatomical landmark in this artwork: hoof baseline → shoulder hump.
    bodyProportion: 0.802,
    artworkAspectRatio: 1247 / 931,
    habitatBlurb: "Forest edges, wetlands, and soft shoreline ground.",
    foodBlurb: "Woody browse and aquatic plants when waters are open.",
    survivalBlurb: "Long legs carry them through deep snow and muskeg.",
  },
  {
    animalId: "black-bear",
    // Mean of reported adult female / male means: about 0.77 m.
    shoulderHeightM: 0.77,
    relativeHeight: relativeShoulderHeight(0.77),
    bodyProportion: 0.964,
    artworkAspectRatio: 1009 / 563,
    habitatBlurb: "Wide forest ranges, berry patches, and shoreline edges.",
    foodBlurb: "Seasonal omnivore — plants, insects, and whatever the year offers.",
    survivalBlurb: "A year shaped by food: green-up, abundance, then denning rest.",
  },
  {
    animalId: "grey-wolf",
    // Midpoint of the typical 0.61–0.76 m adult range.
    shoulderHeightM: 0.69,
    relativeHeight: relativeShoulderHeight(0.69),
    bodyProportion: 0.699,
    artworkAspectRatio: 1019 / 774,
    habitatBlurb: "Broad boreal landscapes where prey and pack routes meet.",
    foodBlurb: "A hunter of forest and snow country — more often tracked than seen.",
    survivalBlurb: "Endurance travelers; family groups shape the quiet drama of the woods.",
  },
  {
    animalId: "woodland-caribou",
    // Ontario / federal range is 1.0–1.2 m; midpoint used for display.
    shoulderHeightM: 1.1,
    relativeHeight: relativeShoulderHeight(1.1),
    // Hoof baseline → top of back. Antlers overlap the torso horizontally, so
    // an alpha-column scan incorrectly reported 0.87 and made this look dog-sized.
    bodyProportion: 0.572,
    artworkAspectRatio: 969 / 922,
    habitatBlurb: "Older forest and lichen country of the living north.",
    foodBlurb: "Tied to lichen and the intact forests that sustain it.",
    survivalBlurb: "A traveler whose future depends on habitat that remains whole.",
  },
  {
    animalId: "white-tailed-deer",
    // Typical midpoint of the 0.8–1.0 m adult range.
    shoulderHeightM: 0.9,
    relativeHeight: relativeShoulderHeight(0.9),
    bodyProportion: 0.601,
    artworkAspectRatio: 807 / 888,
    habitatBlurb: "Forest edges, clearings, and winter yards.",
    foodBlurb: "Browser of edges — twigs, leaves, and seasonal greens.",
    survivalBlurb: "A white flag of alarm, then a bound toward cover.",
  },
  {
    animalId: "canada-lynx",
    // Typical midpoint of the 0.48–0.56 m adult range.
    shoulderHeightM: 0.52,
    relativeHeight: relativeShoulderHeight(0.52),
    bodyProportion: 0.776,
    artworkAspectRatio: 973 / 682,
    habitatBlurb: "Deep-snow forest where snowshoe hares thrive.",
    foodBlurb: "Closely linked to hare country in the boreal winter.",
    survivalBlurb: "Broad paws and quiet steps — a specialist of powder and dusk.",
  },
];

/** Ground→withers share of silhouette art; defaults to 1 when unknown. */
export function forestBodyProportion(animalId: string): number {
  return (
    forestAnimals.find((entry) => entry.animalId === animalId)?.bodyProportion ?? 1
  );
}

export function forestSilhouetteAspectRatio(animalId: string): number {
  return (
    forestAnimals.find((entry) => entry.animalId === animalId)?.artworkAspectRatio ?? 1
  );
}

export const forestTrackChallenge: TrackChallenge = {
  id: "forest-track-1",
  prompt: "Who Left This Track?",
  clue: "A large, long-legged traveler of soft ground and wetland edges — often alone at dawn.",
  correctAnimalId: "moose",
  options: ["moose", "white-tailed-deer", "black-bear", "grey-wolf"],
};

export const forestCopy = {
  swipeHint: "Swipe left or right to explore other forest giants",
  compareTitle: "Compare size",
  compareLead: "Choose two animals. See them side by side with a human for scale.",
  compareMode: "Compare size",
  tracksTitle: "Who Left This Track?",
  tracksLead: "Read the clue, then choose who passed this way.",
  callLabel: "Hear a call",
  callUnavailable: "Call unavailable",
  callCaptionPrefix: "Caption",
  tryAgain: "Try again",
  matchLabel: "Match",
  learnMore: "A little more",
  showLess: "Show less",
  sizeNote:
    "Scale shows shoulder height for animals beside a standing adult (~1.7 m).",
  humanScale: "Adult human · 1.70 m",
  navLead: "Meet the great travelers of the boreal forest. Touch an animal to explore.",
  aboutTitle: "About",
  didYouKnow: "Did you know?",
  statsPending: "Typical adult ranges",
  backHome: "Back to exhibit home",
  fullProfile: "Full profile",
} as const;

/** Soft provisional display stats for the insight panel — not floor-certified. */
export type ForestStatLine = {
  id: "height" | "weight" | "lifespan" | "tracks";
  label: string;
  value: string;
};

export const forestProvisionalStats: Record<string, ForestStatLine[]> = {
  moose: [
    { id: "height", label: "Height", value: "1.8 – 2.3 m" },
    { id: "weight", label: "Weight", value: "385 – 700 kg" },
    { id: "lifespan", label: "Lifespan", value: "15 – 20 years" },
    { id: "tracks", label: "Tracks", value: "12 – 15 cm" },
  ],
  "black-bear": [
    { id: "height", label: "Height", value: "0.7 – 1.0 m" },
    { id: "weight", label: "Weight", value: "90 – 270 kg" },
    { id: "lifespan", label: "Lifespan", value: "15 – 25 years" },
    { id: "tracks", label: "Tracks", value: "10 – 16 cm" },
  ],
  "grey-wolf": [
    { id: "height", label: "Height", value: "0.6 – 0.9 m" },
    { id: "weight", label: "Weight", value: "30 – 50 kg" },
    { id: "lifespan", label: "Lifespan", value: "6 – 13 years" },
    { id: "tracks", label: "Tracks", value: "9 – 12 cm" },
  ],
  "woodland-caribou": [
    { id: "height", label: "Height", value: "1.0 – 1.2 m" },
    { id: "weight", label: "Weight", value: "110 – 210 kg" },
    { id: "lifespan", label: "Lifespan", value: "8 – 15 years" },
    { id: "tracks", label: "Tracks", value: "8 – 12 cm" },
  ],
  "white-tailed-deer": [
    { id: "height", label: "Height", value: "0.8 – 1.1 m" },
    { id: "weight", label: "Weight", value: "40 – 90 kg" },
    { id: "lifespan", label: "Lifespan", value: "6 – 14 years" },
    { id: "tracks", label: "Tracks", value: "5 – 8 cm" },
  ],
  "canada-lynx": [
    { id: "height", label: "Height", value: "0.5 – 0.65 m" },
    { id: "weight", label: "Weight", value: "8 – 14 kg" },
    { id: "lifespan", label: "Lifespan", value: "10 – 15 years" },
    { id: "tracks", label: "Tracks", value: "8 – 10 cm" },
  ],
};

export function getForestProvisionalStats(animalId: string): ForestStatLine[] {
  return (
    forestProvisionalStats[animalId] ?? [
      { id: "height", label: "Height", value: "—" },
      { id: "weight", label: "Weight", value: "—" },
      { id: "lifespan", label: "Lifespan", value: "—" },
      { id: "tracks", label: "Tracks", value: "—" },
    ]
  );
}

/** Cache-bust silhouette cutouts when SW / CDN holds stale white-bg assets. */
export const FOREST_SILHOUETTE_VERSION = "2";

export function forestSilhouetteSrc(animalId: string): string {
  return `/media/animals/silhouettes/${animalId}.png?v=${FOREST_SILHOUETTE_VERSION}`;
}

export const FOREST_HUMAN_SILHOUETTE = `/media/animals/silhouettes/human.png?v=${FOREST_SILHOUETTE_VERSION}`;
export const FOREST_CINEMATIC_BG = "/media/habitats/forest-cinematic-bg.png";

export function getForestAnimal(animalId: AnimalId): ForestAnimalPresentation | undefined {
  return forestAnimals.find((entry) => entry.animalId === animalId);
}
