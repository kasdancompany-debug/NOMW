"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AnimalSilhouette,
  silhouetteKindFromAnimalId,
} from "@/components/animals/AnimalSilhouette";
import { getAnimal } from "@/content/animals";
import {
  forestAnimals,
  forestCopy,
  type ForestAnimalPresentation,
} from "@/content/exhibits/forest/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { touchDrag } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type AnimalCarouselProps = {
  index: number;
  onIndexChange: (index: number) => void;
};

function SilhouetteCard({
  presentation,
  prominent,
}: {
  presentation: ForestAnimalPresentation;
  prominent: boolean;
}) {
  const animal = getAnimal(presentation.animalId);
  const height = Math.max(
    96,
    ((presentation.relativeHeight / (presentation.bodyProportion ?? 1)) * 200),
  );

  return (
    <div className="flex flex-col items-center gap-[var(--space-4)]">
      <div
        className={cn(
          "relative flex items-end justify-center",
          prominent ? "drop-shadow-[0_12px_28px_rgba(212,176,122,0.22)]" : "opacity-50",
        )}
        style={{ height, width: height * 0.72 }}
      >
        <AnimalSilhouette
          kind={silhouetteKindFromAnimalId(presentation.animalId)}
          prominent={prominent}
          className="max-h-full"
        />
      </div>
      <div className="text-center">
        <p
          className={cn(
            "font-[family-name:var(--font-display)] text-[length:var(--text-title)]",
            prominent ? "text-[var(--text-on-dark)]" : "text-[var(--text-on-dark-muted)]",
          )}
        >
          {animal?.commonName ?? presentation.animalId}
        </p>
        {prominent ? (
          <p className="mt-1 text-[10px] tracking-[0.16em] text-[rgba(212,176,122,0.7)] uppercase">
            Silhouette placeholder
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Horizontal swipe gallery — each animal enters at relative real-world scale.
 */
export function AnimalCarousel({ index, onIndexChange }: AnimalCarouselProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const [dragHint] = useState(forestCopy.swipeHint);

  useEffect(() => {
    const controls = animate(x, 0, {
      duration: reducedMotion ? 0 : 0.45,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [index, reducedMotion, x]);

  const go = (next: number) => {
    const clamped = Math.min(forestAnimals.length - 1, Math.max(0, next));
    onIndexChange(clamped);
  };

  return (
    <div className="relative w-full">
      <motion.div
        className="flex cursor-grab items-end justify-center gap-[var(--space-10)] active:cursor-grabbing"
        style={{ x }}
        drag={reducedMotion ? false : "x"}
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={touchDrag.dragElastic}
        dragTransition={touchDrag.dragTransition}
        onDragEnd={(_, info) => {
          const momentumBoost = info.velocity.x * touchDrag.momentum;
          const throwX = info.offset.x + momentumBoost * 0.08;
          if (throwX < -64 || info.velocity.x < -380) go(index + 1);
          else if (throwX > 64 || info.velocity.x > 380) go(index - 1);
          else {
            void animate(x, 0, {
              type: "spring",
              stiffness: touchDrag.snapStiffness,
              damping: touchDrag.snapDamping,
              mass: 0.7,
            });
          }
        }}
      >
        {forestAnimals.map((entry, entryIndex) => {
          const offset = entryIndex - index;
          if (Math.abs(offset) > 1) return null;
          return (
            <motion.div
              key={entry.animalId}
              initial={false}
              animate={{
                scale: offset === 0 ? 1 : 0.86,
                opacity: offset === 0 ? 1 : 0.55,
              }}
              transition={scenicTransition(reducedMotion)}
              className={cn(offset === 0 ? "z-10" : "z-0")}
            >
              <SilhouetteCard presentation={entry} prominent={offset === 0} />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute right-[6%] bottom-0 hidden flex-col items-center gap-[var(--space-3)] lg:flex">
        <div style={{ height: 0.52 * 340, width: 56 }} className="flex items-end justify-center">
          <AnimalSilhouette kind="human" className="max-h-full" />
        </div>
        <p className="text-[length:var(--text-label)] text-[var(--text-on-dark-muted)]">Human scale</p>
      </div>

      <p className="mt-[var(--space-5)] text-center text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        {dragHint}
      </p>
    </div>
  );
}
