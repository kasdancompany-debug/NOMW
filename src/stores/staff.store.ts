import { create } from "zustand";

export type StaffView = "panel" | "diagnostics" | "analytics";

type StaffState = {
  /** PIN pad visible (post logo-hold, pre-auth) */
  pinGateOpen: boolean;
  /** Authenticated staff overlay */
  panelOpen: boolean;
  view: StaffView;
  forceReducedMotion: boolean | null;
  /** Route to restore when leaving /staff deep link */
  returnPath: string | null;
  openPinGate: () => void;
  closePinGate: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setView: (view: StaffView) => void;
  setForceReducedMotion: (value: boolean | null) => void;
  setReturnPath: (path: string | null) => void;
  unlockWithPin: () => void;
  lock: () => void;
};

export const useStaffStore = create<StaffState>((set) => ({
  pinGateOpen: false,
  panelOpen: false,
  view: "panel",
  forceReducedMotion: null,
  returnPath: null,

  openPinGate: () => set({ pinGateOpen: true, panelOpen: false }),
  closePinGate: () => set({ pinGateOpen: false }),
  openPanel: () => set({ panelOpen: true, pinGateOpen: false, view: "panel" }),
  closePanel: () => set({ panelOpen: false, view: "panel" }),
  setView: (view) => set({ view }),
  setForceReducedMotion: (value) => set({ forceReducedMotion: value }),
  setReturnPath: (path) => set({ returnPath: path }),
  unlockWithPin: () => set({ panelOpen: true, pinGateOpen: false, view: "panel" }),
  lock: () => set({ panelOpen: false, pinGateOpen: false, view: "panel" }),
}));
