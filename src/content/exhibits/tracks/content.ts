import type { AnimalId } from "@/types/content";

export type TracksChallengeType =
  | "footprint"
  | "call"
  | "fur-feather"
  | "nest-shelter"
  | "feeding"
  | "silhouette";

/** Visual motif keys rendered by the shared ClueVisual registry — not per-challenge components. */
export type ClueMotif =
  | "print-moose"
  | "print-wolf"
  | "print-hare"
  | "print-bear"
  | "print-deer"
  | "fur-lynx"
  | "fur-fox"
  | "feather-loon"
  | "feather-owl"
  | "nest-eagle"
  | "lodge-beaver"
  | "den-fox"
  | "feeding-bark"
  | "feeding-fish-remains"
  | "feeding-browse"
  | "sil-moose"
  | "sil-crane"
  | "sil-sturgeon"
  | "sil-bat"
  | "call-wave";

export type TracksChallenge = {
  id: string;
  type: TracksChallengeType;
  correctAnimalId: AnimalId;
  /** Distractors drawn from the shared animal database */
  distractorAnimalIds: [AnimalId, AnimalId];
  prompt: string;
  /** Always present — doubles as caption for audio challenges */
  clueCaption: string;
  explanation: string;
  motif: ClueMotif;
  /** When true, play correct animal callAudio (optional; caption always shown) */
  hasCallAudio?: boolean;
};

export const TRACKS_EXHIBIT_TITLE = "Tracks, Calls and Clues";
export const TRACKS_EXHIBIT_SUBTITLE =
  "Read the quiet evidence Northern Ontario wildlife leaves behind";

export const TRACKS_CALL_VOLUME = 0.28;

export const challengeTypeLabels: Record<TracksChallengeType, string> = {
  footprint: "Footprint match",
  call: "Call match",
  "fur-feather": "Fur or feather",
  "nest-shelter": "Nest or shelter",
  feeding: "Feeding clue",
  silhouette: "Silhouette",
};

