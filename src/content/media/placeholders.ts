import type {
  AnimalFact,
  AnimalId,
  MediaAsset,
  MediaId,
  MediaKind,
  PlaceholderMetric,
  PlaceholderText,
} from "@/types/content";

/** Build a clearly labelled placeholder media path under /public/media. */
export function placeholderMediaPath(
  kind: MediaKind,
  folder: "animals" | "habitats" | "ambience" | "sounds" | "video",
  filename: string,
): string {
  const ext =
    kind === "image" ? "webp" : kind === "video" ? "mp4" : "mp3";
  const safe = filename.replace(/\.[a-z0-9]+$/i, "");
  return `/media/${folder}/placeholders/${safe}.PLACEHOLDER.${ext}`;
}

export function createPlaceholderMedia(input: {
  id: MediaId;
  kind: MediaKind;
  folder: "animals" | "habitats" | "ambience" | "sounds" | "video";
  filename: string;
  label: string;
  alt?: string;
  poster?: string;
  loop?: boolean;
  volume?: number;
  caption?: string;
  captionsSrc?: string;
  fallbackSrc?: string;
  preload?: MediaAsset["preload"];
}): MediaAsset {
  return {
    id: input.id,
    kind: input.kind,
    src: placeholderMediaPath(input.kind, input.folder, input.filename),
    label: `[PLACEHOLDER] ${input.label}`,
    alt: input.alt,
    poster: input.poster,
    loop: input.loop,
    volume: input.volume,
    caption: input.caption,
    captionsSrc: input.captionsSrc,
    fallbackSrc: input.fallbackSrc,
    preload: input.preload ?? (input.kind === "audio" ? "none" : "metadata"),
    placeholder: true,
    attribution: "Placeholder media — replace before floor install.",
  };
}

export function animalMediaSet(animalId: AnimalId, commonName: string) {
  const base = animalId;
  return {
    heroImage: createPlaceholderMedia({
      id: `${base}-hero`,
      kind: "image",
      folder: "animals",
      filename: `${base}-hero`,
      label: `${commonName} hero image`,
      alt: `Placeholder hero image for ${commonName}`,
    }),
    galleryImages: [
      createPlaceholderMedia({
        id: `${base}-gallery-01`,
        kind: "image",
        folder: "animals",
        filename: `${base}-gallery-01`,
        label: `${commonName} gallery 1`,
        alt: `Placeholder gallery image 1 for ${commonName}`,
      }),
      createPlaceholderMedia({
        id: `${base}-gallery-02`,
        kind: "image",
        folder: "animals",
        filename: `${base}-gallery-02`,
        label: `${commonName} gallery 2`,
        alt: `Placeholder gallery image 2 for ${commonName}`,
      }),
    ],
    silhouetteImage: createPlaceholderMedia({
      id: `${base}-silhouette`,
      kind: "image",
      folder: "animals",
      filename: `${base}-silhouette`,
      label: `${commonName} silhouette`,
      alt: `Placeholder silhouette for ${commonName}`,
    }),
    habitatVideo: createPlaceholderMedia({
      id: `${base}-habitat-video`,
      kind: "video",
      folder: "video",
      filename: `${base}-habitat-loop`,
      label: `${commonName} habitat video`,
      loop: true,
      poster: placeholderMediaPath("image", "animals", `${base}-habitat-poster`),
    }),
    transparentAnimalImage: createPlaceholderMedia({
      id: `${base}-transparent`,
      kind: "image",
      folder: "animals",
      filename: `${base}-transparent`,
      label: `${commonName} transparent cutout`,
      alt: `Placeholder transparent animal image for ${commonName}`,
    }),
    callAudio: createPlaceholderMedia({
      id: `${base}-call`,
      kind: "audio",
      folder: "sounds",
      filename: `${base}-call`,
      label: `${commonName} call audio`,
      volume: 0.28,
    }),
    ambientAudio: createPlaceholderMedia({
      id: `${base}-ambient`,
      kind: "audio",
      folder: "ambience",
      filename: `${base}-ambient`,
      label: `${commonName} ambient bed`,
      loop: true,
      volume: 0.25,
    }),
  };
}

export function researchPlaceholder(
  text: string,
  researchNote: string,
): PlaceholderText {
  return {
    text,
    status: "placeholder",
    researchNote,
  };
}

export function researchMetric(display: string, researchNote: string): PlaceholderMetric {
  return {
    display,
    status: "placeholder",
    researchNote,
  };
}

export function researchFact(id: string, text: string, researchNote: string): AnimalFact {
  return {
    id,
    text,
    confidence: "needs-research",
    researchNote,
  };
}

/** Soft, non-specific museum phrasing only — still flag for curator pass. */
export function generalFact(id: string, text: string): AnimalFact {
  return {
    id,
    text,
    confidence: "general-knowledge",
  };
}

export const INDIGENOUS_NAME_AWAITING_CONSULTATION = researchPlaceholder(
  "Indigenous name(s) to be confirmed with knowledge keepers",
  "Do not invent Indigenous names, spellings, or meanings. Record language, community attribution, and permission before floor display.",
);

export const METRIC_AWAITING_CURATOR = (topic: string) =>
  researchMetric(
    `[NEEDS RESEARCH] ${topic}`,
    `Confirm ${topic.toLowerCase()} for Northern Ontario populations using curator-approved sources before presenting as fact.`,
  );
