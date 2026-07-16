import type { AnimalId, ExhibitSlug } from "@/types/content";

export type WelcomeZoneId =
  | "boreal-forest"
  | "great-lakes-shoreline"
  | "rivers-wetlands"
  | "rocky-highlands"
  | "far-northern-tundra";

export type WelcomeScreen =
  | "atlas"
  | "habitat"
  | "meet-animals"
  | "how-big"
  | "explore-room";

export type WelcomeZone = {
  id: WelcomeZoneId;
  name: string;
  shortLabel: string;
  summary: string;
  /** Soft atlas colour for the illustrated map shape */
  fill: string;
  activeFill: string;
  /** SVG path in a 1000×900 viewBox — stylized regions within the landmass */
  path: string;
  labelX: number;
  labelY: number;
  animalIds: AnimalId[];
  atmosphere: "boreal-night" | "deep-lake" | "snow-mist" | "museum-glow";
};

export type ScaleComparison = {
  id: string;
  label: string;
  /** Relative visual weight 0–1 within the comparison set */
  relativeSize: number;
  note: string;
  confidence: "general-knowledge" | "needs-research";
  researchNote?: string;
};

export type RoomStationInvite = {
  slug: Exclude<ExhibitSlug, "welcome">;
  title: string;
  invitation: string;
};

export const WELCOME_HOME_SCREEN: WelcomeScreen = "atlas";

export const welcomeCopy = {
  museumName: "The Northern Ontario Museum of Wonder",
  subtitle: "A living world of forest, water, sky and snow",
  atlasLead:
    "Open the atlas of Northern Ontario — then wander any station in the room as you wish.",
  atlasPrompt: "Touch a habitat on the map to begin.",
  habitatReturn: "Return to map",
  meetAnimalsTitle: "Meet the Animals",
  meetAnimalsLead:
    "Begin with the moose — open a full profile, then meet a few more lives of the north.",
  howBigTitle: "How Big Is the North?",
  howBigLead:
    "Northern Ontario is not a single forest edge — it is a vast living network of land and water.",
  exploreTitle: "Explore the room",
  exploreLead:
    "Every screen opens the same living atlas. Choose a station — guests may move freely from there.",
  exploreCta: "Explore the room",
  roomLabel: "Gallery stations",
} as const;

/**
 * Stylized Northern Ontario land outline (viewBox 1000×900).
 * Illustrative — not GIS-accurate.
 */
export const NORTHERN_ONTARIO_LAND_PATH =
  "M210 210 C280 155 390 130 510 145 C620 158 710 190 760 250 C805 305 820 380 800 450 C785 520 760 580 720 640 C685 690 640 740 560 770 C470 805 370 810 290 775 C220 745 175 680 160 600 C145 520 155 430 175 350 C185 295 195 245 210 210 Z";

/**
 * Habitat regions — drawn as clear geographic bands and clipped to the landmass.
 * Shapes intentionally overspill slightly so seams stay solid after clipping.
 */
