"use client";

import { motion } from "framer-motion";
import { useHoldProgress } from "@/hooks/useHoldProgress";
import { pressDepthTap, pressTransition } from "@/lib/motion/touch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type HoldProgressButtonProps = {
  label: string;
  onComplete: () => void;
  durationMs?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Hold-to-confirm control with visible progress — useful for deliberate actions.
 */
export function HoldProgressButton({
  label,
  onComplete,
  durationMs,
  disabled,
  className,
}: HoldProgressButtonProps) {
  const reducedMotion = useReducedMotion();
  const { progress, holding, handlers } = useHoldProgress({
    durationMs,
    disabled,
    onComplete,
  });

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileTap={disabled ? undefined : pressDepthTap(reducedMotion)}
      transition={pressTransition(reducedMotion)}
      className={cn(
        "touch-target-md relative overflow-hidden rounded-[var(--radius-sm)]",
        "border border-[var(--glass-border)] bg-[var(--glass-bg)] px-[var(--space-8)] py-[var(--space-5)]",
        "text-[length:var(--text-lead)] text-[var(--text-on-dark)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
        disabled && "opacity-40",
        className,
      )}
      {...handlers}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-[rgba(212,176,122,0.28)]"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative z-10">
        {holding ? "Keep holding…" : label}
      </span>
    </motion.button>
  );
}
