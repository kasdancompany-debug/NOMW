"use client";

import { cn } from "@/utils/cn";

type PlaceholderBadgeProps = {
  /** What this stand-in represents once finals arrive */
  label: string;
  className?: string;
  /** Corner placement for full-bleed beds */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

/**
 * Explicit museum placeholder label — never looks like unfinished UI chrome.
 */
export function PlaceholderBadge({
  label,
  className,
  position = "bottom-left",
}: PlaceholderBadgeProps) {
  const pos =
    position === "top-left"
      ? "top-[var(--space-4)] left-[var(--space-4)]"
      : position === "top-right"
        ? "top-[var(--space-4)] right-[var(--space-4)]"
        : position === "bottom-right"
          ? "bottom-[var(--space-4)] right-[var(--space-4)]"
          : "bottom-[var(--space-4)] left-[var(--space-4)]";

  return (
    <p
      className={cn(
        "pointer-events-none absolute z-[5] max-w-[22rem] rounded-[var(--radius-sm)]",
        "border border-[rgba(212,176,122,0.35)] bg-[rgba(8,16,22,0.72)] px-3 py-1.5",
        "font-[family-name:var(--font-body)] text-[10px] tracking-[0.14em] text-[rgba(212,176,122,0.92)] uppercase",
        pos,
        className,
      )}
      aria-hidden
    >
      Placeholder · {label}
    </p>
  );
}
