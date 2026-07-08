export type CuratedNewsItem = {
  pubDate: string;
  category: string;
  title: string;
  excerpt: string;
  rssExcerpt: string;
  href: string;
  readTime?: string;
};

export const CURATED_NEWS: CuratedNewsItem[] = [
  {
    pubDate: "2026-04-29",
    category: "Bank of Canada",
    title: "Bank of Canada Holds Rate at 2.25% — Fourth Consecutive Hold",
    excerpt:
      "The BoC held its overnight rate at 2.25% for the fourth consecutive meeting, warning that decisions are clouded by uncertainty as oil-driven inflation rebounds. Prime rate remains 4.45%. Next decision is June 10, 2026.",
    rssExcerpt:
      "The BoC held its overnight rate at 2.25% for the fourth consecutive meeting. Prime rate remains 4.45%. Next decision is June 10, 2026.",
    href: "/bank-of-canada-rate-decisions/",
    readTime: "5 min read",
  },
  {
    pubDate: "2026-05-14",
    category: "Market Data",
    title: "CMHC Spring 2026: Renewal Wave Peaked — 1M Households Still Ahead",
    excerpt:
      "CMHC's Spring 2026 RMIR finds renewal volumes peaked in 2025 (~1.2M) and are projected 13% lower in 2026 (~1M households). Delinquencies ticked up to 0.24% nationally; variable-rate share hit 42% of new extensions by February 2026.",
    rssExcerpt:
      "CMHC's Spring 2026 RMIR finds renewal volumes peaked in 2025 and are projected 13% lower in 2026 (~1M households).",
    href: "/mortgage-renewal-guide/",
    readTime: "11 min read",
  },
  {
    pubDate: "2026-03-18",
    category: "Bank of Canada",
    title: "Bank of Canada Holds Rate at 2.25% in March Decision",
    excerpt:
      "The BoC held its overnight rate at 2.25% for the third consecutive meeting, citing stable inflation at 1.9% and resilient Canadian labour market data. Prime rate remains at 4.45%. Here's what the hold means for anyone renewing in 2026.",
    rssExcerpt:
      "The BoC held its overnight rate at 2.25% for the third consecutive meeting. Prime rate remains at 4.45%.",
    href: "/bank-of-canada-rate-decisions/",
    readTime: "5 min read",
  },
  {
    pubDate: "2026-02-14",
    category: "Regulation",
    title: "November 2024 Stress Test Change: What It Means 18 Months Later",
    excerpt:
      "OSFI's November 21, 2024 rule change eliminated the stress test for uninsured straight-switch renewals. 18 months in, we look at the actual switching behaviour, lender competition, and real borrower savings.",
    rssExcerpt:
      "OSFI's November 21, 2024 rule change eliminated the stress test for uninsured straight-switch renewals.",
    href: "/stress-test-mortgage-renewal/",
    readTime: "8 min read",
  },
  {
    pubDate: "2026-01-20",
    category: "Regulation",
    title: "The December 2024 Mortgage Reforms: 30-Year Amortization Now Live",
    excerpt:
      "First-time buyers and new-build purchasers with insured mortgages can now amortize over 30 years — up from 25. One year later, the program has meaningfully expanded affordability. Here's how it applies at renewal.",
    rssExcerpt:
      "First-time buyers and new-build purchasers with insured mortgages can now amortize over 30 years.",
    href: "/30-year-amortization-mortgage-renewal/",
    readTime: "6 min read",
  },
  {
    pubDate: "2025-12-12",
    category: "Variable Rates",
    title: "Trigger Rate Anxiety Fades as Prime Drops to 4.45%",
    excerpt:
      "Two years ago, variable-rate borrowers were hitting trigger rates in droves. With prime now at 4.45% — down from its 7.20% peak — the trigger-rate crisis has largely resolved. But if you had one, it's time to check whether your amortization restored to schedule.",
    rssExcerpt:
      "With prime now at 4.45% — down from its 7.20% peak — the trigger-rate crisis has largely resolved.",
    href: "/trigger-rate-variable-mortgage-canada/",
    readTime: "7 min read",
  },
  {
    pubDate: "2025-11-05",
    category: "Canadian Mortgage Charter",
    title: "Canadian Mortgage Charter: What Changed Between 2023 and 2026",
    excerpt:
      "Introduced in Budget 2023, the Canadian Mortgage Charter codified lender obligations around at-risk borrowers. Three years on, we look at what it delivered, what banks did voluntarily, and what's still missing at renewal.",
    rssExcerpt:
      "Three years on from Budget 2023, we look at what the Charter delivered and what's still missing at renewal.",
    href: "/canadian-mortgage-charter/",
    readTime: "9 min read",
  },
];
