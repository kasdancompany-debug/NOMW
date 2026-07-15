"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pressDepthTap, pressTransition } from "@/lib/motion/touch";
import { baseTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type ProgressDotsProps = {
  count: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  className?: string;
  label?: string;
};

/**
 * Scene / beat progress. Large hit areas; squares not pills — restrained geometry.
 */
export function ProgressDots({
  count,
  activeIndex,
  onSelect,
  className,
  label = "Progress",
}: ProgressDotsProps) {
  const reducedMotion = useReducedMotion();
  if (count <= 0) return null;

  return (
    <nav aria-label={label} className={cn("flex items-center gap-[var(--space-3)]", className)}>
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        const interactive = Boolean(onSelect);

        const inner = (
          <motion.span
            layout={!reducedMotion}
            transition={baseTransition(reducedMotion)}
            className={cn(
              "block h-3 w-3 rounded-[var(--radius-xs)]",
              active
                ? "bg-[var(--color-museum-warm)] shadow-[var(--elevation-glow-warm)]"
                : "bg-[var(--color-mist)]/35",
            )}
          />
        );

        if (!interactive) {
          return (
            <span key={index} className="touch-target inline-flex items-center justify-center">
              {inner}
            </span>
          );
        }

        return (
          <motion.button
            key={index}
            type="button"
            aria-label={`${label} ${index + 1} of ${count}`}
            aria-current={active ? "step" : undefined}
            className="touch-target touch-pressable inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            whileTap={pressDepthTap(reducedMotion)}
            transition={pressTransition(reducedMotion)}
            onClick={() => onSelect?.(index)}
          >
            {inner}
          </motion.button>
        );
      })}
    </nav>
  );
}
