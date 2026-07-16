import { createPlaceholderMedia } from "@/content/media/placeholders";
import type { AnimalId, MediaAsset } from "@/types/content";

export type CoexistenceTopic =
  | "safe-distance"
  | "bear-encounter"
  | "no-feeding"
  | "nesting-areas"
  | "roadside"
  | "clean-waterways"
  | "wetlands"
  | "invasive-species"
  | "responsible-camping"
  | "living-near-wildlife";

export type ScenarioChoice = {
  id: string;
  label: string;
  /** Whether this is the preferred / recommended action */
  recommended: boolean;
};

export type CoexistenceScenario = {
  id: string;
  topic: CoexistenceTopic;
  title: string;
  situation: string;
  choices: ScenarioChoice[];
  /** Revealed after any choice — preferred action in plain language */
  recommendedAction: string;
  /** Why it helps — practical, never shaming */
  explanation: string;
  /**
   * Emergency / safety wording held for qualified local wildlife authority review
   * before floor installation. Do not treat as final directive language until cleared.
   */
  emergencyContentDisclaimer: string;
  /** Closing wildlife moment */
  wildlifeMoment: {
    animalId?: AnimalId;
    caption: string;
    image: MediaAsset;
    video?: MediaAsset;
  };
};

export const COEXISTENCE_EXHIBIT_TITLE = "Living Together";
export const COEXISTENCE_EXHIBIT_SUBTITLE =
  "Practical ways people and wildlife share Northern Ontario";

/**
 * Exhibit-level safety disclaimer — surface on-screen; final copy requires authority review.
 */
export const coexistenceSafetyDisclaimer = {
  shortLabel: "A gentle note",
  visitorFacing:
    "These choices share general good habits for living near wildlife. They are not a substitute for official guidance in an emergency.",
  /**
   * Structured field for installers / curators — replace with cleared authority text.
   */
  emergencyContentDisclaimer:
    "[NEEDS AUTHORITY REVIEW] Final safety, encounter, and emergency wording for Living Together must be reviewed and approved by qualified local wildlife authorities (and museum educators) before installation. Until cleared, treat all encounter directives as provisional placeholders.",
  authorityContactNote:
    "Record reviewing agency, date cleared, and version on the content sheet before floor lock.",
} as const;

export const topicLabels: Record<CoexistenceTopic, string> = {
  "safe-distance": "Safe distance",
  "bear-encounter": "Bear encounter",
  "no-feeding": "Food and wildlife",
  "nesting-areas": "Nesting areas",
  roadside: "Roadsides",
  "clean-waterways": "Clean waterways",
  wetlands: "Wetlands",
  "invasive-species": "Invasive species",
  "responsible-camping": "Camping",
  "living-near-wildlife": "Near home",
};

function momentMedia(id: string, label: string, animalId?: AnimalId) {
  const image = createPlaceholderMedia({
    id: `${id}-moment-image`,
    kind: "image",
    folder: animalId ? "animals" : "habitats",
    filename: animalId ? `${animalId}-coexistence-moment` : `${id}-moment`,
    label: `${label} wildlife moment image`,
    alt: `Placeholder wildlife image for ${label}`,
  });
  const video = createPlaceholderMedia({
    id: `${id}-moment-video`,
    kind: "video",
    folder: "video",
    filename: animalId ? `${animalId}-coexistence-moment` : `${id}-moment`,
    label: `${label} wildlife moment video`,
    loop: true,
    poster: image.src,
  });
  return { image, video };
}

