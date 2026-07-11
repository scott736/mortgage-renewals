// ============================================
// Mortgage Renewal Hub Automation — Configuration
// ============================================

import type { TopicCluster, Category, AutomationConfig, ShowMappingEntry } from "./types";
import configJson from "../../src/data/automation/config.json";

export const config = configJson as AutomationConfig;

export const MODELS = {
  CONTENT: "grok-4.5",
  ANALYSIS: "grok-4.5",
  UTILITY: "grok-4.5",
} as const;

/**
 * Category → spoke clusters for hub-and-spoke linking.
 * Renewers: guide hubs → blog/news → book-a-call.
 */
export const CATEGORY_TO_CLUSTERS: Record<Category, TopicCluster[]> = {
  "renewal-process": [
    "renewal-basics",
    "first-renewal",
    "subsequent-renewal",
    "renewal-timeline",
  ],
  "switch-vs-stay": [
    "switch-mechanics",
    "penalty-and-break",
    "refinance-vs-renew",
    "broker-help",
  ],
  "rates-and-payments": [
    "rate-environment",
    "payment-shock",
    "fixed-vs-variable",
  ],
  "checklist-and-docs": ["renewal-checklist", "renewal-timeline"],
  "qualification-and-rules": ["stress-test-osfi", "switch-mechanics"],
  "tools-and-calculators": ["calculator-tools", "payment-shock", "switch-mechanics"],
  "life-situations": ["situation-renewal", "first-renewal", "broker-help"],
  "lenders-and-provinces": [
    "bank-lender-renewal",
    "provincial-renewal",
    "broker-help",
  ],
};

/** Clusters that commonly bridge (adjacency for scoring). */
export const CLUSTER_ADJACENCY: Partial<Record<TopicCluster, TopicCluster[]>> = {
  "renewal-basics": [
    "first-renewal",
    "renewal-timeline",
    "renewal-checklist",
    "switch-mechanics",
  ],
  "first-renewal": ["payment-shock", "renewal-checklist", "rate-environment"],
  "subsequent-renewal": [
    "fixed-vs-variable",
    "refinance-vs-renew",
    "rate-environment",
  ],
  "switch-mechanics": [
    "stress-test-osfi",
    "penalty-and-break",
    "calculator-tools",
    "broker-help",
  ],
  "stress-test-osfi": ["switch-mechanics", "calculator-tools"],
  "rate-environment": [
    "payment-shock",
    "fixed-vs-variable",
    "calculator-tools",
  ],
  "payment-shock": [
    "first-renewal",
    "rate-environment",
    "calculator-tools",
  ],
  "fixed-vs-variable": ["rate-environment", "subsequent-renewal"],
  "renewal-checklist": ["renewal-timeline", "renewal-basics", "first-renewal"],
  "renewal-timeline": ["renewal-checklist", "renewal-basics"],
  "penalty-and-break": ["switch-mechanics", "refinance-vs-renew"],
  "refinance-vs-renew": ["switch-mechanics", "subsequent-renewal"],
  "calculator-tools": [
    "payment-shock",
    "switch-mechanics",
    "stress-test-osfi",
  ],
  "bank-lender-renewal": [
    "switch-mechanics",
    "broker-help",
    "rate-environment",
  ],
  "provincial-renewal": ["renewal-basics", "broker-help"],
  "situation-renewal": ["broker-help", "renewal-basics"],
  "broker-help": ["switch-mechanics", "rate-environment", "renewal-basics"],
};

export const APPROVED_TAGS = [
  "renewal",
  "first-renewal",
  "payment-shock",
  "rates",
  "bank-of-canada",
  "switching",
  "discharge-fees",
  "stress-test",
  "osfi",
  "checklist",
  "documents",
  "timeline",
  "fixed-rate",
  "variable-rate",
  "penalty",
  "refinance",
  "heloc",
  "calculator",
  "broker",
  "ontario",
  "bc",
  "alberta",
  "quebec",
  "td",
  "rbc",
  "scotiabank",
  "bmo",
  "cibc",
  "cmhc",
  "self-employed",
  "divorce",
  "investment-property",
];

export const WRITING_STYLE_PROMPT = `
Write for Canadian homeowners facing mortgage renewal — clear, practical, and broker-honest (MortgageRenewalHub.ca).

Voice characteristics:
- Talk TO the reader like a licensed broker who's renewed hundreds of mortgages
- Use plain Canadian mortgage language (renewal letter, switch, discharge, stress test, payment shock)
- Short, direct sentences; concrete payment and rate examples in CAD
- Be direct: "Do this. Don't auto-renew without comparing."
- Use "you" and "your" constantly

NEVER use:
- Corporate buzzwords: navigate, leverage, utilize, optimize, synergy
- Investor jargon (DSCR, BRRRR, NOI) unless the page is specifically about investment-property renewal
- Filler phrases: "It's important to note", "In today's market", "At the end of the day"
`;

const CANADIAN_CONTEXT_PROMPT = `
For Canadian renewal content:
- Reference Canadian banks, OSFI B-20, CMHC, provincial legal/notary fees
- CAD amounts; Bank of Canada overnight rate context when discussing rates
- Stress-test exemption on straight switches at maturity (when accurate)
`;

export const PATHS = {
  BLOG_CONTENT: "src/content/blog",
  BLOG_ROOT: "src/content/blog",
  QUEUE_CONTENT: "src/drafts/queue",
  BLOG_IMAGES: "src/assets/blog-images",
  AUTOMATION_DATA: "src/data/automation",
  LINKER_V4: "src/data/linker-v4",
};

/** Unused podcast mapping kept for type compatibility — defaults to renewal. */
export const SHOW_MAPPING: Record<string, ShowMappingEntry> = {
  default: {
    category: "renewal-process",
    defaultPersona: "first-time-renewer",
    defaultCluster: "renewal-basics",
    autoPublish: false,
  },
};

export const PROMPTS = {
  WRITING_STYLE: WRITING_STYLE_PROMPT,
  CANADIAN_CONTEXT: CANADIAN_CONTEXT_PROMPT,
  SEO: `Generate SEO title (50-60 chars) and meta description (150-160 chars) for Canadian mortgage renewal content. Front-load the renewal keyword; no hype.`,
  SEO_TITLE: `SEO title 50-60 chars for mortgage renewal — front-load keyword, evergreen.`,
  SEO_DESCRIPTION: `Meta description 150-160 chars — action + renewal benefit + Canada context.`,
};
