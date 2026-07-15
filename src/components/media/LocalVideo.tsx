"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_VIDEO_PRELOAD } from "@/lib/media/config";
import {
  asLocalMedia,
  resolveAttribution,
  resolveCaptionText,
  resolveVideoPoster,
} from "@/lib/media/sources";
import { LocalImage } from "@/components/media/LocalImage";
import { MediaFallback } from "@/components/media/MediaFallback";
import { MediaMeta } from "@/components/media/MediaMeta";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnalytics } from "@/lib/analytics";
import { applySimulatorMediaSrc } from "@/lib/dev/simulator";
import type { LocalVideoProps } from "@/types/media";
import { cn } from "@/utils/cn";

/**
 * Local video playback for kiosk exhibits.
 * - No browser chrome / controls
 * - Safe muted autoplay
 * - Poster + graceful still fallback
 * - Lazy src attach so startup stays light
 * - Loop when configured
 * - Caption track support (VTT) for muted understanding
 */
export function LocalVideo({
  asset,
  src,
  poster,
  fallbackSrc,
  caption,
  attribution,
  className,
  videoClassName,
  loop,
  autoPlay = true,
  muted = true,
  preload = DEFAULT_VIDEO_PRELOAD,
  lazy = true,
  priority = false,
  playWhenVisible = true,
  onError,
  showAttribution = true,
  showCaption = true,
}: LocalVideoProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // When playWhenVisible, keep observing so off-screen / covered videos pause decode.
  const observeVisibility = playWhenVisible || (lazy && !priority);
  const inView = useInView(containerRef, {
    enabled: observeVisibility,
    once: !playWhenVisible,
  });

  const media = asLocalMedia(asset);
  const rawVideoSrc = src || media?.src;
  const videoSrc = rawVideoSrc ? applySimulatorMediaSrc(rawVideoSrc) : undefined;
  const shouldLoop = loop ?? media?.loop ?? true;
  const preloadMode = media?.preload ?? preload;
  const posterSrc = resolveVideoPoster({
    asset: media,
    poster,
    fallbackSrc: fallbackSrc || media?.fallbackSrc,
  });
  const captionText = showCaption ? resolveCaptionText(media, caption) : undefined;
  const credit = showAttribution ? resolveAttribution(media, attribution) : undefined;
  const captionsTrack = media?.captionsSrc;

  const [failed, setFailed] = useState(false);
  const attachSrc = Boolean(videoSrc) && (priority || !lazy || inView);
  const playedRef = useRef(false);

  // Reduced motion or missing src → still presentation (poster / image)
  const showStill = reducedMotion || !videoSrc || failed;

  useEffect(() => {
    playedRef.current = false;
  }, [videoSrc]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || showStill || !attachSrc) return;

    const preferPlay = autoPlay && muted && (!playWhenVisible || inView);
    if (preferPlay) {
      void node.play().catch(() => {
        /* wait for gesture / keep poster */
      });
    } else {
      node.pause();
    }
  }, [attachSrc, autoPlay, inView, muted, playWhenVisible, showStill, videoSrc]);

  if (showStill) {
    if (posterSrc || fallbackSrc || media?.fallbackSrc) {
      return (
        <div ref={containerRef} className={cn("relative", className)}>
          <LocalImage
            asset={media}
            src={posterSrc || fallbackSrc || media?.fallbackSrc}
            alt={media?.alt || captionText || ""}
            fallbackSrc={fallbackSrc || media?.fallbackSrc}
            caption={captionText}
            attribution={credit}
            fill={false}
            className="h-full w-full"
            imgClassName={cn("h-full w-full object-cover", videoClassName)}
            priority={priority}
            showCaption={showCaption}
            showAttribution={showAttribution}
          />
        </div>
      );
    }
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        <MediaFallback className={videoClassName} />
        <MediaMeta caption={captionText} attribution={credit} className="mt-2" />
      </div>
    );
  }

  return (
    <figure ref={containerRef} className={cn("relative", className)}>
      <video
        ref={videoRef}
        className={cn("h-full w-full object-cover", videoClassName)}
        src={attachSrc ? videoSrc : undefined}
        poster={posterSrc}
        muted={muted}
        loop={shouldLoop}
        playsInline
        autoPlay={autoPlay && muted}
        preload={priority ? preloadMode : attachSrc ? preloadMode : "none"}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onPlay={() => {
          if (playedRef.current) return;
          playedRef.current = true;
          getAnalytics().track("video_played", {
            mediaKind: "video",
            mediaId: media?.id ?? "video",
          });
        }}
        onError={() => {
          setFailed(true);
          getAnalytics().track("media_error", {
            mediaKind: "video",
            mediaId: media?.id ?? "video",
          });
          onError?.();
        }}
      >
        {captionsTrack ? (
          <track kind="captions" src={captionsTrack} srcLang="en" label="Captions" default />
        ) : null}
      </video>
      {/* Visible caption line — essential meaning without relying on audio */}
      <MediaMeta caption={captionText} attribution={credit} className="mt-2" />
    </figure>
  );
}
