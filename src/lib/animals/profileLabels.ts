import type { ConservationStatus, Season, TimeOfDay } from "@/types/content";

export function formatSeasonList(seasons: Season[]): string {
  if (seasons.includes("year-round")) return "Year-round";
  return seasons
    .map((season) => season.charAt(0).toUpperCase() + season.slice(1))
    .join(" · ");
}

export function formatTimeList(times: TimeOfDay[]): string {
  return times
    .map((time) => time.charAt(0).toUpperCase() + time.slice(1))
    .join(" · ");
}

export function formatConservationStatus(status: ConservationStatus): string {
  switch (status) {
    case "needs-research":
      return "Under review";
    case "not-evaluated-placeholder":
      return "Not evaluated yet";
    case "least-concern-placeholder":
      return "Least concern";
    case "special-concern-placeholder":
      return "Special concern";
    case "threatened-placeholder":
      return "Threatened";
    case "endangered-placeholder":
      return "Endangered";
    case "extirpated-placeholder":
      return "Extirpated";
    default:
      return "Under review";
  }
}

/** Soft relative height cue — aligned with forest shoulder-vs-human scale (human = 1). */
export function relativeHeightForAnimal(animalId: string, group: string): number {
  const known: Record<string, number> = {
    moose: 1.15,
    "woodland-caribou": 0.65,
    "white-tailed-deer": 0.56,
    "black-bear": 0.53,
    "grey-wolf": 0.47,
    "canada-lynx": 0.32,
    "red-fox": 0.28,
    beaver: 0.22,
    "river-otter": 0.24,
    "snowshoe-hare": 0.18,
    "bald-eagle": 0.45,
    "sandhill-crane": 0.7,
    "great-grey-owl": 0.4,
    "common-loon": 0.35,
    "lake-sturgeon": 0.5,
    "northern-pike": 0.42,
  };
  if (known[animalId] != null) return known[animalId]!;
  if (group === "bird") return 0.36;
  if (group === "fish") return 0.4;
  if (group === "reptile") return 0.3;
  return 0.5;
}
