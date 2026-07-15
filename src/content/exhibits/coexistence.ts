import type { ExhibitContent } from "@/types/content";
import {
  COEXISTENCE_EXHIBIT_SUBTITLE,
  COEXISTENCE_EXHIBIT_TITLE,
  coexistenceScenarios,
} from "./coexistence/content";

const animalIds = [
  ...new Set(
    coexistenceScenarios
      .map((scenario) => scenario.wildlifeMoment.animalId)
      .filter((id): id is NonNullable<typeof id> => Boolean(id)),
  ),
];

export const coexistence: ExhibitContent = {
  slug: "coexistence",
  title: COEXISTENCE_EXHIBIT_TITLE,
  tagline: COEXISTENCE_EXHIBIT_SUBTITLE,
  homeSceneId: "coexistence-scenarios",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "coexistence-scenarios",
      title: COEXISTENCE_EXHIBIT_TITLE,
      subtitle: COEXISTENCE_EXHIBIT_SUBTITLE,
      body: "Explore real-world situations and practise hopeful, respectful choices beside wildlife.",
      animalIds,
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds,
  habitatIds: ["boreal-forest", "shield-lake", "wetland-marsh", "river-riparian"],
  media: coexistenceScenarios.flatMap((scenario) => [
    scenario.wildlifeMoment.image,
    ...(scenario.wildlifeMoment.video ? [scenario.wildlifeMoment.video] : []),
  ]),
  meta: {
    version: "0.2.0-living-together",
    updatedAt: "2026-07-15",
    notes:
      "Scenario choices with emergencyContentDisclaimer fields pending wildlife authority review.",
  },
};
