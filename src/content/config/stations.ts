import type { ExhibitSlug } from "@/types/content";
import { EXHIBIT_SLUGS, isExhibitSlug } from "@/types/content";

/**
 * Physical kiosk stations — one build, eight screens.
 * Station IDs match exhibit slugs so URLs stay predictable (`/exhibit/forest`, `?station=forest`).
 */
export type StationId = ExhibitSlug;

export type StationDefinition = {
  id: StationId;
  /** Floor label for staff / setup */
  label: string;
  /** Compact chip text */
  shortLabel: string;
  /** Physical display order on the room floor plan */
  displayNumber: number;
  /** Exhibit route slug (identical to id in this build) */
  exhibitSlug: ExhibitSlug;
};

export const STATIONS: readonly StationDefinition[] = [
  {
    id: "welcome",
    label: "Station 1 — Welcome",
    shortLabel: "Welcome",
    displayNumber: 1,
    exhibitSlug: "welcome",
  },
  {
    id: "forest",
    label: "Station 2 — Giants of the Forest",
    shortLabel: "Forest",
    displayNumber: 2,
    exhibitSlug: "forest",
  },
  {
    id: "water",
    label: "Station 3 — Life Beneath the Water",
    shortLabel: "Water",
    displayNumber: 3,
    exhibitSlug: "water",
  },
  {
    id: "sky",
    label: "Station 4 — Wings of the North",
    shortLabel: "Sky",
    displayNumber: 4,
    exhibitSlug: "sky",
  },
  {
    id: "night",
    label: "Station 5 — The Forest After Dark",
    shortLabel: "Night",
    displayNumber: 5,
    exhibitSlug: "night",
  },
  {
    id: "seasons",
    label: "Station 6 — Four Seasons of Survival",
    shortLabel: "Seasons",
    displayNumber: 6,
    exhibitSlug: "seasons",
  },
  {
    id: "tracks",
    label: "Station 7 — Tracks, Calls and Clues",
    shortLabel: "Tracks",
    displayNumber: 7,
    exhibitSlug: "tracks",
  },
  {
    id: "coexistence",
    label: "Station 8 — Living Together",
    shortLabel: "Coexistence",
    displayNumber: 8,
    exhibitSlug: "coexistence",
  },
] as const;

export const STATION_IDS: readonly StationId[] = STATIONS.map((station) => station.id);

export function isStationId(value: string): value is StationId {
  return isExhibitSlug(value);
}

export function getStation(id: StationId): StationDefinition {
  const found = STATIONS.find((station) => station.id === id);
  if (!found) {
    throw new Error(`Unknown station: ${id}`);
  }
  return found;
}

export function getStationOrNull(id: string): StationDefinition | null {
  if (!isStationId(id)) return null;
  return getStation(id);
}

export function exhibitPathForStation(id: StationId): string {
  return `/exhibit/${id}`;
}

/** Query param used for cold-boot assignment: `/?station=forest` */
export const STATION_QUERY_PARAM = "station";

/** Sanity: stations list tracks EXHIBIT_SLUGS 1:1 */
export function assertStationsCoverExhibits(): void {
  for (const slug of EXHIBIT_SLUGS) {
    if (!STATION_IDS.includes(slug)) {
      throw new Error(`Missing station for exhibit slug: ${slug}`);
    }
  }
}
