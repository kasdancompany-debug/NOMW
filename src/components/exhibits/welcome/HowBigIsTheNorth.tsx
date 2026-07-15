"use client";

import { motion } from "framer-motion";
import { scaleComparisons, welcomeCopy } from "@/content/exhibits/welcome/content";
import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { BackToStartButton } from "@/components/touch/BackToStartButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type HowBigIsTheNorthProps = {
  onBack: () => void;
  onContinue: () => void;
};

/**
 * Relative visual comparison — not a trivia scoreboard of unverified numbers.
 */
export function HowBigIsTheNorth({ onBack, onContinue }: HowBigIsTheNorthProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <LayeredLandscape tone="habitat-lake" badgeLabel="Scale diagram bed · illustrative only" />
      <div className="pointer-events-none absolute inset-0 bg-[rgba(6,16,24,0.5)]" />
      <div className="safe-frame relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div className="max-w-[40rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-aurora-teal)] uppercase">
              Scale of wonder
            </p>
            <h2 className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {welcomeCopy.howBigTitle}
            </h2>
            <p className="mt-[var(--space-4)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {welcomeCopy.howBigLead}
            </p>
          </div>
          <BackToStartButton onPress={onBack} label="Back to map" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-[var(--space-6)] py-[var(--space-8)]">
          {scaleComparisons.map((item, index) => (
            <div key={item.id} className="w-full max-w-[56rem]">
              <div className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-4)]">
                <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
                  {item.label}
                </p>
                {item.confidence === "needs-research" ? (
                  <p className="text-[length:var(--text-micro)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
                    Awaiting curator figures
                  </p>
                ) : null}
              </div>
              <div className="h-14 w-full overflow-hidden rounded-[var(--radius-sm)] bg-[rgba(238,243,246,0.08)]">
                <motion.div
                  className={cn(
                    "h-full rounded-[var(--radius-sm)]",
                    index === 0
                      ? "bg-[var(--color-museum-warm)]"
                      : "bg-[var(--color-aurora-teal)]/70",
                  )}
                  initial={reducedMotion ? false : { width: 0 }}
                  animate={{ width: `${Math.round(item.relativeSize * 100)}%` }}
                  transition={{
                    ...scenicTransition(reducedMotion),
                    delay: reducedMotion ? 0 : index * 0.12,
                  }}
                />
              </div>
              <p className="mt-[var(--space-2)] max-w-[48ch] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <div className="pb-[var(--space-2)]">
          <LargeTouchButton onClick={onContinue}>Explore the room</LargeTouchButton>
        </div>
      </div>
    </motion.div>
  );
}
