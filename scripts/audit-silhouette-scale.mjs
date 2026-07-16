import fs from "fs";
import zlib from "zlib";

function parsePng(file) {
  const buf = fs.readFileSync(file);
  let offset = 8;
  let width;
  let height;
  let colorType;
  const idat = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    offset += 4;
    const type = buf.toString("ascii", offset, offset + 4);
    offset += 4;
    const data = buf.subarray(offset, offset + len);
    offset += len + 4;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") {
      idat.push(data);
    }
  }
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const stride = width * bpp + 1;
  const pixels = Buffer.alloc(width * height * 4);
  let prev = Buffer.alloc(width * bpp);
  for (let y = 0; y < height; y++) {
    const filter = inflated[y * stride];
    const row = inflated.subarray(y * stride + 1, (y + 1) * stride);
    const out = Buffer.alloc(width * bpp);
    for (let i = 0; i < row.length; i++) {
      let v = row[i];
      const left = i >= bpp ? out[i - bpp] : 0;
      const up = prev[i];
      const upLeft = i >= bpp ? prev[i - bpp] : 0;
      if (filter === 1) v = (v + left) & 255;
      else if (filter === 2) v = (v + up) & 255;
      else if (filter === 3) v = (v + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        v = (v + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      }
      out[i] = v;
    }
    for (let x = 0; x < width; x++) {
      const si = x * bpp;
      const di = (y * width + x) * 4;
      if (bpp === 4) {
        pixels[di] = out[si];
        pixels[di + 1] = out[si + 1];
        pixels[di + 2] = out[si + 2];
        pixels[di + 3] = out[si + 3];
      } else if (bpp === 2) {
        pixels[di] = out[si];
        pixels[di + 1] = out[si];
        pixels[di + 2] = out[si];
        pixels[di + 3] = out[si + 1];
      } else if (bpp === 3) {
        pixels[di] = out[si];
        pixels[di + 1] = out[si + 1];
        pixels[di + 2] = out[si + 2];
        pixels[di + 3] = 255;
      } else {
        pixels[di] = out[si];
        pixels[di + 1] = out[si];
        pixels[di + 2] = out[si];
        pixels[di + 3] = 255;
      }
    }
    prev = out;
  }
  return { width, height, pixels };
}

function analyze(name, calibration) {
  const { width, height, pixels } = parsePng(
    `public/media/animals/silhouettes/${name}.png`,
  );
  let minY = height;
  let maxY = -1;
  let minX = width;
  let maxX = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] > 20) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  const contentH = maxY - minY + 1;
  // Shoulder landmarks are anatomical annotations, not alpha-column guesses.
  // Antlers can cross torso columns and made the old caribou estimate 0.87
  // instead of 0.568, shrinking a 1.1 m caribou to the apparent size of a dog.
  const shoulderY = calibration.shoulderY ?? minY;
  const groundToShoulder = maxY - shoulderY + 1;
  const artworkProportion = groundToShoulder / height;
  const relativeToHuman = calibration.shoulderHeightM / 1.7;
  const projectedArtHeight = relativeToHuman / artworkProportion;
  console.log(
    [
      name.padEnd(20),
      `${width}x${height}`,
      `fill=${Math.round((contentH / height) * 100)}%`,
      `shoulder=${calibration.shoulderHeightM.toFixed(2)}m`,
      `artShoulder=${artworkProportion.toFixed(3)}`,
      `fullArtVsHuman=${projectedArtHeight.toFixed(3)}`,
    ].join("  "),
  );
  return { artworkProportion, projectedArtHeight };
}

const calibrations = {
  human: { shoulderY: 8, shoulderHeightM: 1.7 },
  "black-bear": { shoulderY: 12, shoulderHeightM: 0.77 },
  "grey-wolf": { shoulderY: 225, shoulderHeightM: 0.69 },
  moose: { shoulderY: 176, shoulderHeightM: 1.9 },
  "woodland-caribou": { shoulderY: 387, shoulderHeightM: 1.1 },
  "white-tailed-deer": { shoulderY: 346, shoulderHeightM: 0.9 },
  "canada-lynx": { shoulderY: 145, shoulderHeightM: 0.52 },
};

for (const [name, calibration] of Object.entries(calibrations)) {
  try {
    analyze(name, calibration);
  } catch (e) {
    console.log(name, e.message);
    process.exitCode = 1;
  }
}
