"use client";

import { motion } from "framer-motion";
import {
  HUMAN_RELATIVE_LENGTH,
  STURGEON_RELATIVE_LENGTH,
  waterCopy,
} from "@/content/exhibits/water/content";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type SturgeonSizePanelProps = {
  onClose: () => void;
};

/**
 * Horizontal relative length comparison for lake sturgeon.
 * Visual feeling only — not curator-locked measurements.
 */
export function SturgeonSizePanel({ onClose }: SturgeonSizePanelProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-[rgba(6,16,24,0.78)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col justify-between py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {waterCopy.sturgeonTitle}
            </h2>
            <p className="mt-[var(--space-3)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {waterCopy.sturgeonLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <GlassPanel density="dense" className="mt-[var(--space-8)] space-y-[var(--space-8)]">
          <LengthBar
            label="Lake Sturgeon"
            ratio={STURGEON_RELATIVE_LENGTH}
            tone="warm"
            reducedMotion={reducedMotion}
          />
          <LengthBar
            label="Human (standing height as length cue)"
            ratio={HUMAN_RELATIVE_LENGTH}
            tone="mist"
            reducedMotion={reducedMotion}
          />
          <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
            {waterCopy.sizeNote}
          </p>
        </GlassPanel>

        <LargeTouchButton onClick={onClose}>Back to the water column</LargeTouchButton>
      </div>
    </motion.div>
  );
}

function LengthBar({
  label,
  ratio,
  tone,
  reducedMotion,
}: {
  label: string;
  ratio: number;
  tone: "warm" | "mist";
  reducedMotion: boolean;
}) {
  return (
    <div>
      <p className="mb-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
        {label}
      </p>
      <div className="h-16 w-full overflow-hidden rounded-[var(--radius-sm)] bg-[rgba(238,243,246,0.08)]">
        <motion.div
          className={
            tone === "warm"
              ? "h-full bg-[var(--color-museum-warm)]"
              : "h-full bg-[var(--color-mist)]/55"
          }
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${Math.round(ratio * 100)}%` }}
          transition={scenicTransition(reducedMotion)}
        />
      </div>
    </div>
  );
}
