// ============================================
// Smart Linker v4 — Build Page Catalog
// ============================================
// Discovers all linkable pages from source files and builds:
// 1. Raw catalog data (deterministic, no API)
// 2. Compact catalog markdown (for use in link prompts)
// 3. An enrichment prompt for an agent to generate purpose cards
//
// After running this, ask an agent to read the enrichment prompt
// and generate the enriched page-catalog.json.

import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import type { CLIOptions } from "../types";
import type { RawPageData } from "./types";
import { loadMarkdownFiles, extractExcerpt, BLOG_DIR, QUEUE_DIR } from "./parse";
import { CATEGORY_LABELS } from "./catalog-utils";

// ----------------
// Inputs Hash (skip-when-up-to-date)
// ----------------
//
// The catalog build is expensive (reads hundreds of blog posts, rebuilds the
// link graph + semantic index + OpenAI embedding index). Three GitHub Actions
// workflows invoke it per article publish cycle (article-scheduler.yml,
// podcast-publisher.yml, smart-linker.yml). To avoid redundant OpenAI embedding
// API calls, we fingerprint the set of inputs and skip the build early when
// the stored fingerprint matches.
//
// Inputs hashed: sorted list of [slug, mtimeMs] for every file that contributes
// to the catalog — blog posts, queue drafts, glossary terms — plus the mtime
// of this source file itself (so edits to the hard-coded PILLAR_PAGES list
// invalidate the cache). Full file contents are NOT hashed (too slow).

const INPUTS_HASH_VERSION = 1;

async function collectDirEntries(
  dir: string
): Promise<Array<{ slug: string; mtimeMs: number }>> {
  const absDir = path.resolve(dir);
  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    return [];
  }
  const mdFiles = entries.filter((f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("example-"));
  const results = await Promise.all(
    mdFiles.map(async (file) => {
      const stat = await fs.stat(path.join(absDir, file));
      return { slug: file.replace(/\.mdx?$/, ""), mtimeMs: stat.mtimeMs };
    })
  );
  results.sort((a, b) => a.slug.localeCompare(b.slug));
  return results;
}

async function computeInputsHash(): Promise<string> {
  const [blog, queue, glossary] = await Promise.all([
    collectDirEntries(BLOG_DIR),
    collectDirEntries(QUEUE_DIR),
    collectDirEntries("src/content/glossary"),
  ]);

  // Fingerprint this source file too, so edits to the hard-coded page lists
  // (PILLAR_PAGES/TOOL_PAGES/OTHER_PAGES) invalidate the cache.
  let selfMtime = 0;
  try {
    const stat = await fs.stat(new URL(import.meta.url));
    selfMtime = stat.mtimeMs;
  } catch {
    // URL form may fail in some runtimes; fall back to the known relative path.
    try {
      const stat = await fs.stat(
        path.resolve("scripts/automation/linker-v4/build-catalog.ts")
      );
      selfMtime = stat.mtimeMs;
    } catch {
      // give up — hash still reflects content changes
    }
  }

  const payload = JSON.stringify({
    v: INPUTS_HASH_VERSION,
    blog,
    queue,
    glossary,
    selfMtime,
  });
  return createHash("sha256").update(payload).digest("hex");
}

async function readStoredInputsHash(
  rawCatalogPath: string
): Promise<string | null> {
  try {
    const raw = await fs.readFile(rawCatalogPath, "utf-8");
    const parsed = JSON.parse(raw) as { _inputsHash?: string };
    return parsed._inputsHash ?? null;
  } catch {
    return null;
  }
}

// ----------------
// Known Pages (hard-coded from site structure)
// ----------------