export const coexistenceScenarios: CoexistenceScenario[] = [
  {
    id: "distance-trail",
    topic: "safe-distance",
    title: "A moose near the trail",
    situation:
      "You’re walking a forest path when a moose steps into a clearing ahead. It doesn’t seem hurried — and you’re close enough to feel impressed.",
    choices: [
      { id: "approach-photo", label: "Move closer for a better look", recommended: false },
      { id: "give-space", label: "Stop, give space, and wait or quietly turn aside", recommended: true },
      { id: "call-out", label: "Call loudly so it knows you’re there and walk straight on", recommended: false },
    ],
    recommendedAction: "Pause, give a wide berth, and let the animal choose the next move.",
    explanation:
      "Distance is a gift both ways. Extra space lowers stress for wildlife and keeps surprise encounters from feeling sudden.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Confirm preferred safe-distance language for moose trail encounters with local wildlife authorities before install.",
    wildlifeMoment: {
      animalId: "moose",
      caption: "Room enough to wonder — and to walk on safely.",
      ...momentMedia("distance-trail", "Moose", "moose"),
    },
  },
  {
    id: "bear-black",
    topic: "bear-encounter",
    title: "A black bear on the path",
    situation:
      "Around a bend, you notice a black bear nosing through berry shrubs. It hasn’t charged — it’s busy, and you’re suddenly part of the same moment.",
    choices: [
      { id: "run", label: "Turn and run as fast as you can", recommended: false },
      { id: "stay-calm", label: "Stay calm, make yourself known, and back away slowly", recommended: true },
      { id: "feed-distract", label: "Toss a snack to distract it", recommended: false },
    ],
    recommendedAction:
      "Stay calm, speak in a steady voice so the bear knows you’re human, and back away slowly without turning your back in a panic.",
    explanation:
      "Most black bears prefer to avoid people. Calm space and a clear exit help everyone settle the moment — feeding or sudden flight can make things less predictable.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Black bear encounter steps vary by context (defensive vs. curious behaviour, presence of cubs, food conditioning). Replace with official local guidance; never ship provisional text as final emergency instruction.",
    wildlifeMoment: {
      animalId: "black-bear",
      caption: "Shared berry country — patience keeps the story peaceful.",
      ...momentMedia("bear-black", "Black bear", "black-bear"),
    },
  },
  {
    id: "no-feed-fox",
    topic: "no-feeding",
    title: "A fox near the picnic tables",
    situation:
      "A red fox trots near the picnic area, curious about crumbs. Someone nearby wonders if a sandwich edge would “help it out.”",
    choices: [
      { id: "feed", label: "Offer a little food so it moves along", recommended: false },
      { id: "pack-away", label: "Secure food and enjoy watching from a respectful distance", recommended: true },
      { id: "chase", label: "Chase it off aggressively", recommended: false },
    ],
    recommendedAction: "Keep human food packed away and let wild animals find wild meals.",
    explanation:
      "Animals that learn picnic food may linger near people and roads. Leaving wild diets intact supports healthier, more natural behaviour.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Confirm messaging on intentional and unintentional wildlife feeding with local authorities / educators.",
    wildlifeMoment: {
      animalId: "red-fox",
      caption: "Wild meals keep wild neighbours wild.",
      ...momentMedia("no-feed-fox", "Red fox", "red-fox"),
    },
  },
  {
    id: "nesting-shore",
    topic: "nesting-areas",
    title: "Birds defending a shoreline nest",
    situation:
      "Along a lake edge, birds seem unusually bold — swooping nearby as if guiding you away from a stretch of beach.",
    choices: [
      { id: "push-through", label: "Keep straight through — it’s your trail too", recommended: false },
      { id: "reroute", label: "Give the nest area a wide detour and enjoy the view from farther off", recommended: true },
      { id: "touch-check", label: "Look for the nest up close to check on eggs", recommended: false },
    ],
    recommendedAction: "Reroute with a generous buffer and leave nesting zones undisturbed.",
    explanation:
      "Nesting seasons are short and precious. A little detour protects eggs, chicks, and calm for parent birds.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Nest-buffer guidance and seasonal closures should match local protected-area practice before install.",
    wildlifeMoment: {
      animalId: "common-loon",
      caption: "Quiet shores help the next generation take wing.",
      ...momentMedia("nesting-shore", "Common loon", "common-loon"),
    },
  },
  {
    id: "roadside-deer",
    topic: "roadside",
    title: "Deer at the roadside dusk",
    situation:
      "At dusk, a deer stands near the shoulder. Another shape moves in the trees — more animals may be nearby.",
    choices: [
      { id: "speed", label: "Hold speed — you’ll be past quickly", recommended: false },
      { id: "slow", label: "Slow down, watch both sides, and expect companions", recommended: true },
      { id: "horn-photo", label: "Stop in the lane for photos", recommended: false },
    ],
    recommendedAction: "Ease off the speed, scan both roadsides, and remember animals often travel in groups.",
    explanation:
      "One animal at the edge can mean more close behind. Extra time and attention are the neighbourly tools of dusk roads.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Align roadside wildlife messaging with provincial / municipal road-safety partners as needed.",
    wildlifeMoment: {
      animalId: "white-tailed-deer",
      caption: "Twilight roads ask for soft brakes and open eyes.",
      ...momentMedia("roadside-deer", "White-tailed deer", "white-tailed-deer"),
    },
  },
  {
    id: "waterways",
    topic: "clean-waterways",
    title: "Soap at the canoe landing",
    situation:
      "After a paddle, someone starts washing dishes with soapy water right at the rocky shoreline of a clear lake.",
    choices: [
      { id: "shore-wash", label: "Wash everything in the lake — it’s convenient", recommended: false },
      { id: "upland", label: "Carry wash water inland and use lake-friendly habits", recommended: true },
      { id: "dump-bottle", label: "Pour leftover cleaner straight into the water", recommended: false },
    ],
    recommendedAction: "Keep soaps and food scraps away from the water’s edge; wash well back from shore when you can.",
    explanation:
      "Lakes and rivers hold whole communities of life. Small shoreline habits add up to cleaner water for fish, birds, and the next paddle.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Confirm waterway hygiene language with park / watershed partners if site-specific rules apply.",
    wildlifeMoment: {
      animalId: "brook-trout",
      caption: "Clear water is a shared home.",
      ...momentMedia("waterways", "Brook trout", "brook-trout"),
    },
  },
  {
    id: "wetlands",
    topic: "wetlands",
    title: "A shortcut across the marsh",
    situation:
      "The boardwalk forks. One side stays on the path; the other looks like a quicker scramble across soft wetland plants.",
    choices: [
      { id: "shortcut", label: "Cut across the marsh plants to save time", recommended: false },
      { id: "boardwalk", label: "Stay on the boardwalk or marked trail", recommended: true },
    ],
    recommendedAction: "Stay on marked paths and let wetland plants keep building their quiet architecture.",
    explanation:
      "Wetlands filter water, host nests, and soften floods. Footsteps off-trail can press rare plants and stress the animals that need that cover.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Site-specific wetland access rules should be confirmed with land managers before install.",
    wildlifeMoment: {
      animalId: "beaver",
      caption: "Marsh edges are busy workshops — best watched from the path.",
      ...momentMedia("wetlands", "Beaver", "beaver"),
    },
  },
  {
    id: "invasive",
    topic: "invasive-species",
    title: "Boats between lakes",
    situation:
      "You’re moving a canoe from one lake to another. Water plants cling to the hull and the paddle still drips.",
    choices: [
      { id: "launch-now", label: "Launch right away — a few plants won’t matter", recommended: false },
      { id: "clean-drain", label: "Clean, drain, and dry gear before the next launch", recommended: true },
      { id: "dump-livewell", label: "Empty leftover water into the new lake", recommended: false },
    ],
    recommendedAction: "Clean, drain, and dry boats and gear before moving between waters.",
    explanation:
      "Tiny hitchhikers travel farther than they look. A few careful minutes at the landing protect the lakes you love for seasons ahead.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Match invasive-species steps to current provincial Clean-Drain-Dry (or equivalent) guidance before install.",
    wildlifeMoment: {
      animalId: "lake-sturgeon",
      caption: "Ancient fish rely on waters we help keep whole.",
      ...momentMedia("invasive", "Lake sturgeon", "lake-sturgeon"),
    },
  },
  {
    id: "camping",
    topic: "responsible-camping",
    title: "Evening at the campsite",
    situation:
      "Supper smells wonderful. A cooler sits open, leftovers wait on the table, and the forest edge is only a few steps away.",
    choices: [
      { id: "leave-out", label: "Leave food out — you’ll finish it later", recommended: false },
      { id: "secure", label: "Pack food away and keep a tidy site before dark", recommended: true },
      { id: "feed-edge", label: "Leave scraps at the tree line for “the animals”", recommended: false },
    ],
    recommendedAction: "Store food securely, clear scraps promptly, and keep a calm, clean camp.",
    explanation:
      "A tidy camp invites fewer midnight visitors and helps wildlife keep natural foraging habits. Everyone rests easier.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Confirm bear-aware camping storage language with park authorities for the regions you name on floor panels.",
    wildlifeMoment: {
      animalId: "grey-wolf",
      caption: "The night forest thrives when camps stay quietly contained.",
      ...momentMedia("camping", "Night forest", "grey-wolf"),
    },
  },
  {
    id: "near-home",
    topic: "living-near-wildlife",
    title: "Foxes, coyotes, and deer near home",
    situation:
      "In a neighbourhood that meets the forest edge, a fox cuts through a yard at dusk. Deer nibble shrubs. Neighbours also mention coyotes calling after dark.",
    choices: [
      { id: "hand-feed", label: "Start feeding them so they feel welcome", recommended: false },
      {
        id: "secure-habits",
        label: "Secure garbage, bring pet food in, and enjoy watching from indoors or a safe distance",
        recommended: true,
      },
      { id: "corner", label: "Try to corner animals to move them somewhere else", recommended: false },
    ],
    recommendedAction:
      "Make yards less inviting for easy meals, give wildlife room to pass through, and admire them without turning them into dependents.",
    explanation:
      "Foxes, coyotes, and deer belong to the wider landscape. Secure trash and pet food, give space, and keep curious pets supervised — small habits that support calm neighbourhoods.",
    emergencyContentDisclaimer:
      "[NEEDS AUTHORITY REVIEW] Living-near-coyotes / foxes / deer guidance must be cleared with qualified local wildlife authorities. Include emergency contact pathways only after approval. Coyotes are discussed here even when not listed as a featured catalog animal.",
    wildlifeMoment: {
      animalId: "red-fox",
      caption: "Edge habitats work when homes stay politely uninteresting as restaurants.",
      ...momentMedia("near-home", "Neighbourhood wildlife", "red-fox"),
    },
  },
];

/**
 * Visitor-floor set: low-risk stewardship choices only. Encounter, roadside,
 * camping, and emergency-adjacent scenarios remain in the curator dataset but
 * must not be shown until their authority-review fields are cleared.
 */
const FLOOR_READY_SCENARIO_IDS = new Set([
  "no-feed-fox",
  "nesting-shore",
  "wetlands",
  "invasive",
]);

export const floorReadyCoexistenceScenarios = coexistenceScenarios.filter((scenario) =>
  FLOOR_READY_SCENARIO_IDS.has(scenario.id),
);

export const coexistenceCopy = {
  topicTag: "Living with wildlife",
  choosePrompt: "What would you do?",
  recommendedLabel: "A caring choice",
  whyLabel: "Why it helps",
  nextScenario: "Next situation",
  seeMoment: "Meet the wild neighbours",
  disclaimerTitle: "A shared responsibility",
  progressLabel: "Situations",
} as const;

export function getCoexistenceScenario(id: string): CoexistenceScenario | undefined {
  return coexistenceScenarios.find((scenario) => scenario.id === id);
}
