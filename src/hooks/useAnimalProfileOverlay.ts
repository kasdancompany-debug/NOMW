"use client";

import { useAnimalProfileStore } from "@/stores/animal-profile.store";

/** Convenience hook for opening the shared animal profile overlay from any exhibit. */
export function useAnimalProfileOverlay() {
  const openProfile = useAnimalProfileStore((s) => s.openProfile);
  const closeProfile = useAnimalProfileStore((s) => s.closeProfile);
  const isOpen = useAnimalProfileStore((s) => s.isOpen);
  const animalId = useAnimalProfileStore((s) => s.animalId);
  const compareRequestedFor = useAnimalProfileStore((s) => s.compareRequestedFor);
  const acknowledgeCompare = useAnimalProfileStore((s) => s.acknowledgeCompare);

  return {
    isOpen,
    animalId,
    openProfile,
    closeProfile,
    compareRequestedFor,
    acknowledgeCompare,
  };
}
