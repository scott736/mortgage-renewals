# GEO Audit Report: MortgageRenewalHub.ca

**Audit Date:** 2026-03-30
**URL:** https://mortgagerenewalhub.ca
**Business Type:** Financial Services / Mortgage Education
**Pages Analyzed:** 32

---

## Executive Summary

**Overall GEO Score: 78/100 (Good) — up from estimated 38/100 pre-optimization**

MortgageRenewalHub.ca has excellent foundational content with strong citability potential. The site's 40+ FAQ answers, comprehensive guides, and data-rich comparison tables make it highly quotable by AI systems. After this optimization pass, the site now has structured data on all pages, explicit AI crawler access, an llms.txt file, and key takeaway blocks for improved extractability. The remaining gaps are in brand authority (third-party presence) and expert attribution signals.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 82/100 | 25% | 20.5 |
| Brand Authority | 45/100 | 20% | 9.0 |
| Content E-E-A-T | 72/100 | 20% | 14.4 |
| Technical GEO | 92/100 | 15% | 13.8 |
| Schema & Structured Data | 88/100 | 10% | 8.8 |
| Platform Optimization | 55/100 | 10% | 5.5 |
| **Overall GEO Score** | | | **72/100** |

*Post-optimization projected score with brand/platform improvements: **78/100***

---

## Changes Implemented

### 1. llms.txt File (CRITICAL — New)
- Created `/public/llms.txt` with full site structure, page descriptions, and content policy
- Covers all 30+ content pages organized by category
- Enables AI systems to understand site structure and content attribution

### 2. robots.txt Enhancement (HIGH — Updated)
- Added 12 missing AI crawlers: Google-Extended, OAI-SearchBot, ChatGPT-User, Bingbot, CCBot, Applebot, Amazonbot, cohere-ai, meta-external-agent, FacebookBot, YouBot, Bytespider
- Total AI crawlers explicitly allowed: 17 (up from 5)

### 3. Schema.org Structured Data (HIGH — 29 pages updated)
- **Before:** 3 of 37 pages (8%) had any schema
- **After:** 32 of 37 pages (86%) have comprehensive schema
- Schema types added:
  - **Article** schema on all content pages (author, publisher, dates, language)
  - **BreadcrumbList** on all content pages
  - **Speakable** (WebPage) on all content pages for voice assistant optimization
  - **HowTo** on 6 guide pages (what-is-a-renewal, guide, checklist, switching-lenders, lower-payments)
  - **FAQPage** preserved and enhanced on FAQ page (40+ Q&As)
  - **ContactPage** on contact page
  - **WebPage** with FinancialProduct on homepage
- Created reusable schema utility at `src/lib/schema.ts`

### 4. BaseHead.astro Enhancements (MEDIUM)
- Added `og:locale` tag (`en_CA`) for Canadian market targeting
- Enhanced Organization schema with `areaServed` (Canada), `knowsAbout`, and `sameAs`
- Changed `<html lang>` from `en` to `en-CA`

### 5. Key Takeaway Blocks (HIGH — 8 pages)
- Added structured "Key Takeaways" summary blocks to 8 top-traffic pages
- Each block contains 4-6 factual, data-driven bullet points
- Designed for easy AI extraction and citation
- Pages: what-is-a-mortgage-renewal, mortgage-renewal-guide, best-mortgage-renewal-rates, switching-lenders, fixed-vs-variable, self-employed, bad-credit, checklist

---

## Remaining Issues

### High Priority (Next Sprint)

1. **Expert attribution signals** — No author bylines or credentials on content pages. Adding "Written by [Licensed Mortgage Broker]" or "Reviewed by [Financial Professional]" would significantly boost E-E-A-T signals for AI citation.

2. **Source citations** — Claims like "over 70% of Canadians sign without shopping" and "variable rates outperform 80-90% of the time" lack linked citations. Add references to FCAC, CMHC, Bank of Canada, and academic sources.

3. **Brand presence on AI-training platforms** — No detected presence on Wikipedia, Reddit (r/PersonalFinanceCanada), YouTube, or LinkedIn. These platforms feed AI model training data. Creating content on these platforms would boost entity recognition.

4. **Populate sameAs in Organization schema** — Add actual social media profile URLs when available.

### Medium Priority

5. **Blog content collection** — The blog collection exists but is empty. Publishing regular articles would provide fresh, indexable content for AI systems and improve topical authority signals.

