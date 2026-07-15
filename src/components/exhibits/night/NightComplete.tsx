"use client";

import { motion } from "framer-motion";
import { nightCopy } from "@/content/exhibits/night/content";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type NightCompleteProps = {
  onContinue: () => void;
};

/**
 * Quiet celebration — soft light, no fanfare or jump cues.
 */
export function NightComplete({ onContinue }: NightCompleteProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(4,10,16,0.55)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={scenicTransition(reducedMotion)}
        className="w-full max-w-xl px-[var(--space-6)]"
      >
        <GlassPanel density="dense" className="text-center">
          <div className="mx-auto mb-[var(--space-5)] h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(212,176,122,0.7),transparent)]" />
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
            {nightCopy.completeTitle}
          </h2>
          <p className="mx-auto mt-[var(--space-4)] max-w-[36ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
            {nightCopy.completeBody}
          </p>
          <div className="mt-[var(--space-8)] flex justify-center">
            <LargeTouchButton onClick={onContinue}>{nightCopy.completeContinue}</LargeTouchButton>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
