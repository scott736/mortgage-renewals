import rss from "@astrojs/rss";

import { SITE_METADATA } from "../consts";

const posts = [
  {
    date: new Date("2026-04-29"),
    title: "Bank of Canada Holds Rate at 2.25% — Fourth Consecutive Hold",
    excerpt:
      "The BoC held its overnight rate at 2.25% for the fourth consecutive meeting. Prime rate remains 4.45%. Next decision is June 10, 2026.",
    link: "/bank-of-canada-rate-decisions/",
  },
  {
    date: new Date("2026-05-14"),
    title: "CMHC Spring 2026: Renewal Wave Peaked — 1M Households Still Ahead",
    excerpt:
      "CMHC's Spring 2026 RMIR finds renewal volumes peaked in 2025 and are projected 13% lower in 2026 (~1M households).",
    link: "/mortgage-renewal-guide/",
  },
  {
    date: new Date("2026-03-18"),
    title: "Bank of Canada Holds Rate at 2.25% in March Decision",
    excerpt:
      "The BoC held its overnight rate at 2.25% for the third consecutive meeting. Prime rate remains at 4.45%.",
    link: "/bank-of-canada-rate-decisions/",
  },
  {
    date: new Date("2026-02-14"),
    title: "November 2024 Stress Test Change: What It Means 18 Months Later",
    excerpt:
      "OSFI's November 21, 2024 rule change eliminated the stress test for uninsured straight-switch renewals.",
    link: "/stress-test-mortgage-renewal/",
  },
  {
    date: new Date("2026-01-20"),
    title: "The December 2024 Mortgage Reforms: 30-Year Amortization Now Live",
    excerpt:
      "First-time buyers and new-build purchasers with insured mortgages can now amortize over 30 years.",
    link: "/30-year-amortization-mortgage-renewal/",
  },
  {
    date: new Date("2025-12-12"),
    title: "Trigger Rate Anxiety Fades as Prime Drops to 4.45%",
    excerpt:
      "With prime now at 4.45% — down from its 7.20% peak — the trigger-rate crisis has largely resolved.",
    link: "/trigger-rate-variable-mortgage-canada/",
  },
  {
    date: new Date("2025-11-05"),
    title: "Canadian Mortgage Charter: What Changed Between 2023 and 2026",
    excerpt:
      "Three years on from Budget 2023, we look at what the Charter delivered and what's still missing at renewal.",
    link: "/canadian-mortgage-charter/",
  },
];

export async function GET(context) {
  return rss({
    title: `${SITE_METADATA.openGraph.siteName} — Renewal News`,
    description:
      "Canadian mortgage renewal news: Bank of Canada decisions, OSFI rule changes, and market trends for 2026 renewals.",
    site: context.site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `<language>en-ca</language>`,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.excerpt,
      link: post.link,
    })),
  });
}
