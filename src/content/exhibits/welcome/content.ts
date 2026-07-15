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
  /** SVG path in a 1000×900 viewBox — stylized, not cartographic */
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
  /** Highlighted in the three-station visual MVP */
  mvpFeatured?: boolean;
};

export const WELCOME_HOME_SCREEN: WelcomeScreen = "atlas";

export const welcomeCopy = {
  museumName: "The Northern Ontario Museum of Wonder",
  subtitle: "A Living World of Forest, Water, Sky and Snow",
  atlasPrompt: "Touch a habitat on the map to open that page of the atlas.",
  habitatReturn: "Return to map",
  meetAnimalsTitle: "Meet the Animals",
  meetAnimalsLead:
    "Begin with the moose — open a full profile, then meet a few more lives of the north.",
  howBigTitle: "How Big Is the North?",
  howBigLead:
    "Northern Ontario is not a single forest edge — it is a vast living network of land and water.",
  exploreTitle: "This demonstration room",
  exploreLead:
    "Three stations show how the full gallery will feel — Welcome, Forest, and Night. More doors open when the room expands.",
  mvpRibbon: "Visual MVP · Welcome · Forest · Night",
} as const;

/**
 * Stylized Northern Ontario atlas zones.
 * Paths are illustrative placeholders — not GIS-accurate boundaries.
 */
export const welcomeZones: WelcomeZone[] = [
  {
    id: "boreal-forest",
    name: "Boreal Forest",
    shortLabel: "Forest",
    summary:
      "A sweeping woodland of spruce, pine, and mixed green — the living heart of the Shield, changing with snow and light.",
    fill: "rgba(42, 74, 56, 0.72)",
    activeFill: "rgba(111, 143, 94, 0.9)",
    path: "M210,160 C280,120 360,110 430,130 C520,155 580,200 610,270 C640,340 620,410 560,455 C490,510 400,530 320,510 C240,490 190,430 175,350 C160,270 170,200 210,160 Z",
    labelX: 360,
    labelY: 320,
    animalIds: ["moose", "black-bear", "canada-lynx", "snowshoe-hare", "ruffed-grouse"],
    atmosphere: "boreal-night",
  },
  {
    id: "great-lakes-shoreline",
    name: "Great Lakes Shoreline",
    shortLabel: "Shoreline",
    summary:
      "Where inland seas meet rock and sand — wind-carved coasts, islands, and waters that hold their own weather.",
    fill: "rgba(20, 58, 82, 0.75)",
    activeFill: "rgba(94, 184, 168, 0.85)",
    path: "M520,520 C600,500 690,510 760,560 C820,600 850,670 820,730 C780,800 680,820 600,790 C540,765 510,700 515,630 C520,575 520,540 520,520 Z",
    labelX: 680,
    labelY: 660,
    animalIds: ["common-loon", "bald-eagle", "lake-sturgeon", "river-otter"],
    atmosphere: "deep-lake",
  },
  {
    id: "rivers-wetlands",
    name: "Rivers and Wetlands",
    shortLabel: "Rivers",
    summary:
      "Moving corridors and soft-edged marshes — nurseries of sound, insects, fish, and the builders who reshape water.",
    fill: "rgba(35, 90, 100, 0.7)",
    activeFill: "rgba(90, 170, 190, 0.88)",
    path: "M180,480 C250,460 320,470 380,510 C430,545 450,600 420,650 C380,710 300,730 230,700 C170,675 145,600 155,540 C162,505 170,490 180,480 Z",
    labelX: 280,
    labelY: 580,
    animalIds: ["beaver", "river-otter", "northern-pike", "brook-trout", "common-snapping-turtle"],
    atmosphere: "deep-lake",
  },
  {
    id: "rocky-highlands",
    name: "Rocky Highlands",
    shortLabel: "Highlands",
    summary:
      "Granite bones of the Shield — lichen, open rock, and weather-scoured lookouts above lakes and forest.",
    fill: "rgba(90, 88, 82, 0.7)",
    activeFill: "rgba(170, 160, 140, 0.88)",
    path: "M640,180 C720,160 800,175 850,230 C890,280 880,350 830,390 C770,440 680,445 620,400 C570,360 560,290 590,230 C610,200 625,188 640,180 Z",
    labelX: 730,
    labelY: 300,
    animalIds: ["grey-wolf", "bald-eagle", "red-fox", "white-tailed-deer"],
    atmosphere: "snow-mist",
  },
  {
    id: "far-northern-tundra",
    name: "Far Northern Tundra",
    shortLabel: "Tundra",
    summary:
      "A colder, more open north — long light, sparse cover, and seasons that arrive with less mercy and more wonder.",
    fill: "rgba(180, 195, 205, 0.35)",
    activeFill: "rgba(238, 243, 246, 0.55)",
    path: "M300,40 C400,20 520,25 620,55 C700,80 740,120 720,160 C680,150 600,130 500,120 C400,110 320,115 280,130 C270,90 280,55 300,40 Z",
    labelX: 500,
    labelY: 95,
    animalIds: ["woodland-caribou", "snowy-owl", "canada-lynx", "great-grey-owl"],
    atmosphere: "snow-mist",
  },
];

/** Featured animals for the Meet the Animals sequence (MVP focuses presence + one deep profile). */
export const meetAnimalIds: AnimalId[] = ["moose", "grey-wolf", "canada-lynx"];

/**
 * Visual comparisons for “How Big Is the North?”
 * Exact figures marked needs-research — visuals teach relative scale, not trivia scores.
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
    label: "Lake Superior (for sense of scale)",
    relativeSize: 0.28,
    note: "One of the planet’s great freshwater seas — still smaller than the land of the north around it.",
    confidence: "needs-research",
    researchNote: "Confirm area comparisons with curator-approved figures before floor lock.",
  },
  {
    id: "familiar-country",
    label: "A familiar country silhouette",
    relativeSize: 0.18,
    note: "[NEEDS RESEARCH] Replace with an approved country/region comparison once numbers are verified.",
    confidence: "needs-research",
    researchNote: "Do not present invented square-kilometre claims.",
  },
];

export const roomStations: RoomStationInvite[] = [
  {
    slug: "forest",
    title: "Giants of the Forest",
    invitation: "Swipe boreal giants, open a profile, and compare true scale.",
    mvpFeatured: true,
  },
  {
    slug: "night",
    title: "The Forest After Dark",
    invitation: "Guide a soft beam through the night canopy.",
    mvpFeatured: true,
  },
  {
    slug: "water",
    title: "Water",
    invitation: "Coming with the full room — lakes, rivers, and wetlands.",
  },
  {
    slug: "sky",
    title: "Sky",
    invitation: "Coming with the full room — wings and weather.",
  },
  {
    slug: "seasons",
    title: "Seasons",
    invitation: "Coming with the full room — the turning year.",
  },
  {
    slug: "tracks",
    title: "Tracks",
    invitation: "Coming with the full room — prints and signs.",
  },
  {
    slug: "coexistence",
    title: "Coexistence",
    invitation: "Coming with the full room — sharing the landscape.",
  },
];

export function getWelcomeZone(id: WelcomeZoneId): WelcomeZone | undefined {
  return welcomeZones.find((zone) => zone.id === id);
}
