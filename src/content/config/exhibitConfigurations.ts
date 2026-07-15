import type { ExhibitConfiguration } from "@/types/content";

/**
 * Which animals/habitats each exhibit features.
 * Scene composition still lives in exhibit content stubs.
 */
export const exhibitConfigurations: ExhibitConfiguration[] = [
  {
    slug: "welcome",
    title: "Welcome",
    tagline: "Begin your journey through Northern Ontario.",
    featuredAnimalIds: ["moose", "common-loon", "beaver"],
    featuredHabitatIds: ["boreal-forest", "shield-lake"],
    enabled: true,
  },
  {
    slug: "forest",
    title: "Forest",
    tagline: "Step into the boreal.",
    featuredAnimalIds: [
      "moose",
      "black-bear",
      "canada-lynx",
      "woodland-caribou",
      "snowshoe-hare",
      "ruffed-grouse",
      "northern-flying-squirrel",
    ],
    featuredHabitatIds: ["boreal-forest", "winter-snowpack", "night-canopy"],
    enabled: true,
  },
  {
    slug: "water",
    title: "Water",
    tagline: "Lakes, rivers, and wetlands shape life here.",
    featuredAnimalIds: [
      "beaver",
      "river-otter",
      "lake-sturgeon",
      "northern-pike",
      "brook-trout",
      "common-snapping-turtle",
      "common-loon",
    ],
    featuredHabitatIds: ["shield-lake", "wetland-marsh", "river-riparian"],
    enabled: true,
  },
  {
    slug: "sky",
    title: "Sky",
    tagline: "What moves through air above the Shield.",
    featuredAnimalIds: [
      "bald-eagle",
      "sandhill-crane",
      "common-loon",
      "little-brown-bat",
    ],
    featuredHabitatIds: ["open-sky", "shield-lake", "wetland-marsh"],
    enabled: true,
  },
  {
    slug: "night",
    title: "Night",
    tagline: "Listen after dark.",
    featuredAnimalIds: [
      "great-grey-owl",
      "snowy-owl",
      "little-brown-bat",
      "northern-flying-squirrel",
      "grey-wolf",
      "canada-lynx",
    ],
    featuredHabitatIds: ["night-canopy", "boreal-forest", "open-sky"],
    enabled: true,
  },
  {
    slug: "seasons",
    title: "Seasons",
    tagline: "The year transforms habitats and animals.",
    featuredAnimalIds: [
      "snowshoe-hare",
      "moose",
      "sandhill-crane",
      "snowy-owl",
      "black-bear",
    ],
    featuredHabitatIds: ["winter-snowpack", "boreal-forest", "wetland-marsh"],
    enabled: true,
  },
  {
    slug: "tracks",
    title: "Tracks",
    tagline: "Prints and signs tell quiet stories.",
    featuredAnimalIds: [
      "moose",
      "grey-wolf",
      "red-fox",
      "white-tailed-deer",
      "snowshoe-hare",
      "river-otter",
    ],
    featuredHabitatIds: ["winter-snowpack", "boreal-forest", "river-riparian"],
    enabled: true,
  },
  {
    slug: "coexistence",
    title: "Coexistence",
    tagline: "People and wildlife share this landscape.",
    featuredAnimalIds: [
      "black-bear",
      "moose",
      "woodland-caribou",
      "common-loon",
      "little-brown-bat",
      "common-snapping-turtle",
    ],
    featuredHabitatIds: ["boreal-forest", "shield-lake", "river-riparian"],
    enabled: true,
  },
];

export function getExhibitConfiguration(slug: string): ExhibitConfiguration | undefined {
  return exhibitConfigurations.find((config) => config.slug === slug);
}
