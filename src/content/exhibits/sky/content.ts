import type { AnimalId } from "@/types/content";

export type FlightStyle = "soaring" | "gliding" | "flapping" | "diving";

export type SkyMode = "panorama" | "migration" | "flight-styles" | "wing-demo" | "whose-call";

export type SkyBirdPresentation = {
  animalId: AnimalId;
  /** Relative wingspan 0–1 vs widest bird in set (eagle ≈ 1) */
  relativeWingspan: number;
  wingspanLabel: string;
  flightStyle: FlightStyle;
  caption: string;
  /** Soft migration story line for animated path */
  migrationNote: string;
  /** Panorama placement 0–1 */
  x: number;
  y: number;
};

export type MigrationPath = {
  id: string;
  animalId: AnimalId;
  /** Simplified polyline in 0–1 panorama coords */
  points: Array<{ x: number; y: number }>;
  seasonLabel: string;
};

export type WhoseCallChallenge = {
  id: string;
  prompt: string;
  captionHint: string;
  correctAnimalId: AnimalId;
  options: AnimalId[];
};

export const SKY_EXHIBIT_TITLE = "Wings of the North";
export const SKY_EXHIBIT_SUBTITLE = "Flight, call, and seasonal pathways above the Shield";

/** Room-safe call default (eight exhibits sharing air) */
export const SKY_CALL_VOLUME = 0.28;

export const flightStyleCopy: Record<FlightStyle, { title: string; body: string }> = {
  soaring: {
    title: "Soaring",
    body: "Riding rising air with wings held wide — energy saved for watching and waiting.",
  },
  gliding: {
    title: "Gliding",
    body: "A long, quiet coast between flaps — the sky becomes a slope.",
  },
  flapping: {
    title: "Flapping",
    body: "Powered wingbeats that carry bodies through still air and thick weather.",
  },
  diving: {
    title: "Diving",
    body: "A sudden fold toward water or prey — speed borrowed from height.",
  },
};

export const skyBirds: SkyBirdPresentation[] = [
  {
    animalId: "bald-eagle",
    relativeWingspan: 1,
    wingspanLabel: "Among the widest in this sky",
    flightStyle: "soaring",
    caption: "A white head flashing above dark shoreline water.",
    migrationNote: "Some stay; some drift with open water and food.",
    x: 0.72,
    y: 0.28,
  },
  {
    animalId: "great-grey-owl",
    relativeWingspan: 0.72,
    wingspanLabel: "Broad wings for silent forest openings",
    flightStyle: "gliding",
    caption: "A soft shadow listening into snow and spruce.",
    migrationNote: "More wanderer than long migrant — winters can shift the map.",
    x: 0.22,
    y: 0.42,
  },
  {
    animalId: "snowy-owl",
    relativeWingspan: 0.78,
    wingspanLabel: "Wide pale sails of open country",
    flightStyle: "flapping",
    caption: "Arctic brightness perched on winter edges.",
    migrationNote: "Irregular winter visits — never promised, always a wonder.",
    x: 0.48,
    y: 0.22,
  },
  {
    animalId: "common-loon",
    relativeWingspan: 0.55,
    wingspanLabel: "Built for water more than long sky roads",
    flightStyle: "flapping",
    caption: "A lake’s voice with wings that work hard for takeoff.",
    migrationNote: "Open-water seasons draw loons south, then home again.",
    x: 0.38,
    y: 0.62,
  },
  {
    animalId: "sandhill-crane",
    relativeWingspan: 0.88,
    wingspanLabel: "Long arms for wetland highways",
    flightStyle: "soaring",
    caption: "Trumpet travel across marsh and field.",
    migrationNote: "Spring and autumn corridors braid wetland to wetland.",
    x: 0.58,
    y: 0.36,
  },
  {
    animalId: "ruffed-grouse",
    relativeWingspan: 0.28,
    wingspanLabel: "Short bursts through understory",
    flightStyle: "flapping",
    caption: "A sudden thunder out of leaf litter.",
    migrationNote: "Mostly a stay-at-home flier of forest floors.",
    x: 0.16,
    y: 0.7,
  },
  {
    animalId: "canada-goose",
    relativeWingspan: 0.7,
    wingspanLabel: "Strong travelers of the V",
    flightStyle: "flapping",
    caption: "Family lines threading grey weather.",
    migrationNote: "Familiar seasonal sky roads between water and forage.",
    x: 0.84,
    y: 0.48,
  },
];

export const migrationPaths: MigrationPath[] = [
  {
    id: "path-crane",
    animalId: "sandhill-crane",
    seasonLabel: "Spring / autumn wetland corridor",
    points: [
      { x: 0.08, y: 0.72 },
      { x: 0.28, y: 0.5 },
      { x: 0.52, y: 0.38 },
      { x: 0.78, y: 0.3 },
      { x: 0.94, y: 0.22 },
    ],
  },
  {
    id: "path-goose",
    animalId: "canada-goose",
    seasonLabel: "Seasonal V across open sky",
    points: [
      { x: 0.05, y: 0.4 },
      { x: 0.25, y: 0.34 },
      { x: 0.5, y: 0.36 },
      { x: 0.75, y: 0.42 },
      { x: 0.95, y: 0.5 },
    ],
  },
  {
    id: "path-loon",
    animalId: "common-loon",
    seasonLabel: "Open-water season travel",
    points: [
      { x: 0.12, y: 0.58 },
      { x: 0.35, y: 0.55 },
      { x: 0.58, y: 0.6 },
      { x: 0.82, y: 0.66 },
    ],
  },
];

export const whoseCallChallenge: WhoseCallChallenge = {
  id: "sky-call-1",
  prompt: "Whose Call Is It?",
  captionHint: "A bright lake voice — far-carrying, unmistakable across still water.",
  correctAnimalId: "common-loon",
  options: ["common-loon", "sandhill-crane", "canada-goose"],
};

export const skyCopy = {
  swipeHint: "Swipe the sky — or use Look left / Look right — then touch a bird",
  panHintTap: "Use Look left / Look right, or choose a bird by name below",
  panLeft: "Look left",
  panRight: "Look right",
  wingspanTitle: "Wingspan guide",
  wingspanNote: "Full-width guide uses relative scale for feeling.",
  callLabel: "Play call",
  callPlaying: "Call playing",
  callMissing: "Call unavailable",
  callCaptionPrefix: "Caption",
  audioIndicator: "Sound",
  migrationTitle: "Seasonal pathways",
  migrationLead: "Simplified lines — stories of travel, not precise GPS tracks.",
  flightTitle: "Compare flight styles",
  wingDemoTitle: "Slow-motion wingbeat",
  wingDemoLead: "A quiet study of lift — watch the cycle, no sound required.",
  whoseCallTitle: "Whose Call Is It?",
  volumeNote: "Calls play gently — this room shares its air with seven other stations.",
  tryAgain: "Try again",
  matchLabel: "Match",
} as const;

export function getSkyBird(animalId: AnimalId): SkyBirdPresentation | undefined {
  return skyBirds.find((bird) => bird.animalId === animalId);
}