const PILLAR_PAGES: RawPageData[] = [
  {
    slug: "mortgage-renewal-guide",
    url: "/mortgage-renewal-guide/",
    title: "Mortgage Renewal Guide Canada",
    type: "pillar",
    description:
      "Complete guide to renewing your Canadian mortgage — timeline, documents, negotiation, and when to switch lenders.",
    category: "renewal-process",
    tags: ["renewal", "guide", "process"],
    region: "canada",
  },
  {
    slug: "best-mortgage-renewal-rates",
    url: "/best-mortgage-renewal-rates/",
    title: "Best Mortgage Renewal Rates Canada",
    type: "pillar",
    description:
      "Compare current mortgage renewal rates for fixed and variable terms across Canadian lenders.",
    category: "rates-and-payments",
    tags: ["rates", "renewal"],
    region: "canada",
  },
  {
    slug: "mortgage-renewal-checklist",
    url: "/mortgage-renewal-checklist/",
    title: "Mortgage Renewal Checklist",
    type: "pillar",
    description:
      "Step-by-step checklist of documents and actions before your mortgage renewal date.",
    category: "checklist-and-docs",
    tags: ["checklist", "documents"],
    region: "canada",
  },
  {
    slug: "switching-lenders-at-renewal",
    url: "/switching-lenders-at-renewal/",
    title: "Switching Lenders at Renewal",
    type: "pillar",
    description:
      "How to switch mortgage lenders at renewal in Canada — stress test rules, discharge fees, and timeline.",
    category: "switch-vs-stay",
    tags: ["switching", "transfer"],
    region: "canada",
  },
  {
    slug: "renewal-vs-refinancing",
    url: "/renewal-vs-refinancing/",
    title: "Renewal vs Refinancing",
    type: "pillar",
    description:
      "When to renew versus refinance — equity takeout, HELOC, and payment goals at term end.",
    category: "switch-vs-stay",
    tags: ["refinance", "heloc"],
    region: "canada",
  },
  {
    slug: "mortgage-broker-renewal",
    url: "/mortgage-broker-renewal/",
    title: "Mortgage Broker Renewal",
    type: "pillar",
    description:
      "How a mortgage broker helps at renewal — comparing 30+ lenders without bank shopping yourself.",
    category: "lenders-and-provinces",
    tags: ["broker", "renewal"],
    region: "canada",
  },
  {
    slug: "fixed-vs-variable-mortgage-renewal",
    url: "/fixed-vs-variable-mortgage-renewal/",
    title: "Fixed vs Variable at Renewal",
    type: "pillar",
    description:
      "Choose fixed or variable at mortgage renewal — payment stability, trigger rates, and break costs.",
    category: "rates-and-payments",
    tags: ["fixed", "variable"],
    region: "canada",
  },
  {
    slug: "ontario-mortgage-renewal",
    url: "/ontario-mortgage-renewal/",
    title: "Ontario Mortgage Renewal",
    type: "pillar",
    description: "Ontario-specific mortgage renewal tips, legal fees, and lender options.",
    category: "lenders-and-provinces",
    tags: ["ontario", "provincial"],
    region: "canada",
  },
  {
    slug: "bc-mortgage-renewal",
    url: "/bc-mortgage-renewal/",
    title: "BC Mortgage Renewal",
    type: "pillar",
    description: "British Columbia mortgage renewal guide — rates, switching, and provincial considerations.",
    category: "lenders-and-provinces",
    tags: ["bc", "provincial"],
    region: "canada",
  },
  {
    slug: "alberta-mortgage-renewal",
    url: "/alberta-mortgage-renewal/",
    title: "Alberta Mortgage Renewal",
    type: "pillar",
    description: "Alberta mortgage renewal guide for homeowners comparing rates and lenders.",
    category: "lenders-and-provinces",
    tags: ["alberta", "provincial"],
    region: "canada",
  },
  {
    slug: "quebec-mortgage-renewal",
    url: "/quebec-mortgage-renewal/",
    title: "Quebec Mortgage Renewal",
    type: "pillar",
    description: "Quebec mortgage renewal — notary fees, Desjardins, and switching rules.",
    category: "lenders-and-provinces",
    tags: ["quebec", "provincial"],
    region: "canada",
  },
  {
    slug: "what-is-a-mortgage-renewal",
    url: "/what-is-a-mortgage-renewal/",
    title: "What Is a Mortgage Renewal?",
    type: "pillar",
    description:
      "Plain-English explainer of Canadian mortgage renewals, timelines, and options at maturity.",
    category: "renewal-process",
    tags: ["renewal", "basics"],
    region: "canada",
  },
  {
    slug: "mortgage-renewal-payment-shock",
    url: "/mortgage-renewal-payment-shock/",
    title: "Payment Shock at Renewal",
    type: "pillar",
    description:
      "Why renewal payments rise and how to estimate and reduce payment shock in Canada.",
    category: "rates-and-payments",
    tags: ["payment-shock", "rates"],
    region: "canada",
  },
  {
    slug: "stress-test-mortgage-renewal",
    url: "/stress-test-mortgage-renewal/",
    title: "Stress Test at Renewal",
    type: "pillar",
    description:
      "When the mortgage stress test applies at renewal and when switches are exempt.",
    category: "qualification-and-rules",
    tags: ["stress-test", "osfi"],
    region: "canada",
  },
  {
    slug: "osfi-b20-stress-test-at-renewal",
    url: "/osfi-b20-stress-test-at-renewal/",
    title: "OSFI B-20 Stress Test at Renewal",
    type: "pillar",
    description:
      "OSFI B-20 qualifying rules and how they shape renewal switches.",
    category: "qualification-and-rules",
    tags: ["osfi", "stress-test"],
    region: "canada",
  },
  {
    slug: "mortgage-discharge-fees-canada",
    url: "/mortgage-discharge-fees-canada/",
    title: "Mortgage Discharge Fees Canada",
    type: "pillar",
    description:
      "Discharge fees and switch costs when leaving your lender at renewal.",
    category: "switch-vs-stay",
    tags: ["discharge-fees", "switching"],
    region: "canada",
  },
  {
    slug: "first-time-mortgage-renewal",
    url: "/first-time-mortgage-renewal/",
    title: "First-Time Mortgage Renewal",
    type: "pillar",
    description:
      "What to expect at your first mortgage renewal — timeline, payment shock, and comparison checklist.",
    category: "life-situations",
    tags: ["first-renewal"],
    region: "canada",
  },
  {
    slug: "canadian-lender-cheat-sheet",
    url: "/canadian-lender-cheat-sheet/",
    title: "Canadian Lender Cheat Sheet",
    type: "pillar",
    description:
      "Compare Canadian lender types and renewal behaviors before you shop or switch.",
    category: "lenders-and-provinces",
    tags: ["lenders", "broker"],
    region: "canada",
  },

];

