// ============================================
// Smart Linker — Purpose card overrides (renewal hubs)
// ============================================

import type { FinancingConcept } from "./concept-taxonomy";

export interface PurposeCardOverride {
  slug: string;
  linkWhen?: string[];
  doNotLinkWhen?: string[];
  topicsExcluded?: string[];
  financingConcepts?: FinancingConcept[];
  assetTypes?: string[];
  questionsAnswered?: string[];
}

export function applyPurposeCardOverride<T extends { slug: string }>(
  page: T,
  fields: PurposeCardOverride
): T & PurposeCardOverride {
  const merged = { ...page } as T & PurposeCardOverride;
  for (const key of [
    "linkWhen",
    "doNotLinkWhen",
    "topicsExcluded",
    "financingConcepts",
    "assetTypes",
    "questionsAnswered",
  ] as const) {
    const val = fields[key];
    if (val !== undefined) (merged as Record<string, unknown>)[key] = val;
  }
  return merged;
}

export const PURPOSE_CARD_OVERRIDES: PurposeCardOverride[] = [
  {
    slug: "mortgage-renewal-guide",
    financingConcepts: ["renewal-process", "renewal-timeline", "broker-help"],
    linkWhen: [
      "when the reader needs the full renewal process overview",
      "when linking from news/blog to the evergreen guide hub",
    ],
    doNotLinkWhen: [
      "when a more specific hub (rates, checklist, switching, stress test) is clearly better",
    ],
  },
  {
    slug: "switching-lenders-at-renewal",
    financingConcepts: ["switch-vs-stay", "stress-test-osfi", "discharge-fees"],
    linkWhen: [
      "when discussing switching banks or transferring at maturity",
      "when discharge fees or switch eligibility are mentioned",
    ],
    doNotLinkWhen: [
      "when the reader is only comparing fixed vs variable product choice",
    ],
  },
  {
    slug: "best-mortgage-renewal-rates",
    financingConcepts: ["rate-environment", "fixed-vs-variable"],
    linkWhen: [
      "when renewal rates or rate shopping are the topic",
      "when BoC news needs an evergreen rates destination",
    ],
  },
  {
    slug: "mortgage-renewal-checklist",
    financingConcepts: ["renewal-checklist", "renewal-timeline", "first-renewal"],
    linkWhen: [
      "when documents, prep steps, or first-renewal checklists are discussed",
    ],
  },
  {
    slug: "mortgage-renewal-payment-shock",
    financingConcepts: ["payment-shock", "rate-environment", "first-renewal"],
    linkWhen: [
      "when payment increases at renewal are the core problem",
    ],
  },
  {
    slug: "stress-test-mortgage-renewal",
    financingConcepts: ["stress-test-osfi", "switch-vs-stay"],
    linkWhen: [
      "when stress test, qualifying rate, or switch exemption is discussed",
    ],
  },
  {
    slug: "osfi-b20-stress-test-at-renewal",
    financingConcepts: ["stress-test-osfi"],
    linkWhen: ["when OSFI or B-20 is named explicitly"],
  },
  {
    slug: "mortgage-discharge-fees-canada",
    financingConcepts: ["discharge-fees", "switch-vs-stay"],
    linkWhen: [
      "when discharge, legal-paid switches, or switch cost line items appear",
    ],
  },
  {
    slug: "switch-vs-stay-calculator",
    financingConcepts: ["calculator-tools", "switch-vs-stay", "discharge-fees"],
    linkWhen: [
      "when the reader needs quantitative stay-vs-switch math",
    ],
  },
  {
    slug: "mortgage-renewal-calculator",
    financingConcepts: ["calculator-tools", "payment-shock", "rate-environment"],
    linkWhen: ["when payment scenarios at renewal should be calculated"],
  },
  {
    slug: "first-time-mortgage-renewal",
    financingConcepts: ["first-renewal", "renewal-process", "payment-shock"],
    linkWhen: [
      "when addressing first-time renewers or first maturity after a low-rate term",
    ],
  },
  {
    slug: "mortgage-broker-renewal",
    financingConcepts: ["broker-help", "switch-vs-stay", "rate-environment"],
    linkWhen: [
      "when recommending multi-lender shopping or broker help at renewal",
    ],
  },
];
