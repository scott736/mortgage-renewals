/**
 * One-time migration: replace inline FAQ <details> blocks with FaqDetails.astro
 * for LLM-extractable data-faq-question / data-faq-answer markers.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync('find src/pages -name "*.astro"', { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => !f.includes("FaqDetails"));

const PATTERNS = [
  // Standard: f.question / f.answer (plain text)
  {
    re: /\{faqs\.map\(f => \(\s*<details class="rounded-xl border border-gray-100 bg-white p-5 group">\s*<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">\s*<span>\{f\.question\}<\/span>\s*<span class="text-secondary-100 group-open:rotate-45 transition-transform text-xl(?: leading-none)?">\+<\/span>\s*<\/summary>\s*<p class="mt-3 text-body-md text-muted-foreground">\{f\.answer\}<\/p>\s*<\/details>\s*\)\)\}/gs,
    replace: `{faqs.map(f => (\n        <FaqDetails question={f.question} answer={f.answer} />\n      ))}`,
  },
  // Indented variant (calculator pages)
  {
    re: /\{faqs\.map\(f => \(\s*<details class="rounded-xl border border-gray-100 bg-white p-5 group">\s*<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">\s*<span>\{f\.question\}<\/span>\s*<span class="text-secondary-100 group-open:rotate-45 transition-transform text-xl leading-none">\+<\/span>\s*<\/summary>\s*<p class="mt-3 text-body-md text-muted-foreground">\{f\.answer\}<\/p>\s*<\/details>\s*\)\)\}/gs,
    replace: `{faqs.map(f => (\n            <FaqDetails question={f.question} answer={f.answer} />\n          ))}`,
  },
  // Card-style (estate, mcap)
  {
    re: /\{faqs\.map\(f => \(\s*<details class="rounded-lg p-5" style="border: 1px solid var\(--border\); background: var\(--card\)">\s*<summary class="font-bold cursor-pointer" style="color: var\(--primary\)">\{f\.question\}<\/summary>\s*<p class="mt-3 text-sm leading-relaxed" style="color: var\(--muted-foreground\)">\{f\.answer\}<\/p>\s*<\/details>\s*\)\)\}/gs,
    replace: `{faqs.map(f => (\n            <FaqDetails question={f.question} answer={f.answer} />\n          ))}`,
  },
  // pricing.astro: faq.q / faq.a
  {
    re: /\{faqs\.map\(faq => \(\s*<details[^>]*>[\s\S]*?\{faq\.q\}[\s\S]*?<Fragment set:html=\{faq\.a\} \/>[\s\S]*?<\/details>\s*\)\)\}/g,
    replace: `{faqs.map(faq => (\n              <FaqDetails question={faq.q} answer={faq.a} allowHtml />\n            ))}`,
  },
];

function ensureImport(content) {
  const importLine = 'import FaqDetails from "@/components/FaqDetails.astro";';
  if (content.includes(importLine)) return content;
  const match = content.match(/^import .+ from .+;\n/m);
  if (match) {
    const idx = content.indexOf(match[0]) + match[0].length;
    return content.slice(0, idx) + importLine + "\n" + content.slice(idx);
  }
  return importLine + "\n" + content;
}

let changed = 0;
for (const file of files) {
  let content = readFileSync(file, "utf8");
  if (!content.includes("faqs.map") && !content.includes("homeFaqs.map")) continue;

  const before = content;
  for (const { re, replace } of PATTERNS) {
    content = content.replace(re, replace);
  }

  if (content !== before) {
    content = ensureImport(content);
    writeFileSync(file, content);
    changed++;
    console.log("Updated:", file);
  }
}

console.log(`Done. ${changed} files updated.`);
