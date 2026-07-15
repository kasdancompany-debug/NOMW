"use client";

import { cn } from "@/utils/cn";

type MediaMetaProps = {
  caption?: string;
  attribution?: string;
  className?: string;
};

/** Captions + attribution under media — keeps meaning available when audio is muted. */
export function MediaMeta({ caption, attribution, className }: MediaMetaProps) {
  if (!caption && !attribution) return null;

  return (
    <div className={cn("space-y-1", className)}>
      {caption ? (
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">{caption}</p>
      ) : null}
      {attribution ? (
        <p className="text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">{attribution}</p>
      ) : null}
    </div>
  );
}
