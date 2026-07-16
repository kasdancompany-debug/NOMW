import type { AnimalId, MediaAsset } from "@/types/content";

/**
 * Editorial wildlife portraits for Forest full-profile (generated exhibition stills).
 * Guest-facing captions stay scenic — no placeholder / replace-before-install language.
 */
export function forestPortraitSrc(animalId: AnimalId | string): string {
  return `/media/animals/portraits/${animalId}.webp`;
}

export function forestPortraitAsset(
  animalId: AnimalId,
  commonName: string,
): MediaAsset {
  return {
    id: `forest-portrait-${animalId}`,
    kind: "image",
    src: forestPortraitSrc(animalId),
    label: `${commonName} portrait`,
    alt: `${commonName} in Northern Ontario wilderness`,
    caption: `${commonName} — Northern Ontario`,
    attribution: "Exhibition portrait",
    placeholder: false,
    preload: "metadata",
  };
}

export const FOREST_PORTRAIT_IDS: AnimalId[] = [
  "moose",
  "black-bear",
  "grey-wolf",
  "woodland-caribou",
  "white-tailed-deer",
  "canada-lynx",
];

export function hasForestPortrait(animalId: string): boolean {
  return FOREST_PORTRAIT_IDS.includes(animalId as AnimalId);
}
