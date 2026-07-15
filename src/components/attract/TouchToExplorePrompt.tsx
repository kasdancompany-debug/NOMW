"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type TouchToExplorePromptProps = {
  label?: string;
  className?: string;
};

/**
 * Clear attract CTA — ambient pulse only; static under reduced motion.
 */
export function TouchToExplorePrompt({
  label = "Touch to Explore",
  className,
}: TouchToExplorePromptProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("inline-flex flex-col items-start gap-[var(--space-4)]", className)}>
      <motion.span
        className="h-px w-16 bg-[var(--color-museum-warm)]"
        aria-hidden
        animate={
          reducedMotion
            ? { opacity: 0.85 }
            : { opacity: [0.35, 0.95, 0.35], scaleX: [0.85, 1, 0.85] }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ originX: 0 }}
      />
      <motion.p
        className={cn(
          "font-[family-name:var(--font-ui)] text-[length:var(--text-lead)]",
          "font-[number:var(--font-weight-medium)] tracking-[var(--tracking-title)]",
          "text-[var(--text-on-dark)]",
        )}
        animate={reducedMotion ? { opacity: 1 } : { opacity: [0.72, 1, 0.72] }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {label}
      </motion.p>
    </div>
  );
}
