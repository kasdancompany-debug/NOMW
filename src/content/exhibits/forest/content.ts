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
  swipeHint: "Swipe to meet another forest giant",
  compareTitle: "Compare",
  compareLead: "Place two forest dwellers side by side.",
  tracksTitle: "Who Left This Track?",
  tracksLead: "Read the clue, then choose who passed this way.",
  callLabel: "Hear a call",
  callUnavailable: "Call audio arrives with final media",
  callCaptionPrefix: "Caption",
  tryAgain: "Try again",
  matchLabel: "Match",
  learnMore: "A little more",
  showLess: "Show less",
  sizeNote: "Silhouettes show relative size — exact measures await curator confirmation.",
} as const;

export function getForestAnimal(animalId: AnimalId): ForestAnimalPresentation | undefined {
  return forestAnimals.find((entry) => entry.animalId === animalId);
}
