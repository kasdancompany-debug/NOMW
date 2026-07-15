/**
 * Conservative room-safe audio defaults for eight concurrent kiosk stations.
 * Clip volumes multiply by the station master (store.volume).
 */
export const MUSEUM_AUDIO = {
  /** Station master default — persisted locally; kept moderate for shared rooms */
  masterVolume: 0.45,
  /** Soft ambient beds (forest, water, night) */
  ambientVolume: 0.18,
  /** One-shot animal calls */
  callVolume: 0.28,
  /** Short narration / VO beds */
  narrationVolume: 0.32,
  /** Interface ticks — nearly subliminal */
  uiVolume: 0.12,
  /** Howler fade durations (ms) */
  fadeInMs: 600,
  fadeOutMs: 450,
  /** Faster duck when a major clip interrupts ambient */
  duckFadeMs: 220,
  /** UI ticks never longer than this intentional play window */
  uiMaxMs: 400,
} as const;
