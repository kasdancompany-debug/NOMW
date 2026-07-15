import { buildAnimalIdsByHabitat } from "@/content/animals";
import { buildHabitats } from "./catalog";
import type { Habitat, HabitatId } from "@/types/content";

export { habitatDefinitions, buildHabitats } from "./catalog";

export const habitatList: Habitat[] = buildHabitats(buildAnimalIdsByHabitat());

export const habitats: Record<HabitatId, Habitat> = Object.fromEntries(
  habitatList.map((habitat) => [habitat.id, habitat]),
);

export function getHabitat(id: HabitatId): Habitat | undefined {
  return habitats[id];
}

export function listHabitats(options?: { enabledOnly?: boolean }): Habitat[] {
  return habitatList.filter((habitat) => {
    if (options?.enabledOnly && !habitat.enabled) return false;
    return true;
  });
}
