import type { ExhibitSlug, MediaAsset } from "@/types/content";

/** Ambient background treatment for the shell layer (exhibits may still paint their own). */
export type ExhibitBackgroundConfig = {
  imageSrc?: string;
  videoSrc?: string;
  posterSrc?: string;
  /** Tokenized overlay wash when no media is ready */
  fallbackTone?: "boreal-night" | "deep-lake" | "snow-mist" | "museum-glow";
  ambientTone?: "mist" | "aurora" | "night" | "warm" | "none";
  scrim?: "none" | "mist" | "night" | "warm";
};

export type ExhibitAudioConfig = {
  /**
   * Default mute for a fresh station (no persisted settings yet).
   * Never overwrites a visitor/staff mute stored locally.
   */
  muted: boolean;
  /** Station master volume ceiling for this exhibit (0–1). Conservative. */
  volume: number;
  /** Optional ambient bed path under /public */
  ambientSrc?: string;
  /** Ambient bed gain before × master (default ~0.18) */
  ambientVolume?: number;
  /** Default call oneshot gain before × master */
  callVolume?: number;
  /** Narration / VO gain before × master */
  narrationVolume?: number;
  /** Interface feedback gain before × master */
  uiVolume?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
};

/**
 * Navigation policy for a kiosk station.
 * External URLs and unlisted routes are blocked.
 */
export type ExhibitNavigationConfig = {
  /** Show / enable home–restart control */
  allowHomeRestart: boolean;
  /**
   * Paths this station may open (always includes its own `/exhibit/{id}`).
   * `/staff` is allowed only via the hidden staff gesture.
   */
  allowedPaths: string[];
};

/**
 * Per-exhibit attract screen copy and media.
 * Attract video is always muted; ambient audio plays only when allowAmbientAudio is true.
 */
export type AttractModeContent = {
  /** Defaults to the museum lockup */
  museumName?: string;
  title: string;
  /** Short invitation under the title */
  invitation: string;
  /** CTA line — defaults to “Touch to Explore” */
  promptLabel?: string;
  background: ExhibitBackgroundConfig;
  /**
   * When true and the exhibit has ambientSrc configured, attract may keep ambient beds.
   * Default false — no audio autoplay on idle screens.
   */
  allowAmbientAudio?: boolean;
};

/**
 * Shell runtime configuration for one physical touchscreen station.
 * Does not dictate scene composition — only shared chrome and behaviour.
 */
export type ExhibitConfig = {
  id: ExhibitSlug;
  title: string;
  subtitle: string;
  /** Return exhibit UI to home after this much inactivity */
  inactivityTimeoutMs: number;
  /**
   * After this much inactivity, show attract mode (0 = disabled).
   * Typically ≥ inactivityTimeoutMs so home reset happens first.
   */
  attractModeDelayMs: number;
  defaultAudio: ExhibitAudioConfig;
  defaultBackground: ExhibitBackgroundConfig;
  /** Cinematic idle / attract screen for this station */
  attract: AttractModeContent;
  allowedNavigation: ExhibitNavigationConfig;
  /** Shell progress dots; exhibits supply values via props when true */
  showProgress: boolean;
  /** Compact title strip in chrome — set false when the exhibit owns branding */
  showTitleArea: boolean;
  /** When false, hide the shell museum lockup (exhibit owns branding in-layout). */
  showShellBrand?: boolean;
  /** Optional default background MediaAsset references for ops clarity */
  backgroundAssets?: {
    image?: MediaAsset;
    video?: MediaAsset;
    audio?: MediaAsset;
  };
};

export type ExhibitProgressState = {
  count: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  label?: string;
};
