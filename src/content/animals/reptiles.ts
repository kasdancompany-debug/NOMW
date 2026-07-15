import { defineAnimal, generalFact, researchFact } from "./defineAnimal";
import type { Animal } from "@/types/content";

export const reptileAnimals: Animal[] = [
  defineAnimal({
    id: "common-snapping-turtle",
    commonName: "Common Snapping Turtle",
    scientificName: "Chelydra serpentina",
    animalGroup: "reptile",
    shortIntroduction:
      "Common snapping turtles move like living history through shallows and muddy bottoms — ancient travellers of wetland time.",
    fullDescription:
      "Snappers use lakes, rivers, and wetlands. Nesting on roadsides creates coexistence challenges; safety advice must be educator-approved. Conservation status requires current listing checks.",
    habitatIds: ["wetland-marsh", "shield-lake", "river-riparian"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["day", "dawn", "dusk", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "common-snapping-turtle-adapt-1",
        "A powerful beak and strong neck suit a life of aquatic foraging.",
      ),
      researchFact(
        "common-snapping-turtle-adapt-2",
        "[NEEDS RESEARCH] Overwintering underwater behaviour summary.",
        "Confirm physiology wording.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "common-snapping-turtle-mem-1",
        "Giving a nesting turtle space on a warm shoulder is a small act of coexistence.",
      ),
      researchFact(
        "common-snapping-turtle-mem-2",
        "[NEEDS RESEARCH] Lifespan claims for wow-facts.",
        "Longevity numbers must be sourced.",
      ),
    ],
  }),
];
