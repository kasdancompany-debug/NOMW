import type { ExhibitSlug } from "@/types/content";

export type KioskSessionPhase = "active" | "warning" | "reset" | "attract";

export type KioskSettings = {
  muted: boolean;
  volume: number;
  /** null = follow OS preference */
  forceReducedMotion: boolean | null;
  /** How often the health heartbeat writes */
  heartbeatIntervalMs: number;
  /** Soft-reset after uncaught errors when possible */
  softResetOnError: boolean;
  warningMs: number;
  /**
   * Optional staff override for inactivity soft-reset (ms).
   * null / undefined = use exhibit config default.
   */
  inactivityTimeoutMs?: number | null;
  /**
   * Optional staff override for attract delay (ms).
   * null / undefined = use exhibit config default.
   */
  attractModeDelayMs?: number | null;
};

export type ExhibitSessionConfig = {
  exhibitId: ExhibitSlug;
  inactivityTimeoutMs: number;
  attractModeDelayMs: number;
  warningMs?: number;
  homeSceneId?: string;
};

export type ExhibitResetHandler = () => void;

export type KioskHeartbeat = {
  at: number;
  exhibitId: ExhibitSlug | null;
  phase: KioskSessionPhase;
  uptimeMs: number;
  resetCount: number;
  lastErrorAt: number | null;
};

export type KioskSessionApi = {
  phase: KioskSessionPhase;
  /** Milliseconds until soft reset; 0 when already past timeout */
  remainingMs: number;
  /** Milliseconds until attract mode; null when attract disabled */
  remainingAttractMs: number | null;
  lastInteractionAt: number;
  isWarning: boolean;
  isAttract: boolean;
  resetGeneration: number;
  settings: KioskSettings;
  heartbeat: KioskHeartbeat | null;
  exhibitConfig: ExhibitSessionConfig | null;
  noteInteraction: () => void;
  configureExhibit: (config: ExhibitSessionConfig) => void;
  /** Register a soft-reset handler; returns unsubscribe */
  registerResetHandler: (handler: ExhibitResetHandler) => () => void;
  /** Run registered handlers without reloading the page */
  softReset: (reason?: string) => void;
  updateSettings: (patch: Partial<KioskSettings>) => void;
  dismissWarning: () => void;
  dismissAttract: () => void;
  /**
   * Shift the idle clock as if `elapsedMs` have already passed since the last interaction.
   * Used by the museum simulator to exercise real attract / inactivity paths — not a mock phase.
   */
  advanceIdleClock: (elapsedMs: number) => void;
};

export const KIOSK_SETTINGS_STORAGE_KEY = "nomow.kiosk.settings.v1";
export const KIOSK_HEARTBEAT_STORAGE_KEY = "nomow.kiosk.heartbeat.v1";

export const DEFAULT_KIOSK_SETTINGS: KioskSettings = {
  muted: false,
  volume: 0.45,
  forceReducedMotion: null,
  heartbeatIntervalMs: 15_000,
  softResetOnError: true,
  warningMs: 10_000,
  inactivityTimeoutMs: null,
  attractModeDelayMs: null,
};
