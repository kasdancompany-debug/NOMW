import type { ExhibitContent } from "@/types/content";
import {
  SEASONS_EXHIBIT_SUBTITLE,
  SEASONS_EXHIBIT_TITLE,
  seasonalStories,
} from "./seasons/content";

const animalIds = seasonalStories.map((story) => story.animalId);

export const seasons: ExhibitContent = {
  slug: "seasons",
  title: SEASONS_EXHIBIT_TITLE,
  tagline: SEASONS_EXHIBIT_SUBTITLE,
  homeSceneId: "seasons-habitat",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "seasons-habitat",
      title: SEASONS_EXHIBIT_TITLE,
      subtitle: SEASONS_EXHIBIT_SUBTITLE,
      body: "Turn the seasonal wheel to watch one Northern Ontario shore transform through the year.",
      animalIds,
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds,
  habitatIds: ["boreal-forest", "shield-lake", "wetland-marsh", "winter-snowpack"],
  media: [],
  meta: {
    version: "0.2.0-four-seasons",
    updatedAt: "2026-07-15",
    notes: "Layered habitat crossfades with SeasonalAnimalStory follow mode.",
  },
};
