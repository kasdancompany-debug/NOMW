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
 * Center composition — monumental silhouette, human scale, name, swipe.
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
  const heightPx = Math.max(180, presentation.relativeHeight * 420);
  const humanPx = HUMAN_RELATIVE_HEIGHT * 420;

  const go = (next: number) => {
    onIndexChange(Math.min(count - 1, Math.max(0, next)));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col justify-end pb-2">
      <motion.div
        className="relative flex min-h-0 flex-1 cursor-grab items-end justify-center active:cursor-grabbing"
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
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={animal.id}
            className="relative flex w-full max-w-[46rem] items-end justify-center"
            initial={reducedMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -36 }}
            transition={scenicTransition(reducedMotion)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={forestSilhouetteSrc(animal.id)}
              alt=""
              className="max-w-[92%] object-contain object-bottom drop-shadow-[0_18px_40px_rgba(0,0,0,0.65)]"
              style={{ height: heightPx }}
              draggable={false}
            />

            <div
              className="absolute bottom-0 left-[8%] flex flex-col items-center gap-1"
              style={{ height: humanPx }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOREST_HUMAN_SILHOUETTE}
                alt=""
                className="h-full w-auto object-contain object-bottom opacity-95 brightness-0 invert"
                draggable={false}
              />
              <p className="whitespace-nowrap text-[9px] tracking-[0.16em] text-white/70 uppercase">
                {forestCopy.humanScale}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mt-2 max-w-[34rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${animal.id}`}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={scenicTransition(reducedMotion)}
          >
            <h2
              className={cn(
                "font-[family-name:var(--font-ui)] text-[clamp(2.75rem,5.5vw,4.75rem)]",
                "font-bold tracking-[0.04em] text-white uppercase",
                "[text-shadow:0_2px_28px_rgba(0,0,0,0.55)]",
              )}
            >
              {animal.commonName}
            </h2>
            <p className="mt-1 font-[family-name:var(--font-body)] text-[length:var(--text-lead)] text-[var(--color-museum-warm)] italic">
              {animal.scientificName}
            </p>
            <p className="mt-4 max-w-[38ch] text-[length:var(--text-body)] leading-relaxed text-white/88">
              {animal.shortIntroduction}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-col items-start gap-3">
        <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[12px] tracking-[0.06em] text-white/75">
          <span className="mr-2 font-semibold tracking-[0.14em] text-[var(--color-museum-warm)] uppercase">
            Tip
          </span>
          {forestCopy.swipeHint}
        </div>
        <ProgressDots
          count={count}
          activeIndex={index}
          onSelect={onIndexChange}
          label="Forest animals"
        />
      </div>
    </div>
  );
}
