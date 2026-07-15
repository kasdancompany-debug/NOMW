"use client";

import { motion } from "framer-motion";
import {
  AnimalSilhouette,
  silhouetteKindFromAnimalId,
  type SilhouetteKind,
} from "@/components/animals/AnimalSilhouette";
import { forestSilhouetteSrc } from "@/content/exhibits/forest/content";
import { HUMAN_RELATIVE_HEIGHT } from "@/content/exhibits/forest/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

export type SizeSubject = {
  id: string;
  label: string;
  /** 0–1 relative to tallest subject in the set */
  relativeHeight: number;
  variant?: "animal" | "human";
};

type SizeComparisonProps = {
  subjects: SizeSubject[];
  /** Optional note under the stage */
  note?: string;
  className?: string;
  /** Baseline height of the tallest silhouette in CSS */
  maxHeightPx?: number;
};

/**
 * Relative silhouette stage for communicating real-world scale.
 * Heights are visual ratios — not verified metric claims.
 */
export function SizeComparison({
  subjects,
  note,
  className,
  maxHeightPx = 280,
}: SizeComparisonProps) {
  const reducedMotion = useReducedMotion();
  const ordered = [...subjects].sort((a, b) => b.relativeHeight - a.relativeHeight);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative flex items-end justify-center gap-[var(--space-8)] border-b border-[var(--glass-border)] px-[var(--space-4)] pb-0"
        style={{ minHeight: maxHeightPx + 56 }}
      >
        {ordered.map((subject, index) => {
          const height = Math.max(56, subject.relativeHeight * maxHeightPx);
          const isHuman = subject.variant === "human";
          const kind: SilhouetteKind = isHuman
            ? "human"
            : silhouetteKindFromAnimalId(subject.id);
          return (
            <motion.div
              key={subject.id}
              className="flex flex-col items-center gap-[var(--space-3)]"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...scenicTransition(reducedMotion),
                delay: reducedMotion ? 0 : index * 0.05,
              }}
            >
              <div
                className="flex items-end justify-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                style={{ height, width: Math.max(48, height * 0.7) }}
                aria-hidden
              >
                {!isHuman &&
                ["moose", "black-bear", "grey-wolf", "woodland-caribou", "white-tailed-deer", "canada-lynx"].includes(
                  subject.id,
                ) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={forestSilhouetteSrc(subject.id)}
                    alt=""
                    className="max-h-full w-auto object-contain object-bottom"
                    style={{ filter: "brightness(0) invert(0.72)" }}
                    draggable={false}
                  />
                ) : (
                  <AnimalSilhouette kind={kind} prominent={!isHuman} className="max-h-full" />
                )}
              </div>
              <p
                className={cn(
                  "max-w-[7.5rem] text-center text-[length:var(--text-label)]",
                  isHuman
                    ? "text-[var(--text-on-dark-muted)]"
                    : "text-[var(--color-museum-warm)]",
                )}
              >
                {subject.label}
              </p>
            </motion.div>
          );
        })}
      </div>
      {note ? (
        <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          {note}
        </p>
      ) : (
        <p className="mt-[var(--space-3)] text-[10px] tracking-[0.12em] text-[rgba(212,176,122,0.65)] uppercase">
          Placeholder silhouettes · scaled for comparison only
        </p>
      )}
    </div>
  );
}

export function humanSizeSubject(label = "Human"): SizeSubject {
  return {
    id: "human",
    label,
    relativeHeight: HUMAN_RELATIVE_HEIGHT,
    variant: "human",
  };
}
