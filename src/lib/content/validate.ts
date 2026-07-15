import type {
  Animal,
  AnimalId,
  ExhibitConfiguration,
  Habitat,
  HabitatId,
  MediaAsset,
  MediaId,
} from "@/types/content";

export type ContentValidationIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
};

function pushUnique(
  issues: ContentValidationIssue[],
  seen: Set<string>,
  issue: ContentValidationIssue,
) {
  const key = `${issue.level}:${issue.code}:${issue.message}`;
  if (seen.has(key)) return;
  seen.add(key);
  issues.push(issue);
}

function validateMediaList(
  media: MediaAsset[],
  issues: ContentValidationIssue[],
  seenKeys: Set<string>,
  context: string,
) {
  const ids = new Set<MediaId>();
  for (const asset of media) {
    if (!asset.id) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "media-missing-id",
        message: `${context}: media asset is missing id (${asset.label})`,
      });
      continue;
    }
    if (ids.has(asset.id)) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "media-duplicate-id",
        message: `${context}: duplicate media id "${asset.id}"`,
      });
    }
    ids.add(asset.id);

    if (!asset.src) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "media-missing-src",
        message: `${context}: media "${asset.id}" is missing src`,
      });
    }

    if (asset.placeholder !== true) {
      pushUnique(issues, seenKeys, {
        level: "warning",
        code: "media-not-marked-placeholder",
        message: `${context}: media "${asset.id}" is not marked placeholder — confirm final asset`,
      });
    }

    if (!asset.label.toLowerCase().includes("placeholder") && asset.placeholder) {
      pushUnique(issues, seenKeys, {
        level: "warning",
        code: "media-label-unclear",
        message: `${context}: placeholder media "${asset.id}" label should include PLACEHOLDER for staff clarity`,
      });
    }
  }
}

function collectAnimalMedia(animal: Animal): MediaAsset[] {
  return [
    animal.heroImage,
    ...animal.galleryImages,
    animal.silhouetteImage,
    animal.habitatVideo,
    animal.transparentAnimalImage,
    animal.callAudio,
    animal.ambientAudio,
  ];
}

export function validateAnimals(animals: Animal[]): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const seenKeys = new Set<string>();
  const ids = new Set<AnimalId>();

  for (const animal of animals) {
    if (!animal.id) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "animal-missing-id",
        message: `Animal "${animal.commonName}" is missing id`,
      });
      continue;
    }

    if (ids.has(animal.id)) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "animal-duplicate-id",
        message: `Duplicate animal id "${animal.id}"`,
      });
    }
    ids.add(animal.id);

    if (!animal.commonName?.trim()) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "animal-missing-common-name",
        message: `Animal "${animal.id}" is missing commonName`,
      });
    }

    if (!animal.scientificName?.trim()) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "animal-missing-scientific-name",
        message: `Animal "${animal.id}" is missing scientificName`,
      });
    }

    if (animal.habitatIds.length === 0) {
      pushUnique(issues, seenKeys, {
        level: "warning",
        code: "animal-no-habitats",
        message: `Animal "${animal.id}" has no habitatIds`,
      });
    }

    if (animal.indigenousNamePlaceholder.status !== "placeholder") {
      pushUnique(issues, seenKeys, {
        level: "warning",
        code: "indigenous-name-not-placeholder",
        message: `Animal "${animal.id}" indigenous name is not marked placeholder — ensure consultation recorded`,
      });
    }

    for (const fact of [...animal.adaptationFacts, ...animal.memorableFacts]) {
      if (fact.confidence === "needs-research" && !fact.researchNote) {
        pushUnique(issues, seenKeys, {
          level: "warning",
          code: "fact-missing-research-note",
          message: `Animal "${animal.id}" fact "${fact.id}" needs-research but has no researchNote`,
        });
      }
      if (fact.text.includes("[NEEDS RESEARCH]") && fact.confidence !== "needs-research") {
        pushUnique(issues, seenKeys, {
          level: "warning",
          code: "fact-marker-mismatch",
          message: `Animal "${animal.id}" fact "${fact.id}" contains [NEEDS RESEARCH] but confidence is not needs-research`,
        });
      }
    }

    validateMediaList(collectAnimalMedia(animal), issues, seenKeys, `animal:${animal.id}`);
  }

  return issues;
}

