import { create } from "zustand";
import { idleConfig } from "@/content/config/idle.config";

type IdleState = {
  lastInteractionAt: number;
  isIdle: boolean;
  isWarning: boolean;
  timeoutMs: number;
  warningMs: number;
  resetToken: number;
  registerInteraction: () => void;
  setTimeoutMs: (ms: number) => void;
  tick: (now?: number) => void;
  forceReset: () => void;
};

export const useIdleStore = create<IdleState>((set, get) => ({
  lastInteractionAt: Date.now(),
  isIdle: false,
  isWarning: false,
  timeoutMs: idleConfig.timeoutMs,
  warningMs: idleConfig.warningMs,
  resetToken: 0,

  registerInteraction: () =>
    set({
      lastInteractionAt: Date.now(),
      isIdle: false,
      isWarning: false,
    }),

  setTimeoutMs: (ms) => set({ timeoutMs: ms }),

  tick: (now = Date.now()) => {
    const { lastInteractionAt, timeoutMs, warningMs, isIdle } = get();
    const elapsed = now - lastInteractionAt;

    if (elapsed >= timeoutMs) {
      if (!isIdle) {
        set((state) => ({
          isIdle: true,
          isWarning: false,
          resetToken: state.resetToken + 1,
        }));
      }
      return;
    }

    const inWarning = elapsed >= timeoutMs - warningMs;
    set({ isWarning: inWarning, isIdle: false });
  },

  forceReset: () =>
    set((state) => ({
      isIdle: true,
      isWarning: false,
      lastInteractionAt: Date.now(),
      resetToken: state.resetToken + 1,
    })),
}));
