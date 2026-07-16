import type { AnimalId, Season } from "@/types/content";

/** Exhibit seasons — year-round animals are handled via presence flags. */
export type ExhibitSeason = Exclude<Season, "year-round">;

export type CoatVariant = "summer" | "winter" | "molting" | "default";

export type SeasonalHabitatLook = {
  season: ExhibitSeason;
  label: string;
  daylight: string;
  weather: string;
  water: string;
  vegetation: string;
  /** CSS gradient tokens for sky / canopy / ground / water planes */
  sky: string;
  canopy: string;
  midground: string;
  ground: string;
  waterTone: string;
  weatherOverlay?: string;
  /** Soft vignette / light warmth 0–1 */
  light: number;
};

export type SeasonChapter = {
  season: ExhibitSeason;
  present: boolean;
  coat: CoatVariant;
  behavior: string;
  blurb: string;
  /** Placement when present — 0–1 */
  x: number;
  y: number;
};

export type SeasonalAnimalStoryData = {
  animalId: AnimalId;
  theme: string;
  chapters: Record<ExhibitSeason, SeasonChapter>;
};

export const SEASONS_EXHIBIT_TITLE = "Four Seasons of Survival";
export const SEASONS_EXHIBIT_SUBTITLE =
  "One Northern Ontario shore — remade by thaw, green, gold, and ice";

export const EXHIBIT_SEASONS: ExhibitSeason[] = ["spring", "summer", "autumn", "winter"];

export const seasonLabels: Record<ExhibitSeason, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export const habitatLooks: Record<ExhibitSeason, SeasonalHabitatLook> = {
  spring: {
    season: "spring",
    label: "Spring thaw",
    daylight: "Longer light returns; mornings still hold a chill.",
    weather: "Soft rain and mist along the shoreline.",
    water: "Ice edges retreat — open water widens.",
    vegetation: "Buds and first green lace the spruce edge.",
    sky: "linear-gradient(180deg,#9ec4e0 0%,#6a92b0 45%,#4a6f88 100%)",
    canopy: "linear-gradient(180deg,transparent 0%,rgba(70,110,70,0.25) 40%,rgba(40,70,45,0.55) 100%)",
    midground: "rgba(90,130,70,0.45)",
    ground: "linear-gradient(180deg,#5a6e4a 0%,#3e4a36 100%)",
    waterTone: "linear-gradient(180deg,rgba(120,170,200,0.75),rgba(50,90,120,0.9))",
    weatherOverlay: "linear-gradient(180deg,rgba(200,220,230,0.2),transparent 50%)",
    light: 0.72,
  },
  summer: {
    season: "summer",
    label: "High summer",
    daylight: "Long bright days over shoreline water.",
    weather: "Warm air; light clouds drift without hurry.",
    water: "Open water full and reflective.",
    vegetation: "Deep green canopy and leafy understory.",
    sky: "linear-gradient(180deg,#6eb0e0 0%,#3d7fb0 42%,#2a5a7a 100%)",
    canopy: "linear-gradient(180deg,transparent 0%,rgba(40,100,55,0.35) 35%,rgba(20,70,35,0.7) 100%)",
    midground: "rgba(50,120,55,0.55)",
    ground: "linear-gradient(180deg,#4a6a38 0%,#2f4428 100%)",
    waterTone: "linear-gradient(180deg,rgba(70,150,190,0.8),rgba(30,80,110,0.95))",
    light: 0.92,
  },
  autumn: {
    season: "autumn",
    label: "Autumn turn",
    daylight: "Tilted light — gold hours lengthen.",
    weather: "Cool air; scattered leaves ride the wind.",
    water: "Still water darkens under cooler skies.",
    vegetation: "Gold, copper, and fading green along the shore.",
    sky: "linear-gradient(180deg,#d4a878 0%,#8a6a58 40%,#4a5060 100%)",
    canopy: "linear-gradient(180deg,transparent 0%,rgba(160,100,40,0.35) 40%,rgba(90,50,30,0.65) 100%)",
    midground: "rgba(160,90,40,0.5)",
    ground: "linear-gradient(180deg,#8a6a40 0%,#4a3a28 100%)",
    waterTone: "linear-gradient(180deg,rgba(90,120,140,0.75),rgba(35,55,70,0.92))",
    weatherOverlay: "linear-gradient(120deg,transparent 40%,rgba(200,140,60,0.12) 100%)",
    light: 0.62,
  },
  winter: {
    season: "winter",
    label: "Winter hold",
    daylight: "Short pale light across white ground.",
    weather: "Snow settles; air stays sharp and clear.",
    water: "Ice seals the lake — life continues below.",
    vegetation: "Evergreen dark against snow and bare hardwood.",
    sky: "linear-gradient(180deg,#c8d4e0 0%,#8a9aac 40%,#4a5a6a 100%)",
    canopy: "linear-gradient(180deg,transparent 0%,rgba(40,60,55,0.2) 45%,rgba(20,35,40,0.55) 100%)",
    midground: "rgba(200,215,225,0.55)",
    ground: "linear-gradient(180deg,#e8eef4 0%,#b8c4d0 55%,#6a7888 100%)",
    waterTone: "linear-gradient(180deg,rgba(210,225,235,0.92),rgba(150,175,195,0.95))",
    weatherOverlay: "linear-gradient(180deg,rgba(255,255,255,0.25),transparent 45%)",
    light: 0.48,
  },
};

