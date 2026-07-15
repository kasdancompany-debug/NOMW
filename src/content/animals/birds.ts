import { defineAnimal, generalFact, researchFact } from "./defineAnimal";
import type { Animal } from "@/types/content";

export const birdAnimals: Animal[] = [
  defineAnimal({
    id: "common-loon",
    commonName: "Common Loon",
    scientificName: "Gavia immer",
    animalGroup: "bird",
    featured: true,
    shortIntroduction:
      "The common loon’s call is a signature of Northern Ontario lakes — stark, beautiful, and impossible to forget across still water.",
    fullDescription:
      "Loons nest on lakes and feed by diving for fish. Nest disturbance and boat wake are coexistence topics for educators. Song descriptions should pair with approved audio.",
    habitatIds: ["shield-lake", "wetland-marsh", "open-sky"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["dawn", "day", "dusk", "night"],
    adaptationFacts: [
      generalFact(
        "common-loon-adapt-1",
        "Dense bones and rear-set legs suit underwater pursuit of fish.",
      ),
      researchFact(
        "common-loon-adapt-2",
        "[NEEDS RESEARCH] Nest-site preferences for local lakes.",
        "Confirm before shoreline guidance panels.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "common-loon-mem-1",
        "A loon call across a quiet lake is one of the north’s most memorable sounds.",
      ),
      researchFact(
        "common-loon-mem-2",
        "[NEEDS RESEARCH] Migration timing for seasons exhibit.",
        "Verify provincial phenology notes.",
      ),
    ],
  }),

  defineAnimal({
    id: "bald-eagle",
    commonName: "Bald Eagle",
    scientificName: "Haliaeetus leucocephalus",
    animalGroup: "bird",
    featured: true,
    shortIntroduction:
      "Bald eagles watch Northern Ontario waters from high perches — broad wings over lakes and rivers.",
    fullDescription:
      "Eagles hunt and scavenge near productive waters. Nesting buffers and recovery history should use official conservation language when ready.",
    habitatIds: ["shield-lake", "river-riparian", "open-sky", "rocky-outcrop"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "bald-eagle-adapt-1",
        "Keen vision and powerful wings suit hunting along open water.",
      ),
      researchFact(
        "bald-eagle-adapt-2",
        "[NEEDS RESEARCH] Year-round presence vs seasonal movements locally.",
        "Confirm winter distribution claims.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "bald-eagle-mem-1",
        "A white head flashing above a dark shoreline can stop a whole trail conversation.",
      ),
      researchFact(
        "bald-eagle-mem-2",
        "[NEEDS RESEARCH] Wingspan figure for comparison interactives.",
        "Use sourced measurements only.",
      ),
    ],
  }),

  defineAnimal({
    id: "great-grey-owl",
    commonName: "Great Grey Owl",
    scientificName: "Strix nebulosa",
    animalGroup: "bird",
    featured: true,
    shortIntroduction:
      "Great grey owls are ghostly hunters of northern forest openings — huge facial disks listening into soft snow.",
    fullDescription:
      "These owls hunt small mammals, sometimes through snow cover. Hearing claims and irruption years need careful sourcing.",
    habitatIds: ["boreal-forest", "winter-snowpack", "night-canopy", "open-sky"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "day", "variable"],
    adaptationFacts: [
      generalFact(
        "great-grey-owl-adapt-1",
        "A large facial disk helps funnel sound toward the owl’s ears.",
      ),
      researchFact(
        "great-grey-owl-adapt-2",
        "[NEEDS RESEARCH] Hunting-through-snow description accuracy.",
        "Validate before tracks/night interactives.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "great-grey-owl-mem-1",
        "In the right winter light, a great grey can look taller than the small mammals it seeks.",
      ),
      researchFact(
        "great-grey-owl-mem-2",
        "[NEEDS RESEARCH] Visitation / irruption explanations.",
        "Avoid predicting owl winters as certainty.",
      ),
    ],
  }),

  defineAnimal({
    id: "snowy-owl",
    commonName: "Snowy Owl",
    scientificName: "Bubo scandiacus",
    animalGroup: "bird",
    shortIntroduction:
      "Snowy owls bring arctic brightness south in some winters — pale hunters of open spaces and shorelines.",
    fullDescription:
      "Snowy owls are more irregular visitors depending on food and season. Treat winter appearance as variable, not guaranteed annual spectacle.",
    habitatIds: ["open-sky", "winter-snowpack", "rocky-outcrop"],
    activeSeasons: ["winter"],
    activeTimeOfDay: ["day", "dawn", "dusk", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "snowy-owl-adapt-1",
        "Feathered legs and a thick coat suit cold, open country.",
      ),
      researchFact(
        "snowy-owl-adapt-2",
        "[NEEDS RESEARCH] Southern winter movement drivers.",
        "Keep language probabilistic.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "snowy-owl-mem-1",
        "A snowy owl on a fence post can look like winter itself decided to perch.",
      ),
      researchFact(
        "snowy-owl-mem-2",
        "[NEEDS RESEARCH] Safe viewing distances for coexistence tips.",
        "Educator-approved only.",
      ),
    ],
  }),

  defineAnimal({
    id: "sandhill-crane",
    commonName: "Sandhill Crane",
    scientificName: "Antigone canadensis",
    animalGroup: "bird",
    shortIntroduction:
      "Sandhill cranes trumpet across wetlands and fields — tall, ancient-looking travelers of sky and marsh.",
    fullDescription:
      "Cranes use wetlands and open foraging areas. Migration timing and local nesting status need confirmation for Northern Ontario panels.",
    habitatIds: ["wetland-marsh", "open-sky"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["dawn", "day", "dusk"],
    adaptationFacts: [
      generalFact(
        "sandhill-crane-adapt-1",
        "Long legs suit wading and walking through marsh edges.",
      ),
      researchFact(
        "sandhill-crane-adapt-2",
        "[NEEDS RESEARCH] Local nesting vs stopover wording.",
        "Confirm status for Northern Ontario specifically.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "sandhill-crane-mem-1",
        "Crane voices can carry a long way across open wetland air.",
      ),
      researchFact(
        "sandhill-crane-mem-2",
        "[NEEDS RESEARCH] Courtship display description for motion scenes.",
        "Choreograph only after ethology check.",
      ),
    ],
  }),

  defineAnimal({
    id: "ruffed-grouse",
    commonName: "Ruffed Grouse",
    scientificName: "Bonasa umbellus",
    animalGroup: "bird",
    shortIntroduction:
      "Ruffed grouse drum the spring woods — a soft thunder from hidden forest stages.",
    fullDescription:
      "Grouse live in forest understories, exploding into flight when startled. Drumming mechanics are a good interactive topic once scientifically checked.",
    habitatIds: ["boreal-forest", "winter-snowpack"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk"],
    adaptationFacts: [
      generalFact(
        "ruffed-grouse-adapt-1",
        "Cryptic plumage helps grouse vanish into leaf litter and brush.",
      ),
      researchFact(
        "ruffed-grouse-adapt-2",
        "[NEEDS RESEARCH] Snow-roosting behaviour notes.",
        "Confirm for winter exhibit.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "ruffed-grouse-mem-1",
        "The spring drumming of a grouse can feel closer than it looks.",
      ),
      researchFact(
        "ruffed-grouse-mem-2",
        "[NEEDS RESEARCH] Drumming frequency explanation for audio UX.",
        "Pair with verified field recordings.",
      ),
    ],
  }),

  defineAnimal({
    id: "canada-goose",
    commonName: "Canada Goose",
    scientificName: "Branta canadensis",
    animalGroup: "bird",
    featured: true,
    shortIntroduction:
      "Canada geese travel sky highways in shifting Vs — family groups that bind wetland edges to open water and meadow.",
    fullDescription:
      "Geese nest near water and forage in open habitats. Migration timing and local staging sites vary; treat corridor maps as simplified stories until curators confirm regional routes.",
    habitatIds: ["wetland-marsh", "open-sky", "shield-lake"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["dawn", "day", "dusk"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "canada-goose-adapt-1",
        "V-formation flight helps groups share the work of long travel.",
      ),
      researchFact(
        "canada-goose-adapt-2",
        "[NEEDS RESEARCH] Local migration corridor wording for sky exhibit.",
        "Confirm Northern Ontario staging notes before locking paths.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "canada-goose-mem-1",
        "A distant V can turn an ordinary grey sky into a story of return.",
      ),
      researchFact(
        "canada-goose-mem-2",
        "[NEEDS RESEARCH] Call repertoire captions for Whose Call activity.",
        "Pair only with verified recordings.",
      ),
    ],
  }),
];
