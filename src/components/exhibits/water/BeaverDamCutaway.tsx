"use client";

import { motion } from "framer-motion";
import { waterCopy } from "@/content/exhibits/water/content";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type BeaverDamCutawayProps = {
  onClose: () => void;
};

export function BeaverDamCutaway({ onClose }: BeaverDamCutawayProps) {
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
              {waterCopy.damTitle}
            </h2>
            <p className="mt-[var(--space-3)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {waterCopy.damLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <GlassPanel density="dense" className="relative mt-[var(--space-6)] min-h-[22rem] overflow-hidden">
          <svg viewBox="0 0 900 420" className="h-full w-full" aria-hidden>
            <rect x="0" y="0" width="900" height="420" fill="#0c2433" />
            <path d="M0 250 H900" stroke="rgba(94,184,168,0.35)" strokeWidth="2" />
            {/* Water */}
            <rect x="0" y="250" width="900" height="170" fill="rgba(30,100,140,0.45)" />
            {/* Dam cross-section */}
            <path
              d="M360 120 L520 120 L560 250 L320 250 Z"
              fill="rgba(90,70,45,0.85)"
              stroke="rgba(212,176,122,0.5)"
              strokeWidth="3"
            />
            <path d="M380 140 H500 M370 170 H510 M355 200 H525 M340 230 H540" stroke="rgba(40,28,18,0.55)" strokeWidth="6" />
            {/* Lodge */}
            <ellipse cx="250" cy="270" rx="70" ry="40" fill="rgba(70,55,40,0.9)" />
            <path d="M210 270 Q250 220 290 270" fill="rgba(90,70,50,0.95)" />
            {/* Labels */}
            <text x="430" y="95" fill="#f3efe6" fontSize="22" textAnchor="middle">
              Dam
            </text>
            <text x="250" y="330" fill="#f3efe6" fontSize="20" textAnchor="middle">
              Lodge
            </text>
            <text x="700" y="300" fill="rgba(200,230,240,0.85)" fontSize="20" textAnchor="middle">
              Pond
            </text>
          </svg>
          <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
            Cross-section of dam, lodge, and pond — how beavers reshape a shoreline.
          </p>
        </GlassPanel>

        <LargeTouchButton onClick={onClose}>Back to the water column</LargeTouchButton>
      </div>
    </motion.div>
  );
}
