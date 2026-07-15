import type { AnimalId } from "@/types/content";

export type NightBehavior = "still" | "drift-away";

export type NightDiscoveryId =
  | AnimalId
  | "night-moths";

export type NightCreature = {
  id: NightDiscoveryId;
  /** Display name when not a catalog animal */
  label: string;
  /** Panorama placement 0–1 */
  x: number;
  y: number;
  /** Hit radius as % of viewport short side */
  hitRadius: number;
  behavior: NightBehavior;
  /** Soft drift distance in px when illuminated (drift-away only) */
  driftPx: number;
  nocturnalFact: string;
  silhouette: "lynx" | "fox" | "owl" | "bat" | "squirrel" | "wolf" | "moths";
};

export const NIGHT_EXHIBIT_TITLE = "The Forest After Dark";
export const NIGHT_EXHIBIT_SUBTITLE = "Guide a gentle beam through the night canopy";

/** Room-safe night ambience for eight concurrent stations */
export const NIGHT_AMBIENT_VOLUME = 0.18;

export const nightCreatures: NightCreature[] = [
  {
    id: "canada-lynx",
    label: "Canada Lynx",
    x: 0.22,
    y: 0.58,
    hitRadius: 0.07,
    behavior: "still",
    driftPx: 0,
    nocturnalFact:
      "Wide, furred feet and a quiet step help lynx travel soft snow and dark forest floors.",
    silhouette: "lynx",
  },
  {
    id: "red-fox",
    label: "Red Fox",
    x: 0.7,
    y: 0.72,
    hitRadius: 0.065,
    behavior: "still",
    driftPx: 0,
    nocturnalFact:
      "Keen hearing and a keen nose let foxes hunt when daylight has already left the trail.",
    silhouette: "fox",
  },
  {
    id: "great-grey-owl",
    label: "Great Grey Owl",
    x: 0.48,
    y: 0.28,
    hitRadius: 0.08,
    behavior: "still",
    driftPx: 0,
    nocturnalFact:
      "A facial disc funnels faint sound — this owl can listen for prey under a blanket of quiet snow.",
    silhouette: "owl",
  },
  {
    id: "little-brown-bat",
    label: "Little Brown Bat",
    x: 0.82,
    y: 0.22,
    hitRadius: 0.06,
    behavior: "drift-away",
    driftPx: 36,
    nocturnalFact:
      "Echolocation paints the dark with sound, guiding tiny wings toward night insects.",
    silhouette: "bat",
  },
  {
    id: "northern-flying-squirrel",
    label: "Northern Flying Squirrel",
    x: 0.34,
    y: 0.38,
    hitRadius: 0.055,
    behavior: "drift-away",
    driftPx: 42,
    nocturnalFact:
      "A membrane between wrist and ankle turns a leap into a soft glide through the canopy night.",
    silhouette: "squirrel",
  },
  {
    id: "grey-wolf",
    label: "Grey Wolf",
    x: 0.12,
    y: 0.74,
    hitRadius: 0.075,
    behavior: "drift-away",
    driftPx: 28,
    nocturnalFact:
      "Wolves are built for distance — dusk and dark often mean the day’s travel continues in hush.",
    silhouette: "wolf",
  },
  {
    id: "night-moths",
    label: "Moths and insects",
    x: 0.58,
    y: 0.48,
    hitRadius: 0.09,
    behavior: "drift-away",
    driftPx: 22,
    nocturnalFact:
      "Night air over forest openings is rich with moths and other insects — food for bats, owls, and foxes.",
    silhouette: "moths",
  },
];

export const nightCopy = {
  hint: "Drag the beam slowly — or tap “Explore by list” if dragging is hard",
  hintTap: "Tap a name on the discovery trail to meet each night traveler",
  exploreByList: "Explore by list",
  exploringByList: "List explore on",
  trailTitle: "Discovery trail",
  factTitle: "After dark",
  nightVisionOn: "Night vision on",
  nightVisionOff: "Night vision",
  soundOn: "Night sound on",
  soundOff: "Night sound",
  soundMuted: "Sound muted",
  completeTitle: "The night knows you now",
  completeBody:
    "Every quiet traveler on this trail has been found. Rest a moment — the forest keeps its own calm.",
  completeContinue: "Explore again",
  foundPrefix: "Found",
} as const;

export function getNightCreature(id: NightDiscoveryId): NightCreature | undefined {
  return nightCreatures.find((creature) => creature.id === id);
}
