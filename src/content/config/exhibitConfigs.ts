import type { ExhibitSlug } from "@/types/content";
import type { AttractModeContent, ExhibitConfig } from "@/types/exhibit-shell";
import { EXHIBIT_SLUGS } from "@/types/content";
import { createPlaceholderMedia } from "@/content/media/placeholders";
import { idleConfig } from "@/content/config/idle.config";

function backgroundFor(
  id: ExhibitSlug,
  title: string,
  fallbackTone: ExhibitConfig["defaultBackground"]["fallbackTone"],
  ambientTone: ExhibitConfig["defaultBackground"]["ambientTone"],
) {
  const image = createPlaceholderMedia({
    id: `${id}-shell-bg`,
    kind: "image",
    folder: "habitats",
    filename: `${id}-shell-bg`,
    label: `${title} shell background`,
    alt: `Placeholder background for ${title} exhibit`,
  });
  const video = createPlaceholderMedia({
    id: `${id}-shell-bg-video`,
    kind: "video",
    folder: "video",
    filename: `${id}-shell-bg-loop`,
    label: `${title} shell background video`,
    loop: true,
    poster: image.src,
  });
  const audio = createPlaceholderMedia({
    id: `${id}-shell-ambient`,
    kind: "audio",
    folder: "ambience",
    filename: `${id}-shell-ambient`,
    label: `${title} shell ambient audio`,
    loop: true,
    volume: 0.22,
  });

  return {
    defaultBackground: {
      fallbackTone,
      ambientTone,
      scrim: "mist" as const,
      // Wire placeholders so LocalImage/LocalVideo/Attract can soft-fail to labelled media
      // (and LayeredLandscape when files are missing).
      imageSrc: image.src,
      posterSrc: image.src,
      videoSrc: undefined,
    },
    backgroundAssets: { image, video, audio },
    defaultAudio: {
      muted: false,
      volume: 0.45,
      ambientVolume: 0.18,
      callVolume: 0.28,
      narrationVolume: 0.32,
      uiVolume: 0.12,
      fadeInMs: 600,
      fadeOutMs: 450,
      // Keep ambient off until final beds ship — avoids Howler 404 loops on every station.
      ambientSrc: undefined as string | undefined,
    },
  };
}

function attractFor(
  title: string,
  invitation: string,
  background: ExhibitConfig["defaultBackground"],
  extras?: Partial<AttractModeContent>,
): AttractModeContent {
  return {
    title,
    invitation,
    promptLabel: "Touch to Explore",
    background: {
      ...background,
      // Prefer looping video when delivered; until then fallback tone + habitat drift.
      imageSrc: background.imageSrc,
      videoSrc: background.videoSrc,
      posterSrc: background.posterSrc,
    },
    allowAmbientAudio: false,
    ...extras,
  };
}

function baseConfig(
  partial: Omit<
    ExhibitConfig,
    "defaultAudio" | "defaultBackground" | "backgroundAssets" | "allowedNavigation" | "attract"
  > & {
    fallbackTone: ExhibitConfig["defaultBackground"]["fallbackTone"];
    ambientTone: ExhibitConfig["defaultBackground"]["ambientTone"];
    invitation: string;
    allowedPaths?: string[];
    attractExtras?: Partial<AttractModeContent>;
  },
): ExhibitConfig {
  const media = backgroundFor(
    partial.id,
    partial.title,
    partial.fallbackTone,
    partial.ambientTone,
  );

  return {
    id: partial.id,
    title: partial.title,
    subtitle: partial.subtitle,
    inactivityTimeoutMs: partial.inactivityTimeoutMs,
    attractModeDelayMs: partial.attractModeDelayMs,
    showProgress: partial.showProgress,
    showTitleArea: partial.showTitleArea,
    showShellBrand: partial.showShellBrand,
    allowedNavigation: {
      allowHomeRestart: true,
      allowedPaths: partial.allowedPaths ?? [`/exhibit/${partial.id}`],
    },
    attract: attractFor(
      partial.title,
      partial.invitation,
      media.defaultBackground,
      partial.attractExtras,
    ),
    ...media,
  };
}

/**
 * Shell configs for all eight stations.
 * Content feature lists remain in exhibitConfigurations.ts.
 */
