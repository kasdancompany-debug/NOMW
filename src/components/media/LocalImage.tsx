"use client";

import { useState } from "react";
import Image from "next/image";
import { KIOSK_IMAGE_SIZES } from "@/lib/media/config";
import {
  asLocalMedia,
  imageSrcSet,
  resolveAttribution,
  resolveCaptionText,
  resolveImageSrc,
} from "@/lib/media/sources";
import { MediaFallback } from "@/components/media/MediaFallback";
import { MediaMeta } from "@/components/media/MediaMeta";
import { getAnalytics } from "@/lib/analytics";
import type { LocalImageProps } from "@/types/media";
import { cn } from "@/utils/cn";

/**
 * Local responsive image with lazy loading, fallback chain, and attribution.
 */
export function LocalImage({
  asset,
  src,
  alt,
  fallbackSrc,
  caption,
  attribution,
  className,
  imgClassName,
  priority = false,
  sizes = KIOSK_IMAGE_SIZES.hero,
  fill = false,
  width,
  height,
  onError,
  showAttribution = true,
  showCaption = true,
}: LocalImageProps) {
  const media = asLocalMedia(asset);
  const [failedPrimary, setFailedPrimary] = useState(false);
  const [failedFallback, setFailedFallback] = useState(false);

  const resolvedSrc = resolveImageSrc({
    asset: media
      ? { ...media, fallbackSrc: fallbackSrc || media.fallbackSrc }
      : media,
    src,
    failedPrimary,
    failedFallback,
  });

  const resolvedAlt = alt || media?.alt || media?.label || "";
  const captionText = showCaption ? resolveCaptionText(media, caption) : undefined;
  const credit = showAttribution ? resolveAttribution(media, attribution) : undefined;
  const srcSet = imageSrcSet(media?.sources);
  const useNativeImg = Boolean(srcSet) || resolvedSrc.startsWith("data:");

  if (failedFallback) {
    return (
      <div className={cn("relative", className)}>
        <MediaFallback className={cn(fill && "absolute inset-0", imgClassName)} />
        <MediaMeta caption={captionText} attribution={credit} className="mt-2" />
      </div>
    );
  }

  const handleError = () => {
    getAnalytics().track("media_error", {
      mediaKind: "image",
      mediaId: media?.id ?? "image",
    });
    if (!failedPrimary) {
      setFailedPrimary(true);
      onError?.();
      return;
    }
    setFailedFallback(true);
    onError?.();
  };

  return (
    <figure className={cn("relative", className)}>
      {useNativeImg || !fill ? (
        // Native img for srcset / data-uri fallbacks
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={resolvedAlt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={cn(fill && "absolute inset-0 h-full w-full object-cover", imgClassName)}
          onError={handleError}
          draggable={false}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={resolvedAlt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn("object-cover", imgClassName)}
          sizes={sizes}
          unoptimized
          onError={handleError}
        />
      )}
      <MediaMeta caption={captionText} attribution={credit} className="mt-2" />
    </figure>
  );
}
