import type { ExhibitContent } from "@/types/content";

export const forest: ExhibitContent = {
  slug: "forest",
  title: "Giants of the Forest",
  tagline: "Meet the great travelers of the boreal",
  homeSceneId: "forest-home",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "forest-home",
      title: "Giants of the Forest",
      subtitle: "Meet the great travelers of the boreal",
      body: "Swipe through Moose, Black Bear, Grey Wolf, Woodland Caribou, White-tailed Deer, and Canada Lynx.",
      animalIds: [
        "moose",
        "black-bear",
        "grey-wolf",
        "woodland-caribou",
        "white-tailed-deer",
        "canada-lynx",
      ],
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds: [
    "moose",
    "black-bear",
    "grey-wolf",
    "woodland-caribou",
    "white-tailed-deer",
    "canada-lynx",
  ],
  habitatIds: ["boreal-forest", "winter-snowpack"],
  media: [],
  meta: {
    version: "0.2.0-forest-giants",
    updatedAt: "2026-07-15",
    notes: "Giants of the Forest interactive experience.",
  },
};
