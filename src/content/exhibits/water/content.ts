import type { AnimalId } from "@/types/content";

export type WaterZoneId =
  | "shoreline"
  | "wetland"
  | "surface"
  | "shallow"
  | "open-water"
  | "deep"
  | "river-bottom";

export type WaterCondition = "summer" | "winter";

export type WaterMode = "column" | "dam" | "food-chain" | "sturgeon-size";

export type WaterZone = {
  id: WaterZoneId;
  name: string;
  summary: string;
  /** 0–1 position of zone center along the column (0 = top / shoreline) */
  center: number;
  /** Relative slice height of the column */
  height: number;
  summerTint: string;
  winterTint: string;
};

export type WaterAnimalPlacement = {
  animalId: AnimalId;
  zoneId: WaterZoneId;
  /** 0–1 within the full column */
  y: number;
  /** 0–1 across column width */
  x: number;
  blurb: string;
};

export type WaterReveal = {
  id: string;
  kind: "bubble" | "ripple";
  x: number;
  y: number;
  fact: string;
};

export type FoodChainNode = {
  id: string;
  label: string;
  role: "producer" | "consumer" | "top";
  animalId?: AnimalId;
};

export const WATER_EXHIBIT_TITLE = "Life Beneath the Water";
export const WATER_EXHIBIT_SUBTITLE = "From shoreline light to river-bottom dark";

export const waterZones: WaterZone[] = [
  {
    id: "shoreline",
    name: "Shoreline",
    summary: "Rock, root, and the meeting place of land and water.",
    center: 0.06,
    height: 0.1,
    summerTint: "rgba(90, 140, 110, 0.45)",
    winterTint: "rgba(190, 210, 220, 0.35)",
  },
  {
    id: "wetland",
    name: "Wetland",
    summary: "Reeds, soft edges, and nurseries of sound.",
    center: 0.16,
    height: 0.12,
    summerTint: "rgba(50, 110, 95, 0.5)",
    winterTint: "rgba(150, 175, 190, 0.4)",
  },
  {
    id: "surface",
    name: "Surface",
    summary: "Wind-skin and sky mirror — where divers launch and return.",
    center: 0.28,
    height: 0.1,
    summerTint: "rgba(70, 150, 180, 0.35)",
    winterTint: "rgba(210, 225, 235, 0.55)",
  },
  {
    id: "shallow",
    name: "Shallow Water",
    summary: "Sunlit shallows — hunting lanes and quiet travel.",
    center: 0.4,
    height: 0.14,
    summerTint: "rgba(30, 100, 140, 0.55)",
    winterTint: "rgba(100, 140, 165, 0.5)",
  },
  {
    id: "open-water",
    name: "Open Water",
    summary: "The broad room of the lake — cool, deep-looking light.",
    center: 0.56,
    height: 0.16,
    summerTint: "rgba(15, 70, 110, 0.65)",
    winterTint: "rgba(40, 80, 110, 0.7)",
  },
  {
    id: "deep",
    name: "Deep Water",
    summary: "Pressure, dimness, and ancient travelers.",
    center: 0.72,
    height: 0.16,
    summerTint: "rgba(8, 40, 70, 0.8)",
    winterTint: "rgba(12, 35, 55, 0.85)",
  },
  {
    id: "river-bottom",
    name: "River Bottom",
    summary: "Stone beds and slow stories of the current.",
    center: 0.9,
    height: 0.14,
    summerTint: "rgba(25, 35, 40, 0.9)",
    winterTint: "rgba(20, 30, 38, 0.92)",
  },
];

export const waterAnimals: WaterAnimalPlacement[] = [
  {
    animalId: "beaver",
    zoneId: "wetland",
    y: 0.17,
    x: 0.22,
    blurb: "Engineer of ponds — wetlands follow where beavers work.",
  },
  {
    animalId: "common-loon",
    zoneId: "surface",
    y: 0.27,
    x: 0.68,
    blurb: "A signature of northern lakes — diving from the bright skin of water.",
  },
  {
    animalId: "river-otter",
    zoneId: "shallow",
    y: 0.39,
    x: 0.3,
    blurb: "Sleek traveler of shallows, banks, and ice edges.",
  },
  {
    animalId: "common-snapping-turtle",
    zoneId: "shallow",
    y: 0.44,
    x: 0.72,
    blurb: "Ancient shoreline presence in warm-season waters.",
  },
  {
    animalId: "northern-pike",
    zoneId: "open-water",
    y: 0.54,
    x: 0.4,
    blurb: "Ambush green of weed edges and open shallows nearby.",
  },
  {
    animalId: "brook-trout",
    zoneId: "open-water",
    y: 0.6,
    x: 0.75,
    blurb: "Cool, clean water is habitat — a living signal of balance.",
  },
  {
    animalId: "lake-sturgeon",
    zoneId: "deep",
    y: 0.74,
    x: 0.48,
    blurb: "Armoured elder of deep rooms and long time.",
  },
];

export const waterReveals: WaterReveal[] = [
  {
    id: "bubble-1",
    kind: "bubble",
    x: 0.18,
    y: 0.33,
    fact: "Still water can hold a sky — then break into rings when something rises.",
  },
  {
    id: "ripple-1",
    kind: "ripple",
    x: 0.82,
    y: 0.29,
    fact: "A loon’s dive begins as a quiet disappearance from the mirror.",
  },
  {
    id: "bubble-2",
    kind: "bubble",
    x: 0.55,
    y: 0.5,
    fact: "Weed beds are theatres of waiting — pike know the edges.",
  },
  {
    id: "ripple-2",
    kind: "ripple",
    x: 0.25,
    y: 0.68,
    fact: "Deep water is not empty. It is another country of pressure and dark.",
  },
  {
    id: "bubble-3",
    kind: "bubble",
    x: 0.7,
    y: 0.86,
    fact: "River bottoms remember the shape of floods in stone and sand.",
  },
];

export const waterFoodChain: FoodChainNode[] = [
  { id: "plants", label: "Aquatic plants & algae", role: "producer" },
  { id: "insects", label: "Insects & small life", role: "consumer" },
  { id: "trout", label: "Brook Trout", role: "consumer", animalId: "brook-trout" },
  { id: "pike", label: "Northern Pike", role: "top", animalId: "northern-pike" },
  { id: "otter", label: "River Otter", role: "top", animalId: "river-otter" },
];

/** Relative length for sturgeon vs person (visual only). */
export const STURGEON_RELATIVE_LENGTH = 1;
export const HUMAN_RELATIVE_LENGTH = 0.45;

export const waterCopy = {
  dragHint: "Drag up or down to travel the water column",
  summer: "Clear summer water",
  winter: "Under-ice winter",
  damTitle: "Beaver Dam Cutaway",
  damLead: "A dam holds water, softens current, and invites a wetland world.",
  foodTitle: "A Simple Food Chain",
  foodLead: "Energy moves from green light to sleek hunters — one link at a time.",
  sturgeonTitle: "Lake Sturgeon Size",
  sturgeonLead: "An ancient shape — longer than many visitors expect.",
  sizeNote: "Relative silhouettes for feeling, not measuring — confirm figures before floor lock.",
} as const;
