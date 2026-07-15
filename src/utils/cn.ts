/**
 * Lightweight className joiner — avoids an extra dependency for the design system.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
