"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import type { WelcomeZone } from "@/content/exhibits/welcome/content";
import { welcomeCopy } from "@/content/exhibits/welcome/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import {
  LayeredLandscape,
  type LandscapeTone,
} from "@/components/media/LayeredLandscape";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { BackToStartButton } from "@/components/touch/BackToStartButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";

type HabitatSceneProps = {
  zone: WelcomeZone;
  selectedAnimalId: AnimalId | null;
  onSelectAnimal: (id: AnimalId) => void;
  onClearAnimal: () => void;
  onBack: () => void;
};

function landscapeForZone(tone: WelcomeZone["atmosphere"]): LandscapeTone {
  switch (tone) {
    case "deep-lake":
      return "habitat-lake";
    case "snow-mist":
      return "habitat-snow";
    case "museum-glow":
      return "welcome-dawn";
    case "boreal-night":
    default:
      return "boreal-giants";
  }
}

export function HabitatScene({
  zone,
  selectedAnimalId,
  onSelectAnimal,
  onClearAnimal,
  onBack,
}: HabitatSceneProps) {
  const reducedMotion = useReducedMotion();
  const { openProfile } = useAnimalProfileOverlay();
  const { noteInteraction } = useKioskSession();
  const selected = selectedAnimalId ? getAnimal(selectedAnimalId) : undefined;

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <LayeredLandscape tone={landscapeForZone(zone.atmosphere)} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,14,18,0.72)_0%,rgba(6,14,18,0.25)_55%,transparent_100%)]" />

      <div className="safe-frame relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div className="max-w-[36rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-aurora-teal)] uppercase">
              Habitat atlas
            </p>
            <h2 className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
              {zone.name}
            </h2>
            <p className="mt-[var(--space-4)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {zone.summary}
            </p>
          </div>
          <BackToStartButton onPress={onBack} label={welcomeCopy.habitatReturn} />
        </div>

        <div className="flex flex-wrap gap-[var(--space-4)] pb-[var(--space-4)]">
          {zone.animalIds.map((animalId, index) => {
            const animal = getAnimal(animalId);
            if (!animal) return null;
            return (
              <motion.div
                key={animalId}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...scenicTransition(reducedMotion),
                  delay: reducedMotion ? 0 : index * 0.06,
                }}
              >
                <LargeTouchButton
                  variant={selectedAnimalId === animalId ? "primary" : "secondary"}
                  onClick={() => onSelectAnimal(animalId)}
                >
                  {animal.commonName}
                </LargeTouchButton>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 p-[var(--safe-margin)]"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={scenicTransition(reducedMotion)}
          >
            <GlassPanel density="dense" className="max-w-[40rem]" as="aside">
              <AnimalNameplate
                commonName={selected.commonName}
                scientificName={selected.scientificName}
              />
              <p className="mt-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                {selected.shortIntroduction}
              </p>
              <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
                <LargeTouchButton
                  onClick={() => {
                    noteInteraction();
                    openProfile({
                      animalId: selected.id,
                      animalIds: zone.animalIds,
                    });
                  }}
                >
                  Full profile
                </LargeTouchButton>
                <LargeTouchButton variant="secondary" onClick={onClearAnimal}>
                  Close
                </LargeTouchButton>
              </div>
            </GlassPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
