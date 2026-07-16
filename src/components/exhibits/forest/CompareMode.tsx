"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  FOREST_HUMAN_SILHOUETTE,
  HUMAN_RELATIVE_HEIGHT,
  forestAnimals,
  forestCopy,
  forestSilhouetteSrc,
} from "@/content/exhibits/forest/content";
import { ForestStage } from "@/components/exhibits/forest/ForestStage";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
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

function AnimalChip({
  animalId,
  active,
  disabled,
  onSelect,
}: {
  animalId: AnimalId;
  active: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const animal = getAnimal(animalId);
  if (!animal) return null;
  return (
    <Touchable
      soft
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "rounded-[var(--radius-sm)] px-[0.9rem] py-[0.55rem] text-[12px] tracking-[0.06em]",
        active
          ? "bg-[var(--color-museum-warm)] text-[#1a140c]"
          : "border border-white/15 text-white/70",
        disabled && "opacity-25",
      )}
      onClick={onSelect}
    >
      {animal.commonName}
    </Touchable>
  );
}

function CompareFigure({
  animalId,
  relativeHeight,
  stagePx,
}: {
  animalId: AnimalId;
  relativeHeight: number;
  stagePx: number;
}) {
  const animal = getAnimal(animalId);
  const height = Math.max(72, relativeHeight * stagePx);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-end">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={forestSilhouetteSrc(animalId)}
        alt=""
        className="w-auto max-w-full object-contain object-bottom"
        style={{
          height,
          filter:
            "brightness(0) invert(1) drop-shadow(0 0 18px rgba(160,210,180,0.35)) drop-shadow(0 14px 28px rgba(0,0,0,0.45))",
        }}
        draggable={false}
      />
      <p className="mt-[var(--space-4)] text-center font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.85rem)] leading-tight tracking-[-0.02em] text-white">
        {animal?.commonName}
      </p>
      <p className="mt-1 font-[family-name:var(--font-body)] text-[13px] italic text-[var(--color-museum-warm)]/90">
        {animal?.scientificName}
      </p>
    </div>
  );
}

/**
 * Full-screen size compare — opaque stage, two animals + human baseline.
 * Never leaves the explore UI visible underneath.
 */
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
  const stagePx = 280;
  const humanPx = HUMAN_RELATIVE_HEIGHT * stagePx;
  const ready = Boolean(left && right);

  return (
    <motion.div
      className="absolute inset-0 z-[55] flex flex-col overflow-hidden bg-[#06100e]"
      role="dialog"
      aria-modal="true"
      aria-label={forestCopy.compareTitle}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <ForestStage />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-[var(--space-6)] pt-[var(--space-8)] pb-[var(--space-5)] xl:px-[var(--space-9)]">
        <header className="flex shrink-0 items-start justify-between gap-[var(--space-6)]">
          <div>
            <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.2em] text-white/45 uppercase">
              Giants of the Forest
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2rem,3.5vw,3rem)] font-medium tracking-[-0.02em] text-white">
              {forestCopy.compareTitle}
            </h2>
            <p className="mt-2 max-w-[40ch] font-[family-name:var(--font-body)] text-[15px] leading-relaxed text-white/60">
              {forestCopy.compareLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </header>

        <div className="mt-[var(--space-6)] grid shrink-0 gap-[var(--space-5)] lg:grid-cols-2">
          <div>
            <p className="mb-3 font-[family-name:var(--font-ui)] text-[10px] tracking-[0.18em] text-white/45 uppercase">
              First animal
            </p>
            <div className="flex flex-wrap gap-2">
              {forestAnimals.map((entry) => (
                <AnimalChip
                  key={`l-${entry.animalId}`}
                  animalId={entry.animalId}
                  active={leftId === entry.animalId}
                  disabled={rightId === entry.animalId}
                  onSelect={() => onSelectLeft(entry.animalId)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-[family-name:var(--font-ui)] text-[10px] tracking-[0.18em] text-white/45 uppercase">
              Second animal
            </p>
            <div className="flex flex-wrap gap-2">
              {forestAnimals.map((entry) => (
                <AnimalChip
                  key={`r-${entry.animalId}`}
                  animalId={entry.animalId}
                  active={rightId === entry.animalId}
                  disabled={leftId === entry.animalId}
                  onSelect={() => onSelectRight(entry.animalId)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-[var(--space-6)] min-h-0 flex-1">
          <div className="absolute inset-x-[10%] top-[8%] bottom-[18%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(210,230,220,0.16)_0%,transparent_70%)] blur-md" />

          {ready && left && right ? (
            <div className="relative flex h-full items-end justify-center gap-[clamp(1.5rem,4vw,3.5rem)] pb-2">
              <CompareFigure
                animalId={left.animalId}
                relativeHeight={left.relativeHeight}
                stagePx={stagePx}
              />

              <div className="flex flex-col items-center justify-end pb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FOREST_HUMAN_SILHOUETTE}
                  alt=""
                  className="w-auto object-contain object-bottom"
                  style={{
                    height: humanPx,
                    filter:
                      "brightness(0) invert(0.82) sepia(0.35) saturate(1.4) hue-rotate(5deg)",
                  }}
                  draggable={false}
                />
                <p className="mt-[var(--space-4)] whitespace-nowrap text-[10px] tracking-[0.18em] text-white/50 uppercase">
                  {forestCopy.humanScale}
                </p>
              </div>

              <CompareFigure
                animalId={right.animalId}
                relativeHeight={right.relativeHeight}
                stagePx={stagePx}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="font-[family-name:var(--font-body)] text-[15px] text-white/55">
                Choose two different animals to compare.
              </p>
            </div>
          )}
        </div>

        <footer className="mt-[var(--space-4)] flex shrink-0 flex-wrap items-center justify-between gap-[var(--space-4)] border-t border-white/[0.08] pt-[var(--space-4)]">
          <p className="max-w-[48ch] font-[family-name:var(--font-body)] text-[13px] text-white/45">
            {forestCopy.sizeNote}
          </p>
          <LargeTouchButton onClick={onClose}>Back to Giants</LargeTouchButton>
        </footer>
      </div>
    </motion.div>
  );
}
