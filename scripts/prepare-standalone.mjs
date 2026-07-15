/**
 * Copy Next.js standalone server assets into `.next/standalone`
 * so a museum PC can run `node server.js` without npm on the floor.
 *
 * Usage (after `npm run build`):
 *   node scripts/prepare-standalone.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[prepare-standalone] skip missing: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(path.join(standalone, "server.js"))) {
  console.error("[prepare-standalone] Run `npm run build` first (output: 'standalone').");
  process.exit(1);
}

copyRecursive(path.join(root, "public"), path.join(standalone, "public"));
copyRecursive(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"));

console.log("[prepare-standalone] Ready:", standalone);
console.log(
  "  Start:  cd .next/standalone && set HOSTNAME=0.0.0.0&& set PORT=3000&& node server.js",
);
