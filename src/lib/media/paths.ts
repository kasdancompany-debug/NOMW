import type { MediaAsset, MediaId } from "@/types/content";

/** Build a public URL for a file under /public/media/... */
export function mediaUrl(relativePath: string): string {
  const cleaned = relativePath.replace(/^\/+/, "").replace(/^media\//, "");
  return `/media/${cleaned}`;
}

export function indexMedia(assets: MediaAsset[]): Map<MediaId, MediaAsset> {
  return new Map(assets.map((asset) => [asset.id, asset]));
}

export function resolveMedia(
  assets: MediaAsset[] | Map<MediaId, MediaAsset>,
  id: MediaId,
): MediaAsset | undefined {
  if (assets instanceof Map) return assets.get(id);
  return assets.find((asset) => asset.id === id);
}