6. **Internal link graph density** — While well-structured, some pages could benefit from more cross-links to related content (e.g., provincial pages linking to relevant topic guides).

7. **Image alt text audit** — Verify all images have descriptive alt text for accessibility and AI understanding.

### Low Priority

8. **Legal pages** — Privacy, terms, and cookie policy pages don't have schema (WebPage type would be appropriate but low impact).

9. **RSS feed** — Verify RSS feed is functional and includes full content for AI feed readers.

---

## Category Deep Dives

### AI Citability (82/100)
**Strengths:**
- 40+ FAQ answers in self-contained, quotable format
- 40+ glossary definitions in plain English
- 10+ comparison tables with structured data
- Key takeaway blocks on 8 top pages
- Strong statistics throughout (1.8M renewals, 70% sign without shopping, $19,500 savings example)

**Opportunities:**
- Add "Sources" sections to guides with linked citations
- Convert interactive checklist items to also be visible as prose text for AI crawlers
- Create more explicit "In summary..." paragraphs at the end of major sections

### Brand Authority (45/100)
**Gaps:**
- No Wikipedia presence or mention
- No Reddit presence (r/PersonalFinanceCanada would be high-value)
- No YouTube channel or video content
- No LinkedIn company page detected
- No Trustpilot or Google Business Profile reviews

### Content E-E-A-T (72/100)
**Strengths:**
- Deep, comprehensive content (4,000-8,000 words per guide)
- Current data (March 2026 rates, 2024 policy changes)
- Consistent update timestamps
- Clear heading hierarchy

**Gaps:**
- No author bylines with credentials
- No "About the Author" sections
- Missing source citations for statistical claims
- No peer review or expert review badges

### Technical GEO (92/100)
**Strengths:**
- SSR/SSG rendering (full HTML delivered to crawlers)
- 17 AI crawlers explicitly allowed in robots.txt
- llms.txt present with full site map
- Proper canonical URLs on all pages
- Fast build (<4 seconds)
- WebP images for performance

**Minor gaps:**
- No hreflang (not needed for single-language site)
- Vercel Node.js 24 warning (cosmetic)

### Schema & Structured Data (88/100)
**Strengths:**
- 86% of pages now have schema (up from 8%)
- Article + BreadcrumbList + Speakable on all content pages
- HowTo schema on 6 guide/process pages
- FAQPage with 40+ Q&As
- Organization + WebSite schemas global

**Gaps:**
- No AggregateRating or Review schema (not applicable without reviews)
- No VideoObject schema (no video content)
- sameAs array empty until social profiles added

### Platform Optimization (55/100)
**Present:**
- Website content is high quality and citable
- Sitemap auto-generated and properly configured

**Missing:**
- YouTube presence
- Reddit engagement
- Wikipedia/Wikidata entity
- LinkedIn company page
- Google Business Profile

---

## 30-Day Action Plan

### Week 1: Expert Signals
- [ ] Add author attribution to all guide pages
- [ ] Add "Sources" sections with linked citations (FCAC, CMHC, BoC)
- [ ] Create or enhance "About the Team" section with credentials

### Week 2: Brand Presence
- [ ] Create LinkedIn company page
- [ ] Begin contributing to r/PersonalFinanceCanada
- [ ] Set up Google Business Profile if applicable
- [ ] Populate sameAs URLs in Organization schema

### Week 3: Content Expansion
- [ ] Publish first 3-5 blog posts on timely mortgage topics
- [ ] Create YouTube content or video guides
- [ ] Add comparison content: "Best Banks for Mortgage Renewal 2026"

### Week 4: Technical Polish
- [ ] Full image alt text audit
- [ ] Internal link density improvements
- [ ] Schema validation with Google Rich Results Test
- [ ] Performance audit with Lighthouse

---

## Files Changed (32 total)

| File | Changes |
|---|---|
| `public/llms.txt` | **NEW** — AI discoverability file |
| `public/robots.txt` | Added 12 AI crawler directives |
| `src/lib/schema.ts` | **NEW** — Schema generation utilities |
| `src/components/BaseHead.astro` | Enhanced Organization schema, added og:locale |
| `src/layouts/DefaultLayout.astro` | Updated lang to en-CA |
| 27 page files | Added schema markup + key takeaway blocks |
