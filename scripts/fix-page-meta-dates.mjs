// Fix circular pageMeta.dateModified in getPageMeta() blocks.
// Run: node scripts/fix-page-meta-dates.mjs

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(ROOT, "src", "pages");

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
    else if (entry.isFile() && entry.name.endsWith(".astro")) files.push(full);
  }
  return files;
}

const broken = /getPageMeta\(([\s\S]*?)\{\s*dateModified:\s*pageMeta\.dateModified,\s*\}\);/g;
let fixed = 0;

for (const filePath of walk(PAGES_DIR)) {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("dateModified: pageMeta.dateModified,")) continue;

  const pageMetaBlock = content.match(
    /export const pageMeta = getPageMeta\([\s\S]*?\);/,
  );
  if (!pageMetaBlock || !pageMetaBlock[0].includes("pageMeta.dateModified")) {
    continue;
  }

  const date = gitLastModified(filePath);
  const newContent = content.replace(
    /export const pageMeta = getPageMeta\(([\s\S]*?)\{\s*dateModified:\s*pageMeta\.dateModified,\s*\}\);/,
    (match, middle) =>
      `export const pageMeta = getPageMeta(${middle.trimEnd()}{\n  dateModified: "${date}",\n});`,
  );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    fixed++;
    console.log(`Fixed: ${path.relative(PAGES_DIR, filePath)} → ${date}`);
  }
}

console.log(`\nFixed ${fixed} files.`);