const TOOL_PAGES: RawPageData[] = [
  {
    slug: "mortgage-renewal-calculator",
    url: "/mortgage-renewal-calculator/",
    title: "Mortgage Renewal Calculator",
    type: "page",
    description: "Estimate your new renewal payment at different rates and terms.",
    category: "tools-and-calculators",
    tags: ["calculator", "payment"],
    region: "canada",
  },
  {
    slug: "switch-vs-stay-calculator",
    url: "/switch-vs-stay-calculator/",
    title: "Switch vs Stay Calculator",
    type: "page",
    description: "Compare staying with your bank versus switching lenders at renewal.",
    category: "tools-and-calculators",
    tags: ["calculator", "switching"],
    region: "canada",
  },
  {
    slug: "mortgage-penalty-calculator",
    url: "/mortgage-penalty-calculator/",
    title: "Mortgage Penalty Calculator",
    type: "page",
    description: "Estimate IRD or three-month interest penalties if you break your mortgage early.",
    category: "tools-and-calculators",
    tags: ["calculator", "penalty"],
    region: "canada",
  },
  {
    slug: "break-even-switch-calculator",
    url: "/break-even-switch-calculator/",
    title: "Break-Even Switch Calculator",
    type: "page",
    description: "Find how long a rate savings needs to cover switch costs at renewal.",
    category: "tools-and-calculators",
    tags: ["calculator", "switching"],
    region: "canada",
  },
  {
    slug: "mortgage-stress-test-calculator",
    url: "/mortgage-stress-test-calculator/",
    title: "Mortgage Stress Test Calculator",
    type: "page",
    description: "Check OSFI B-20 stress test qualification for switches that require it.",
    category: "tools-and-calculators",
    tags: ["calculator", "stress-test"],
    region: "canada",
  },
  {
    slug: "rate-comparison-calculator",
    url: "/rate-comparison-calculator/",
    title: "Rate Comparison Calculator",
    type: "page",
    description: "Compare two mortgage rate offers side by side for your renewal.",
    category: "tools-and-calculators",
    tags: ["calculator", "rates"],
    region: "canada",
  },
  {
    slug: "current-mortgage-rates-canada",
    url: "/current-mortgage-rates-canada/",
    title: "Current Mortgage Rates Canada",
    type: "page",
    description: "Current Canadian mortgage rates for renewals and purchases.",
    category: "rates-and-payments",
    tags: ["rates"],
    region: "canada",
  },
  {
    slug: "bank-of-canada-rate-decisions",
    url: "/bank-of-canada-rate-decisions/",
    title: "Bank of Canada Rate Decisions",
    type: "page",
    description: "BoC policy rate decisions and what they mean for mortgage renewals.",
    category: "rates-and-payments",
    tags: ["rates", "boc"],
    region: "canada",
  },
];

