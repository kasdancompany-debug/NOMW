"use client";

import { MEDIA_FALLBACK_DATA_URI } from "@/lib/media/config";
import { cn } from "@/utils/cn";

type MediaFallbackProps = {
  className?: string;
  label?: string;
};

/**
 * Soft media miss: branded plane instead of a broken browser icon.
 * Optional media must never block exhibit navigation or crash the session.
 */
export function MediaFallback({
  className,
  label = "Media arrives with final install",
}: MediaFallbackProps) {
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-[#1a3038]", className)}
      role="img"
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MEDIA_FALLBACK_DATA_URI}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
