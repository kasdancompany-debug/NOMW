/**
 * Optional: stage a clean deploy folder ready to copy to USB / museum share.
 * Copies .next/standalone → deploy/dist/nomow/
 *
 * Usage (after build:production): node scripts/pack-deploy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, ".next", "standalone");
const dest = path.join(root, "deploy", "dist", "nomow");

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyRecursive(a, b);
    else fs.copyFileSync(a, b);
  }
}

if (!fs.existsSync(path.join(src, "server.js"))) {
  console.error("[pack-deploy] Missing standalone build. Run: npm run build:production");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
copyRecursive(src, dest);

const windowsSrc = path.join(root, "deploy", "windows");
const windowsDest = path.join(root, "deploy", "dist", "windows");
if (fs.existsSync(windowsSrc)) {
  fs.rmSync(windowsDest, { recursive: true, force: true });
  copyRecursive(windowsSrc, windowsDest);
}

console.log("[pack-deploy] Staged:");
console.log(" ", dest);
console.log(" ", windowsDest);
