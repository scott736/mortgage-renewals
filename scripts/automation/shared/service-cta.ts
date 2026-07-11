// ============================================
// Service CTA — Contextual hub link (Mortgage Renewal Hub)
// ============================================
// Inserts one editorial sentence linking to a relevant hub page.
// Complements Smart CTAs (booking) — does not replace them.

import { CONTENT_CTA_SIGNALS } from "./smart-cta";

/** Parent hubs only (high-traffic renewal pages). */
export const SERVICE_HUB_URLS = [
  "/mortgage-renewal-guide/",
  "/best-mortgage-renewal-rates/",
  "/mortgage-renewal-checklist/",
  "/switching-lenders-at-renewal/",
  "/mortgage-renewal-calculator/",
  "/switch-vs-stay-calculator/",
  "/current-mortgage-rates-canada/",
  "/mortgage-penalty-calculator/",
  "/renewal-vs-refinancing/",
  "/mortgage-broker-renewal/",
  "/fixed-vs-variable-mortgage-renewal/",
  "/ontario-mortgage-renewal/",
  "/bc-mortgage-renewal/",
  "/alberta-mortgage-renewal/",
  "/quebec-mortgage-renewal/",
] as const;

const SERVICE_HUB_SET = new Set<string>(SERVICE_HUB_URLS);

/** CONTENT_CTA_SIGNALS topics → parent hub. */
export const TOPIC_TO_SERVICE: Record<string, string> = {
  rates: "/best-mortgage-renewal-rates/",
  switching: "/switching-lenders-at-renewal/",
  checklist: "/mortgage-renewal-checklist/",
  calculator: "/mortgage-renewal-calculator/",
  penalty: "/mortgage-penalty-calculator/",
  refinance: "/renewal-vs-refinancing/",
  process: "/mortgage-renewal-guide/",
  broker: "/mortgage-broker-renewal/",
  "fixed-variable": "/fixed-vs-variable-mortgage-renewal/",
};

/**
 * Category fallbacks for posts without a strong content signal.
 * Blog posts often use tags; map common renewal tags + default category.
 */
export const CATEGORY_SERVICE_FALLBACK: Record<string, string> = {
  "mortgage-financing": "/mortgage-renewal-guide/",
  "investing-fundamentals": "/mortgage-renewal-guide/",
  renewal: "/mortgage-renewal-guide/",
  rates: "/best-mortgage-renewal-rates/",
  switching: "/switching-lenders-at-renewal/",
  checklist: "/mortgage-renewal-checklist/",
  calculators: "/mortgage-renewal-calculator/",
  "personal-finance-mindset": "/mortgage-renewal-guide/",
};

const SERVICE_CTA_MARKER = "<!-- service-cta -->";

const HUB_LINK_LABELS: Record<string, { en: string; es: string; fr: string }> = {
  "/mortgage-renewal-guide/": {
    en: "our mortgage renewal guide",
    es: "nuestra guía de renovación hipotecaria",
    fr: "notre guide de renouvellement hypothécaire",
  },
  "/best-mortgage-renewal-rates/": {
    en: "our best mortgage renewal rates page",
    es: "nuestra página de mejores tasas de renovación",
    fr: "notre page des meilleurs taux de renouvellement",
  },
  "/mortgage-renewal-checklist/": {
    en: "our mortgage renewal checklist",
    es: "nuestra lista de verificación de renovación",
    fr: "notre liste de contrôle de renouvellement",
  },
  "/switching-lenders-at-renewal/": {
    en: "our guide to switching lenders at renewal",
    es: "nuestra guía para cambiar de prestamista al renovar",
    fr: "notre guide pour changer de prêteur au renouvellement",
  },
  "/mortgage-renewal-calculator/": {
    en: "our mortgage renewal calculator",
    es: "nuestra calculadora de renovación hipotecaria",
    fr: "notre calculateur de renouvellement hypothécaire",
  },
  "/switch-vs-stay-calculator/": {
    en: "our switch vs stay calculator",
    es: "nuestra calculadora cambiar vs quedarse",
    fr: "notre calculateur changer ou rester",
  },
  "/current-mortgage-rates-canada/": {
    en: "current Canadian mortgage rates",
    es: "las tasas hipotecarias actuales en Canadá",
    fr: "les taux hypothécaires actuels au Canada",
  },
  "/mortgage-penalty-calculator/": {
    en: "our mortgage penalty calculator",
    es: "nuestra calculadora de penalidades hipotecarias",
    fr: "notre calculateur de pénalité hypothécaire",
  },
  "/renewal-vs-refinancing/": {
    en: "our renewal vs refinancing guide",
    es: "nuestra guía renovación vs refinanciación",
    fr: "notre guide renouvellement vs refinancement",
  },
  "/mortgage-broker-renewal/": {
    en: "how a mortgage broker helps at renewal",
    es: "cómo un broker ayuda en la renovación",
    fr: "comment un courtier aide au renouvellement",
  },
  "/fixed-vs-variable-mortgage-renewal/": {
    en: "our fixed vs variable renewal guide",
    es: "nuestra guía fijo vs variable al renovar",
    fr: "notre guide fixe vs variable au renouvellement",
  },
  "/ontario-mortgage-renewal/": {
    en: "our Ontario mortgage renewal guide",
    es: "nuestra guía de renovación en Ontario",
    fr: "notre guide de renouvellement en Ontario",
  },
  "/bc-mortgage-renewal/": {
    en: "our BC mortgage renewal guide",
    es: "nuestra guía de renovación en BC",
    fr: "notre guide de renouvellement en C.-B.",
  },
  "/alberta-mortgage-renewal/": {
    en: "our Alberta mortgage renewal guide",
    es: "nuestra guía de renovación en Alberta",
    fr: "notre guide de renouvellement en Alberta",
  },
  "/quebec-mortgage-renewal/": {
    en: "our Quebec mortgage renewal guide",
    es: "nuestra guía de renovación en Quebec",
    fr: "notre guide de renouvellement au Québec",
  },
};

