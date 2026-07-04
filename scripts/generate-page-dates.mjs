// Generates src/data/page-dates.json for sitemap lastmod.
// Run automatically via npm prebuild, or manually:
//   node scripts/generate-page-dates.mjs

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(ROOT, "src", "pages");
const OUT = path.join(ROOT, "src", "data", "page-dates.json");

function shouldInclude(relPath) {
  const normalized = relPath.split(path.sep).join("/");
  if (normalized.startsWith("api/")) return false;
  if (normalized.startsWith("book/")) return false;
  return normalized.endsWith(".astro");
}

function fileToPathname(relPath) {
  const posix = relPath.split(path.sep).join("/");
  if (posix === "index.astro") return "/";
  const withoutExt = posix.replace(/\.astro$/, "");
  return `/${withoutExt}/`;
}

function extractDateModified(content) {
  const pageMetaGet = content.match(
    /export const pageMeta = getPageMeta\([\s\S]*?dateModified:\s*"([^"]+)"/,
  );
  if (pageMetaGet) return pageMetaGet[1];

  const pageMetaPlain = content.match(
    /export const pageMeta = \{[\s\S]*?dateModified:\s*"([^"]+)"/,
  );
  if (pageMetaPlain) return pageMetaPlain[1];

  const articleSchema = content.match(
    /articleSchema\(\{[\s\S]*?dateModified:\s*"([^"]+)"/,
  );
  if (articleSchema) return articleSchema[1];

  return null;
}

function gitLastModified(filePath) {
  try {
    return execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
  } catch {
    return new Date().toISOString();
  }
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

const pageDates = {};

for (const filePath of walk(PAGES_DIR)) {
  const rel = path.relative(PAGES_DIR, filePath);
  if (!shouldInclude(rel)) continue;

  const content = fs.readFileSync(filePath, "utf8");
  const pathname = fileToPathname(rel);
  const extracted = extractDateModified(content);
  pageDates[pathname] = extracted ?? gitLastModified(filePath);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(pageDates, null, 2)}\n`);
console.log(`Wrote ${Object.keys(pageDates).length} entries to ${path.relative(ROOT, OUT)}`);
