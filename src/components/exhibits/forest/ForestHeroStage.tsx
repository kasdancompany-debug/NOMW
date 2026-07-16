"use client";

import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import type { Animal } from "@/types/content";
import {
  FOREST_HUMAN_SILHOUETTE,
  HUMAN_RELATIVE_HEIGHT,
  forestCopy,
  forestSilhouetteSrc,
  type ForestAnimalPresentation,
} from "@/content/exhibits/forest/content";
import { ProgressDots } from "@/components/navigation/ProgressDots";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { touchDrag } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type ForestHeroStageProps = {
  animal: Animal;
  presentation: ForestAnimalPresentation;
  index: number;
  count: number;
  onIndexChange: (index: number) => void;
};

/**
 * Center composition — silhouette fills the stage without clipping; copy sits below.
 */
export function ForestHeroStage({
  animal,
  presentation,
  index,
  count,
  onIndexChange,
}: ForestHeroStageProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const scale = presentation.relativeHeight;

  const go = (next: number) => {
    onIndexChange(Math.min(count - 1, Math.max(0, next)));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <motion.div
        className="relative min-h-0 flex-1 cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag={reducedMotion ? false : "x"}
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={touchDrag.dragElastic}
        dragTransition={touchDrag.dragTransition}
        onDragEnd={(_, info) => {
          const boost = info.velocity.x * touchDrag.momentum;
          const throwX = info.offset.x + boost * 0.08;
          if (throwX < -72 || info.velocity.x < -420) go(index + 1);
          else if (throwX > 72 || info.velocity.x > 420) go(index - 1);
          else {
            void animate(x, 0, {
              type: "spring",
              stiffness: touchDrag.snapStiffness,
              damping: touchDrag.snapDamping,
              mass: 0.7,
            });
          }
        }}
        aria-label={forestCopy.swipeHint}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={animal.id}
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -28 }}
            transition={scenicTransition(reducedMotion)}
          >
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center">
              {/* Shared ground plane — both figures scale against full stage height */}
              <div className="relative h-full w-full max-w-[42rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={forestSilhouetteSrc(animal.id)}
                  alt=""
                  className="absolute bottom-0 left-1/2 w-auto max-w-[92%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                  style={{ height: `${Math.round(scale * 100)}%` }}
                  draggable={false}
                />

                <div
                  className="absolute bottom-0 left-[6%] flex items-end"
                  style={{ height: `${Math.round(HUMAN_RELATIVE_HEIGHT * 100)}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FOREST_HUMAN_SILHOUETTE}
                    alt=""
                    className="h-full w-auto object-contain object-bottom opacity-90 brightness-0 invert"
                    draggable={false}
                  />
                  <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.2em] text-white/60 uppercase">
                    {forestCopy.humanScale}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mt-[var(--space-6)] shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${animal.id}`}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={scenicTransition(reducedMotion)}
          >
            <h2
              className={cn(
                "font-[family-name:var(--font-ui)] text-[clamp(2rem,3.8vw,3.25rem)]",
                "font-bold leading-[1.02] tracking-[0.08em] text-white uppercase",
                "[text-shadow:0_2px_24px_rgba(0,0,0,0.5)]",
              )}
            >
              {animal.commonName}
            </h2>
            <p className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[var(--color-museum-warm)] italic">
              {animal.scientificName}
            </p>
            <p className="mt-[var(--space-4)] max-w-[38ch] text-[length:var(--text-body-sm)] leading-[1.7] text-white/85">
              {animal.shortIntroduction}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-[var(--space-5)]">
          <ProgressDots
            count={count}
            activeIndex={index}
            onSelect={onIndexChange}
            label="Forest animals"
          />
        </div>
      </div>
    </div>
  );
}