const OTHER_PAGES: RawPageData[] = [
  {
    slug: "mortgage-renewal-faq",
    url: "/mortgage-renewal-faq/",
    title: "Mortgage Renewal FAQ",
    type: "page",
    description: "Frequently asked questions about Canadian mortgage renewals.",
    category: "renewal-process",
    tags: ["faq"],
    region: "canada",
  },
  {
    slug: "mortgage-renewal-glossary",
    url: "/mortgage-renewal-glossary/",
    title: "Mortgage Renewal Glossary",
    type: "page",
    description: "Definitions of common mortgage renewal terms for Canadian homeowners.",
    category: "renewal-process",
    tags: ["glossary"],
    region: "canada",
  },
  {
    slug: "about",
    url: "/about/",
    title: "About Mortgage Renewal Hub",
    type: "page",
    description: "About MortgageRenewalHub.ca — Canadian mortgage renewal education from licensed brokers.",
    category: "renewal-process",
    tags: ["about"],
    region: "canada",
  },
  {
    slug: "book-a-call",
    url: "/book-a-call/",
    title: "Book a Call",
    type: "page",
    description: "Book a free mortgage renewal strategy call with a licensed Canadian broker.",
    category: "renewal-process",
    tags: ["booking"],
    region: "canada",
  },
  {
    slug: "td-mortgage-renewal",
    url: "/td-mortgage-renewal/",
    title: "TD Mortgage Renewal",
    type: "page",
    description: "TD Bank mortgage renewal options — compare before you auto-renew.",
    category: "lenders-and-provinces",
    tags: ["td", "lender"],
    region: "canada",
  },
  {
    slug: "rbc-mortgage-renewal",
    url: "/rbc-mortgage-renewal/",
    title: "RBC Mortgage Renewal",
    type: "page",
    description: "RBC mortgage renewal guide — rates, process, and switching alternatives.",
    category: "lenders-and-provinces",
    tags: ["rbc", "lender"],
    region: "canada",
  },
  {
    slug: "scotiabank-mortgage-renewal",
    url: "/scotiabank-mortgage-renewal/",
    title: "Scotiabank Mortgage Renewal",
    type: "page",
    description: "Scotiabank mortgage renewal — compare offers and switch options.",
    category: "lenders-and-provinces",
    tags: ["scotiabank", "lender"],
    region: "canada",
  },
];

// ----------------
// Glossary Discovery
// ----------------

