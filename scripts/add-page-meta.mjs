// Add `export const pageMeta = getPageMeta(...)` to .astro pages that use
// articleSchema but lack pageMeta. Run: node scripts/add-page-meta.mjs

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(ROOT, "src", "pages");

function shouldInclude(relPath) {
  const normalized = relPath.split(path.sep).join("/");
  if (normalized.startsWith("api/")) return false;
  if (normalized.startsWith("book/")) return false;
  if (normalized.startsWith("blog/")) return false;
  return normalized.endsWith(".astro");
}

function fileToSlug(relPath) {
  const posix = relPath.split(path.sep).join("/");
  if (posix === "index.astro") return "";
  return posix.replace(/\.astro$/, "");
}

function gitLastModified(filePath) {
  try {
    return execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: ROOT,
      encoding: "utf8",
    })
      .trim()
      .slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

let updated = 0;
let skipped = 0;

for (const filePath of walk(PAGES_DIR)) {
  const rel = path.relative(PAGES_DIR, filePath);
  if (!shouldInclude(rel)) continue;

  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("export const pageMeta")) {
    skipped++;
    continue;
  }
  if (!content.includes("articleSchema(")) {
    skipped++;
    continue;
  }

  const slug = fileToSlug(rel);
  const dateMatch = content.match(/dateModified:\s*"([^"]+)"/);
  const dateModified = dateMatch?.[1] ?? gitLastModified(filePath);

  if (!content.includes("getPageMeta")) {
    const schemaImport = content.match(
      /import[^\n]+from ['"]@\/lib\/schema['"];?\n/,
    );
    if (schemaImport) {
      content = content.replace(
        schemaImport[0],
        `${schemaImport[0]}import { getPageMeta } from '@/lib/page-meta';\n`,
      );
    } else {
      content = content.replace(
        "---\n",
        "---\nimport { getPageMeta } from '@/lib/page-meta';\n",
      );
    }
  }

  const slugArg = slug ? `"${slug}"` : '""';
  const pageMetaBlock = `export const pageMeta = getPageMeta(${slugArg}, {
  dateModified: "${dateModified}",
});\n\n`;

  const firstConstIdx = content.search(/\n(?:const |export const )/);
  if (firstConstIdx === -1) {
    console.warn(`Skip (no const): ${rel}`);
    skipped++;
    continue;
  }

  content =
    content.slice(0, firstConstIdx + 1) +
    pageMetaBlock +
    content.slice(firstConstIdx + 1);

  // Only replace dateModified inside articleSchema, not inside pageMeta block
  content = content.replace(
    /(export const pageMeta = getPageMeta\([\s\S]*?\}\);[\s\S]*?articleSchema\(\{[\s\S]*?)dateModified:\s*"[^"]+"/,
    "$1dateModified: pageMeta.dateModified",
  );

  fs.writeFileSync(filePath, content);
  updated++;
  console.log(`Updated: ${rel}`);
}

console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