export const seasonalStories: SeasonalAnimalStoryData[] = [
  {
    animalId: "black-bear",
    theme: "Hibernation and the quiet year",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Emerging hunger",
        blurb: "Bears leave winter dens lean and ready to find early food along edges and shores.",
        x: 0.22,
        y: 0.62,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "Foraging widely",
        blurb: "Long days mean long feeding — building fat before the light shortens again.",
        x: 0.28,
        y: 0.58,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Hyperphagia",
        blurb: "Appetite peaks. Every berry, root, and shore meal matters for the months ahead.",
        x: 0.24,
        y: 0.6,
      },
      winter: {
        season: "winter",
        present: false,
        coat: "default",
        behavior: "Denning / hibernation",
        blurb: "Above snow, the bear is largely out of sight — metabolism slowed in a carefully chosen den.",
        x: 0.18,
        y: 0.7,
      },
    },
  },
  {
    animalId: "snowshoe-hare",
    theme: "Coat changes with the snow line",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "molting",
        behavior: "Coat in transition",
        blurb: "White patches give way to brown as snow retreats — timing the molt with the landscape.",
        x: 0.58,
        y: 0.68,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "summer",
        behavior: "Brown camouflage",
        blurb: "A summer coat matches soil, stem, and shade in the understory.",
        x: 0.55,
        y: 0.7,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "molting",
        behavior: "Whitening begins",
        blurb: "As nights cool, the coat begins its turn toward winter white.",
        x: 0.6,
        y: 0.68,
      },
      winter: {
        season: "winter",
        present: true,
        coat: "winter",
        behavior: "White on snow",
        blurb: "Wide feet and a white coat help the hare move and hide on deep winter snow.",
        x: 0.52,
        y: 0.72,
      },
    },
  },
  {
    animalId: "canada-goose",
    theme: "Bird migration on the year-wheel",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Return and nest",
        blurb: "Geese follow open water and green forage north — nesting near wetland edges.",
        x: 0.72,
        y: 0.42,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "Raising young",
        blurb: "Family groups work the shoreline meadows through the long bright season.",
        x: 0.68,
        y: 0.48,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Staging to leave",
        blurb: "V formations gather — the sky road turns south as frost approaches.",
        x: 0.78,
        y: 0.36,
      },
      winter: {
        season: "winter",
        present: false,
        coat: "default",
        behavior: "Away on migration",
        blurb: "Most are gone from this shore — their winter story plays out on other waters.",
        x: 0.8,
        y: 0.3,
      },
    },
  },
  {
    animalId: "moose",
    theme: "Winter movement and browse",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Shoreline browsing",
        blurb: "Thaw opens soft ground and early plants along lakes and marshes.",
        x: 0.38,
        y: 0.55,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "Aquatic feeding",
        blurb: "Moose often use water and wetland edges for cool and forage.",
        x: 0.42,
        y: 0.58,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Rut and range",
        blurb: "Autumn movement can widen — energy and attention shift with the season.",
        x: 0.35,
        y: 0.56,
      },
      winter: {
        season: "winter",
        present: true,
        coat: "default",
        behavior: "Deep-snow travel",
        blurb: "Long legs and a dense coat suit yards and trails where snow slows smaller travelers.",
        x: 0.32,
        y: 0.6,
      },
    },
  },
  {
    animalId: "beaver",
    theme: "Food storage under ice-to-come",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Lodge upkeep",
        blurb: "Open water returns — beavers repair and reshape their engineered shore.",
        x: 0.84,
        y: 0.66,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "Building & cutting",
        blurb: "Woody stems and shoreline work fill the bright months.",
        x: 0.8,
        y: 0.64,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Food cache",
        blurb: "Branches are stored underwater near the lodge — a pantry beneath winter ice.",
        x: 0.82,
        y: 0.68,
      },
      winter: {
        season: "winter",
        present: true,
        coat: "default",
        behavior: "Under-ice pantry",
        blurb: "From the lodge, beavers reach cached food beneath the sealed ice.",
        x: 0.86,
        y: 0.7,
      },
    },
  },
  {
    animalId: "canada-lynx",
    theme: "Lynx and hare — a linked winter story",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Forest stealth",
        blurb: "Lynx stay soft-footed in the spring woods as hare coats also change.",
        x: 0.16,
        y: 0.48,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "Hunting the thicket",
        blurb: "Green cover hides predator and prey — both are present, often unseen.",
        x: 0.14,
        y: 0.5,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Tracking hare",
        blurb: "As hare begin to whiten, lynx keep reading the same forest trails.",
        x: 0.18,
        y: 0.52,
      },
      winter: {
        season: "winter",
        present: true,
        coat: "default",
        behavior: "Snow hunt",
        blurb: "Wide feet on snow — lynx and hare share a winter stage of chase and escape.",
        x: 0.2,
        y: 0.54,
      },
    },
  },
  {
    animalId: "lake-sturgeon",
    theme: "Fish beneath winter ice",
    chapters: {
      spring: {
        season: "spring",
        present: true,
        coat: "default",
        behavior: "Open-water season",
        blurb: "As ice leaves, sturgeon remain a deep, long-lived presence in Shield waters.",
        x: 0.64,
        y: 0.82,
      },
      summer: {
        season: "summer",
        present: true,
        coat: "default",
        behavior: "River & lake depth",
        blurb: "Warm months still keep sturgeon mostly below the visitor’s casual glance.",
        x: 0.66,
        y: 0.84,
      },
      autumn: {
        season: "autumn",
        present: true,
        coat: "default",
        behavior: "Cooling waters",
        blurb: "The water column cools; sturgeon continue their underwater year.",
        x: 0.62,
        y: 0.83,
      },
      winter: {
        season: "winter",
        present: true,
        coat: "default",
        behavior: "Life under ice",
        blurb: "Ice closes the surface — beneath it, fish keep the quiet winter of the lake.",
        x: 0.65,
        y: 0.86,
      },
    },
  },
];

export const seasonsCopy = {
  wheelHint: "Touch a season or drag through the year",
  followHint: "Choose an animal to follow through all four seasons",
  followLabel: "Follow across seasons",
  stopFollow: "Stop following",
  coatNote: "Coat",
  behaviorNote: "Behaviour",
  absentNote: "Not visible this season",
  relationTitle: "Lynx & hare",
  relationBody:
    "In winter especially, wide feet and white coats tell a linked story of hunt and hide on snow.",
  habitatNote: "Habitat notes",
} as const;

export function getSeasonalStory(animalId: AnimalId): SeasonalAnimalStoryData | undefined {
  return seasonalStories.find((story) => story.animalId === animalId);
}

export function seasonIndex(season: ExhibitSeason): number {
  return EXHIBIT_SEASONS.indexOf(season);
}

export function seasonFromProgress(progress: number): ExhibitSeason {
  const clamped = Math.min(0.999, Math.max(0, progress));
  return EXHIBIT_SEASONS[Math.floor(clamped * EXHIBIT_SEASONS.length)]!;
}

export function progressFromSeason(season: ExhibitSeason): number {
  const i = seasonIndex(season);
  return (i + 0.5) / EXHIBIT_SEASONS.length;
}