/** Data-driven challenge pool — engine shuffles and paces animals. */
export const tracksChallenges: TracksChallenge[] = [
  {
    id: "fp-moose",
    type: "footprint",
    correctAnimalId: "moose",
    distractorAnimalIds: ["white-tailed-deer", "woodland-caribou"],
    prompt: "Which animal left this track?",
    clueCaption: "A large cloven print with long, pointed toes — deep in soft shore mud.",
    explanation:
      "Moose prints are among the largest cloven tracks on the trail — long toes that often splay in soft ground.",
    motif: "print-moose",
  },
  {
    id: "fp-wolf",
    type: "footprint",
    correctAnimalId: "grey-wolf",
    distractorAnimalIds: ["red-fox", "canada-lynx"],
    prompt: "Match the animal to this footprint.",
    clueCaption: "Four toe pads and a triangular heel pad in a straight-line gait.",
    explanation:
      "Wolf tracks show four toes and claw marks; the stride often runs nearly in a line when traveling.",
    motif: "print-wolf",
  },
  {
    id: "fp-hare",
    type: "footprint",
    correctAnimalId: "snowshoe-hare",
    distractorAnimalIds: ["red-fox", "northern-flying-squirrel"],
    prompt: "Who made these snow prints?",
    clueCaption: "Wide rear prints landing ahead of smaller front prints — a hopping pattern.",
    explanation:
      "Snowshoe hares leave classic hop sets: large hind feet land ahead of the smaller front pair.",
    motif: "print-hare",
  },
  {
    id: "fp-bear",
    type: "footprint",
    correctAnimalId: "black-bear",
    distractorAnimalIds: ["moose", "grey-wolf"],
    prompt: "Which traveler pressed this print?",
    clueCaption: "A broad five-toed plantigrade print with an arc of small claw tips.",
    explanation:
      "Black bears walk plantigrade — heel and toes both mark — with five toes and a wide pad.",
    motif: "print-bear",
  },
  {
    id: "fp-deer",
    type: "footprint",
    correctAnimalId: "white-tailed-deer",
    distractorAnimalIds: ["moose", "woodland-caribou"],
    prompt: "Match the footprint to its animal.",
    clueCaption: "A neat heart-shaped cloven print, smaller than a moose.",
    explanation:
      "White-tailed deer leave tidy heart-shaped tracks — paired toes without the moose’s great length.",
    motif: "print-deer",
  },
  {
    id: "call-loon",
    type: "call",
    correctAnimalId: "common-loon",
    distractorAnimalIds: ["canada-goose", "sandhill-crane"],
    prompt: "Whose call is this?",
    clueCaption:
      "A far-carrying lake voice — clear, rising, and unmistakable across still water.",
    explanation:
      "The common loon’s call is one of the north’s signature sounds — heard more often than the bird is seen.",
    motif: "call-wave",
    hasCallAudio: true,
  },
  {
    id: "call-owl",
    type: "call",
    correctAnimalId: "great-grey-owl",
    distractorAnimalIds: ["snowy-owl", "ruffed-grouse"],
    prompt: "Match the animal to this call.",
    clueCaption: "A soft, deep hooting from the spruce edge — more velvet than shriek.",
    explanation:
      "Great grey owls speak in soft booming notes — less piercing than many people expect from owls.",
    motif: "call-wave",
    hasCallAudio: true,
  },
  {
    id: "call-goose",
    type: "call",
    correctAnimalId: "canada-goose",
    distractorAnimalIds: ["common-loon", "sandhill-crane"],
    prompt: "Who is calling overhead?",
    clueCaption: "A bright honking exchange — often in overlapping voices from a traveling group.",
    explanation:
      "Canada geese keep contact with loud honks, especially when flying in loose V lines.",
    motif: "call-wave",
    hasCallAudio: true,
  },
  {
    id: "fur-lynx",
    type: "fur-feather",
    correctAnimalId: "canada-lynx",
    distractorAnimalIds: ["red-fox", "snowshoe-hare"],
    prompt: "Which animal left this fur clue?",
    clueCaption: "Long, soft grey-brown guard hairs snagged on low spruce — tufted-ear country.",
    explanation:
      "Lynx fur can catch on brush along winter trails; soft denseness suits deep-cold hunting.",
    motif: "fur-lynx",
  },
  {
    id: "fur-fox",
    type: "fur-feather",
    correctAnimalId: "red-fox",
    distractorAnimalIds: ["canada-lynx", "grey-wolf"],
    prompt: "Identify the fur clue.",
    clueCaption: "Rusty-orange hairs with a darker tip caught on raspberry cane.",
    explanation:
      "Red fox fur often shows warm rufous tones — a contrast to the greyer winter coats of lynx or wolf.",
    motif: "fur-fox",
  },
  {
    id: "feather-loon",
    type: "fur-feather",
    correctAnimalId: "common-loon",
    distractorAnimalIds: ["bald-eagle", "ruffed-grouse"],
    prompt: "Which bird left this feather?",
    clueCaption: "A stiff, dark waterbird contour feather near the lakeshore wrack line.",
    explanation:
      "Loon feathers turn up along shorelines where birds preen and rest between dives.",
    motif: "feather-loon",
  },
  {
    id: "feather-owl",
    type: "fur-feather",
    correctAnimalId: "great-grey-owl",
    distractorAnimalIds: ["snowy-owl", "bald-eagle"],
    prompt: "Match the feather to its bird.",
    clueCaption: "A soft, barred flight feather — edges that suggest quiet wingbeats.",
    explanation:
      "Owl flight feathers are fringed for silence — a clue in the texture as much as the pattern.",
    motif: "feather-owl",
  },
  {
    id: "nest-eagle",
    type: "nest-shelter",
    correctAnimalId: "bald-eagle",
    distractorAnimalIds: ["great-grey-owl", "canada-goose"],
    prompt: "Who built this nest or shelter?",
    clueCaption: "A massive stick platform high in a shoreline pine — reused and added to over years.",
    explanation:
      "Bald eagles build enormous stick nests in tall shoreline trees, often returning for seasons.",
    motif: "nest-eagle",
  },
  {
    id: "lodge-beaver",
    type: "nest-shelter",
    correctAnimalId: "beaver",
    distractorAnimalIds: ["river-otter", "snowshoe-hare"],
    prompt: "Which animal made this shelter?",
    clueCaption: "A dome of mud and peeled sticks rising from pond ice — underwater doors below.",
    explanation:
      "Beavers build lodges of sticks and mud with underwater entrances — shelters that reshape the shore.",
    motif: "lodge-beaver",
  },
  {
    id: "den-fox",
    type: "nest-shelter",
    correctAnimalId: "red-fox",
    distractorAnimalIds: ["grey-wolf", "canada-lynx"],
    prompt: "Identify the shelter.",
    clueCaption: "A sloping burrow mouth in a sandy bank, with worn pads of soil at the entrance.",
    explanation:
      "Red foxes often use dens in banks or hillsides for raising kits — look for the worn doorway soil.",
    motif: "den-fox",
  },
  {
    id: "feed-beaver",
    type: "feeding",
    correctAnimalId: "beaver",
    distractorAnimalIds: ["moose", "snowshoe-hare"],
    prompt: "Who left this feeding clue?",
    clueCaption: "Pencil-point stumps and wood chips — trunks cut on a clean diagonal.",
    explanation:
      "Beavers carve woody stems at a neat angle, leaving chips and pointed stumps near water.",
    motif: "feeding-bark",
  },
  {
    id: "feed-eagle",
    type: "feeding",
    correctAnimalId: "bald-eagle",
    distractorAnimalIds: ["river-otter", "northern-pike"],
    prompt: "Match the feeding sign to its animal.",
    clueCaption: "Fish scales and bones scattered beneath a tall shoreline perch.",
    explanation:
      "Eagles often leave fish remains under favored perches after meals over open water.",
    motif: "feeding-fish-remains",
  },
  {
    id: "feed-moose",
    type: "feeding",
    correctAnimalId: "moose",
    distractorAnimalIds: ["white-tailed-deer", "woodland-caribou"],
    prompt: "Which browser left this clue?",
    clueCaption: "High-broken willow stems and stripped twigs above deer height.",
    explanation:
      "Moose browse high — snapped stems and stripped twigs often sit above what deer can reach.",
    motif: "feeding-browse",
  },
  {
    id: "sil-moose",
    type: "silhouette",
    correctAnimalId: "moose",
    distractorAnimalIds: ["woodland-caribou", "white-tailed-deer"],
    prompt: "Which animal is this silhouette?",
    clueCaption: "A towering shoulder hump and long legs against the spruce edge.",
    explanation:
      "The moose silhouette is unmistakable: high shoulders, long legs, and a heavy head carriage.",
    motif: "sil-moose",
  },
  {
    id: "sil-crane",
    type: "silhouette",
    correctAnimalId: "sandhill-crane",
    distractorAnimalIds: ["canada-goose", "great-grey-owl"],
    prompt: "Identify the silhouette.",
    clueCaption: "A tall, upright marsh bird with a long neck and trailing legs in flight.",
    explanation:
      "Sandhill cranes show long necks and legs — a lankier sky outline than a goose.",
    motif: "sil-crane",
  },
  {
    id: "sil-sturgeon",
    type: "silhouette",
    correctAnimalId: "lake-sturgeon",
    distractorAnimalIds: ["northern-pike", "brook-trout"],
    prompt: "Which fish is shown here?",
    clueCaption: "A long, armored body with a shovel snout — a shape of deep river time.",
    explanation:
      "Lake sturgeon silhouettes show bony scutes and an ancient, tapered snout — unlike trim trout or pike.",
    motif: "sil-sturgeon",
  },
  {
    id: "sil-bat",
    type: "silhouette",
    correctAnimalId: "little-brown-bat",
    distractorAnimalIds: ["northern-flying-squirrel", "great-grey-owl"],
    prompt: "Match the silhouette to its animal.",
    clueCaption: "A tiny, fast fluttering outline over dusk water — wings quick and angled.",
    explanation:
      "Little brown bats sketch sharp, fluttering silhouettes while hunting insects after dusk.",
    motif: "sil-bat",
  },
];

export const tracksCopy = {
  scoreLabel: "Session score",
  nextChallenge: "Next clue",
  tryAgain: "Try again",
  placeHint: "Drag an animal here — or tap to select, then tap to place",
  selectedLabel: "Selected",
  correctSoft: "Well spotted",
  incorrectSoft: "Not that one — here’s the story",
  replayCall: "Play call again",
  callPlaying: "Playing…",
  callMissing: "Call audio arrives with final media",
  audioCaption: "Caption",
  startOver: "New set of clues",
  detectiveHint: "You’re a wildlife detective — every clue has a gentle answer",
} as const;
