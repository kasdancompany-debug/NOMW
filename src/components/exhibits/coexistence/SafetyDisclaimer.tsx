"use client";

import {
  coexistenceCopy,
  coexistenceSafetyDisclaimer,
} from "@/content/exhibits/coexistence/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/utils/cn";

type SafetyDisclaimerProps = {
  className?: string;
  /** Show the structured emergency review field for staff / install visibility in-content */
  showReviewField?: boolean;
};

/**
 * Surfaces visitor-facing context plus the emergency-content disclaimer field
 * reserved for qualified local wildlife authority review before installation.
 */
export function SafetyDisclaimer({ className, showReviewField = false }: SafetyDisclaimerProps) {
  return (
    <GlassPanel density="dense" className={cn("max-w-md space-y-[var(--space-2)] py-[var(--space-4)]", className)}>
      <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
        {coexistenceCopy.disclaimerTitle}
      </p>
      <p className="text-[length:var(--text-body-sm)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
        {coexistenceSafetyDisclaimer.visitorFacing}
      </p>
      {showReviewField ? (
        <p
          className="rounded-[var(--radius-sm)] bg-white/5 p-[var(--space-3)] text-[length:var(--text-micro)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]"
          data-emergency-content-disclaimer={coexistenceSafetyDisclaimer.emergencyContentDisclaimer}
        >
          <span className="text-[var(--color-museum-warm)]">{coexistenceSafetyDisclaimer.shortLabel}: </span>
          {coexistenceSafetyDisclaimer.emergencyContentDisclaimer}
        </p>
      ) : null}
    </GlassPanel>
  );
}
