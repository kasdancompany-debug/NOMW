"use client";

import { LocalImage } from "@/components/media/LocalImage";
import { LocalVideo } from "@/components/media/LocalVideo";
import { KIOSK_IMAGE_SIZES } from "@/lib/media/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type FullscreenMediaProps = {
  /** Image path under /public */
  imageSrc?: string;
  imageAlt?: string;
  /** Video path under /public */
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
  /** Dim/scrim for text legibility */
  scrim?: "none" | "mist" | "night" | "warm";
  /** Background beds are priority for the active exhibit, but use metadata preload */
  priority?: boolean;
  /**
   * When false (e.g. attract covering the shell), pause decode/play and prefer the poster.
   * Keeps polish without hidden fullscreen video running under attract.
   */
  playbackActive?: boolean;
};

/**
 * Edge-to-edge visual plane for exhibit atmospheres.
 * Uses the local media layer — posters, lazy-safe video, no broken icons.
 */
export function FullscreenMedia({
  imageSrc,
  imageAlt = "",
  videoSrc,
  posterSrc,
  className,
  scrim = "mist",
  priority = true,
  playbackActive = true,
}: FullscreenMediaProps) {
  const reducedMotion = useReducedMotion();
  const showVideo = Boolean(videoSrc) && !reducedMotion && playbackActive;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden={imageAlt === ""}>
      {showVideo && videoSrc ? (
        <LocalVideo
          src={videoSrc}
          poster={posterSrc ?? imageSrc}
          fallbackSrc={imageSrc ?? posterSrc}
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover"
          loop
          autoPlay
          muted
          preload="metadata"
          lazy={false}
          priority={priority}
          playWhenVisible
          showCaption={false}
          showAttribution={false}
        />
      ) : imageSrc || posterSrc ? (
        <LocalImage
          src={imageSrc ?? posterSrc}
          alt={imageAlt}
          fallbackSrc={posterSrc}
          fill
          priority={priority}
          sizes={KIOSK_IMAGE_SIZES.fullBleed}
          className="absolute inset-0"
          imgClassName="object-cover"
          showCaption={false}
          showAttribution={false}
        />
      ) : (
        <div className="h-full w-full bg-boreal-night" />
      )}

      {scrim !== "none" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "mist" && "overlay-mist",
            scrim === "night" && "overlay-night",
            scrim === "warm" && "overlay-warm-light",
          )}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 overlay-vignette" />
    </div>
  );
}
