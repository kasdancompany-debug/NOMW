import { create } from "zustand";
import type { AnimalId, HabitatId, SceneId } from "@/types/content";

type ExhibitUiState = {
  activeSceneId: SceneId | null;
  selectedAnimalId: AnimalId | null;
  selectedHabitatId: HabitatId | null;
  setActiveScene: (sceneId: SceneId) => void;
  selectAnimal: (animalId: AnimalId | null) => void;
  selectHabitat: (habitatId: HabitatId | null) => void;
  resetToHome: (homeSceneId: SceneId) => void;
};

export const useExhibitUiStore = create<ExhibitUiState>((set) => ({
  activeSceneId: null,
  selectedAnimalId: null,
  selectedHabitatId: null,

  setActiveScene: (sceneId) => set({ activeSceneId: sceneId }),

  selectAnimal: (animalId) => set({ selectedAnimalId: animalId }),

  selectHabitat: (habitatId) => set({ selectedHabitatId: habitatId }),

  resetToHome: (homeSceneId) =>
    set({
      activeSceneId: homeSceneId,
      selectedAnimalId: null,
      selectedHabitatId: null,
    }),
}));
