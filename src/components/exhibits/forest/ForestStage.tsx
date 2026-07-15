"use client";

import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { cn } from "@/utils/cn";

type ForestStageProps = {
  className?: string;
};

/**
 * Layered boreal MVP environment — gradient + silhouette canopy with labelled placeholder media.
 */
export function ForestStage({ className }: ForestStageProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <LayeredLandscape tone="boreal-giants" badgeLabel="Forest home loop · H.264 bed + WebP poster" />
      <div className="absolute inset-0 overlay-mist opacity-55" />
    </div>
  );
}