async function discoverGlossaryTerms(): Promise<RawPageData[]> {
  const glossaryDir = path.resolve("src/content/glossary");

  let entries: string[];
  try {
    entries = await fs.readdir(glossaryDir);
  } catch {
    return [];
  }

  const mdFiles = entries.filter((f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("example-"));
  const pages: RawPageData[] = [];

  for (const file of mdFiles) {
    const filePath = path.join(glossaryDir, file);
    const raw = await fs.readFile(filePath, "utf-8");
    let data: Record<string, unknown>;
    try {
      ({ data } = await import("gray-matter").then((m) => m.default(raw)));
    } catch {
      console.warn(`⚠ Skipping glossary/${file}: YAML parse error`);
      continue;
    }
    const slug = file.replace(/\.mdx?$/, "");

    // Glossary files use "term" and "definition" instead of "title" and "description"
    const title = String(data.term || data.title || slug);
    const description = String(data.definition || data.description || "");

    if (!title) continue;

    pages.push({
      slug: `glossary/${slug}`,
      url: `/glossary/${slug}/`,
      title,
      type: "page" as const,
      description,
      category: "renewal-process",
      tags: (data.tags as string[]) || [],
      region: "both",
      isTooltipOnly: true,
    });
  }

  return pages;
}

// ----------------
// Blog & Queue Discovery
// ----------------

function articleToRawPage(
  article: Awaited<ReturnType<typeof loadMarkdownFiles>>[0],
  type: "post" | "queue"
): RawPageData {
  const fm = article.frontmatter;
  return {
    slug: article.slug,
    url: `/blog/${article.slug}/`,
    title: String(fm.title || article.slug),
    type,
    description: String(fm.description || ""),
    category: String(fm.category || "renewal-process"),
    tags: (fm.tags as string[]) || [],
    region: String(fm.region || "canada"),
    excerpt: extractExcerpt(article.body, 2),
  };
}

// ----------------
// Main Function
// ----------------

export async function buildCatalog(options: CLIOptions): Promise<void> {
  console.log("Building page catalog from source files...\n");

  // Step 0: Fingerprint inputs — skip early if unchanged (unless --force).
  // This is the fast-path for the three workflows that all build the catalog
  // on every publish cycle; only the first call in a given commit does work.
  const dataDir = path.resolve("src/data/linker-v4");
  const rawCatalogPath = path.join(dataDir, "raw-catalog.json");
  const inputsHash = await computeInputsHash();

  if (!options.force) {
    const stored = await readStoredInputsHash(rawCatalogPath);
    if (stored && stored === inputsHash) {
      console.log(
        `Catalog up-to-date (inputs hash ${inputsHash.slice(0, 12)}) — skipping build.`
      );
      console.log(`  Use --force to rebuild anyway.`);
      return;
    }
    if (stored) {
      console.log(
        `Inputs changed (old: ${stored.slice(0, 12)} → new: ${inputsHash.slice(0, 12)}) — rebuilding.`
      );
    }
  } else {
    console.log(`--force: rebuilding catalog regardless of inputs hash.`);
  }

  // Step 1: Collect all pages
  const blogPosts = await loadMarkdownFiles(BLOG_DIR);
  const queueArticles = await loadMarkdownFiles(QUEUE_DIR);
  const glossaryTerms = await discoverGlossaryTerms();

  console.log(`  Blog posts: ${blogPosts.length}`);
  console.log(`  Queue articles: ${queueArticles.length}`);
  console.log(`  Glossary terms: ${glossaryTerms.length}`);
  console.log(`  Pillar/service pages: ${PILLAR_PAGES.length}`);
  console.log(`  Tool pages: ${TOOL_PAGES.length}`);
  console.log(`  Other pages: ${OTHER_PAGES.length}`);

  // Convert to raw page data
  const allPages: RawPageData[] = [
    ...PILLAR_PAGES,
    ...TOOL_PAGES,
    ...OTHER_PAGES,
    ...glossaryTerms,
    ...blogPosts.map((p) => articleToRawPage(p, "post")),
    ...queueArticles.map((p) => articleToRawPage(p, "queue")),
  ];

  const totalPages = allPages.length;
  console.log(`\n  Total linkable pages: ${totalPages}`);

  // Step 2: Write raw catalog data (tagged with inputs hash so subsequent
  // runs in the same commit can short-circuit the build).
  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(
    rawCatalogPath,
    JSON.stringify(
      {
        _inputsHash: inputsHash,
        generatedAt: new Date().toISOString(),
        totalPages,
        pages: allPages,
      },
      null,
      2
    )
  );
  console.log(`\n  Raw catalog: ${rawCatalogPath}`);

  // Step 2b: Enrich catalog with pillar intent + blog frontmatter heuristics
  const { enrichPageCatalog } = await import("./enrich-catalog");
  await enrichPageCatalog();

  // Step 3: Build compact catalogs (for use in link prompts)
  // Full catalog (includes queue) — used for reference only
  const compactCatalogFull = buildCompactCatalog(allPages);
  const compactFullPath = path.join(dataDir, "compact-catalog-full.md");
  await fs.writeFile(compactFullPath, compactCatalogFull);
  console.log(`  Full compact catalog: ${compactFullPath}`);

  // Published-only catalog — used in link prompts (smaller, no queue articles)
  const publishedPages = allPages.filter((p) => p.type !== "queue");
  const compactCatalog = buildCompactCatalog(publishedPages);
  const compactPath = path.join(dataDir, "compact-catalog.md");
  await fs.writeFile(compactPath, compactCatalog);
  console.log(`  Link prompt catalog: ${compactPath} (${publishedPages.length} pages — no queue)`);

  // Step 4: Write the enrichment prompt for an agent
  const promptDir = path.join(dataDir, "prompts");
  await fs.mkdir(promptDir, { recursive: true });
  const promptPath = path.join(promptDir, "catalog-build-prompt.md");
  const enrichmentPrompt = buildEnrichmentPrompt(allPages);
  await fs.writeFile(promptPath, enrichmentPrompt);
  console.log(`  Enrichment prompt: ${promptPath}`);

  console.log(`\nCatalog build complete.`);
  console.log(`  Enriched catalog: ${path.join(dataDir, "page-catalog.json")}`);

  // Auto-build link graph
  console.log("\nBuilding link graph...");
  const { buildLinkGraph } = await import("./link-graph");
  await buildLinkGraph();

  // Auto-build semantic index
  console.log("\nBuilding semantic index...");
  const { buildSemanticIndex } = await import("./semantic-filter");
  await buildSemanticIndex();

  // Auto-build embedding index (GitHub Actions / explicit API only)
  if (!options.noApi && process.env.OPENAI_API_KEY) {
    console.log("\nBuilding embedding index...");
    const { buildEmbeddingIndex } = await import("./embeddings");
    await buildEmbeddingIndex();
  } else {
    console.log("\n  Skipping embedding index (local/no-api — TF-IDF retrieval only)");
  }
}

// ----------------
// Compact Catalog Builder
// ----------------

function buildCompactCatalog(pages: RawPageData[]): string {
  const lines: string[] = [];
  lines.push("# Mortgage Renewal Hub Site — All Linkable Pages");
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push(`# Total: ${pages.length} pages\n`);

  // Group pages by type
  const pillarPages = pages.filter(
    (p) =>
      p.type === "pillar" ||
      (p.type === "page" && !p.slug.startsWith("glossary/"))
  );
  const blogPages = pages.filter((p) => p.type === "post");
  const queuePages = pages.filter((p) => p.type === "queue");
  const glossaryPages = pages.filter(
    (p) => p.type === "page" && p.slug.startsWith("glossary/")
  );

  // Service & Financing Pages
  lines.push("## Service & Financing Pages");
  for (const p of pillarPages) {
    lines.push(`- ${p.title} (${p.url}) — ${p.description}${p.tags?.length ? ` [${p.tags.join(", ")}]` : ""}`);
  }

  // Blog posts grouped by category
  const blogByCategory = groupByCategory(blogPages);
  for (const [category, catPages] of Object.entries(blogByCategory)) {
    const label = CATEGORY_LABELS[category] || category;
    lines.push(`\n## ${label} Articles`);
    for (const p of catPages) {
      lines.push(`- ${p.title} (${p.url}) — ${p.description}${p.tags?.length ? ` [${p.tags.join(", ")}]` : ""}`);
    }
  }

  // Queue articles grouped by category
  if (queuePages.length > 0) {
    const queueByCategory = groupByCategory(queuePages);
    for (const [category, catPages] of Object.entries(queueByCategory)) {
      const label = CATEGORY_LABELS[category] || category;
      lines.push(`\n## Upcoming: ${label}`);
      for (const p of catPages) {
        lines.push(`- ${p.title} (${p.url}) — ${p.description}${p.tags?.length ? ` [${p.tags.join(", ")}]` : ""}`);
      }
    }
  }

  // Glossary terms
  if (glossaryPages.length > 0) {
    lines.push(`\n## Glossary Terms`);
    for (const p of glossaryPages) {
      lines.push(`- ${p.title} (${p.url}) — ${p.description}${p.tags?.length ? ` [${p.tags.join(", ")}]` : ""}`);
    }
  }

  return lines.join("\n");
}

function groupByCategory(
  pages: RawPageData[]
): Record<string, RawPageData[]> {
  const groups: Record<string, RawPageData[]> = {};
  for (const page of pages) {
    const cat = page.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(page);
  }
  return groups;
}

// ----------------
// Enrichment Prompt Builder
// ----------------

function buildEnrichmentPrompt(pages: RawPageData[]): string {
  // Only pillar and tool pages need enrichment
  const pagesNeedingEnrichment = pages.filter(
    (p) =>
      p.type === "pillar" ||
      (p.type === "page" && !p.slug.startsWith("glossary/"))
  );

  const lines: string[] = [];
  lines.push("# Page Catalog Enrichment Task\n");
  lines.push(
    "You are helping build a page catalog for an internal linking system."
  );
  lines.push(
    "For each page below, generate a **purpose card** that describes what the page delivers to readers.\n"
  );
  lines.push("## Output Format\n");
  lines.push(
    "Return a JSON array of objects with this structure for each page:"
  );
  lines.push("```json");
  lines.push(`{
  "slug": "the-page-slug",
  "readerPromise": "One sentence: what the reader gets by visiting this page",
  "topicsCovered": ["topic1", "topic2", "topic3"],
  "questionsAnswered": ["What is X?", "How do I Y?"],
  "linkWhen": ["when the article discusses X", "when the reader needs help with Y"],
  "doNotLinkWhen": ["when the article only mentions X in passing", "when the context is about Z not Y"]
}`);
  lines.push("```\n");
  lines.push("## Guidelines\n");
  lines.push(
    "- **readerPromise**: Be specific about what the READER gets, not what the PAGE contains."
  );
  lines.push(
    "  Example: 'Learn how DSCR loans let you qualify for US rentals using property income instead of personal income'"
  );
  lines.push("- **topicsCovered**: 5-8 specific topics covered in depth");
  lines.push(
    "- **questionsAnswered**: 3-5 real questions a reader can get answered"
  );
  lines.push(
    "- **linkWhen**: 3-5 contexts in a blog post where linking helps the reader"
  );
  lines.push(
    "- **doNotLinkWhen**: 2-4 contexts where linking would mislead the reader"
  );
  lines.push(
    "  Example: linking to DSCR page when the article is about Canadian conventional mortgages"
  );
  lines.push("\n## Pages to Enrich\n");

  for (const page of pagesNeedingEnrichment) {
    lines.push(`### ${page.title}`);
    lines.push(`- **URL**: ${page.url}`);
    lines.push(`- **Type**: ${page.type}`);
    lines.push(`- **Description**: ${page.description}`);
    lines.push(`- **Region**: ${page.region}`);
    lines.push(`- **Tags**: ${page.tags.join(", ") || "none"}`);
    lines.push("");
  }

  return lines.join("\n");
}
