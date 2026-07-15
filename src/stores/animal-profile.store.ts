import { create } from "zustand";
import type { AnimalId } from "@/types/content";

export type OpenAnimalProfileInput = {
  animalId: AnimalId;
  /** Ordered queue for previous / next controls. Defaults to [animalId]. */
  animalIds?: AnimalId[];
  /** Show optional Compare control */
  enableCompare?: boolean;
};

type AnimalProfileState = {
  isOpen: boolean;
  animalId: AnimalId | null;
  animalIds: AnimalId[];
  enableCompare: boolean;
  /** Set when visitor taps Compare — exhibits may react without route change */
  compareRequestedFor: AnimalId | null;
  openProfile: (input: OpenAnimalProfileInput) => void;
  closeProfile: () => void;
  showPrevious: () => void;
  showNext: () => void;
  requestCompare: () => void;
  acknowledgeCompare: () => void;
};

function withCurrent(ids: AnimalId[], animalId: AnimalId): AnimalId[] {
  const unique = [...new Set(ids.length ? ids : [animalId])];
  if (!unique.includes(animalId)) unique.unshift(animalId);
  return unique;
}

/**
 * Shared animal profile overlay state — opens over any exhibit without navigation.
 */
export const useAnimalProfileStore = create<AnimalProfileState>((set, get) => ({
  isOpen: false,
  animalId: null,
  animalIds: [],
  enableCompare: false,
  compareRequestedFor: null,

  openProfile: (input) => {
    const animalIds = withCurrent(input.animalIds ?? [input.animalId], input.animalId);
    set({
      isOpen: true,
      animalId: input.animalId,
      animalIds,
      enableCompare: Boolean(input.enableCompare),
      compareRequestedFor: null,
    });
    void import("@/lib/analytics").then(({ getAnalytics }) => {
      getAnalytics().track("animal_profile_opened", { animalId: input.animalId });
    });
  },

  closeProfile: () =>
    set({
      isOpen: false,
      animalId: null,
      enableCompare: false,
      compareRequestedFor: null,
    }),

  showPrevious: () => {
    const { animalId, animalIds } = get();
    if (!animalId || animalIds.length < 2) return;
    const index = animalIds.indexOf(animalId);
    const nextIndex = index <= 0 ? animalIds.length - 1 : index - 1;
    set({ animalId: animalIds[nextIndex]! });
  },

  showNext: () => {
    const { animalId, animalIds } = get();
    if (!animalId || animalIds.length < 2) return;
    const index = animalIds.indexOf(animalId);
    const nextIndex = index >= animalIds.length - 1 ? 0 : index + 1;
    set({ animalId: animalIds[nextIndex]! });
  },

  requestCompare: () => {
    const { animalId } = get();
    if (!animalId) return;
    set({ compareRequestedFor: animalId });
  },

  acknowledgeCompare: () => set({ compareRequestedFor: null }),
}));
