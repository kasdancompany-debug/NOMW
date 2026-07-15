/**
 * Production museum build:
 *   1. next build (standalone)
 *   2. prepare-standalone (copy public + static)
 *   3. write deploy/.release.json for floor pack identification
 *
 * Usage: node scripts/build-production.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";
const npm = isWin ? "npm.cmd" : "npm";

function run(script) {
  console.log(`[build-production] npm run ${script}`);
  const result = spawnSync(npm, ["run", script], {
    cwd: root,
    stdio: "inherit",
    shell: isWin,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("build");
run("prepare:standalone");

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const release = {
  name: pkg.name,
  version: process.env.NEXT_PUBLIC_APP_VERSION || pkg.version,
  builtAt: new Date().toISOString(),
  standalonePath: ".next/standalone",
};

const releaseDir = path.join(root, "deploy");
fs.mkdirSync(releaseDir, { recursive: true });
fs.writeFileSync(path.join(releaseDir, ".release.json"), JSON.stringify(release, null, 2));

console.log("[build-production] Done.");
console.log(`  Version: ${release.version}`);
console.log(`  Bundle:  ${path.join(root, ".next", "standalone")}`);
console.log("  Floor:   copy .next/standalone → C:\\Museum\\nomow\\ (or museum server path)");
console.log("  Health:  GET /api/health");
