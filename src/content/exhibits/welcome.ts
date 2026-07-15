import type { ExhibitContent } from "@/types/content";

/**
 * Welcome exhibit content spine.
 * Interactive atlas copy and zones live in ./welcome/content.ts.
 */
export const welcome: ExhibitContent = {
  slug: "welcome",
  title: "Welcome",
  tagline: "A Living World of Forest, Water, Sky and Snow",
  homeSceneId: "welcome-atlas",
  idle: { returnToHome: true },
  scenes: [
    {
      id: "welcome-atlas",
      title: "Atlas",
      subtitle: "A Living World of Forest, Water, Sky and Snow",
      body: "Touch a habitat on the illustrated map to open Northern Ontario’s living pages.",
      motion: { respectReducedMotion: true },
    },
    {
      id: "welcome-meet-animals",
      title: "Meet the Animals",
      motion: { respectReducedMotion: true },
    },
    {
      id: "welcome-how-big",
      title: "How Big Is the North?",
      motion: { respectReducedMotion: true },
    },
    {
      id: "welcome-explore-room",
      title: "Explore the Room",
      motion: { respectReducedMotion: true },
    },
  ],
  animalIds: [
    "moose",
    "common-loon",
    "beaver",
    "grey-wolf",
    "bald-eagle",
    "woodland-caribou",
  ],
  habitatIds: ["boreal-forest", "wetland-marsh", "rocky-outcrop", "shield-lake"],
  media: [],
  meta: {
    version: "0.2.0-welcome-atlas",
    updatedAt: "2026-07-15",
    notes: "Welcome atlas experience with placeholder illustrated map shapes.",
  },
};
