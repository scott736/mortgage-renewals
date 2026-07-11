/**
 * Content publish queue for MortgageRenewalHub.ca
 *
 * Cadence: 5 articles per calendar day (America/Toronto).
 * Status:
 *   - published → live MDX with draft:false and pubDate <= today
 *   - queued    → MDX exists (or brief ready) with draft:true until publish day
 *   - brief     → topic reserved; body not written yet
 *
 * Automation / agents: each day, publish the next 5 `queued` items whose
 * scheduledDate is today or earlier (flip draft:false, set pubDate), then
 * refill briefs so the queue always holds ≥ 10 publishing days.
 */

export type ContentQueueStatus = "published" | "queued" | "brief";

export type ContentQueueItem = {
  id: string;
  scheduledDate: string; // YYYY-MM-DD
  slot: 1 | 2 | 3 | 4 | 5;
  title: string;
  primaryKeyword: string;
  cluster: "residential" | "investment" | "commercial" | "rates" | "process";
  slug: string; // blog MDX id (filename without .mdx)
  status: ContentQueueStatus;
  notes?: string;
};

/** Target publish volume used by schedulers and status checks. */
export const ARTICLES_PER_DAY = 5;

export const CONTENT_QUEUE: ContentQueueItem[] = [
  // ——— 2026-07-11 (publish today) ———
  {
    id: "2026-07-11-1",
    scheduledDate: "2026-07-11",
    slot: 1,
    title: "Documents Required for Mortgage Renewal: Stay vs Switch",
    primaryKeyword: "documents required for mortgage renewal",
    cluster: "process",
    slug: "documents-required-mortgage-renewal-july-2026",
    status: "published",
    notes: "Targets 211 GSC impressions @ ~pos 70",
  },
  {
    id: "2026-07-11-2",
    scheduledDate: "2026-07-11",
    slot: 2,
    title: "Investment Property Mortgage Rates vs Owner-Occupied (2026)",
    primaryKeyword: "investment property mortgage rates",
    cluster: "investment",
    slug: "investment-property-mortgage-rates-july-2026",
    status: "published",
  },
  {
    id: "2026-07-11-3",
    scheduledDate: "2026-07-11",
    slot: 3,
    title: "DSCR Mortgage Canada: When Property Income Qualifies the Deal",
    primaryKeyword: "DSCR mortgage Canada",
    cluster: "investment",
    slug: "dscr-mortgage-canada-july-2026",
    status: "published",
  },
  {
    id: "2026-07-11-4",
    scheduledDate: "2026-07-11",
    slot: 4,
    title: "Commercial Mortgage Rates Canada: Why There Is No Single Number",
    primaryKeyword: "commercial mortgage rates Canada",
    cluster: "commercial",
    slug: "commercial-mortgage-rates-canada-july-2026",
    status: "published",
  },
  {
    id: "2026-07-11-5",
    scheduledDate: "2026-07-11",
    slot: 5,
    title: "Do You Need to Qualify to Renew a Mortgage in Canada?",
    primaryKeyword: "do you need to qualify for mortgage renewal",
    cluster: "residential",
    slug: "qualify-to-renew-mortgage-canada-july-2026",
    status: "published",
    notes: "Clusters ~70+ impression zero-click queries",
  },

  // ——— 2026-07-12 ———
  {
    id: "2026-07-12-1",
    scheduledDate: "2026-07-12",
    slot: 1,
    title: "Automatic Mortgage Renewal in Canada: Why You Should Override It",
    primaryKeyword: "automatic mortgage renewal",
    cluster: "residential",
    slug: "automatic-mortgage-renewal-canada",
    status: "queued",
  },
  {
    id: "2026-07-12-2",
    scheduledDate: "2026-07-12",
    slot: 2,
    title: "Can You Pay Off Your Mortgage at Renewal Without Penalty?",
    primaryKeyword: "can you pay off mortgage at renewal",
    cluster: "process",
    slug: "pay-off-mortgage-at-renewal",
    status: "queued",
  },
  {
    id: "2026-07-12-3",
    scheduledDate: "2026-07-12",
    slot: 3,
    title: "Rental Property Mortgage Canada: 1–4 Unit Renewal Checklist",
    primaryKeyword: "rental property mortgage Canada",
    cluster: "investment",
    slug: "rental-property-mortgage-canada-checklist",
    status: "queued",
  },
  {
    id: "2026-07-12-4",
    scheduledDate: "2026-07-12",
    slot: 4,
    title: "Multi-Family Mortgage Canada: When MLI Select Beats Conventional",
    primaryKeyword: "multi unit residential mortgage Canada",
    cluster: "commercial",
    slug: "multi-family-mli-select-vs-conventional",
    status: "queued",
  },
  {
    id: "2026-07-12-5",
    scheduledDate: "2026-07-12",
    slot: 5,
    title: "Cooling-Off Period Mortgage Renewal: What Actually Exists",
    primaryKeyword: "cooling off period mortgage renewal",
    cluster: "process",
    slug: "cooling-off-period-mortgage-renewal",
    status: "queued",
  },

  // ——— 2026-07-13 ———
  {
    id: "2026-07-13-1",
    scheduledDate: "2026-07-13",
    slot: 1,
    title: "Best Mortgage Renewal Rates Canada: How to Read July 2026 Quotes",
    primaryKeyword: "best mortgage renewal rates Canada",
    cluster: "rates",
    slug: "best-mortgage-renewal-rates-how-to-read",
    status: "brief",
  },
  {
    id: "2026-07-13-2",
    scheduledDate: "2026-07-13",
    slot: 2,
    title: "Mortgage Renewal vs Refinance: Document and Stress-Test Differences",
    primaryKeyword: "difference between refinancing and renewing a mortgage",
    cluster: "process",
    slug: "renewal-vs-refinance-documents-stress-test",
    status: "brief",
  },
  {
    id: "2026-07-13-3",
    scheduledDate: "2026-07-13",
    slot: 3,
    title: "Portfolio Lending for Canadian Landlords at Renewal",
    primaryKeyword: "portfolio lending Canada rental",
    cluster: "investment",
    slug: "portfolio-lending-landlords-renewal",
    status: "brief",
  },
  {
    id: "2026-07-13-4",
    scheduledDate: "2026-07-13",
    slot: 4,
    title: "Commercial Mortgage Broker vs Residential Broker",
    primaryKeyword: "commercial mortgage broker Canada",
    cluster: "commercial",
    slug: "commercial-vs-residential-mortgage-broker",
    status: "brief",
  },
  {
    id: "2026-07-13-5",
    scheduledDate: "2026-07-13",
    slot: 5,
    title: "Extend Mortgage Term at Renewal: When It Helps Cash Flow",
    primaryKeyword: "can you extend your mortgage term at renewal",
    cluster: "residential",
    slug: "extend-mortgage-term-at-renewal",
    status: "brief",
  },

  // ——— 2026-07-14 ———
  {
    id: "2026-07-14-1",
    scheduledDate: "2026-07-14",
    slot: 1,
    title: "Canadian Mortgage Renewal Calculator: What Number to Enter",
    primaryKeyword: "canadian mortgage renewal calculator",
    cluster: "rates",
    slug: "mortgage-renewal-calculator-what-to-enter",
    status: "brief",
  },
  {
    id: "2026-07-14-2",
    scheduledDate: "2026-07-14",
    slot: 2,
    title: "Down Payment for Investment Property Canada (Renewal Angle)",
    primaryKeyword: "investment property down payment Canada",
    cluster: "investment",
    slug: "investment-property-down-payment-renewal",
    status: "brief",
  },
  {
    id: "2026-07-14-3",
    scheduledDate: "2026-07-14",
    slot: 3,
    title: "Mixed-Use Commercial Mortgage Renewal Basics",
    primaryKeyword: "mixed use commercial mortgage Canada",
    cluster: "commercial",
    slug: "mixed-use-commercial-mortgage-renewal",
    status: "brief",
  },
  {
    id: "2026-07-14-4",
    scheduledDate: "2026-07-14",
    slot: 4,
    title: "Does a Mortgage Automatically Renew in Canada?",
    primaryKeyword: "does a mortgage automatically renew",
    cluster: "residential",
    slug: "does-mortgage-automatically-renew-canada",
    status: "brief",
  },
  {
    id: "2026-07-14-5",
    scheduledDate: "2026-07-14",
    slot: 5,
    title: "Job Loss and Mortgage Renewal Documents",
    primaryKeyword: "can i renew my mortgage if i lost my job",
    cluster: "process",
    slug: "job-loss-renewal-documents",
    status: "brief",
  },
];

export function getQueueForDate(date: string): ContentQueueItem[] {
  return CONTENT_QUEUE.filter((item) => item.scheduledDate === date).sort(
    (a, b) => a.slot - b.slot,
  );
}

export function getDueQueueItems(today: string): ContentQueueItem[] {
  return CONTENT_QUEUE.filter(
    (item) =>
      (item.status === "queued" || item.status === "brief") && item.scheduledDate <= today,
  ).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate) || a.slot - b.slot);
}

export function assertFivePerDay(items: ContentQueueItem[] = CONTENT_QUEUE): string[] {
  const byDate = new Map<string, number>();
  for (const item of items) {
    byDate.set(item.scheduledDate, (byDate.get(item.scheduledDate) ?? 0) + 1);
  }
  const problems: string[] = [];
  for (const [date, count] of byDate) {
    if (count !== ARTICLES_PER_DAY) {
      problems.push(`${date} has ${count} items (expected ${ARTICLES_PER_DAY})`);
    }
  }
  return problems;
}
