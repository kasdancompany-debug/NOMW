import type { Howl } from "howler";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import type { AudioRole } from "@/types/media";
import { useAudioStore } from "@/stores/audio.store";

type RegisteredClip = {
  id: string;
  role: AudioRole;
  howl: Howl;
  /** Base clip gain before master / mute (0–1) */
  baseVolume: number;
  fadeInMs: number;
  fadeOutMs: number;
};

export type PlayAudioOptions = {
  /** Skip fade-in (UI ticks) */
  instant?: boolean;
  /** Force volume for this play */
  volume?: number;
};

export type StopAudioOptions = {
  fadeMs?: number;
  instant?: boolean;
};

/**
 * Museum-safe station audio concurrency (Howler).
 *
 * Roles:
 * - ambient — looping beds; ducked (not hard-cut) while major audio plays
 * - call / narration — major clips; mutually exclusive; interrupt each other
 * - ui — short feedback; never interrupts major; never ducks ambient
 *
 * “Prominent” is treated as an alias of call for backward compatibility.
 */
class LocalAudioManager {
  private clips = new Map<string, RegisteredClip>();
  private activeMajorId: string | null = null;
  private listeners = new Set<(activeId: string | null) => void>();
  /** Fade / duck completion timers — cleared on unregister and station silence. */
  private pendingTimers = new Set<number>();

  register(
    id: string,
    role: AudioRole,
    howl: Howl,
    options: {
      baseVolume?: number;
      fadeInMs?: number;
      fadeOutMs?: number;
    } = {},
  ) {
    const normalized = this.normalizeRole(role);
    this.clips.set(id, {
      id,
      role: normalized,
      howl,
      baseVolume: options.baseVolume ?? this.defaultVolumeFor(normalized),
      fadeInMs: options.fadeInMs ?? MUSEUM_AUDIO.fadeInMs,
      fadeOutMs: options.fadeOutMs ?? MUSEUM_AUDIO.fadeOutMs,
    });
  }

  unregister(id: string) {
    const clip = this.clips.get(id);
    if (!clip) return;
    try {
      clip.howl.stop();
    } catch {
      /* already unloaded */
    }
    this.clips.delete(id);
    if (this.activeMajorId === id) {
      this.activeMajorId = null;
      this.notifyActive();
      useAudioStore.getState().resumeBackground();
    }
  }

  /** Cancel outstanding fade/pause timers (idle reset, route leave). */
  clearPendingTimers() {
    if (typeof window === "undefined") {
      this.pendingTimers.clear();
      return;
    }
    for (const timerId of this.pendingTimers) {
      window.clearTimeout(timerId);
    }
    this.pendingTimers.clear();
  }

  private schedule(fn: () => void, ms: number) {
    if (typeof window === "undefined") {
      fn();
      return;
    }
    const timerId = window.setTimeout(() => {
      this.pendingTimers.delete(timerId);
      fn();
    }, ms);
    this.pendingTimers.add(timerId);
  }

