"use client";

import { motion } from "framer-motion";
import type { NightCreature } from "@/content/exhibits/night/content";
import { nightCopy, nightCreatures } from "@/content/exhibits/night/content";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type NightFactPanelProps = {
  creature: NightCreature;
  onClose: () => void;
};

const NIGHT_ANIMAL_IDS = nightCreatures
  .map((entry) => entry.id)
  .filter((id): id is Exclude<typeof id, "night-moths"> => id !== "night-moths");

export function NightFactPanel({ creature, onClose }: NightFactPanelProps) {
  const reducedMotion = useReducedMotion();
  const { noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const canProfile = creature.id !== "night-moths";

  return (
    <motion.div
      className="pointer-events-auto absolute top-[6rem] right-[var(--space-6)] z-40 w-[min(26rem,40vw)]"
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={scenicTransition(reducedMotion)}
    >
      <GlassPanel density="dense" className="space-y-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-3)]">
          <div>
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              {nightCopy.factTitle}
            </p>
            <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
              {creature.label}
            </h2>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
          {creature.nocturnalFact}
        </p>
        {canProfile ? (
          <LargeTouchButton
            variant="secondary"
            onClick={() => {
              noteInteraction();
              openProfile({
                animalId: creature.id,
                animalIds: NIGHT_ANIMAL_IDS,
              });
            }}
          >
            Full profile
          </LargeTouchButton>
        ) : null}
      </GlassPanel>
    </motion.div>
  );
}
