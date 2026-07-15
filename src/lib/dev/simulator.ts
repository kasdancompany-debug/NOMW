/**
 * Development museum simulator protocol.
 * Parent (/dev/museum-simulator) ↔ iframe exhibits (?simulator=1).
 * Dev-only — production builds never activate.
 */

export const SIMULATOR_QUERY = "simulator";
export const SIMULATOR_CHANNEL = "nomow:simulator";

export const SIMULATOR_MEDIA_FAIL_KEY = "nomow.simulator.mediaFailure";
export const SIMULATOR_OFFLINE_KEY = "nomow.simulator.offline";

export type SimulatorFrameState = {
  exhibitId: string | null;
  phase: string;
  remainingMs: number;
  remainingAttractMs: number | null;
  resetGeneration: number;
  muted: boolean;
  volume: number;
  forceReducedMotion: boolean | null;
  mediaFailure: boolean;
  offlineSim: boolean;
  lastInteractionAt: number;
};

export type SimulatorCommand =
  | { type: typeof SIMULATOR_CHANNEL; action: "softReset"; reason?: string }
  | { type: typeof SIMULATOR_CHANNEL; action: "triggerInactivity" }
  | { type: typeof SIMULATOR_CHANNEL; action: "triggerAttract" }
  | { type: typeof SIMULATOR_CHANNEL; action: "noteInteraction" }
  | { type: typeof SIMULATOR_CHANNEL; action: "setMuted"; muted: boolean }
  | { type: typeof SIMULATOR_CHANNEL; action: "setReducedMotion"; value: boolean | null }
  | { type: typeof SIMULATOR_CHANNEL; action: "setMediaFailure"; enabled: boolean }
  | { type: typeof SIMULATOR_CHANNEL; action: "setOffline"; enabled: boolean }
  | { type: typeof SIMULATOR_CHANNEL; action: "requestState" }
  | { type: typeof SIMULATOR_CHANNEL; action: "reload" };

/** Command body without channel type (parent → iframe). */
export type SimulatorCommandBody =
  | { action: "softReset"; reason?: string }
  | { action: "triggerInactivity" }
  | { action: "triggerAttract" }
  | { action: "noteInteraction" }
  | { action: "setMuted"; muted: boolean }
  | { action: "setReducedMotion"; value: boolean | null }
  | { action: "setMediaFailure"; enabled: boolean }
  | { action: "setOffline"; enabled: boolean }
  | { action: "requestState" }
  | { action: "reload" };

export type SimulatorStateMessage = {
  type: typeof SIMULATOR_CHANNEL;
  action: "state";
  state: SimulatorFrameState;
};

export function isSimulatorEnvironment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isSimulatorFrame(): boolean {
  if (typeof window === "undefined") return false;
  if (!isSimulatorEnvironment()) return false;
  try {
    return new URLSearchParams(window.location.search).get(SIMULATOR_QUERY) === "1";
  } catch {
    return false;
  }
}

export function exhibitSimulatorSrc(slug: string): string {
  return `/exhibit/${slug}?${SIMULATOR_QUERY}=1`;
}

export function setSimulatorMediaFailure(enabled: boolean): void {
  if (typeof window === "undefined" || !isSimulatorEnvironment()) return;
  try {
    if (enabled) window.sessionStorage.setItem(SIMULATOR_MEDIA_FAIL_KEY, "1");
    else window.sessionStorage.removeItem(SIMULATOR_MEDIA_FAIL_KEY);
    window.dispatchEvent(new Event("nomow-simulator-flags"));
  } catch {
    /* ignore */
  }
}

export function isSimulatorMediaFailure(): boolean {
  if (typeof window === "undefined" || !isSimulatorEnvironment()) return false;
  try {
    return window.sessionStorage.getItem(SIMULATOR_MEDIA_FAIL_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Force production media components down their real error → fallback path.
 * Does not replace LocalImage / LocalVideo with a mock UI.
 */
export function applySimulatorMediaSrc(src: string): string {
  if (!src || !isSimulatorMediaFailure()) return src;
  if (src.startsWith("data:")) return src;
  return `/__simulator_missing__${src.startsWith("/") ? src : `/${src}`}`;
}

export function setSimulatorOffline(enabled: boolean): void {
  if (typeof window === "undefined" || !isSimulatorEnvironment()) return;
  try {
    if (enabled) window.sessionStorage.setItem(SIMULATOR_OFFLINE_KEY, "1");
    else window.sessionStorage.removeItem(SIMULATOR_OFFLINE_KEY);
    window.dispatchEvent(new Event("nomow-simulator-flags"));
  } catch {
    /* ignore */
  }
}

export function isSimulatorOffline(): boolean {
  if (typeof window === "undefined" || !isSimulatorEnvironment()) return false;
  try {
    return window.sessionStorage.getItem(SIMULATOR_OFFLINE_KEY) === "1";
  } catch {
    return false;
  }
}

export function postSimulatorCommand(
  target: Window | null | undefined,
  command: SimulatorCommandBody,
): void {
  if (!target) return;
  const message = { ...command, type: SIMULATOR_CHANNEL } as SimulatorCommand;
  target.postMessage(message, window.location.origin);
}

export function isSimulatorCommand(data: unknown): data is SimulatorCommand {
  if (!data || typeof data !== "object") return false;
  const record = data as { type?: string; action?: string };
  return record.type === SIMULATOR_CHANNEL && typeof record.action === "string";
}
