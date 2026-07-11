// ============================================
// Service CTA — Mortgage Renewal Hub (fresh copy)
// ============================================
// Editorial hub links for renewers — not LendCity commercial service pages.

import { CONTENT_CTA_SIGNALS } from "./smart-cta";

/** Parent renewal hubs only. */
export const SERVICE_HUB_URLS = [
  "/mortgage-renewal-guide/",
  "/what-is-a-mortgage-renewal/",
  "/switching-lenders-at-renewal/",
  "/best-mortgage-renewal-rates/",
  "/mortgage-renewal-payment-shock/",
  "/mortgage-renewal-checklist/",
  "/stress-test-mortgage-renewal/",
  "/osfi-b20-stress-test-at-renewal/",
  "/mortgage-discharge-fees-canada/",
  "/mortgage-renewal-calculator/",
  "/switch-vs-stay-calculator/",
  "/mortgage-penalty-calculator/",
  "/first-time-mortgage-renewal/",
  "/mortgage-broker-renewal/",
  "/renewal-vs-refinancing/",
  "/fixed-vs-variable-mortgage-renewal/",
  "/current-mortgage-rates-canada/",
  "/bank-of-canada-rate-decisions/",
] as const;

const SERVICE_HUB_SET = new Set<string>(SERVICE_HUB_URLS);

/** Content-topic signals → hub. */
export const TOPIC_TO_SERVICE: Record<string, string> = {
  "switch-vs-stay": "/switching-lenders-at-renewal/",
  "payment-shock": "/mortgage-renewal-payment-shock/",
  "rates-and-news": "/best-mortgage-renewal-rates/",
  "checklist-timeline": "/mortgage-renewal-checklist/",
  "stress-test-fees": "/stress-test-mortgage-renewal/",
  calculators: "/mortgage-renewal-calculator/",
  "first-renewal": "/first-time-mortgage-renewal/",
};

/** Category fallbacks (renewal-native categories). */
export const CATEGORY_SERVICE_FALLBACK: Record<string, string> = {
  "renewal-process": "/mortgage-renewal-guide/",
  "switch-vs-stay": "/switching-lenders-at-renewal/",
  "rates-and-payments": "/best-mortgage-renewal-rates/",
  "checklist-and-docs": "/mortgage-renewal-checklist/",
  "qualification-and-rules": "/stress-test-mortgage-renewal/",
  "tools-and-calculators": "/mortgage-renewal-calculator/",
  "life-situations": "/first-time-mortgage-renewal/",
  "lenders-and-provinces": "/mortgage-broker-renewal/",
};

const SERVICE_CTA_MARKER = "<!-- service-cta -->";

const HUB_LINK_LABELS: Record<string, { en: string; fr: string }> = {
  "/mortgage-renewal-guide/": {
    en: "our complete mortgage renewal guide",
    fr: "notre guide complet de renouvellement hypothécaire",
  },
  "/what-is-a-mortgage-renewal/": {
    en: "what a mortgage renewal actually is",
    fr: "ce qu'est vraiment un renouvellement hypothécaire",
  },
  "/switching-lenders-at-renewal/": {
    en: "our guide to switching lenders at renewal",
    fr: "notre guide pour changer de prêteur au renouvellement",
  },
  "/best-mortgage-renewal-rates/": {
    en: "today's best mortgage renewal rates",
    fr: "les meilleurs taux de renouvellement du moment",
  },
  "/mortgage-renewal-payment-shock/": {
    en: "our payment-shock at renewal guide",
    fr: "notre guide sur le choc de paiement au renouvellement",
  },
  "/mortgage-renewal-checklist/": {
    en: "the mortgage renewal checklist",
    fr: "la liste de contrôle de renouvellement",
  },
  "/stress-test-mortgage-renewal/": {
    en: "how the stress test works at renewal",
    fr: "comment le test de résistance s'applique au renouvellement",
  },
  "/osfi-b20-stress-test-at-renewal/": {
    en: "OSFI B-20 rules at renewal",
    fr: "les règles OSFI B-20 au renouvellement",
  },
  "/mortgage-discharge-fees-canada/": {
    en: "Canadian mortgage discharge fees explained",
    fr: "les frais de quittance hypothécaire au Canada",
  },
  "/mortgage-renewal-calculator/": {
    en: "the mortgage renewal payment calculator",
    fr: "le calculateur de paiement au renouvellement",
  },
  "/switch-vs-stay-calculator/": {
    en: "the switch vs stay calculator",
    fr: "le calculateur changer ou rester",
  },
  "/mortgage-penalty-calculator/": {
    en: "the mortgage penalty calculator",
    fr: "le calculateur de pénalité hypothécaire",
  },
  "/first-time-mortgage-renewal/": {
    en: "our first-time renewal guide",
    fr: "notre guide pour un premier renouvellement",
  },
  "/mortgage-broker-renewal/": {
    en: "how a broker helps at renewal",
    fr: "comment un courtier aide au renouvellement",
  },
  "/renewal-vs-refinancing/": {
    en: "renewal vs refinancing compared",
    fr: "renouvellement vs refinancement",
  },
  "/fixed-vs-variable-mortgage-renewal/": {
    en: "fixed vs variable at renewal",
    fr: "fixe vs variable au renouvellement",
  },
  "/current-mortgage-rates-canada/": {
    en: "current Canadian mortgage rates",
    fr: "les taux hypothécaires actuels au Canada",
  },
  "/bank-of-canada-rate-decisions/": {
    en: "Bank of Canada rate decisions for renewers",
    fr: "les décisions de taux de la Banque du Canada",
  },
};

