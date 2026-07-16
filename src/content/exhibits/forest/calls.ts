/**
 * Public-domain forest call audio (USFWS / NPS via SoundBible).
 * Species without a verified matching recording stay on the placeholder path
 * so ListenControl reports unavailable — we do not invent animal voices.
 */
import type { AnimalId, MediaAsset } from "@/types/content";

const ATTR = {
  moose: "Female moose call — U.S. Fish & Wildlife Service (public domain).",
  "black-bear": "Bear with cubs — U.S. National Park Service (public domain).",
  "grey-wolf": "Wolf pack howl — U.S. Fish & Wildlife Service (public domain).",
} as const;

function callAsset(
  id: AnimalId,
  filename: string,
  caption: string,
): MediaAsset {
  return {
    id: `forest-call-${id}`,
    kind: "audio",
    src: `/media/sounds/calls/${filename}`,
    label: `${id} call`,
    caption,
    volume: 0.32,
    preload: "none",
    placeholder: false,
    attribution: caption,
  };
}

/** Real call files available for Forest “Hear a call”. */
export const FOREST_CALL_AUDIO: Partial<Record<AnimalId, MediaAsset>> = {
  moose: callAsset("moose", "moose-call.mp3", ATTR.moose),
  "black-bear": callAsset("black-bear", "black-bear-call.mp3", ATTR["black-bear"]),
  "grey-wolf": callAsset("grey-wolf", "grey-wolf-call.mp3", ATTR["grey-wolf"]),
};

export function forestCallAudioFor(animalId: AnimalId): MediaAsset | undefined {
  return FOREST_CALL_AUDIO[animalId];
}
