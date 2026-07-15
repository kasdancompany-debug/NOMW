"use client";

import { motion } from "framer-motion";
import { waterCopy, waterFoodChain } from "@/content/exhibits/water/content";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type FoodChainPanelProps = {
  onClose: () => void;
};

export function FoodChainPanel({ onClose }: FoodChainPanelProps) {
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
              {waterCopy.foodTitle}
            </h2>
            <p className="mt-[var(--space-3)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {waterCopy.foodLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <div className="flex flex-1 flex-col items-stretch justify-center gap-[var(--space-4)] py-[var(--space-8)]">
          {waterFoodChain.map((node, index) => (
            <motion.div
              key={node.id}
              initial={reducedMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                ...scenicTransition(reducedMotion),
                delay: reducedMotion ? 0 : index * 0.06,
              }}
            >
              <GlassPanel
                density="dense"
                className={cn(
                  "max-w-[36rem]",
                  node.role === "producer" && "border-[var(--color-moss-lit)]/40",
                  node.role === "top" && "border-[var(--color-museum-warm)]/50",
                )}
              >
                <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-aurora-teal)] uppercase">
                  {node.role === "producer"
                    ? "Produces"
                    : node.role === "top"
                      ? "Top link"
                      : "Consumes"}
                </p>
                <p className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
                  {node.label}
                </p>
              </GlassPanel>
              {index < waterFoodChain.length - 1 ? (
                <p className="py-[var(--space-2)] pl-[var(--space-5)] text-[var(--color-museum-warm)]" aria-hidden>
                  ↓
                </p>
              ) : null}
            </motion.div>
          ))}
        </div>

        <LargeTouchButton onClick={onClose}>Back to the water column</LargeTouchButton>
      </div>
    </motion.div>
  );
}
