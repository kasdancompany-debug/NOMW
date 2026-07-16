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

function analyze(name) {
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
  // Shoulder band: mid-front torso columns (quadrupeds face right)
  const cx0 = minX + Math.floor((maxX - minX) * 0.28);
  const cx1 = minX + Math.floor((maxX - minX) * 0.52);
  let withersY = maxY;
  for (let x = cx0; x <= cx1; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (pixels[(y * width + x) * 4 + 3] > 20) {
        withersY = Math.min(withersY, y);
        break;
      }
    }
  }
  const groundToWithers = maxY - withersY + 1;
  const bpFull = groundToWithers / height;
  const bpContent = groundToWithers / contentH;
  console.log(
    [
      name.padEnd(20),
      `${width}x${height}`,
      `fill=${Math.round((contentH / height) * 100)}%`,
      `padT=${Math.round((minY / height) * 100)}%`,
      `padB=${Math.round(((height - 1 - maxY) / height) * 100)}%`,
      `bpFull=${bpFull.toFixed(2)}`,
      `bpContent=${bpContent.toFixed(2)}`,
    ].join("  "),
  );
  return { bpFull, bpContent };
}

const names = [
  "human",
  "black-bear",
  "grey-wolf",
  "moose",
  "woodland-caribou",
  "white-tailed-deer",
  "canada-lynx",
];
for (const n of names) {
  try {
    analyze(n);
  } catch (e) {
    console.log(n, e.message);
  }
}
