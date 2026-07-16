/**
 * Convert silhouette PNGs with white/light backgrounds into true transparent cutouts.
 * Usage: node scripts/make-silhouettes-transparent.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, "../public/media/animals/silhouettes");

/** Pixels lighter than this (0–255 luminance) become transparent. */
const WHITE_CUTOFF = 210;
/** Dark silhouette pixels are forced fully opaque black for clean edges. */
const DARK_CUTOFF = 140;

async function processFile(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 4) throw new Error(`Expected RGBA: ${filePath}`);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum >= WHITE_CUTOFF) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else if (lum <= DARK_CUTOFF) {
      data[i] = 8;
      data[i + 1] = 10;
      data[i + 2] = 12;
      data[i + 3] = 255;
    } else {
      // Soft anti-aliased edge → black with proportional alpha
      const t = (WHITE_CUTOFF - lum) / (WHITE_CUTOFF - DARK_CUTOFF);
      const a = Math.round(Math.min(1, Math.max(0, t)) * 255);
      data[i] = 8;
      data[i + 1] = 10;
      data[i + 2] = 12;
      data[i + 3] = a;
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(filePath);

  console.log(`[silhouette] transparent: ${path.basename(filePath)}`);
}

const files = fs
  .readdirSync(dir)
  .filter((name) => name.endsWith(".png"))
  .map((name) => path.join(dir, name));

if (!files.length) {
  console.error("[silhouette] No PNG files found in", dir);
  process.exit(1);
}

for (const file of files) {
  await processFile(file);
}

console.log(`[silhouette] Done — ${files.length} files`);
