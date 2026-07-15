import {
  INDIGENOUS_NAME_AWAITING_CONSULTATION,
  METRIC_AWAITING_CURATOR,
  animalMediaSet,
  generalFact,
  researchFact,
  researchPlaceholder,
} from "@/content/media/placeholders";
import type {
  Animal,
  AnimalFact,
  AnimalGroup,
  ConservationStatus,
  HabitatId,
  Season,
  TimeOfDay,
} from "@/types/content";

type DefineAnimalInput = {
  id: string;
  commonName: string;
  scientificName: string;
  animalGroup: AnimalGroup;
  shortIntroduction: string;
  fullDescription: string;
  habitatIds: HabitatId[];
  activeSeasons: Season[];
  activeTimeOfDay: TimeOfDay[];
  conservationStatus?: ConservationStatus;
  adaptationFacts: AnimalFact[];
  memorableFacts: AnimalFact[];
  featured?: boolean;
  enabled?: boolean;
  captions?: string[];
};

/**
 * Factory for catalog animals. Sensitive fields default to explicit research placeholders.
 */
export function defineAnimal(input: DefineAnimalInput): Animal {
  const media = animalMediaSet(input.id, input.commonName);

  return {
    id: input.id,
    commonName: input.commonName,
    scientificName: input.scientificName,
    indigenousNamePlaceholder: INDIGENOUS_NAME_AWAITING_CONSULTATION,
    animalGroup: input.animalGroup,
    shortIntroduction: input.shortIntroduction,
    fullDescription: input.fullDescription,
    habitatIds: input.habitatIds,
    activeSeasons: input.activeSeasons,
    activeTimeOfDay: input.activeTimeOfDay,
    diet: researchPlaceholder(
      `[NEEDS RESEARCH] Diet summary for ${input.commonName}`,
      "Confirm diet details for Northern Ontario populations before presenting as fact.",
    ),
    conservationStatus: input.conservationStatus ?? "needs-research",
    northernOntarioRange: researchPlaceholder(
      `[NEEDS RESEARCH] Northern Ontario range for ${input.commonName}`,
      "Confirm current range and seasonal presence with curator-approved regional sources.",
    ),
    averageLength: METRIC_AWAITING_CURATOR(`Average length — ${input.commonName}`),
    averageHeight: METRIC_AWAITING_CURATOR(`Average height — ${input.commonName}`),
    averageWeight: METRIC_AWAITING_CURATOR(`Average weight — ${input.commonName}`),
    lifespan: METRIC_AWAITING_CURATOR(`Lifespan — ${input.commonName}`),
    tracksDescription: researchPlaceholder(
      `[NEEDS RESEARCH] Track and sign description for ${input.commonName}`,
      "Field-accurate track copy requires naturalist review; do not invent print details.",
    ),
    callDescription: researchPlaceholder(
      `[NEEDS RESEARCH] Call / sound description for ${input.commonName}`,
      "Describe calls only after verifying against approved audio and specialist notes.",
    ),
    adaptationFacts: input.adaptationFacts,
    memorableFacts: input.memorableFacts,
    coexistenceAdvice: researchPlaceholder(
      `[NEEDS RESEARCH] Coexistence guidance for ${input.commonName}`,
      "Safety and coexistence advice must be approved by museum educators / wildlife specialists.",
    ),
    ...media,
    captions: input.captions ?? [
      `Placeholder caption — ${input.commonName}`,
      "Replace with curator-approved visitor captions.",
    ],
    attribution: `Placeholder media attribution — ${input.commonName}. Replace before install.`,
    featured: input.featured ?? false,
    enabled: input.enabled ?? true,
  };
}

export { generalFact, researchFact };
