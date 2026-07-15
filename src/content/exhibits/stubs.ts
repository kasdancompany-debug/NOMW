import type { ExhibitContent } from "@/types/content";

function createStubExhibit(
  slug: ExhibitContent["slug"],
  title: string,
  tagline: string,
): ExhibitContent {
  const homeSceneId = `${slug}-home`;

  return {
    slug,
    title,
    tagline,
    homeSceneId,
    idle: { returnToHome: true },
    scenes: [
      {
        id: homeSceneId,
        title,
        subtitle: tagline,
        body: "Interactive scenes will be authored here. Content drives this experience.",
        motion: { respectReducedMotion: true },
      },
    ],
    animalIds: [],
    habitatIds: [],
    media: [],
    meta: {
      version: "0.1.0-mvp",
      updatedAt: "2026-07-15",
      notes: "Structural stub — replace with authored exhibit content.",
    },
  };
}

export const welcomeExhibit = createStubExhibit(
  "welcome",
  "Welcome",
  "Begin your journey through Northern Ontario.",
);

export const forestExhibit = createStubExhibit(
  "forest",
  "Forest",
  "Step into the boreal.",
);

export const waterExhibit = createStubExhibit(
  "water",
  "Water",
  "Lakes, rivers, and wetlands shape life here.",
);

export const skyExhibit = createStubExhibit(
  "sky",
  "Sky",
  "What moves through air above the Shield.",
);

export const nightExhibit = createStubExhibit(
  "night",
  "Night",
  "Listen after dark.",
);

export const seasonsExhibit = createStubExhibit(
  "seasons",
  "Seasons",
  "The year transforms habitats and animals.",
);

export const tracksExhibit = createStubExhibit(
  "tracks",
  "Tracks",
  "Prints and signs tell quiet stories.",
);

export const coexistenceExhibit = createStubExhibit(
  "coexistence",
  "Coexistence",
  "People and wildlife share this landscape.",
);
