"use client";

import { motion } from "framer-motion";
import { skyCopy } from "@/content/exhibits/sky/content";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type WingDemoProps = {
  onClose: () => void;
};

/**
 * Silent slow-motion wingbeat demonstration — visual only.
 */
export function WingDemo({ onClose }: WingDemoProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-30 bg-[rgba(8,18,28,0.82)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {skyCopy.wingDemoTitle}
            </h2>
            <p className="mt-[var(--space-2)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {skyCopy.wingDemoLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <GlassPanel density="dense" className="flex w-full max-w-3xl flex-col items-center py-[var(--space-8)]">
            <motion.svg
              viewBox="0 0 320 160"
              className="h-48 w-full max-w-xl text-[var(--color-museum-warm)]"
              aria-label="Slow-motion wingbeat diagram"
            >
              <ellipse cx="160" cy="82" rx="14" ry="22" fill="currentColor" opacity="0.85" />
              <motion.path
                d="M160 78 C110 40 60 50 24 78"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        d: [
                          "M160 78 C110 40 60 50 24 78",
                          "M160 78 C112 95 62 110 24 88",
                          "M160 78 C110 40 60 50 24 78",
                        ],
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <motion.path
                d="M160 78 C210 40 260 50 296 78"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        d: [
                          "M160 78 C210 40 260 50 296 78",
                          "M160 78 C208 95 258 110 296 88",
                          "M160 78 C210 40 260 50 296 78",
                        ],
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <circle cx="160" cy="58" r="5" fill="currentColor" opacity="0.7" />
            </motion.svg>
            <p className="mt-[var(--space-6)] max-w-[42ch] text-center text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
              Downstroke gathers air; upstroke recovers. You can follow the cycle without listening.
            </p>
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  );
}
