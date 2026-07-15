import type { MediaAsset, MediaId } from "@/types/content";

/** HTML media preload strategy — keep startup light by default. */
export type MediaPreload = "none" | "metadata" | "auto";

/** Concurrent audio roles on a single kiosk station. */
export type AudioRole = "ambient" | "call" | "narration" | "ui" | "prominent";

/** Optional responsive derivative for images or alternate video sources. */
export type MediaSourceVariant = {
  src: string;
  /** Intrinsic width hint for srcset (images) */
  width?: number;
  type?: string;
  /** Optional max viewport width (px) for this candidate */
  mediaMaxWidth?: number;
};

/**
 * Playback-oriented fields layered on content MediaAsset.
 * Keep optional so existing catalog records remain valid.
 */
export type LocalMediaAsset = MediaAsset & {
  /** WebVTT / caption file under /public */
  captionsSrc?: string;
  /** Still or alternate used when primary fails */
  fallbackSrc?: string;
  /** Responsive / alternate files — largest last is fine; helpers sort by width */
  sources?: MediaSourceVariant[];
  preload?: MediaPreload;
  /** Visitor-facing caption (distinct from staff `label`) */
  caption?: string;
};

export type LocalImageProps = {
  asset?: LocalMediaAsset | null;
  /** Direct path when no MediaAsset is authored yet */
  src?: string;
  alt?: string;
  fallbackSrc?: string;
  caption?: string;
  attribution?: string;
  className?: string;
  imgClassName?: string;
  /**
   * When true, load immediately (hero / LCP).
   * Default lazy — large media must not all load at startup.
   */
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  onError?: () => void;
  showAttribution?: boolean;
  showCaption?: boolean;
};

export type LocalVideoProps = {
  asset?: LocalMediaAsset | null;
  src?: string;
  poster?: string;
  fallbackSrc?: string;
  caption?: string;
  attribution?: string;
  className?: string;
  videoClassName?: string;
  /** Default true for ambience beds; respect asset.loop when provided */
  loop?: boolean;
  /** Safe autoplay only when muted (museum default) */
  autoPlay?: boolean;
  muted?: boolean;
  /** Default "metadata"; use "none" for offscreen / deferred beds */
  preload?: MediaPreload;
  /**
   * When true, do not assign `src` until the element nears the viewport
   * (or until `priority` is set).
   */
  lazy?: boolean;
  priority?: boolean;
  /** Play only while intersecting viewport */
  playWhenVisible?: boolean;
  onError?: () => void;
  showAttribution?: boolean;
  showCaption?: boolean;
};

export type UseLocalAudioOptions = {
  id: MediaId | string;
  src: string;
  role?: AudioRole;
  volume?: number;
  loop?: boolean;
  /** Default "none" for one-shots; ambience may use metadata */
  preload?: MediaPreload;
  fadeInMs?: number;
  fadeOutMs?: number;
  /**
   * When true (default for Listen / call / narration), unmutes so the visitor’s
   * intentional tap can be heard. Station mute still persists via Sound control.
   */
  unmuteOnPlay?: boolean;
  onEnd?: () => void;
  onError?: () => void;
};