export const exhibitConfigs: Record<ExhibitSlug, ExhibitConfig> = {
  welcome: baseConfig({
    id: "welcome",
    title: "Welcome",
    subtitle: "A Living World of Forest, Water, Sky and Snow",
    invitation: "Open the atlas — begin the north.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "museum-glow",
    ambientTone: "warm",
    attractExtras: {
      title: "Welcome",
      invitation:
        "Northern Ontario Museum of Wonder — touch to open the living atlas.",
      promptLabel: "Touch to Explore",
    },
  }),
  forest: baseConfig({
    id: "forest",
    title: "Giants of the Forest",
    subtitle: "Meet the great travelers of the boreal",
    invitation: "Many animals call the forest home — touch to explore.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    showShellBrand: false,
    fallbackTone: "boreal-night",
    ambientTone: "mist",
    attractExtras: {
      title: "Giants of the Forest",
      invitation: "Many animals call the forest home — touch to explore.",
      promptLabel: "Touch to Explore",
    },
  }),
  water: baseConfig({
    id: "water",
    title: "Life Beneath the Water",
    subtitle: "From shoreline light to river-bottom dark",
    invitation: "Drag through the water column — from shoreline light to river-bottom dark.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "deep-lake",
    ambientTone: "night",
    attractExtras: {
      title: "Life Beneath the Water",
      invitation: "Shoreline to river bottom — touch to dive into the column.",
      promptLabel: "Touch to Explore",
    },
  }),
  sky: baseConfig({
    id: "sky",
    title: "Wings of the North",
    subtitle: "Flight, call, and seasonal pathways above the Shield",
    invitation: "Swipe the panorama — touch a bird, measure wingspan, and compare flight.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "deep-lake",
    ambientTone: "aurora",
    attractExtras: {
      title: "Wings of the North",
      invitation: "Sky highways over the Shield — touch to look up.",
      promptLabel: "Touch to Explore",
    },
  }),
  night: baseConfig({
    id: "night",
    title: "The Forest After Dark",
    subtitle: "Guide a gentle beam through the night canopy",
    invitation: "The forest waits in quiet dark — touch and drag a soft beam to explore.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "boreal-night",
    ambientTone: "night",
    attractExtras: {
      title: "The Forest After Dark",
      invitation: "A gentle beam. Quiet discovery. Touch to enter the night.",
      promptLabel: "Touch to Explore",
    },
  }),
  seasons: baseConfig({
    id: "seasons",
    title: "Four Seasons of Survival",
    subtitle: "One Northern Ontario shore — remade by thaw, green, gold, and ice",
    invitation: "Turn the year — watch vegetation, light, water, and wildlife transform.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "snow-mist",
    ambientTone: "mist",
    attractExtras: {
      title: "Four Seasons of Survival",
      invitation: "Spring to winter on one shore — touch to turn the year.",
      promptLabel: "Touch to Explore",
    },
  }),
  tracks: baseConfig({
    id: "tracks",
    title: "Tracks, Calls and Clues",
    subtitle: "Read the quiet evidence Northern Ontario wildlife leaves behind",
    invitation: "Match prints, calls, fur, shelters, and silhouettes — gently detective work.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "snow-mist",
    ambientTone: "mist",
    attractExtras: {
      title: "Tracks, Calls and Clues",
      invitation: "Every clue has a story — touch to begin detecting.",
      promptLabel: "Touch to Explore",
    },
  }),
  coexistence: baseConfig({
    id: "coexistence",
    title: "Living Together",
    subtitle: "Practical ways people and wildlife share Northern Ontario",
    invitation: "Shared trails, shared waters — choose hopeful habits beside wildlife.",
    inactivityTimeoutMs: idleConfig.timeoutMs,
    attractModeDelayMs: idleConfig.timeoutMs + 5_000,
    showProgress: false,
    showTitleArea: false,
    fallbackTone: "museum-glow",
    ambientTone: "warm",
    attractExtras: {
      title: "Living Together",
      invitation: "Real situations. Gentle choices. Touch to practise living beside wildlife.",
      promptLabel: "Touch to Explore",
    },
  }),
};

export function getExhibitConfig(id: ExhibitSlug): ExhibitConfig {
  return exhibitConfigs[id];
}

export function listExhibitConfigs(): ExhibitConfig[] {
  return EXHIBIT_SLUGS.map((slug) => exhibitConfigs[slug]);
}
