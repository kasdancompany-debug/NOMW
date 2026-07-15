"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type ExhibitLoadingStateProps = {
  label?: string;
  className?: string;
};

export function ExhibitLoadingState({
  label = "Preparing the exhibit…",
  className,
}: ExhibitLoadingStateProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "safe-frame absolute inset-0 z-40 flex items-end bg-boreal-night",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div>
        <motion.div
          className="mb-[var(--space-5)] h-1 w-24 origin-left bg-[var(--color-museum-warm)]"
          initial={reducedMotion ? false : { scaleX: 0.2, opacity: 0.5 }}
          animate={
            reducedMotion
              ? { opacity: 1 }
              : { scaleX: [0.2, 1, 0.35], opacity: [0.5, 1, 0.7] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
          {label}
        </p>
      </div>
    </div>
  );
}
