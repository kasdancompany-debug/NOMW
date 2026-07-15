"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type DirectionPromptProps = {
  message: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
};

const chevron: Record<Exclude<DirectionPromptProps["direction"], undefined | "none">, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

/**
 * Soft guidance for standing visitors — not a floating badge swarm.
 */
export function DirectionPrompt({
  message,
  direction = "none",
  className,
}: DirectionPromptProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.p
      className={cn(
        "inline-flex items-center gap-[var(--space-3)]",
        "font-[family-name:var(--font-ui)] text-[length:var(--text-body)]",
        "tracking-[var(--tracking-title)] text-[var(--text-on-dark-muted)]",
        className,
      )}
      animate={
        reducedMotion || direction === "none"
          ? undefined
          : {
              opacity: [0.55, 1, 0.55],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {direction !== "none" ? (
        <span aria-hidden className="text-[var(--color-aurora-teal)]">
          {chevron[direction]}
        </span>
      ) : null}
      {message}
    </motion.p>
  );
}
