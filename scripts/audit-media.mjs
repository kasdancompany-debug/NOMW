import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "src");
const PUBLIC_ROOT = path.join(ROOT, "public");
const STRICT = process.argv.includes("--strict");
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const sourceFiles = walk(SOURCE_ROOT).filter((file) =>
  SOURCE_EXTENSIONS.has(path.extname(file)),
);
const concreteReferences = new Map();
const placeholderReferences = new Set();

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/["'`](\/media\/[^"'`\s)}]+)["'`]/g)) {
    const reference = match[1].split("?")[0];
    if (reference.includes("${")) continue;
    if (reference.includes("...")) continue;
    if (reference.toLowerCase().includes("placeholder")) {
      placeholderReferences.add(reference);
      continue;
    }
    const files = concreteReferences.get(reference) ?? new Set();
    files.add(path.relative(ROOT, file));
    concreteReferences.set(reference, files);
  }
}

const missing = [];
for (const [reference, files] of concreteReferences) {
  const target = path.join(PUBLIC_ROOT, reference.replace(/^\//, ""));
  if (!fs.existsSync(target)) {
    missing.push({ reference, files: [...files] });
  }
}

const placeholderFiles = walk(path.join(PUBLIC_ROOT, "media"))
  .filter((file) => file.toLowerCase().includes(".placeholder."))
  .map((file) => path.relative(ROOT, file));

console.log(`Media references checked: ${concreteReferences.size}`);
console.log(`Missing concrete assets: ${missing.length}`);
for (const item of missing) {
  console.log(`  MISSING ${item.reference}`);
  for (const file of item.files) console.log(`    used by ${file}`);
}

console.log(`Placeholder references: ${placeholderReferences.size}`);
for (const reference of [...placeholderReferences].sort()) {
  console.log(`  PLACEHOLDER REF ${reference}`);
}

console.log(`Placeholder files on disk: ${placeholderFiles.length}`);
for (const file of placeholderFiles.sort()) console.log(`  PLACEHOLDER FILE ${file}`);

if (missing.length > 0 || (STRICT && (placeholderReferences.size > 0 || placeholderFiles.length > 0))) {
  process.exitCode = 1;
}
