import type { ExhibitContent } from "@/types/content";
import { NIGHT_EXHIBIT_SUBTITLE, NIGHT_EXHIBIT_TITLE, nightCreatures } from "./night/content";

const animalIds = nightCreatures
  .map((creature) => creature.id)
  .filter((id): id is Exclude<typeof id, "night-moths"> => id !== "night-moths");

export const night: ExhibitContent = {
  slug: "night",
  title: NIGHT_EXHIBIT_TITLE,
  tagline: NIGHT_EXHIBIT_SUBTITLE,
  homeSceneId: "night-forest",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "night-forest",
      title: NIGHT_EXHIBIT_TITLE,
      subtitle: NIGHT_EXHIBIT_SUBTITLE,
      body: "Drag a gentle flashlight through the dark forest to discover nocturnal lives.",
      animalIds,
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds,
  habitatIds: ["night-canopy", "boreal-forest", "winter-snowpack"],
  media: [],
  meta: {
    version: "0.2.0-forest-after-dark",
    updatedAt: "2026-07-15",
    notes: "Flashlight discovery with night-vision mode and quiet completion.",
  },
};
