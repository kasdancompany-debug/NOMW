import { defineAnimal, generalFact, researchFact } from "./defineAnimal";
import type { Animal } from "@/types/content";

export const fishAnimals: Animal[] = [
  defineAnimal({
    id: "lake-sturgeon",
    commonName: "Lake Sturgeon",
    scientificName: "Acipenser fulvescens",
    animalGroup: "fish",
    featured: true,
    shortIntroduction:
      "Lake sturgeon are ancient survivors of Northern Ontario waters — armoured, long-lived, and deserving of careful stewardship language.",
    fullDescription:
      "Sturgeon inhabit large lakes and rivers. Lifespan, size records, and conservation listings must come from approved fisheries sources; this entry refuses invented numbers.",
    habitatIds: ["shield-lake", "river-riparian"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "lake-sturgeon-adapt-1",
        "Bony scutes give sturgeon a prehistoric silhouette among freshwater fishes.",
      ),
      researchFact(
        "lake-sturgeon-adapt-2",
        "[NEEDS RESEARCH] Spawning habitat requirements for local rivers.",
        "Confirm with fisheries specialists.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "lake-sturgeon-mem-1",
        "Meeting a sturgeon’s deep-time shape in a northern river can reset what ‘fish’ means.",
      ),
      researchFact(
        "lake-sturgeon-mem-2",
        "[NEEDS RESEARCH] Maximum size statements for wow-panels.",
        "Never invent record lengths.",
      ),
    ],
  }),

  defineAnimal({
    id: "northern-pike",
    commonName: "Northern Pike",
    scientificName: "Esox lucius",
    animalGroup: "fish",
    shortIntroduction:
      "Northern pike wait like green lightning in weedy shallows — ambush hunters of Shield lakes and slow rivers.",
    fullDescription:
      "Pike favour vegetated cover where they can ambush prey fish. Growth rates and trophy sizes vary widely; keep exhibit numbers offline until confirmed.",
    habitatIds: ["shield-lake", "wetland-marsh", "river-riparian"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk", "variable"],
    adaptationFacts: [
      generalFact(
        "northern-pike-adapt-1",
        "A long body and quick strike suit hunting from cover in shallow weeds.",
      ),
      researchFact(
        "northern-pike-adapt-2",
        "[NEEDS RESEARCH] Preferred water temperature ranges for copy.",
        "Confirm limnology claims.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "northern-pike-mem-1",
        "Weed beds are more than scenery — they are theatres of waiting.",
      ),
      researchFact(
        "northern-pike-mem-2",
        "[NEEDS RESEARCH] Tooth / jaw microcopy for touch interactives.",
        "Keep age-appropriate and accurate.",
      ),
    ],
  }),

  defineAnimal({
    id: "brook-trout",
    commonName: "Brook Trout",
    scientificName: "Salvelinus fontinalis",
    animalGroup: "fish",
    featured: true,
    shortIntroduction:
      "Brook trout colour cold, clean water — a living signal of shaded streams and delicate aquatic balance.",
    fullDescription:
      "Brook trout need cool, well-oxygenated water. Habitat threats and stocking distinctions should be handled carefully by curators.",
    habitatIds: ["river-riparian", "shield-lake"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "brook-trout-adapt-1",
        "Brook trout are associated with cool, clear freshwater habitats.",
      ),
      researchFact(
        "brook-trout-adapt-2",
        "[NEEDS RESEARCH] Native vs introduced population notes by watershed.",
        "Do not generalize all Northern Ontario waters.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "brook-trout-mem-1",
        "A trout’s speckled flare in a shaded pool is a reminder that water quality is habitat.",
      ),
      researchFact(
        "brook-trout-mem-2",
        "[NEEDS RESEARCH] Spawning season visitor messaging.",
        "Confirm phenology before seasons panels.",
      ),
    ],
  }),
];
