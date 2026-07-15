import { createPlaceholderMedia } from "@/content/media/placeholders";
import type { AnimalId, Habitat, HabitatId } from "@/types/content";

function habitatMedia(id: HabitatId, name: string) {
  return {
    ambientImage: createPlaceholderMedia({
      id: `${id}-ambient-image`,
      kind: "image",
      folder: "habitats",
      filename: `${id}-ambient`,
      label: `${name} ambient still`,
      alt: `Placeholder ambient image for ${name}`,
    }),
    ambientVideo: createPlaceholderMedia({
      id: `${id}-ambient-video`,
      kind: "video",
      folder: "video",
      filename: `${id}-ambient-loop`,
      label: `${name} ambient video`,
      loop: true,
      poster: `/media/habitats/placeholders/${id}-ambient.PLACEHOLDER.webp`,
    }),
    ambientAudio: createPlaceholderMedia({
      id: `${id}-ambient-audio`,
      kind: "audio",
      folder: "ambience",
      filename: `${id}-ambient`,
      label: `${name} ambient audio`,
      loop: true,
      volume: 0.22,
    }),
  };
}

/**
 * Shared habitat catalog. animalIds are filled after the animal catalog loads
 * via `linkHabitatsToAnimals` to avoid circular authorship drift.
 */
export const habitatDefinitions: Omit<Habitat, "animalIds">[] = [
  {
    id: "boreal-forest",
    name: "Boreal forest",
    summary:
      "A vast northern woodland of spruce, fir, pine, and mixed stands — a living weave of canopy, understory, and shadowed ground.",
    regionNote: "Across much of Northern Ontario on and beyond the Canadian Shield",
    typicalSeasons: ["year-round"],
    media: habitatMedia("boreal-forest", "Boreal forest"),
    captions: ["Placeholder caption — boreal forest atmosphere"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "shield-lake",
    name: "Shield lake",
    summary:
      "Deep, clear, and wind-brushed lakes set among granite and forest — cold water realms that shape life above and below the surface.",
    regionNote: "Lakes of the Canadian Shield in Northern Ontario",
    typicalSeasons: ["year-round"],
    media: habitatMedia("shield-lake", "Shield lake"),
    captions: ["Placeholder caption — shield lake"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "wetland-marsh",
    name: "Wetland & marsh",
    summary:
      "Reeds, shallow water, and soft edges where land and water trade places — nurseries of sound, insects, and quiet hunters.",
    regionNote: "Marshes, fens, and wetland margins across Northern Ontario",
    typicalSeasons: ["spring", "summer", "autumn"],
    media: habitatMedia("wetland-marsh", "Wetland & marsh"),
    captions: ["Placeholder caption — wetland"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "river-riparian",
    name: "River & riparian",
    summary:
      "Flowing corridors and vegetated banks — travel routes for fish, mammals, and the stories written in mud and snow.",
    regionNote: "Rivers and stream edges of Northern Ontario",
    typicalSeasons: ["year-round"],
    media: habitatMedia("river-riparian", "River & riparian"),
    captions: ["Placeholder caption — river corridor"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "rocky-outcrop",
    name: "Rocky outcrop & shoreline",
    summary:
      "Granite shelves, lichen, and open rock where weather and water carve a harder kind of beauty.",
    regionNote: "Exposed rock and shorelines of the Shield",
    typicalSeasons: ["year-round"],
    media: habitatMedia("rocky-outcrop", "Rocky outcrop & shoreline"),
    captions: ["Placeholder caption — rocky shoreline"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "open-sky",
    name: "Open sky",
    summary:
      "Thermal lift, migrating lanes, and the wide blue above forest and water — a habitat measured in air.",
    regionNote: "Airspace above Northern Ontario landscapes",
    typicalSeasons: ["year-round"],
    media: habitatMedia("open-sky", "Open sky"),
    captions: ["Placeholder caption — open sky"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "night-canopy",
    name: "Night canopy",
    summary:
      "After dusk the forest changes keys — eyeshine, wingbeats, and soft footfalls in the dark.",
    regionNote: "Nocturnal forest and edge habitats in Northern Ontario",
    typicalSeasons: ["year-round"],
    media: habitatMedia("night-canopy", "Night canopy"),
    captions: ["Placeholder caption — night forest"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
  {
    id: "winter-snowpack",
    name: "Winter snowpack",
    summary:
      "Snow remakes the ground: insulation, trails, and a white stage where tracks become sentences.",
    regionNote: "Snow-covered Northern Ontario forests and clearings",
    typicalSeasons: ["winter"],
    media: habitatMedia("winter-snowpack", "Winter snowpack"),
    captions: ["Placeholder caption — winter snowpack"],
    attribution: "Placeholder habitat media",
    enabled: true,
  },
];

export function buildHabitats(animalIdsByHabitat: Record<HabitatId, AnimalId[]>): Habitat[] {
  return habitatDefinitions.map((habitat) => ({
    ...habitat,
    animalIds: animalIdsByHabitat[habitat.id] ?? [],
  }));
}
