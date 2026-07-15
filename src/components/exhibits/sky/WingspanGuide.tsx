"use client";

import type { SkyBirdPresentation } from "@/content/exhibits/sky/content";
import { skyCopy } from "@/content/exhibits/sky/content";
import { cn } from "@/utils/cn";

type WingspanGuideProps = {
  bird: SkyBirdPresentation;
  commonName: string;
  className?: string;
};

/**
 * Full-width relative wingspan guide — sensation of span, not a calibrated metric.
 */
export function WingspanGuide({ bird, commonName, className }: WingspanGuideProps) {
  const widthPct = Math.max(18, Math.round(bird.relativeWingspan * 100));

  return (
    <div className={cn("w-full space-y-[var(--space-3)]", className)}>
      <div className="flex items-baseline justify-between gap-[var(--space-4)]">
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
          {skyCopy.wingspanTitle}
        </h3>
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          {commonName}
        </p>
      </div>

      <div className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-white/6 px-[var(--space-2)] py-[var(--space-4)]">
        <div className="mb-[var(--space-2)] flex justify-between text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)] uppercase tracking-[var(--tracking-label)]">
          <span>Tip</span>
          <span>Tip</span>
        </div>
        <div className="relative h-3 w-full bg-white/10">
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--color-museum-warm),transparent)]"
            style={{ width: `${widthPct}%` }}
          />
          <div
            className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-[var(--color-museum-warm)]"
            style={{ left: `calc(50% - ${widthPct / 2}%)` }}
          />
          <div
            className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-[var(--color-museum-warm)]"
            style={{ left: `calc(50% + ${widthPct / 2}%)` }}
          />
        </div>
        <div className="mt-[var(--space-3)] flex items-center justify-center gap-[var(--space-3)]">
          <svg viewBox="0 0 120 40" className="h-8 w-auto text-[var(--text-on-dark)]" aria-hidden>
            <path
              d={`M10 22 Q ${60 - bird.relativeWingspan * 40} 8 60 18 Q ${60 + bird.relativeWingspan * 40} 8 110 22`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              opacity="0.85"
            />
            <ellipse cx="60" cy="20" rx="6" ry="8" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
      </div>

      <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">{bird.wingspanLabel}</p>
      <p className="text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
        {skyCopy.wingspanNote}
      </p>
    </div>
  );
}
