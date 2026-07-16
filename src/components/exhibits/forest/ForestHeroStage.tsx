"use client";

import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import type { Animal } from "@/types/content";
import {
  FOREST_HUMAN_SILHOUETTE,
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
  // Human standing height is the shared % reference; animal art is sized so
  // withers land at relativeHeight (antlers may extend above via bodyProportion).
  const humanStagePct = 52;
  const bodyProportion = presentation.bodyProportion ?? 1;
  const animalStagePct =
    (presentation.relativeHeight / Math.min(1, Math.max(0.35, bodyProportion))) *
    humanStagePct;

  const go = (next: number) => {
    onIndexChange(Math.min(count - 1, Math.max(0, next)));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-visible">
      <motion.div
        className="relative min-h-0 flex-1 cursor-grab overflow-visible active:cursor-grabbing"
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
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center px-2 pt-4">
              <div className="relative h-full w-full max-w-[42rem]">
                {/* Soft light plate so dark cutouts separate from the treeline */}
                <div
                  className="pointer-events-none absolute bottom-[4%] left-1/2 h-[70%] w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(210,230,220,0.22)_0%,rgba(80,120,110,0.1)_45%,transparent_72%)] blur-md"
                  aria-hidden
                />

                <div
                  className="pointer-events-none absolute right-[3%] left-[4%] z-[1] border-t border-dashed border-white/25"
                  style={{ bottom: `${presentation.relativeHeight * humanStagePct}%` }}
                  aria-hidden
                >
                  <span className="absolute right-0 bottom-1 font-[family-name:var(--font-ui)] text-[9px] tracking-[0.16em] text-white/58 uppercase">
                    Shoulder · {presentation.shoulderHeightM.toFixed(2)} m
                  </span>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={forestSilhouetteSrc(animal.id)}
                  data-testid="forest-animal-silhouette"
                  data-animal-id={animal.id}
                  alt=""
                  className="absolute bottom-0 left-[54%] z-[2] w-auto max-w-[86%] -translate-x-1/2 object-contain object-bottom"
                  style={{
                    height: `${animalStagePct}%`,
                    opacity: 0.94,
                    filter:
                      "brightness(0) invert(1) drop-shadow(0 0 22px rgba(160,210,180,0.4)) drop-shadow(0 16px 28px rgba(0,0,0,0.45))",
                  }}
                  draggable={false}
                />

                <div
                  className="absolute bottom-0 left-[8%] z-[2] flex items-end"
                  style={{ height: `${humanStagePct}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FOREST_HUMAN_SILHOUETTE}
                    data-testid="forest-human-silhouette"
                    alt=""
                    className="h-full w-auto object-contain object-bottom opacity-80"
                    style={{
                      filter:
                        "brightness(0) invert(0.82) sepia(0.35) saturate(1.4) hue-rotate(5deg)",
                    }}
                    draggable={false}
                  />
                  <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.2em] text-white/55 uppercase">
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
                "font-[family-name:var(--font-display)] text-[clamp(2.5rem,4.5vw,4rem)]",
                "font-medium leading-[1.02] tracking-[-0.025em] text-white",
                "[text-shadow:0_2px_28px_rgba(0,0,0,0.45)]",
              )}
            >
              {animal.commonName}
            </h2>
            <p className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--text-body)] italic tracking-[0.01em] text-[var(--color-museum-warm)]">
              {animal.scientificName}
            </p>
            <p className="mt-[var(--space-4)] max-w-[38ch] font-[family-name:var(--font-body)] text-[length:var(--text-body-sm)] leading-[1.7] text-white/85">
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
