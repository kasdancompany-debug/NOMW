import { defineAnimal, generalFact, researchFact } from "./defineAnimal";
import type { Animal } from "@/types/content";

export const mammalAnimals: Animal[] = [
  defineAnimal({
    id: "moose",
    commonName: "Moose",
    scientificName: "Alces alces",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "The moose is a towering presence in Northern Ontario’s forests and wetland edges — long-legged, quiet, and built for deep snow and soft ground.",
    fullDescription:
      "Moose move through boreal forest, shorelines, and shallow waters where they can feed on aquatic and woody plants. Their great height and long legs help them travel where snow and muskeg slow other animals. Visitor stories often begin with a glimpse at the forest edge at dawn or dusk. Precise measurements, diet percentages, and regional abundance require curator-confirmed sources before they are presented as exhibit facts.",
    habitatIds: ["boreal-forest", "wetland-marsh", "river-riparian", "winter-snowpack"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "variable"],
    adaptationFacts: [
      generalFact(
        "moose-adapt-1",
        "Long legs help moose travel through deep snow and soft shoreline ground.",
      ),
      researchFact(
        "moose-adapt-2",
        "[NEEDS RESEARCH] Seasonal coat and thermoregulation details for local populations.",
        "Confirm adaptation wording with naturalist review.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "moose-mem-1",
        "Moose are often associated with quiet lakeshores and wetland edges in the boreal.",
      ),
      researchFact(
        "moose-mem-2",
        "[NEEDS RESEARCH] Antler growth timing and visitor-facing size comparisons.",
        "Avoid unverified size superlatives until confirmed.",
      ),
    ],
  }),

  defineAnimal({
    id: "black-bear",
    commonName: "Black Bear",
    scientificName: "Ursus americanus",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "Black bears are powerful forest omnivores of Northern Ontario — curious, mostly shy of people, and deeply tied to seasonal foods.",
    fullDescription:
      "Black bears travel large home ranges through forest, berry patches, and shoreline edges. Their year is shaped by food availability: spring green-up, summer abundance, and autumn fattening before denning. Coexistence guidance and diet specifics must be educator-approved; this entry avoids unverified behavioural claims.",
    habitatIds: ["boreal-forest", "wetland-marsh", "river-riparian", "night-canopy"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["dawn", "dusk", "night", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "black-bear-adapt-1",
        "Bears follow seasonal food landscapes across forest and edge habitats.",
      ),
      researchFact(
        "black-bear-adapt-2",
        "[NEEDS RESEARCH] Denning timing for Northern Ontario.",
        "Confirm den ecology before stating dates as fact.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "black-bear-mem-1",
        "Most black bears prefer to avoid people when given space and secure food storage.",
      ),
      researchFact(
        "black-bear-mem-2",
        "[NEEDS RESEARCH] Regional population notes for exhibit panels.",
        "Use only approved wildlife-agency language.",
      ),
    ],
  }),

  defineAnimal({
    id: "grey-wolf",
    commonName: "Grey Wolf",
    scientificName: "Canis lupus",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "Grey wolves are social hunters of Northern Ontario’s forests — more often heard or tracked than seen.",
    fullDescription:
      "Wolves travel widely through boreal landscapes, living in family groups and shaping prey movements with their presence. Exhibit storytelling should emphasize ecological relationships rather than myth. Pack size, diet percentages, and howling behaviour details await specialist confirmation.",
    habitatIds: ["boreal-forest", "winter-snowpack", "night-canopy"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "night", "variable"],
    adaptationFacts: [
      generalFact(
        "grey-wolf-adapt-1",
        "Wolves are endurance travellers of forest and snow country.",
      ),
      researchFact(
        "grey-wolf-adapt-2",
        "[NEEDS RESEARCH] Cooperative hunting roles in local packs.",
        "Avoid dramatized hunting narratives without sources.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "grey-wolf-mem-1",
        "Visitors more often meet wolves through tracks, scat, and distant howls than face to face.",
      ),
      researchFact(
        "grey-wolf-mem-2",
        "[NEEDS RESEARCH] Howl communication summary for audio exhibit.",
        "Pair only with verified recordings and captions.",
      ),
    ],
  }),

  defineAnimal({
    id: "canada-lynx",
    commonName: "Canada Lynx",
    scientificName: "Lynx canadensis",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "The Canada lynx is a quiet, deep-snow specialist — tufted ears, broad paws, and a close relationship with snowshoe hare country.",
    fullDescription:
      "Lynx favour forest habitats where snowshoe hares thrive. Their large paws and winter coat hint at a life shaped by snowpack. Population cycles and hunting success rates are research topics — not floor facts until confirmed.",
    habitatIds: ["boreal-forest", "winter-snowpack", "night-canopy"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["night", "dawn", "dusk", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "canada-lynx-adapt-1",
        "Broad paws help lynx travel atop deep snow.",
      ),
      researchFact(
        "canada-lynx-adapt-2",
        "[NEEDS RESEARCH] Hare–lynx relationship wording for Northern Ontario.",
        "Describe cycles only with curator-approved science summary.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "canada-lynx-mem-1",
        "Lynx are elusive; signs in snow often tell the story visitors cannot see.",
      ),
      researchFact(
        "canada-lynx-mem-2",
        "[NEEDS RESEARCH] Ear tuft and ruff function for kids’-level copy.",
        "Keep wonder; verify function claims.",
      ),
    ],
  }),

  defineAnimal({
    id: "woodland-caribou",
    commonName: "Woodland Caribou",
    scientificName: "Rangifer tarandus caribou",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "Woodland caribou belong to older forests and lichen country — a boreal traveler whose future depends on intact habitat.",
    fullDescription:
      "Woodland caribou are tightly connected to mature forest and lichen forage. Conservation status and recovery language must follow current official listings — this catalog marks status as needing research rather than asserting a legal designation.",
    habitatIds: ["boreal-forest", "winter-snowpack", "wetland-marsh"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk", "variable"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "woodland-caribou-adapt-1",
        "Caribou are linked to landscapes where lichen and older forest persist.",
      ),
      researchFact(
        "woodland-caribou-adapt-2",
        "[NEEDS RESEARCH] Seasonal movement patterns in Northern Ontario herds.",
        "Do not invent migration routes.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "woodland-caribou-mem-1",
        "Seeing caribou is uncommon; protecting the forests they need is part of the wonder.",
      ),
      researchFact(
        "woodland-caribou-mem-2",
        "[NEEDS RESEARCH] Hoof and snow travel details for interactives.",
        "Verify biomechanics copy before locking UI text.",
      ),
    ],
  }),

  defineAnimal({
    id: "white-tailed-deer",
    commonName: "White-tailed Deer",
    scientificName: "Odocoileus virginianus",
    animalGroup: "mammal",
    shortIntroduction:
      "White-tailed deer flash a bright flag of alarm and move lightly through forest edges, clearings, and winter yards.",
    fullDescription:
      "Deer are familiar across many Northern Ontario edges and successional habitats. Seasonal browsing, predator relationships, and regional density vary — treat abundance claims as research items.",
    habitatIds: ["boreal-forest", "winter-snowpack", "river-riparian"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "night", "variable"],
    adaptationFacts: [
      generalFact(
        "white-tailed-deer-adapt-1",
        "A raised white tail can signal alarm as deer bound to cover.",
      ),
      researchFact(
        "white-tailed-deer-adapt-2",
        "[NEEDS RESEARCH] Winter yard behaviour in colder northern districts.",
        "Confirm local winter ecology notes.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "white-tailed-deer-mem-1",
        "Tracks and browse lines often reveal deer long before the animal appears.",
      ),
      researchFact(
        "white-tailed-deer-mem-2",
        "[NEEDS RESEARCH] Antler timing copy for seasons exhibit.",
        "Verify schedule language by region.",
      ),
    ],
  }),

  defineAnimal({
    id: "red-fox",
    commonName: "Red Fox",
    scientificName: "Vulpes vulpes",
    animalGroup: "mammal",
    shortIntroduction:
      "The red fox is a adaptable hunter of forest edges and open pockets — clever feet, keen ears, and a coat that brightens winter.",
    fullDescription:
      "Foxes use a mosaic of cover and openings, hunting small mammals and other seasonal foods. Colour morphs and diet lists should not be overstated without sources.",
    habitatIds: ["boreal-forest", "winter-snowpack", "night-canopy"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "night", "variable"],
    adaptationFacts: [
      generalFact(
        "red-fox-adapt-1",
        "Foxes often hunt along edges where cover and open ground meet.",
      ),
      researchFact(
        "red-fox-adapt-2",
        "[NEEDS RESEARCH] Hearing / pounce hunting description accuracy.",
        "Validate sensory claims before animation sync.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "red-fox-mem-1",
        "A fox track line in fresh snow can feel like a story written in a single night.",
      ),
      researchFact(
        "red-fox-mem-2",
        "[NEEDS RESEARCH] Den season visitor messaging.",
        "Avoid disturbing den sites; use educator guidance.",
      ),
    ],
  }),

  defineAnimal({
    id: "beaver",
    commonName: "Beaver",
    scientificName: "Castor canadensis",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "Beavers reshaped Northern Ontario waterways — engineers of ponds, wetlands, and the wildlife that follow water.",
    fullDescription:
      "Beavers cut woody plants and build dams and lodges that create wetland habitat for many species. Engineering details and cutting rates belong in research-confirmed panels.",
    habitatIds: ["wetland-marsh", "river-riparian", "shield-lake"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "dusk", "night", "variable"],
    adaptationFacts: [
      generalFact(
        "beaver-adapt-1",
        "Beaver dams can create wetland habitat used by many other animals.",
      ),
      researchFact(
        "beaver-adapt-2",
        "[NEEDS RESEARCH] Lodge architecture details for kids’ interactives.",
        "Simplify only after accuracy check.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "beaver-mem-1",
        "A beaver pond is often a gathering place for birds, amphibians, and insects.",
      ),
      researchFact(
        "beaver-mem-2",
        "[NEEDS RESEARCH] Tooth-growth explanation for exhibit microcopy.",
        "Confirm biology phrasing.",
      ),
    ],
  }),

  defineAnimal({
    id: "river-otter",
    commonName: "River Otter",
    scientificName: "Lontra canadensis",
    animalGroup: "mammal",
    shortIntroduction:
      "River otters bring playfulness to cold water — sleek swimmers of lakes, rivers, and ice edges.",
    fullDescription:
      "Otters travel aquatic corridors hunting fish and other prey. Play behaviour is real but should not be anthropomorphized beyond what educators approve.",
    habitatIds: ["shield-lake", "river-riparian", "wetland-marsh"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["dawn", "day", "dusk", "variable"],
    adaptationFacts: [
      generalFact(
        "river-otter-adapt-1",
        "Streamlined bodies and webbed feet suit a life in water.",
      ),
      researchFact(
        "river-otter-adapt-2",
        "[NEEDS RESEARCH] Winter ice-hole hunting language.",
        "Verify before night/winter scenes.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "river-otter-mem-1",
        "Otter slides on snowy banks are a joy to find — and a clue that water is near.",
      ),
      researchFact(
        "river-otter-mem-2",
        "[NEEDS RESEARCH] Family group terminology for visitor panels.",
        "Confirm social language.",
      ),
    ],
  }),

  defineAnimal({
    id: "snowshoe-hare",
    commonName: "Snowshoe Hare",
    scientificName: "Lepus americanus",
    animalGroup: "mammal",
    featured: true,
    shortIntroduction:
      "Snowshoe hares wear the seasons — brown in summer, white in winter — and leave soft messages in powder snow.",
    fullDescription:
      "Hares are central to boreal food webs, especially for lynx. Coat-change timing and cycle dynamics need careful, sourced explanation for exhibits.",
    habitatIds: ["boreal-forest", "winter-snowpack", "night-canopy"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["night", "dawn", "dusk"],
    adaptationFacts: [
      generalFact(
        "snowshoe-hare-adapt-1",
        "Large hind feet act like snowshoes on soft powder.",
      ),
      researchFact(
        "snowshoe-hare-adapt-2",
        "[NEEDS RESEARCH] Coat colour change timing by latitude.",
        "Avoid a single calendar claim for all Northern Ontario.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "snowshoe-hare-mem-1",
        "Hare tracks often zigzag between cover — a map of caution and appetite.",
      ),
      researchFact(
        "snowshoe-hare-mem-2",
        "[NEEDS RESEARCH] Population cycle simplification for children.",
        "Use museum educator framing only.",
      ),
    ],
  }),

  defineAnimal({
    id: "little-brown-bat",
    commonName: "Little Brown Bat",
    scientificName: "Myotis lucifugus",
    animalGroup: "mammal",
    shortIntroduction:
      "Little brown bats skim insect-rich evenings — tiny aerial hunters of lakeshores and forest openings.",
    fullDescription:
      "These bats catch flying insects in the night air. Disease impacts and roost needs are sensitive topics; conservation wording must match current guidance.",
    habitatIds: ["night-canopy", "shield-lake", "open-sky", "boreal-forest"],
    activeSeasons: ["spring", "summer", "autumn"],
    activeTimeOfDay: ["night", "dusk"],
    conservationStatus: "needs-research",
    adaptationFacts: [
      generalFact(
        "little-brown-bat-adapt-1",
        "Echolocation helps many bats find insects in darkness.",
      ),
      researchFact(
        "little-brown-bat-adapt-2",
        "[NEEDS RESEARCH] White-nose syndrome messaging for coexistence exhibit.",
        "Follow approved conservation communications only.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "little-brown-bat-mem-1",
        "A single summer night over water can look empty until you imagine the insects — and the bats that follow them.",
      ),
      researchFact(
        "little-brown-bat-mem-2",
        "[NEEDS RESEARCH] Colony size statements.",
        "Do not invent roost counts.",
      ),
    ],
  }),

  defineAnimal({
    id: "northern-flying-squirrel",
    commonName: "Northern Flying Squirrel",
    scientificName: "Glaucomys sabrinus",
    animalGroup: "mammal",
    shortIntroduction:
      "Northern flying squirrels glide between night trees — soft, wide-eyed travelers of the canopy dark.",
    fullDescription:
      "These nocturnal squirrels glide on membranes between wrist and ankle, foraging in mature forest. Glide distances and diet lists require confirmation.",
    habitatIds: ["boreal-forest", "night-canopy"],
    activeSeasons: ["year-round"],
    activeTimeOfDay: ["night"],
    adaptationFacts: [
      generalFact(
        "northern-flying-squirrel-adapt-1",
        "A stretch of skin between fore and hind limbs turns a leap into a glide.",
      ),
      researchFact(
        "northern-flying-squirrel-adapt-2",
        "[NEEDS RESEARCH] Typical glide distance for visitor copy.",
        "Use measured ranges only when sourced.",
      ),
    ],
    memorableFacts: [
      generalFact(
        "northern-flying-squirrel-mem-1",
        "You may never see one — yet the night canopy is busy above the trail.",
      ),
      researchFact(
        "northern-flying-squirrel-mem-2",
        "[NEEDS RESEARCH] Fungal / lichen food relationships.",
        "Confirm before food-web interactives.",
      ),
    ],
  }),
];