export const welcomeZones: WelcomeZone[] = [
  {
    id: "far-northern-tundra",
    name: "Far Northern Tundra",
    shortLabel: "Tundra",
    summary:
      "A colder, more open north — long light, sparse cover, and seasons that arrive with less mercy and more wonder.",
    fill: "rgba(188, 206, 218, 0.72)",
    activeFill: "rgba(228, 238, 244, 0.92)",
    path: "M150 120 H830 V305 H150 Z",
    labelX: 490,
    labelY: 235,
    animalIds: ["woodland-caribou", "snowy-owl", "canada-lynx", "great-grey-owl"],
    atmosphere: "snow-mist",
  },
  {
    id: "rocky-highlands",
    name: "Rocky Highlands",
    shortLabel: "Highlands",
    summary:
      "Granite bones of the Shield — lichen, open rock, and weather-scoured lookouts above lakes and forest.",
    fill: "rgba(122, 112, 98, 0.88)",
    activeFill: "rgba(178, 166, 144, 0.96)",
    path: "M605 300 H840 V620 H605 Z",
    labelX: 715,
    labelY: 450,
    animalIds: ["grey-wolf", "bald-eagle", "red-fox", "white-tailed-deer"],
    atmosphere: "snow-mist",
  },
  {
    id: "boreal-forest",
    name: "Boreal Forest",
    shortLabel: "Forest",
    summary:
      "A sweeping woodland of spruce, pine, and mixed green — the living heart of the Shield, changing with snow and light.",
    fill: "rgba(42, 90, 60, 0.92)",
    activeFill: "rgba(92, 148, 100, 0.98)",
    path: "M140 300 H610 V620 H140 Z",
    labelX: 375,
    labelY: 455,
    animalIds: ["moose", "black-bear", "canada-lynx", "snowshoe-hare", "ruffed-grouse"],
    atmosphere: "boreal-night",
  },
  {
    id: "rivers-wetlands",
    name: "Rivers and Wetlands",
    shortLabel: "Rivers",
    summary:
      "Moving corridors and soft-edged marshes — nurseries of sound, insects, fish, and the builders who reshape water.",
    fill: "rgba(36, 118, 124, 0.9)",
    activeFill: "rgba(82, 184, 190, 0.96)",
    path: "M140 615 H430 V830 H140 Z",
    labelX: 285,
    labelY: 710,
    animalIds: ["beaver", "river-otter", "northern-pike", "brook-trout", "common-snapping-turtle"],
    atmosphere: "deep-lake",
  },
  {
    id: "great-lakes-shoreline",
    name: "Great Lakes Shoreline",
    shortLabel: "Shoreline",
    summary:
      "Where inland seas meet rock and sand — wind-carved coasts, islands, and waters that hold their own weather.",
    fill: "rgba(24, 82, 112, 0.9)",
    activeFill: "rgba(82, 178, 170, 0.96)",
    path: "M425 615 H840 V830 H425 Z",
    labelX: 620,
    labelY: 720,
    animalIds: ["common-loon", "bald-eagle", "lake-sturgeon", "river-otter"],
    atmosphere: "deep-lake",
  },
];

/** Featured animals for the Meet the Animals sequence. */
export const meetAnimalIds: AnimalId[] = ["moose", "grey-wolf", "canada-lynx"];

/**
 * Relative visual comparisons for “How Big Is the North?”
 * Bars teach feeling of scale — not measured trivia.
 */
export const scaleComparisons: ScaleComparison[] = [
  {
    id: "northern-ontario",
    label: "Northern Ontario",
    relativeSize: 1,
    note: "A broad living region of forest, water, rock, and sky.",
    confidence: "general-knowledge",
  },
  {
    id: "lake-superior",
    label: "Lake Superior",
    relativeSize: 0.28,
    note: "One of the planet’s great freshwater seas — still smaller than the land of the north around it.",
    confidence: "general-knowledge",
  },
  {
    id: "familiar-country",
    label: "A familiar country",
    relativeSize: 0.18,
    note: "A reminder of how wide this northern country feels when set beside a place many travellers know.",
    confidence: "general-knowledge",
  },
];

export const roomStations: RoomStationInvite[] = [
  {
    slug: "forest",
    title: "Giants of the Forest",
    invitation: "Many animals call the forest home — meet them up close.",
  },
  {
    slug: "night",
    title: "The Forest After Dark",
    invitation: "Guide a soft beam through the night canopy.",
  },
  {
    slug: "water",
    title: "Life Beneath the Water",
    invitation: "Travel the water column from shoreline light to river-bottom dark.",
  },
  {
    slug: "sky",
    title: "Wings of the North",
    invitation: "Pan the sky — birds, calls, and flight styles.",
  },
  {
    slug: "seasons",
    title: "Four Seasons of Survival",
    invitation: "Turn the year on one Northern Ontario shore.",
  },
  {
    slug: "tracks",
    title: "Tracks, Calls and Clues",
    invitation: "Read the signs animals leave behind.",
  },
  {
    slug: "coexistence",
    title: "Living Together",
    invitation: "Practice gentle choices beside wildlife.",
  },
];

export function getWelcomeZone(id: WelcomeZoneId): WelcomeZone | undefined {
  return welcomeZones.find((zone) => zone.id === id);
}
