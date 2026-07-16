import type { StationId } from "@/content/config/stations";

export type StationMaturity = "cinematic" | "mvp" | "scaffold";

export type StationStudioMeta = {
  id: StationId;
  focus: string;
  maturity: StationMaturity;
  maturityLabel: string;
  nextEffort: string;
};

/**
 * Honest development map — where polish energy should go next.
 */
export const STATION_STUDIO_META: StationStudioMeta[] = [
  {
    id: "welcome",
    focus: "Atlas home — brand, map, invite into the room",
    maturity: "mvp",
    maturityLabel: "MVP atlas",
    nextEffort: "Stronger first viewport + clearer path into live stations",
  },
  {
    id: "forest",
    focus: "Giants of the Forest — cinematic explore, compare, profiles",
    maturity: "cinematic",
    maturityLabel: "Cinematic lead",
    nextEffort: "Curator media + remaining call recordings",
  },
  {
    id: "water",
    focus: "Life Beneath the Water — depth / column exploration",
    maturity: "scaffold",
    maturityLabel: "Scaffold",
    nextEffort: "Apply forest-level visual language to the water column",
  },
  {
    id: "sky",
    focus: "Wings of the North — panorama, calls, flight compare",
    maturity: "scaffold",
    maturityLabel: "Scaffold",
    nextEffort: "Bird hero stage + call UX polish",
  },
  {
    id: "night",
    focus: "The Forest After Dark — beam / night discovery",
    maturity: "mvp",
    maturityLabel: "MVP night",
    nextEffort: "Tighter creature reveals + quieter chrome",
  },
  {
    id: "seasons",
    focus: "Four Seasons of Survival — year turntable",
    maturity: "scaffold",
    maturityLabel: "Scaffold",
    nextEffort: "Seasonal landscape plates + one clear story arc",
  },
  {
    id: "tracks",
    focus: "Tracks, Calls and Clues — detective interactions",
    maturity: "scaffold",
    maturityLabel: "Scaffold",
    nextEffort: "Clue visuals + one flawless challenge flow",
  },
  {
    id: "coexistence",
    focus: "Living Together — shared-landscape scenarios",
    maturity: "scaffold",
    maturityLabel: "Scaffold",
    nextEffort: "Scenario framing + approved coexistence copy",
  },
];

export const STUDIO_SESSION_KEY = "nomow.studio.enabled";

export function isStudioSessionEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STUDIO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setStudioSessionEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) window.sessionStorage.setItem(STUDIO_SESSION_KEY, "1");
    else window.sessionStorage.removeItem(STUDIO_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
