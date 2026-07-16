"use client";

import { motion } from "framer-motion";
import {
  AnimalSilhouette,
  silhouetteKindFromAnimalId,
  type SilhouetteKind,
} from "@/components/animals/AnimalSilhouette";
import {
  forestBodyProportion,
  forestSilhouetteAspectRatio,
  forestSilhouetteDisplayHeight,
  forestSilhouetteSrc,
  HUMAN_RELATIVE_HEIGHT,
} from "@/content/exhibits/forest/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

export type SizeSubject = {
  id: string;
  label: string;
  /** Shoulder / withers height relative to standing adult human (= 1.0) */
  relativeHeight: number;
  /**
   * Fraction of silhouette art from ground to withers.
   * Antlered species are < 1 so antlers can extend above the shoulder line.
   */
  bodyProportion?: number;
  variant?: "animal" | "human";
};

type SizeComparisonProps = {
  subjects: SizeSubject[];
  /** Optional note under the stage */
  note?: string;
  className?: string;
  /** Baseline height of a standing adult human in CSS px */
  maxHeightPx?: number;
};

const FOREST_IDS = new Set([
  "moose",
  "black-bear",
  "grey-wolf",
  "woodland-caribou",
  "white-tailed-deer",
  "canada-lynx",
]);

function subjectDisplayHeight(subject: SizeSubject, stagePx: number): number {
  if (subject.variant === "human") {
    return Math.max(48, subject.relativeHeight * stagePx);
  }
  const proportion =
    subject.bodyProportion ??
    (FOREST_IDS.has(subject.id) ? forestBodyProportion(subject.id) : 1);
  return forestSilhouetteDisplayHeight(subject.relativeHeight, proportion, stagePx);
}

/**
 * Relative silhouette stage for communicating real-world scale.
 * Human standing height = 1.0; animal values are shoulder/withers height.
 */
export function SizeComparison({
  subjects,
  note,
  className,
  maxHeightPx = 160,
}: SizeComparisonProps) {
  const reducedMotion = useReducedMotion();
  // Human is the fixed reference; antlers may extend above maxHeightPx.
  const stagePx = maxHeightPx;
  const tallest = Math.max(
    ...subjects.map((subject) => subjectDisplayHeight(subject, stagePx)),
    stagePx,
  );
  const ordered = [...subjects].sort((a, b) => b.relativeHeight - a.relativeHeight);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative flex items-end justify-center gap-[var(--space-6)] border-b border-white/10 px-[var(--space-3)] pb-0"
        style={{ minHeight: tallest + 48 }}
      >
        {ordered.map((subject, index) => {
          const height = subjectDisplayHeight(subject, stagePx);
          const isHuman = subject.variant === "human";
          const kind: SilhouetteKind = isHuman
            ? "human"
            : silhouetteKindFromAnimalId(subject.id);
          const useCutout = !isHuman && FOREST_IDS.has(subject.id);

          return (
            <motion.div
              key={subject.id}
              className="flex flex-col items-center gap-[var(--space-3)]"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...scenicTransition(reducedMotion),
                delay: reducedMotion ? 0 : index * 0.04,
              }}
            >
              <div
                className="flex items-end justify-center"
                style={{
                  height,
                  width: Math.max(
                    40,
                    height *
                      (useCutout ? forestSilhouetteAspectRatio(subject.id) : 0.65),
                  ),
                }}
                aria-hidden
              >
                {useCutout ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={forestSilhouetteSrc(subject.id)}
                    alt=""
                    className="max-h-full w-auto object-contain object-bottom"
                    style={{
                      filter:
                        "brightness(0) invert(1) drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
                    }}
                    draggable={false}
                  />
                ) : (
                  <AnimalSilhouette
                    kind={kind}
                    compact
                    prominent={!isHuman}
                    className={cn(
                      "max-h-full",
                      isHuman ? "text-white/55" : "text-white/90",
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  "max-w-[7rem] text-center text-[12px] leading-snug",
                  isHuman ? "text-white/45" : "text-[var(--color-museum-warm)]",
                )}
              >
                {subject.label}
              </p>
            </motion.div>
          );
        })}
      </div>
      {note ? (
        <p className="mt-[var(--space-3)] text-[13px] leading-relaxed text-white/45">{note}</p>
      ) : null}
    </div>
  );
}

export function humanSizeSubject(label = "Human"): SizeSubject {
  return {
    id: "human",
    label,
    relativeHeight: HUMAN_RELATIVE_HEIGHT,
    bodyProportion: 1,
    variant: "human",
  };
}
