"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { baseTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type IdleWarningOverlayProps = {
  className?: string;
};

/**
 * Shown shortly before inactivity soft-reset. Any touch dismisses and renews the session.
 */
export function IdleWarningOverlay({ className }: IdleWarningOverlayProps) {
  const { isWarning, remainingMs, dismissWarning, phase } = useKioskSession();
  const reducedMotion = useReducedMotion();
  const visible = isWarning && phase === "warning";
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn(
            "absolute inset-0 z-[45] flex items-end bg-[rgba(6,16,24,0.55)]",
            className,
          )}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={baseTransition(reducedMotion)}
          onPointerDown={dismissWarning}
        >
          <div className="safe-frame w-full">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
              Still exploring?
            </p>
            <p className="mt-[var(--space-3)] max-w-[36ch] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
              This station returns to the start in about {seconds} second
              {seconds === 1 ? "" : "s"}. Touch anywhere to continue.
            </p>
            <div className="mt-[var(--space-6)]">
              <LargeTouchButton
                onClick={(event) => {
                  event.stopPropagation();
                  dismissWarning();
                }}
              >
                Keep exploring
              </LargeTouchButton>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