const SERVICE_CTA_TEMPLATES: Record<"en" | "es" | "fr", string[]> = {
  en: [
    "For a deeper look at the renewal angle behind this topic, see {link}.",
    "When you're ready to compare options for your renewal, {link} covers the steps most homeowners miss.",
    "The right move at renewal can change your payment for years — explore {link} for the options that typically fit.",
    "If this decision is on your radar, {link} walks through how Mortgage Renewal Hub approaches it.",
  ],
  es: [
    "Para profundizar en el ángulo de renovación de este tema, consulta {link}.",
    "Cuando quieras comparar opciones para tu renovación, {link} cubre los pasos que la mayoría omite.",
    "La decisión correcta al renovar puede cambiar tu pago por años — explora {link}.",
    "Si esta decisión está en tu radar, {link} explica el enfoque de Mortgage Renewal Hub.",
  ],
  fr: [
    "Pour approfondir l'angle renouvellement de ce sujet, consultez {link}.",
    "Quand vous serez prêt à comparer vos options de renouvellement, {link} couvre les étapes souvent oubliées.",
    "Le bon choix au renouvellement peut changer votre paiement pour des années — explorez {link}.",
    "Si cette décision vous intéresse, {link} explique l'approche de Mortgage Renewal Hub.",
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

/** True when URL points at a parent hub (or a path under one). */
export function isServiceHubUrl(url: string): boolean {
  const normalized = normalizeHubPath(url);
  if (SERVICE_HUB_SET.has(normalized)) return true;
  for (const hub of SERVICE_HUB_URLS) {
    const h = hub.replace(/\/$/, "");
    if (normalized.startsWith(`${h}/`)) return true;
  }
  return false;
}

/** True if the article body already links to any service hub. */
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
    switching: 2,
    rates: 2,
    penalty: 2,
    calculator: 1.5,
    checklist: 1.5,
    refinance: 1.5,
    "fixed-variable": 1.5,
    broker: 1.2,
    process: 1,
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
  if (topic && TOPIC_TO_SERVICE[topic]) {
    return TOPIC_TO_SERVICE[topic];
  }
  const cat = category || "renewal";
  return CATEGORY_SERVICE_FALLBACK[cat] || "/mortgage-renewal-guide/";
}

function buildServiceLink(hubUrl: string, locale: string): string {
  const lang = (locale || "en").toLowerCase() as "en" | "es" | "fr";
  const labels = HUB_LINK_LABELS[hubUrl];
  const label =
    labels?.[lang] ||
    labels?.en ||
    (lang === "fr"
      ? "notre guide de renouvellement"
      : "our mortgage renewal guide");
  return `[${label}](${hubUrl})`;
}

/**
 * Insert one Service CTA after ~2nd H2.
 * Skips when any service hub link already exists.
 */
export function insertServiceCTA(
  content: string,
  category?: string,
  locale: string = "en"
): string {
  if (hasServiceHubLink(content)) {
    return content;
  }

  const lang = (
    ["en", "es", "fr"].includes((locale || "en").toLowerCase())
      ? (locale || "en").toLowerCase()
      : "en"
  ) as "en" | "es" | "fr";

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
    const pos = h2Positions[0];
    return content.slice(0, pos) + block + content.slice(pos);
  }
  return content.trimEnd() + block;
}

export function stripServiceCTA(content: string): string {
  if (!content.includes(SERVICE_CTA_MARKER)) {
    // Also strip unmarked hub sentences that match our templates loosely
    return content;
  }
  const lines = content.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(SERVICE_CTA_MARKER)) {
      // drop marker line and the following non-empty CTA line
      if (i + 1 < lines.length && lines[i + 1].trim() === "") {
        // keep scanning
      }
      if (i + 1 < lines.length && !lines[i + 1].includes(SERVICE_CTA_MARKER)) {
        i += 1; // skip CTA sentence
        while (i + 1 < lines.length && lines[i + 1].trim() === "") i += 1;
      }
      continue;
    }
    out.push(lines[i]);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
