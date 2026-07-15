"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  forestAnimals,
  forestCopy,
} from "@/content/exhibits/forest/content";
import { SizeComparison, humanSizeSubject } from "@/components/animals/SizeComparison";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

type CompareModeProps = {
  leftId: AnimalId | null;
  rightId: AnimalId | null;
  onSelectLeft: (id: AnimalId) => void;
  onSelectRight: (id: AnimalId) => void;
  onClose: () => void;
};

function Picker({
  label,
  selectedId,
  onSelect,
  excludeId,
}: {
  label: string;
  selectedId: AnimalId | null;
  onSelect: (id: AnimalId) => void;
  excludeId: AnimalId | null;
}) {
  return (
    <div>
      <p className="mb-[var(--space-3)] text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-[var(--space-2)]">
        {forestAnimals.map((entry) => {
          const animal = getAnimal(entry.animalId);
          if (!animal) return null;
          const disabled = excludeId === entry.animalId;
          const active = selectedId === entry.animalId;
          return (
            <Touchable
              key={entry.animalId}
              soft
              glow={!active && !disabled}
              disabled={disabled}
              className={cn(
                "touch-pressable rounded-[var(--radius-xs)] px-[var(--space-4)] text-[length:var(--text-body-sm)]",
                active
                  ? "bg-[var(--color-museum-warm)] text-[var(--text-on-accent)]"
                  : "border border-[var(--glass-border)] text-[var(--text-on-dark-muted)]",
                disabled && "opacity-30",
              )}
              onClick={() => onSelect(entry.animalId)}
            >
              {animal.commonName}
            </Touchable>
          );
        })}
      </div>
    </div>
  );
}

export function CompareMode({
  leftId,
  rightId,
  onSelectLeft,
  onSelectRight,
  onClose,
}: CompareModeProps) {
  const reducedMotion = useReducedMotion();
  const left = forestAnimals.find((a) => a.animalId === leftId);
  const right = forestAnimals.find((a) => a.animalId === rightId);

  const subjects = [
    left
      ? {
          id: left.animalId,
          label: getAnimal(left.animalId)?.commonName ?? left.animalId,
          relativeHeight: left.relativeHeight,
        }
      : null,
    right
      ? {
          id: right.animalId,
          label: getAnimal(right.animalId)?.commonName ?? right.animalId,
          relativeHeight: right.relativeHeight,
        }
      : null,
    humanSizeSubject(),
  ].filter(Boolean) as { id: string; label: string; relativeHeight: number }[];

  return (
    <motion.div
      className="absolute inset-0 z-30 bg-[rgba(6,16,24,0.72)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col justify-between py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {forestCopy.compareTitle}
            </h2>
            <p className="mt-[var(--space-3)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {forestCopy.compareLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close compare</QuietButton>
        </div>

        <GlassPanel density="dense" className="mt-[var(--space-6)] space-y-[var(--space-6)]">
          <div className="grid gap-[var(--space-6)] lg:grid-cols-2">
            <Picker
              label="First animal"
              selectedId={leftId}
              onSelect={onSelectLeft}
              excludeId={rightId}
            />
            <Picker
              label="Second animal"
              selectedId={rightId}
              onSelect={onSelectRight}
              excludeId={leftId}
            />
          </div>

          {subjects.length >= 2 ? (
            <SizeComparison subjects={subjects} note={forestCopy.sizeNote} maxHeightPx={220} />
          ) : (
            <p className="text-[var(--text-on-dark-muted)]">Choose two animals to compare.</p>
          )}
        </GlassPanel>

        <div className="pt-[var(--space-6)]">
          <LargeTouchButton onClick={onClose}>Back to Giants</LargeTouchButton>
        </div>
      </div>
    </motion.div>
  );
}
