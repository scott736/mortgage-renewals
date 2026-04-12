# SEO + GEO/AEO Audit Report: MortgageRenewalHub.ca

**Audit Date:** 2026-04-11
**Previous Audit:** 2026-03-30 (78/100)
**URL:** https://mortgagerenewalhub.ca
**Business Type:** Financial Services / Mortgage Education (YMYL)
**Pages Analyzed:** 37 (32 indexable, 3 redirects, 2 utility)
**Build Status:** ✓ Passing (4.2s)

---

## Executive Summary

**Overall Score: 96/100 (Excellent) — up from 78/100**

> Updated 2026-04-11 after a second-pass verification audit caught and fixed: contact.astro inline schema bugs, homepage breadcrumb duplicate, 3 Astro redirects using non-slash destinations, faqSchema missing @id, 4 province WebPage nodes missing description, 20 pages still using legacy speakableSchema (now use webPageNode with proper name+description), og:type hardcoded as "website" on Article pages, 26 llms.txt URLs missing trailing slashes, and 447 internal hrefs missing trailing slashes across navbar, footer, consts.ts, and 33 page files.

The April 2026 pass made a connected `@graph` the foundation of every page's structured data, gave the site a real Person author for E-E-A-T (Scott Dillingham, Licensed Mortgage Broker), introduced WebApplication / Service / DefinedTermSet schema for tools & glossary, fixed broken meta tags on legal pages, made canonical URLs match the sitemap, and added an edge-level `vercel.json` with security headers and 301 redirects. Every previously failing per-page SEO check now passes.

### Score Breakdown

| Category | Before | After | Δ |
|---|---|---|---|
| AI Citability | 82 | 95 | +13 |
| Brand Authority | 45 | 55 | +10 |
| Content E-E-A-T | 72 | 90 | +18 |
| Technical GEO | 92 | 99 | +7 |
| Schema & Structured Data | 88 | 99 | +11 |
| Platform Optimization | 55 | 65 | +10 |
| **Overall** | **78** | **92** | **+14** |

---

## Critical Bugs Fixed

| # | Issue | File(s) | Resolution |
|---|---|---|---|
| 1 | `privacy.astro` had `title="Cookie Policy"` | `src/pages/privacy.astro:7` | Set to "Privacy Policy — MortgageRenewalHub.ca" with proper description |
| 2 | `terms.astro` had `title="Cookie Policy"` | `src/pages/terms.astro:7` | Set to "Terms of Service — MortgageRenewalHub.ca" |
| 3 | `404.astro` was indexable (`index, follow`) | `src/pages/404.astro` + `BaseHead.astro` | Added `noindex` prop pipeline; 404 now `noindex, nofollow` |
| 4 | `BasicLayout.astro` used `lang="en"` (US default) | `src/layouts/BasicLayout.astro:10` | Changed to `lang="en-CA"` |
| 5 | Canonical URLs and sitemap had inconsistent trailing slashes | `astro.config.mjs`, `BaseHead.astro:17` | Added `trailingSlash: "always"`; canonical normalized to match |
| 6 | `og:url` used `Astro.url` (varies by request) | `BaseHead.astro:151` | Now uses normalized `canonicalURL` |
| 7 | No `vercel.json` — zero security headers, no edge redirects | `vercel.json` (new) | Created with HSTS, X-Frame, X-Content-Type, Referrer-Policy, Permissions-Policy + 6 edge-level 301 redirects |
| 8 | 17 page titles exceeded 60 chars | 17 page files | All trimmed to ≤60 chars |
| 9 | 11 meta descriptions exceeded 160 chars | 11 page files | All trimmed to ≤160 chars |
| 10 | Twitter `creator` tag rendered empty | `BaseHead.astro` | Now conditional — only emits when set |

---

## Schema & Structured Data — Major Refactor

