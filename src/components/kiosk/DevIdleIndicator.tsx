"use client";

import { useKioskSession } from "@/hooks/useKioskSession";

/**
 * Development-only remaining inactivity countdown.
 * Renders nothing in production builds.
 */
export function DevIdleIndicator() {
  if (process.env.NODE_ENV === "production") return null;

  return <DevIdleIndicatorInner />;
}

function DevIdleIndicatorInner() {
  const {
    remainingMs,
    remainingAttractMs,
    phase,
    exhibitConfig,
    resetGeneration,
    heartbeat,
  } = useKioskSession();

  if (!exhibitConfig) return null;

  const resetSeconds = (remainingMs / 1000).toFixed(1);
  const attractSeconds =
    remainingAttractMs === null ? "—" : (remainingAttractMs / 1000).toFixed(1);

  return (
    <div
      className="pointer-events-none fixed right-3 bottom-3 z-[100] rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[rgba(8,18,24,0.88)] px-3 py-2 font-mono text-[11px] leading-relaxed text-[var(--color-mist)] shadow-[var(--elevation-1)]"
      aria-hidden
    >
      <div className="text-[var(--color-museum-warm)]">kiosk dev</div>
      <div>exhibit: {exhibitConfig.exhibitId}</div>
      <div>phase: {phase}</div>
      <div>reset in: {resetSeconds}s</div>
      <div>attract in: {attractSeconds}s</div>
      <div>resets: {resetGeneration}</div>
      {heartbeat ? <div>hb age: {Math.round((Date.now() - heartbeat.at) / 1000)}s</div> : null}
    </div>
  );
}
