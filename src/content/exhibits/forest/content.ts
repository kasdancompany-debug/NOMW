import type { AnimalId } from "@/types/content";

export type ForestProfileTab = "meet" | "size" | "habitat" | "food" | "survival";

export type ForestMode = "explore" | "compare" | "tracks";

export type ForestAnimalPresentation = {
  animalId: AnimalId;
  /**
   * Relative silhouette height vs the tallest featured animal (moose = 1).
   * For visual scale only — not a substitute for curator-approved metrics.
   */
  relativeHeight: number;
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

/** Human silhouette relative height for comparison (adult standing). */
export const HUMAN_RELATIVE_HEIGHT = 0.52;

export const forestAnimals: ForestAnimalPresentation[] = [
  {
    animalId: "moose",
    relativeHeight: 1,
    habitatBlurb: "Forest edges, wetlands, and soft shoreline ground.",
    foodBlurb: "Woody browse and aquatic plants when waters are open.",
    survivalBlurb: "Long legs carry them through deep snow and muskeg.",
  },
  {
    animalId: "black-bear",
    relativeHeight: 0.58,
    habitatBlurb: "Wide forest ranges, berry patches, and shoreline edges.",
    foodBlurb: "Seasonal omnivore — plants, insects, and whatever the year offers.",
    survivalBlurb: "A year shaped by food: green-up, abundance, then denning rest.",
  },
  {
    animalId: "grey-wolf",
    relativeHeight: 0.42,
    habitatBlurb: "Broad boreal landscapes where prey and pack routes meet.",
    foodBlurb: "A hunter of forest and snow country — more often tracked than seen.",
    survivalBlurb: "Endurance travelers; family groups shape the quiet drama of the woods.",
  },
  {
    animalId: "woodland-caribou",
    relativeHeight: 0.78,
    habitatBlurb: "Older forest and lichen country of the living north.",
    foodBlurb: "Tied to lichen and the intact forests that sustain it.",
    survivalBlurb: "A traveler whose future depends on habitat that remains whole.",
  },
  {
    animalId: "white-tailed-deer",
    relativeHeight: 0.62,
    habitatBlurb: "Forest edges, clearings, and winter yards.",
    foodBlurb: "Browser of edges — twigs, leaves, and seasonal greens.",
    survivalBlurb: "A white flag of alarm, then a bound toward cover.",
  },
  {
    animalId: "canada-lynx",
    relativeHeight: 0.34,
    habitatBlurb: "Deep-snow forest where snowshoe hares thrive.",
    foodBlurb: "Closely linked to hare country in the boreal winter.",
    survivalBlurb: "Broad paws and quiet steps — a specialist of powder and dusk.",
  },
];

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
  callUnavailable: "Call recording coming soon",
  callCaptionPrefix: "Caption",
  tryAgain: "Try again",
  matchLabel: "Match",
  learnMore: "A little more",
  showLess: "Show less",
  sizeNote: "Silhouettes show relative size — exact measures await curator confirmation.",
  humanScale: "Human scale",
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