export function validateHabitats(
  habitats: Habitat[],
  animalIds: Set<AnimalId>,
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const seenKeys = new Set<string>();
  const ids = new Set<HabitatId>();

  for (const habitat of habitats) {
    if (!habitat.id) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "habitat-missing-id",
        message: `Habitat "${habitat.name}" is missing id`,
      });
      continue;
    }

    if (ids.has(habitat.id)) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "habitat-duplicate-id",
        message: `Duplicate habitat id "${habitat.id}"`,
      });
    }
    ids.add(habitat.id);

    for (const animalId of habitat.animalIds) {
      if (!animalIds.has(animalId)) {
        pushUnique(issues, seenKeys, {
          level: "error",
          code: "habitat-unknown-animal",
          message: `Habitat "${habitat.id}" references unknown animal "${animalId}"`,
        });
      }
    }

    const media = [
      habitat.media.ambientImage,
      habitat.media.ambientVideo,
      habitat.media.ambientAudio,
    ].filter(Boolean) as MediaAsset[];

    validateMediaList(media, issues, seenKeys, `habitat:${habitat.id}`);
  }

  return issues;
}

export function validateExhibitConfigurations(
  configs: ExhibitConfiguration[],
  animalIds: Set<AnimalId>,
  habitatIds: Set<HabitatId>,
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const seenKeys = new Set<string>();
  const slugs = new Set<string>();

  for (const config of configs) {
    if (slugs.has(config.slug)) {
      pushUnique(issues, seenKeys, {
        level: "error",
        code: "exhibit-duplicate-slug",
        message: `Duplicate exhibit configuration slug "${config.slug}"`,
      });
    }
    slugs.add(config.slug);

    for (const animalId of config.featuredAnimalIds) {
      if (!animalIds.has(animalId)) {
        pushUnique(issues, seenKeys, {
          level: "error",
          code: "exhibit-unknown-animal",
          message: `Exhibit "${config.slug}" features unknown animal "${animalId}"`,
        });
      }
    }

    for (const habitatId of config.featuredHabitatIds) {
      if (!habitatIds.has(habitatId)) {
        pushUnique(issues, seenKeys, {
          level: "error",
          code: "exhibit-unknown-habitat",
          message: `Exhibit "${config.slug}" features unknown habitat "${habitatId}"`,
        });
      }
    }
  }

  return issues;
}

export function validateContentDatabase(input: {
  animals: Animal[];
  habitats: Habitat[];
  exhibitConfigurations?: ExhibitConfiguration[];
}): ContentValidationIssue[] {
  const animalIdSet = new Set(input.animals.map((animal) => animal.id));
  const habitatIdSet = new Set(input.habitats.map((habitat) => habitat.id));

  const animalIssues = validateAnimals(input.animals);
  const habitatIssues = validateHabitats(input.habitats, animalIdSet);
  const exhibitIssues = input.exhibitConfigurations
    ? validateExhibitConfigurations(input.exhibitConfigurations, animalIdSet, habitatIdSet)
    : [];

  for (const animal of input.animals) {
    for (const habitatId of animal.habitatIds) {
      if (!habitatIdSet.has(habitatId)) {
        animalIssues.push({
          level: "error",
          code: "animal-unknown-habitat",
          message: `Animal "${animal.id}" references unknown habitat "${habitatId}"`,
        });
      }
    }
  }

  return [...animalIssues, ...habitatIssues, ...exhibitIssues];
}

/** Logs warnings in development; always surfaces errors. Throws if any errors exist. */
export function reportContentValidation(
  issues: ContentValidationIssue[],
  options: { throwOnError?: boolean } = {},
): void {
  if (issues.length === 0) return;

  const isDev = process.env.NODE_ENV !== "production";
  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");

  if (isDev) {
    for (const warning of warnings) {
      console.warn(`[content] ${warning.code}: ${warning.message}`);
    }
  }

  for (const error of errors) {
    console.error(`[content] ${error.code}: ${error.message}`);
  }

  const shouldThrow = options.throwOnError ?? true;
  if (shouldThrow && errors.length > 0) {
    throw new Error(
      `Content validation failed with ${errors.length} error(s). See console for details.`,
    );
  }
}
