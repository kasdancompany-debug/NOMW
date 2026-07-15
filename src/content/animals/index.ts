import { birdAnimals } from "./birds";
import { fishAnimals } from "./fish";
import { mammalAnimals } from "./mammals";
import { reptileAnimals } from "./reptiles";
import type { Animal, AnimalId, HabitatId } from "@/types/content";

/** Ordered master list — Northern Ontario species for the MVP catalog. */
export const animalList: Animal[] = [
  ...mammalAnimals,
  ...birdAnimals,
  ...fishAnimals,
  ...reptileAnimals,
];

export const animals: Record<AnimalId, Animal> = Object.fromEntries(
  animalList.map((animal) => [animal.id, animal]),
);

export const EXPECTED_ANIMAL_COUNT = 23;

export function getAnimal(id: AnimalId): Animal | undefined {
  return animals[id];
}

export function listAnimals(options?: { enabledOnly?: boolean; featuredOnly?: boolean }): Animal[] {
  return animalList.filter((animal) => {
    if (options?.enabledOnly && !animal.enabled) return false;
    if (options?.featuredOnly && !animal.featured) return false;
    return true;
  });
}

export function getAnimalsByHabitat(habitatId: HabitatId): Animal[] {
  return animalList.filter((animal) => animal.habitatIds.includes(habitatId));
}

export function listEnabledAnimalIds(): AnimalId[] {
  return listAnimals({ enabledOnly: true }).map((animal) => animal.id);
}

export function buildAnimalIdsByHabitat(): Record<HabitatId, AnimalId[]> {
  const map: Record<HabitatId, AnimalId[]> = {};
  for (const animal of animalList) {
    for (const habitatId of animal.habitatIds) {
      if (!map[habitatId]) map[habitatId] = [];
      map[habitatId].push(animal.id);
    }
  }
  return map;
}
