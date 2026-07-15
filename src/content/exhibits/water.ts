import type { ExhibitContent } from "@/types/content";

export const water: ExhibitContent = {
  slug: "water",
  title: "Life Beneath the Water",
  tagline: "From shoreline light to river-bottom dark",
  homeSceneId: "water-column",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "water-column",
      title: "Life Beneath the Water",
      subtitle: "From shoreline light to river-bottom dark",
      body: "Drag vertically through shoreline, wetland, surface, shallows, open water, deep water, and river bottom.",
      animalIds: [
        "lake-sturgeon",
        "northern-pike",
        "brook-trout",
        "beaver",
        "river-otter",
        "common-snapping-turtle",
        "common-loon",
      ],
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds: [
    "lake-sturgeon",
    "northern-pike",
    "brook-trout",
    "beaver",
    "river-otter",
    "common-snapping-turtle",
    "common-loon",
  ],
  habitatIds: ["shield-lake", "wetland-marsh", "river-riparian"],
  media: [],
  meta: {
    version: "0.2.0-water-column",
    updatedAt: "2026-07-15",
    notes: "Vertical water-column experience with summer/winter conditions.",
  },
};
