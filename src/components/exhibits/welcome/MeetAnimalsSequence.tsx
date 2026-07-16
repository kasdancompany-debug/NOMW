"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AnimalSilhouette,
  silhouetteKindFromAnimalId,
} from "@/components/animals/AnimalSilhouette";
import { getAnimal } from "@/content/animals";
import { meetAnimalIds, welcomeCopy } from "@/content/exhibits/welcome/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { ProgressDots } from "@/components/navigation/ProgressDots";
import { BackToStartButton } from "@/components/touch/BackToStartButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type MeetAnimalsSequenceProps = {
  index: number;
  onIndexChange: (index: number) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function MeetAnimalsSequence({
  index,
  onIndexChange,
  onBack,
  onContinue,
}: MeetAnimalsSequenceProps) {
  const reducedMotion = useReducedMotion();
  const { noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const animalId = meetAnimalIds[index] ?? meetAnimalIds[0];
  const animal = getAnimal(animalId);
  const isLast = index >= meetAnimalIds.length - 1;

  if (!animal) return null;

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <LayeredLandscape tone="welcome-dawn" />
      <div className="pointer-events-none absolute inset-0 bg-[rgba(8,16,20,0.45)]" />
      <div className="safe-frame relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              {welcomeCopy.meetAnimalsTitle}
            </p>
            <p className="mt-[var(--space-3)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {welcomeCopy.meetAnimalsLead}
            </p>
          </div>
          <BackToStartButton onPress={onBack} label="Back to map" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={animal.id}
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -24 }}
            transition={scenicTransition(reducedMotion)}
            className="grid flex-1 grid-cols-1 items-center gap-[var(--space-8)] lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="mx-auto flex h-[min(42vh,22rem)] w-full max-w-[22rem] items-end justify-center">
              <AnimalSilhouette
                kind={silhouetteKindFromAnimalId(animal.id)}
                className="max-h-full drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
            <GlassPanel density="dense" className="w-full max-w-[44rem]">
              <AnimalNameplate
                commonName={animal.commonName}
                scientificName={animal.scientificName}
              />
              <p className="mt-[var(--space-5)] text-[length:var(--text-lead)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                {animal.shortIntroduction}
              </p>
              <div className="mt-[var(--space-5)]">
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    openProfile({
                      animalId: animal.id,
                      animalIds: [...meetAnimalIds],
                    });
                  }}
                >
                  {animal.id === "moose" ? "Open moose profile" : "Open full profile"}
                </LargeTouchButton>
              </div>
            </GlassPanel>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-[var(--space-6)] pb-[var(--space-2)]">
          <ProgressDots
            count={meetAnimalIds.length}
            activeIndex={index}
            onSelect={onIndexChange}
            label="Meet the Animals"
          />
          <div className="flex gap-[var(--space-4)]">
            <LargeTouchButton
              variant="secondary"
              disabled={index === 0}
              onClick={() => onIndexChange(Math.max(0, index - 1))}
            >
              Previous
            </LargeTouchButton>
            <LargeTouchButton
              onClick={() => {
                if (isLast) onContinue();
                else onIndexChange(index + 1);
              }}
            >
              {isLast ? "How big is the north?" : "Next animal"}
            </LargeTouchButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