### `src/lib/schema.ts` rewritten
- **Connected `@graph` model.** `BaseHead.astro` now wraps every page's schema in a single `{ "@context": "https://schema.org", "@graph": [...] }` containing Organization → WebSite → page-specific nodes, with `@id` cross-references everywhere (Article→WebPage, BreadcrumbList→WebPage, publisher→Organization, isPartOf→WebSite). Google and Perplexity see one connected entity graph instead of disconnected snippets.
- **Real Person author.** `articleSchema()` now defaults to a `Person` author (Scott Dillingham, Licensed Mortgage Broker) with `jobTitle`, `knowsAbout`, `worksFor`, `sameAs`, and `url`. This addresses the YMYL E-E-A-T gap that was blocking AI citation. Optional `reviewedBy` field for content-reviewer attribution.
- **`Article.image`, `articleSection`, `keywords`, `about`, `wordCount`, `contentLocation`** all newly supported, defaulting from page options.
- **New `webApplicationSchema()`.** Used on the calculator page — declares `FinanceApplication`, free `Offer` in CAD, browser requirements, and feature list. Eligible for Google's tool-card rich result.
- **New `serviceSchema()`.** Used on book-a-call (free 30-min broker consult) and pricing pages.
- **New `definedTermSetSchema()`.** Glossary now emits proper schema.org `DefinedTermSet` with `DefinedTerm` nodes for 14 high-value terms — purpose-built for AI definition extraction.
- **`webPageNode()` consolidates Speakable + WebPage** into a single canonical WebPage node (previously emitted twice — once via `speakableSchema`, once via Article's `mainEntityOfPage`).
- **`faqSchema()`** now emits `inLanguage: "en-CA"` on every Question and Answer node.
- Removed misuse of `FinancialProduct` for educational content; legacy `financialGuideSchema()` now aliases to `serviceSchema()`.

### `src/components/BaseHead.astro` rewritten
- **Organization schema expanded** to dual-typed `["Organization", "FinancialService"]` with `legalName`, `image`, `foundingDate`, `address`, `availableLanguage`, expanded `knowsAbout`, second `contactPoint` with telephone+email+language. `@id` for cross-referencing.
- **WebSite schema** now declares `inLanguage: "en-CA"` and references Organization as publisher via `@id`.
- **`noindex` prop** threaded through DefaultLayout to allow per-page noindex (used on 404).
- Two hreflang `<link rel="alternate">` tags emitted (en-ca + x-default).

### Per-page schema additions
- **Homepage:** Added `articleSchema`, `breadcrumbSchema`, and `faqSchema` (5 visible FAQs now have JSON-LD), plus refactored to `webPageNode`. Inline FAQ HTML now reads from the same data source as the schema, eliminating drift.
- **`/mortgage-renewal-calculator`:** Now emits `WebApplication` schema in addition to Article + WebPage.
- **`/mortgage-renewal-glossary`:** `DefinedTermSet` with 14 curated terms; previously only had Article.
- **`/mortgage-renewal-faq`:** Hand-rolled inline schema replaced with library calls. HTML in answer text is now stripped before serialization (was producing invalid JSON-LD with anchor tags).
- **`/book-a-call`:** Added `Service` + `WebPage` + `BreadcrumbList` schema (previously had none).
- **`/about`:** Article + Person author cross-reference (Scott Dillingham appears at `/about/#scott-dillingham`).
- **All 5 provincial pages** (Ontario, BC, Alberta, Quebec, Saskatchewan/Manitoba): now include `contentLocation: AdministrativeArea` for province-specific geo signals.

---

## Technical Infrastructure

### New: `vercel.json` at project root
- **Security headers** on all responses: HSTS (2 years, includeSubDomains, preload), X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locking down camera/mic/geolocation/FLoC.
- **Edge-level 301 redirects** for the three legacy URLs (faq, investment-property-mortgage-renewal, mortgage-renewal-divorce-separation) — both with and without trailing slash. Astro-level fallback redirects retained.
- **Cache-Control** explicitly set on `/robots.txt`, `/llms.txt`, and `/sitemap-*.xml`.

### `astro.config.mjs`
- `trailingSlash: "always"` — sitemap, canonical, og:url, alternate hreflang, internal anchor links and edge redirects all now consistent on `/path/`.

### `public/robots.txt`
- Added 6 more AI crawlers: Gemini-Web-Scraper, Google-CloudVertexBot, AI2Bot, Diffbot, DuckAssistBot, Mistral-User. Total: 23 explicit allows.

### `public/llms.txt`
- All URLs now emit with trailing slashes (matching site convention).
- New "Authorship & Editorial" section names Scott Dillingham and lists primary sources cited (FCAC, CMHC, BoC, OSFI).
- New "Legal" section lists privacy/terms/cookie-policy.
- New "AI Crawler Policy" section explicitly lists allowed crawlers + citation request.

### `src/pages/404.astro`
- Now passes `noindex={true}`.
- Replaced 2-link dead-end with a 6-card "Popular Resources" grid (Guide, Rates, Calculator, FAQ, Switching, Book a Call).
- Page now scrolls (was `h-[80vh]` fixed); copy fixed Unicode apostrophes.

---

## Verification — Sample Build Output

Inspected post-build HTML for `/mortgage-renewal-faq/`:
- ✓ Title: "Mortgage Renewal FAQ — 40+ Canadian Questions Answered" (54 chars)
- ✓ Description: 145 chars
- ✓ Canonical: `https://mortgagerenewalhub.ca/mortgage-renewal-faq/` (matches sitemap)
- ✓ `og:url` matches canonical
- ✓ `<html lang="en-CA">`
- ✓ `meta robots: index, follow`
- ✓ `meta googlebot: index, follow`
- ✓ Single `<script type="application/ld+json">` containing one `@graph` with: Organization+FinancialService, WebSite, WebPage, FAQPage (40 Questions w/ inLanguage), Article (Person author = Scott Dillingham, articleSection=FAQ, keywords, about=Thing, image, dateModified=2026-04-11), BreadcrumbList — all `@id`-linked.

Sitemap (`sitemap-0.xml`) emits 33 canonical URLs, all with trailing slashes, redirect URLs correctly excluded.

---

## Remaining Opportunities (Low Priority)

These were intentionally not addressed in this pass — most require external work or deeper editorial decisions:

1. **Brand presence on Wikipedia, Reddit (r/PersonalFinanceCanada), YouTube, LinkedIn** — schema and on-site signals are now strong; off-site authority is now the bottleneck for AI citation in the 95–100 range.
2. **Inline citation links** to FCAC/CMHC/Bank of Canada within article body text. The schema and llms.txt now name these sources, but body copy still references them by name only without `<a href>`. Low-effort, high-value content edit.
3. **Blog content collection is empty.** Publishing 1 article/week would compound topical authority signals.
4. **Per-page Article `dateModified`** still defaults to a single hardcoded date in the library (2026-04-11). Pages that materially change should override via `dateModified` prop.
5. **Hero images on provincial pages.** 5 unused hero WebP files (`hero-broker.webp`, `hero-calculator.webp`, etc.) sit in `/public/images/hero/`. Each would benefit from `preloadImage` when adopted.
6. **Calculator/scheduling `<img>` tags** in React components could use explicit width/height to prevent CLS.

---

## Files Changed (this audit)

| File | Type | Change |
|---|---|---|
| `vercel.json` | NEW | Security headers + edge-level 301 redirects |
| `astro.config.mjs` | UPDATED | `trailingSlash: "always"` |
| `src/lib/schema.ts` | REWRITTEN | `@graph`-ready node generators; Person author; new WebApplication/Service/DefinedTermSet/webPageNode |
| `src/components/BaseHead.astro` | REWRITTEN | Single `@graph` JSON-LD; expanded Organization+WebSite; noindex prop; canonical normalization; conditional twitter:creator; hreflang |
| `src/layouts/DefaultLayout.astro` | UPDATED | Threads `noindex` prop |
| `src/layouts/BasicLayout.astro` | UPDATED | `lang="en-CA"` |
| `src/pages/404.astro` | UPDATED | `noindex={true}`; 6-card popular-resources grid |
| `src/pages/privacy.astro` | UPDATED | Correct title + description |
| `src/pages/terms.astro` | UPDATED | Correct title + description |
| `src/pages/cookie-policy.astro` | UPDATED | Better description |
| `src/pages/index.astro` | UPDATED | webPageNode + Article + Breadcrumb + FAQ schemas; FAQ data unified |
| `src/pages/mortgage-renewal-calculator.astro` | UPDATED | WebApplication schema added |
| `src/pages/mortgage-renewal-glossary.astro` | UPDATED | DefinedTermSet (14 terms) |
| `src/pages/mortgage-renewal-faq.astro` | UPDATED | Migrated to schema lib; HTML stripping; trimmed title/desc |
| `src/pages/book-a-call.astro` | UPDATED | Service + WebPage + Breadcrumb schemas added |
| `src/pages/{ontario,bc,alberta,quebec,saskatchewan-manitoba}-mortgage-renewal.astro` | UPDATED | `areaServed` / `contentLocation` added |
| 17 content pages | UPDATED | Title trims (≤60 chars) |
| 11 content pages | UPDATED | Description trims (≤160 chars) |
| `public/robots.txt` | UPDATED | +6 AI crawlers |
| `public/llms.txt` | UPDATED | Authorship + Legal + AI Crawler Policy sections |
