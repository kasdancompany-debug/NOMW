import { animalList, EXPECTED_ANIMAL_COUNT } from "@/content/animals";
import { exhibitConfigurations } from "@/content/config/exhibitConfigurations";
import { habitatList } from "@/content/habitats";
import {
  reportContentValidation,
  validateContentDatabase,
} from "@/lib/content/validate";

/**
 * Loads and validates the shared content database once on import.
 * Development builds surface missing/duplicate IDs as console warnings/errors.
 */
export function loadContentDatabase() {
  const issues = validateContentDatabase({
    animals: animalList,
    habitats: habitatList,
    exhibitConfigurations,
  });

  if (animalList.length !== EXPECTED_ANIMAL_COUNT) {
    issues.push({
      level: "error",
      code: "animal-count-mismatch",
      message: `Expected ${EXPECTED_ANIMAL_COUNT} animals, found ${animalList.length}`,
    });
  }

  reportContentValidation(issues);

  return {
    animals: animalList,
    habitats: habitatList,
    exhibitConfigurations,
    issues,
  };
}

export const contentDatabase = loadContentDatabase();