  onActiveChange(listener: (activeId: string | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getActiveMajorId() {
    return this.activeMajorId;
  }

  /** @deprecated use getActiveMajorId */
  getActiveProminentId() {
    return this.activeMajorId;
  }

  /**
   * Request playback with museum interruption rules.
   * Returns false if the clip is missing / muted without unmute intent.
   */
  play(id: string, options: PlayAudioOptions = {}): boolean {
    const clip = this.clips.get(id);
    if (!clip) return false;

    const store = useAudioStore.getState();
    if (store.muted && clip.role !== "ui") {
      return false;
    }

    const targetVolume = this.resolveVolume(clip, options.volume);

    if (this.isMajor(clip.role)) {
      // Claim the major slot before stopping peers so their onstop cannot clear us.
      this.activeMajorId = id;
      this.notifyActive();
      this.stopMajorExcept(id, { fadeMs: MUSEUM_AUDIO.duckFadeMs });
      this.duckAmbient();
    }

    try {
      clip.howl.stop();
      if (options.instant || clip.role === "ui" || clip.fadeInMs <= 0) {
        clip.howl.volume(targetVolume);
        clip.howl.play();
      } else {
        clip.howl.volume(0);
        clip.howl.play();
        clip.howl.fade(0, targetVolume, clip.fadeInMs);
      }
      return true;
    } catch {
      if (this.isMajor(clip.role)) {
        this.activeMajorId = null;
        this.notifyActive();
        useAudioStore.getState().resumeBackground();
      }
      return false;
    }
  }

  stop(id: string, options: StopAudioOptions = {}) {
    const clip = this.clips.get(id);
    if (!clip) return;

    const fadeMs =
      options.instant || clip.role === "ui"
        ? 0
        : (options.fadeMs ?? clip.fadeOutMs);

    this.stopHowl(clip, fadeMs);

    if (this.activeMajorId === id) {
      this.activeMajorId = null;
      this.notifyActive();
      useAudioStore.getState().resumeBackground();
      this.unduckAmbient();
    }
  }

  notifyEnded(id: string) {
    if (this.activeMajorId === id) {
      this.activeMajorId = null;
      this.notifyActive();
      useAudioStore.getState().resumeBackground();
      this.unduckAmbient();
    }
  }

  /** Stop call + narration; leave ambient / ui alone (then unduck). */
  stopAllMajor(options: StopAudioOptions = {}) {
    this.stopMajorExcept(null, options);
    this.activeMajorId = null;
    this.notifyActive();
    useAudioStore.getState().resumeBackground();
    this.unduckAmbient();
  }

  /** @deprecated use stopAllMajor */
  stopAllProminent() {
    this.stopAllMajor({ instant: true });
  }

  /**
   * Silence the station — used on inactivity reset, route change, and soft errors.
   * Ambient and major clips fade out; UI stops instantly.
   */
  stopAll(options: StopAudioOptions = {}) {
    this.clearPendingTimers();
    for (const clip of this.clips.values()) {
      const fadeMs =
        options.instant || clip.role === "ui"
          ? 0
          : (options.fadeMs ?? Math.min(clip.fadeOutMs, MUSEUM_AUDIO.fadeOutMs));
      this.stopHowl(clip, fadeMs);
    }
    this.activeMajorId = null;
    this.notifyActive();
    useAudioStore.getState().resumeBackground();
  }

  /** Apply master/mute to ambient beds without restarting. */
  syncAmbientLevels() {
    const store = useAudioStore.getState();
    for (const clip of this.clips.values()) {
      if (clip.role !== "ambient") continue;
      if (store.backgroundPaused) continue;
      const target = store.muted ? 0 : this.resolveVolume(clip);
      try {
        clip.howl.volume(target);
        clip.howl.mute(store.muted);
      } catch {
        /* ignore */
      }
    }
  }

  private normalizeRole(role: AudioRole): AudioRole {
    if (role === "prominent") return "call";
    return role;
  }

  private isMajor(role: AudioRole) {
    return role === "call" || role === "narration" || role === "prominent";
  }

  private defaultVolumeFor(role: AudioRole) {
    switch (role) {
      case "ambient":
        return MUSEUM_AUDIO.ambientVolume;
      case "narration":
        return MUSEUM_AUDIO.narrationVolume;
      case "ui":
        return MUSEUM_AUDIO.uiVolume;
      case "call":
      case "prominent":
      default:
        return MUSEUM_AUDIO.callVolume;
    }
  }

  private resolveVolume(clip: RegisteredClip, override?: number) {
    const store = useAudioStore.getState();
    const base = override ?? clip.baseVolume;
    return Math.min(1, Math.max(0, base * store.volume));
  }

  private stopHowl(clip: RegisteredClip, fadeMs: number) {
    try {
      if (fadeMs > 0 && clip.howl.playing()) {
        const from = clip.howl.volume();
        clip.howl.fade(from, 0, fadeMs);
        this.schedule(() => {
          try {
            clip.howl.stop();
          } catch {
            /* ignore */
          }
        }, fadeMs + 20);
      } else {
        clip.howl.stop();
      }
    } catch {
      /* ignore */
    }
  }

  private stopMajorExcept(keepId: string | null, options: StopAudioOptions = {}) {
    for (const clip of this.clips.values()) {
      if (!this.isMajor(clip.role)) continue;
      if (keepId && clip.id === keepId) continue;
      this.stopHowl(clip, options.instant ? 0 : (options.fadeMs ?? MUSEUM_AUDIO.duckFadeMs));
    }
  }

  private duckAmbient() {
    useAudioStore.getState().pauseBackground();
    for (const clip of this.clips.values()) {
      if (clip.role !== "ambient") continue;
      try {
        if (clip.howl.playing()) {
          const from = clip.howl.volume();
          clip.howl.fade(from, 0, MUSEUM_AUDIO.duckFadeMs);
          this.schedule(() => {
            try {
              if (useAudioStore.getState().backgroundPaused) clip.howl.pause();
            } catch {
              /* ignore */
            }
          }, MUSEUM_AUDIO.duckFadeMs + 20);
        } else {
          clip.howl.pause();
        }
      } catch {
        /* ignore */
      }
    }
  }

  private unduckAmbient() {
    // Ambient resume is driven by useExhibitAmbientAudio watching backgroundPaused.
    // Levels are re-applied there / via syncAmbientLevels.
    this.syncAmbientLevels();
  }

  private notifyActive() {
    for (const listener of this.listeners) {
      try {
        listener(this.activeMajorId);
      } catch {
        /* ignore listener errors */
      }
    }
    useAudioStore.getState().setActiveMajorId(this.activeMajorId);
  }
}

export const localAudioManager = new LocalAudioManager();

/** Hard stop used by reset / route / error paths. */
export function silenceStationAudio(instant = false) {
  localAudioManager.clearPendingTimers();
  localAudioManager.stopAll({ instant });
}