/** Fresh renewer-facing sentences — MortgageRenewalHub.ca voice. */
const SERVICE_CTA_TEMPLATES: Record<"en" | "fr", string[]> = {
  en: [
    "For the practical next step on this topic, see {link}.",
    "When you're ready to act on your renewal — not just read about it — {link} covers the details most bank letters skip.",
    "Bookmark {link} if you want the evergreen version of this decision without the news noise.",
    "If this is showing up on your renewal letter, {link} walks through what Mortgage Renewal Hub recommends next.",
  ],
  fr: [
    "Pour l'étape concrète suivante, consultez {link}.",
    "Quand vous serez prêt à agir — pas seulement à lire — {link} couvre ce que la plupart des lettres de banque omettent.",
    "Gardez {link} sous la main pour la version durable de cette décision, sans le bruit médiatique.",
    "Si cela apparaît sur votre lettre de renouvellement, {link} explique la suite recommandée par Mortgage Renewal Hub.",
  ],
};

function ensureTrailingSlash(url: string): string {
  const trimmed = url.trim().split(/[?#]/)[0];
  if (!trimmed.startsWith("/")) return trimmed;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function normalizeHubPath(url: string): string {
  let path = url.trim();
  const domainMatch = path.match(
    /^https?:\/\/(?:www\.)?mortgagerenewalhub\.ca(\/.*)/i
  );
  if (domainMatch) path = domainMatch[1];
  return ensureTrailingSlash(path.split(/[?#]/)[0]);
}

export function isServiceHubUrl(url: string): boolean {
  const normalized = normalizeHubPath(url);
  if (SERVICE_HUB_SET.has(normalized)) return true;
  for (const hub of SERVICE_HUB_URLS) {
    const h = hub.replace(/\/$/, "");
    if (normalized.startsWith(`${h}/`)) return true;
  }
  return false;
}

export function hasServiceHubLink(content: string): boolean {
  for (const m of content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
    if (isServiceHubUrl(m[2])) return true;
  }
  for (const m of content.matchAll(/href=["']([^"']+)["']/gi)) {
    if (isServiceHubUrl(m[1])) return true;
  }
  return false;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function detectContentTopic(content: string): string | null {
  const contentLower = content.toLowerCase();
  const TOPIC_WEIGHT: Record<string, number> = {
    "switch-vs-stay": 2,
    "payment-shock": 2,
    "stress-test-fees": 2,
    "rates-and-news": 1.8,
    "checklist-timeline": 1.5,
    calculators: 1.5,
    "first-renewal": 1.5,
  };

  let bestTopic: string | null = null;
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(CONTENT_CTA_SIGNALS)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(
        keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi"
      );
      const matches = contentLower.match(regex);
      if (matches) score += matches.length;
    }
    const weighted = score * (TOPIC_WEIGHT[topic] ?? 1);
    if (weighted > bestScore) {
      bestScore = weighted;
      bestTopic = topic;
    }
  }

  return bestScore >= 3 ? bestTopic : null;
}

export function resolveServiceHub(content: string, category?: string): string {
  const topic = detectContentTopic(content);
  if (topic && TOPIC_TO_SERVICE[topic]) return TOPIC_TO_SERVICE[topic];
  const cat = category || "renewal-process";
  return CATEGORY_SERVICE_FALLBACK[cat] || "/mortgage-renewal-guide/";
}

function buildServiceLink(hubUrl: string, locale: string): string {
  const lang = (locale || "en").toLowerCase() === "fr" ? "fr" : "en";
  const labels = HUB_LINK_LABELS[hubUrl];
  const label =
    labels?.[lang] ||
    labels?.en ||
    (lang === "fr"
      ? "notre guide de renouvellement"
      : "our mortgage renewal guide");
  return `[${label}](${hubUrl})`;
}

export function insertServiceCTA(
  content: string,
  category?: string,
  locale: string = "en"
): string {
  if (hasServiceHubLink(content)) return content;

  const lang = (locale || "en").toLowerCase() === "fr" ? "fr" : "en";
  const hubUrl = resolveServiceHub(content, category);
  const templates = SERVICE_CTA_TEMPLATES[lang];
  const idx = hashString(content.slice(0, 1500)) % templates.length;
  const sentence = templates[idx].replace(
    "{link}",
    buildServiceLink(hubUrl, lang)
  );
  const block = `\n\n${SERVICE_CTA_MARKER}\n${sentence}\n`;

  const h2Pattern = /\n(## [^\n]+)/g;
  const h2Positions: number[] = [];
  let match;
  while ((match = h2Pattern.exec(content)) !== null) {
    h2Positions.push(match.index);
  }

  if (h2Positions.length >= 2) {
    const pos = h2Positions[Math.min(2, h2Positions.length - 1)];
    return content.slice(0, pos) + block + content.slice(pos);
  }
  if (h2Positions.length === 1) {
    return content.slice(0, h2Positions[0]) + block + content.slice(h2Positions[0]);
  }
  return content.trimEnd() + block;
}

export function stripServiceCTA(content: string): string {
  if (!content.includes(SERVICE_CTA_MARKER)) return content;
  const lines = content.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(SERVICE_CTA_MARKER)) {
      if (i + 1 < lines.length && !lines[i + 1].includes(SERVICE_CTA_MARKER)) {
        i += 1;
        while (i + 1 < lines.length && lines[i + 1].trim() === "") i += 1;
      }
      continue;
    }
    out.push(lines[i]);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
