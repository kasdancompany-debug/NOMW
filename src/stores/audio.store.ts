import { create } from "zustand";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";

type AudioState = {
  unlocked: boolean;
  muted: boolean;
  /** Station master gain (0–1). Persisted. Kept conservative for shared rooms. */
  volume: number;
  /**
   * When true, exhibit ambient / background beds should pause
   * (e.g. while a one-shot animal call or narration plays).
   */
  backgroundPaused: boolean;
  /** Currently playing major clip id (call / narration), if any */
  activeMajorId: string | null;
  unlock: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  pauseBackground: () => void;
  resumeBackground: () => void;
  setActiveMajorId: (id: string | null) => void;
};

/**
 * Audio session state shared by shell ambient beds and one-shot call players.
 */
export const useAudioStore = create<AudioState>((set, get) => ({
  unlocked: false,
  muted: false,
  volume: MUSEUM_AUDIO.masterVolume,
  backgroundPaused: false,
  activeMajorId: null,

  unlock: () => set({ unlocked: true }),

  setMuted: (muted) => set({ muted }),

  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),

  toggleMute: () => set({ muted: !get().muted }),

  pauseBackground: () => set({ backgroundPaused: true }),

  resumeBackground: () => set({ backgroundPaused: false }),

  setActiveMajorId: (id) => set({ activeMajorId: id }),
}));
