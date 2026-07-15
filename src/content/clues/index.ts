/**
 * Track and sound clue catalogs for Tracks / Night exhibits.
 * Descriptions default to research placeholders until naturalist review.
 */

import { createPlaceholderMedia, researchPlaceholder } from "@/content/media/placeholders";
import type { SoundClue, TrackClue } from "@/types/content";

export const trackClues: TrackClue[] = [
  {
    id: "track-moose",
    animalId: "moose",
    label: "Large ungulate track",
    description:
      "[NEEDS RESEARCH] Field-accurate moose track description awaiting naturalist review.",
    confidence: "needs-research",
    researchNote: "Do not invent pad counts, measurements, or gait notes.",
    mediaId: "moose-track-placeholder",
  },
  {
    id: "track-wolf",
    animalId: "grey-wolf",
    label: "Canid track line",
    description:
      "[NEEDS RESEARCH] Wolf vs dog comparison copy awaiting curator approval.",
    confidence: "needs-research",
    researchNote: "Misidentification risk is high — specialist review required.",
    mediaId: "grey-wolf-track-placeholder",
  },
  {
    id: "track-hare",
    animalId: "snowshoe-hare",
    label: "Snowshoe pair",
    description:
      "[NEEDS RESEARCH] Hare track pattern description awaiting naturalist review.",
    confidence: "needs-research",
    researchNote: "Confirm hop pattern language before Tracks exhibit lock.",
    mediaId: "snowshoe-hare-track-placeholder",
  },
];

export const soundClues: SoundClue[] = [
  {
    id: "sound-loon",
    animalId: "common-loon",
    label: "Lake call",
    description:
      "[NEEDS RESEARCH] Loon call typology captions awaiting audio + specialist pairing.",
    confidence: "needs-research",
    researchNote: "Pair only with verified recordings.",
    mediaId: "common-loon-call",
  },
  {
    id: "sound-wolf",
    animalId: "grey-wolf",
    label: "Distant howl",
    description:
      "[NEEDS RESEARCH] Howl description awaiting verified audio and ethology notes.",
    confidence: "needs-research",
    researchNote: "Avoid mythic language; keep ecological.",
    mediaId: "grey-wolf-call",
  },
  {
    id: "sound-owl",
    animalId: "great-grey-owl",
    label: "Soft night call",
    description:
      "[NEEDS RESEARCH] Owl vocalization caption awaiting verified recording.",
    confidence: "needs-research",
    researchNote: "Confirm species-typical calls before Night exhibit.",
    mediaId: "great-grey-owl-call",
  },
];

/** Optional media stubs referenced by clue mediaIds. */
export const clueMedia = [
  createPlaceholderMedia({
    id: "moose-track-placeholder",
    kind: "image",
    folder: "animals",
    filename: "moose-track",
    label: "Moose track illustration",
    alt: "Placeholder moose track illustration",
  }),
  createPlaceholderMedia({
    id: "grey-wolf-track-placeholder",
    kind: "image",
    folder: "animals",
    filename: "grey-wolf-track",
    label: "Grey wolf track illustration",
    alt: "Placeholder grey wolf track illustration",
  }),
  createPlaceholderMedia({
    id: "snowshoe-hare-track-placeholder",
    kind: "image",
    folder: "animals",
    filename: "snowshoe-hare-track",
    label: "Snowshoe hare track illustration",
    alt: "Placeholder snowshoe hare track illustration",
  }),
];

export const coexistenceResearchNote = researchPlaceholder(
  "Coexistence advice is incomplete until educator and wildlife-specialist approval.",
  "Never present unverified safety guidance on the museum floor.",
);
