/**
 * Returns true when non-essential motion should be suppressed.
 * Staff override (when wired) can force this regardless of OS preference.
 */
export function prefersReducedMotion(
  forceOverride: boolean | null = null,
  mediaQueryMatch = false,
): boolean {
  if (forceOverride !== null) return forceOverride;
  return mediaQueryMatch;
}

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
