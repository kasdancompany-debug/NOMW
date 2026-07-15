"use client";

import { cn } from "@/utils/cn";

type FlashlightLayerProps = {
  x: number;
  y: number;
  /** Beam radius in vmin */
  radiusVmin?: number;
  nightVision?: boolean;
  className?: string;
};

/**
 * Dark veil with a CSS radial mask that follows the smoothed pointer.
 */
export function FlashlightLayer({
  x,
  y,
  radiusVmin = 22,
  nightVision = false,
  className,
}: FlashlightLayerProps) {
  const cx = `${(x * 100).toFixed(3)}%`;
  const cy = `${(y * 100).toFixed(3)}%`;
  const soft = nightVision ? radiusVmin * 1.15 : radiusVmin;

  const mask = `radial-gradient(circle ${soft}vmin at ${cx} ${cy}, transparent 0%, transparent 38%, rgba(0,0,0,0.55) 62%, black 78%)`;

  return (
    <>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", className)}
        style={{
          background: nightVision ? "rgba(2, 18, 10, 0.88)" : "rgba(2, 6, 12, 0.93)",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
      {/* Soft beam glow (not masked) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: nightVision
            ? `radial-gradient(circle ${soft * 0.85}vmin at ${cx} ${cy}, rgba(70,180,120,0.16) 0%, transparent 70%)`
            : `radial-gradient(circle ${soft * 0.8}vmin at ${cx} ${cy}, rgba(220,210,180,0.12) 0%, transparent 68%)`,
        }}
      />
    </>
  );
}
