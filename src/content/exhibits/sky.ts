import type { ExhibitContent } from "@/types/content";
import { SKY_EXHIBIT_SUBTITLE, SKY_EXHIBIT_TITLE, skyBirds } from "./sky/content";

const animalIds = skyBirds.map((bird) => bird.animalId);

export const sky: ExhibitContent = {
  slug: "sky",
  title: SKY_EXHIBIT_TITLE,
  tagline: SKY_EXHIBIT_SUBTITLE,
  homeSceneId: "sky-panorama",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "sky-panorama",
      title: SKY_EXHIBIT_TITLE,
      subtitle: SKY_EXHIBIT_SUBTITLE,
      body: "Swipe the canopy panorama, then touch a bird for wingspan, call captions, and flight stories.",
      animalIds,
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds,
  habitatIds: ["open-sky", "boreal-forest", "wetland-marsh", "shield-lake"],
  media: [],
  meta: {
    version: "0.2.0-wings-of-the-north",
    updatedAt: "2026-07-15",
    notes: "Wings of the North panorama with migration, flight styles, and Whose Call.",
  },
};
