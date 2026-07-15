import type { MediaAsset, MediaSourceVariant } from "@/types/content";
import type { LocalMediaAsset } from "@/types/media";
import { MEDIA_FALLBACK_DATA_URI } from "@/lib/media/config";
import { applySimulatorMediaSrc } from "@/lib/dev/simulator";

export function asLocalMedia(asset?: MediaAsset | LocalMediaAsset | null): LocalMediaAsset | null {
  if (!asset) return null;
  return asset;
}

export function imageSrcSet(variants?: MediaSourceVariant[]): string | undefined {
  if (!variants?.length) return undefined;
  const parts = variants
    .filter((variant) => variant.width && variant.src)
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))
    .map((variant) => `${applySimulatorMediaSrc(variant.src)} ${variant.width}w`);
  return parts.length ? parts.join(", ") : undefined;
}

export function resolveImageSrc(input: {
  asset?: LocalMediaAsset | null;
  src?: string;
  failedPrimary?: boolean;
  failedFallback?: boolean;
}): string {
  const { asset, src, failedPrimary, failedFallback } = input;
  if (failedFallback) return MEDIA_FALLBACK_DATA_URI;
  if (failedPrimary) {
    const fallback = asset?.fallbackSrc || src || asset?.poster || MEDIA_FALLBACK_DATA_URI;
    return applySimulatorMediaSrc(fallback);
  }
  const primary = src || asset?.src || asset?.poster || MEDIA_FALLBACK_DATA_URI;
  return applySimulatorMediaSrc(primary);
}

export function resolveVideoPoster(input: {
  asset?: LocalMediaAsset | null;
  poster?: string;
  fallbackSrc?: string;
}): string | undefined {
  return (
    input.poster ||
    input.asset?.poster ||
    input.fallbackSrc ||
    input.asset?.fallbackSrc ||
    undefined
  );
}

export function resolveCaptionText(
  asset?: LocalMediaAsset | null,
  override?: string,
): string | undefined {
  if (override) return override;
  return asset?.caption;
}

export function resolveAttribution(
  asset?: LocalMediaAsset | null,
  override?: string,
): string | undefined {
  return override || asset?.attribution || asset?.credit;
}
