import type { ExhibitContent } from "@/types/content";
import { TRACKS_EXHIBIT_SUBTITLE, TRACKS_EXHIBIT_TITLE, tracksChallenges } from "./tracks/content";

const animalIds = [
  ...new Set(
    tracksChallenges.flatMap((challenge) => [
      challenge.correctAnimalId,
      ...challenge.distractorAnimalIds,
    ]),
  ),
];

export const tracks: ExhibitContent = {
  slug: "tracks",
  title: TRACKS_EXHIBIT_TITLE,
  tagline: TRACKS_EXHIBIT_SUBTITLE,
  homeSceneId: "tracks-detective",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "tracks-detective",
      title: TRACKS_EXHIBIT_TITLE,
      subtitle: TRACKS_EXHIBIT_SUBTITLE,
      body: "Match animals to footprints, calls, fur, shelters, feeding signs, and silhouettes.",
      animalIds,
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds,
  habitatIds: ["boreal-forest", "winter-snowpack", "shield-lake", "wetland-marsh"],
  media: [],
  meta: {
    version: "0.2.0-tracks-clues",
    updatedAt: "2026-07-15",
    notes: "Data-driven challenge engine with session-only scoring.",
  },
};
