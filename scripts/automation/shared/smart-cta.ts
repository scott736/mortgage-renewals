// ============================================
// Smart CTA - Contextual Inline Call-to-Action
// Mortgage Renewal Hub — booking URL /book-a-call/
// ============================================

export const BOOKING_URL = "/book-a-call/";

export const CTA_BUTTON = `<a href="/book-a-call/" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-zinc-600 h-10 px-8 no-underline">Book Free Strategy Call</a>`;

function getBookingUrl(_region?: string): string {
  return BOOKING_URL;
}

/**
 * Content keyword signals for topic detection.
 * Topics feed both Smart CTA templates and Service CTA hub mapping.
 */
export const CONTENT_CTA_SIGNALS: Record<string, string[]> = {
  rates: [
    "renewal rate",
    "mortgage rate",
    "best rate",
    "rate offer",
    "posted rate",
    "discounted rate",
    "prime rate",
    "bank of canada",
  ],
  switching: [
    "switch lender",
    "switching lender",
    "change lender",
    "transfer mortgage",
    "discharge fee",
    "port my mortgage",
    "leave my bank",
  ],
  checklist: [
    "renewal checklist",
    "document checklist",
    "renewal letter",
    "what to bring",
    "paperwork",
  ],
  calculator: [
    "calculator",
    "payment shock",
    "run the numbers",
    "break-even",
    "switch vs stay",
  ],
  penalty: [
    "mortgage penalty",
    "ird",
    "interest rate differential",
    "three-month interest",
    "break your mortgage",
  ],
  refinance: [
    "refinanc",
    "heloc",
    "cash-out",
    "equity takeout",
    "renewal vs refinance",
  ],
  process: [
    "renewal process",
    "how renewal works",
    "renewal timeline",
    "auto-renew",
    "renewal window",
  ],
  broker: [
    "mortgage broker",
    "brokerage",
    "compare lenders",
    "30+ lenders",
  ],
  "fixed-variable": [
    "fixed vs variable",
    "fixed rate",
    "variable rate",
    "trigger rate",
  ],
};

const SMART_CTA_TEMPLATES: Record<string, string[]> = {
  renewal: [
    "Before you sign your bank's renewal letter, it pays to compare — {link} and we'll shop 30+ lenders for your situation.",
    "Auto-renewing is convenient, but it rarely gets you the best rate — {link} for a free second opinion.",
    "Your renewal window is the easiest time to switch lenders with no stress test in most cases — {link} to see if a switch saves you money.",
    "A 0.20% rate difference on a $400K mortgage adds up fast — {link} and we'll run the real payment math.",
  ],
  rates: [
    "Posted renewal rates aren't the whole story — {link} and we'll show you the discounted rates you may actually qualify for.",
    "Rate shopping at renewal takes one call, not a week of bank visits — {link} to compare options side by side.",
  ],
  switching: [
    "Switching at renewal is often free of the stress test — {link} and we'll map the discharge, legal, and rate trade-offs.",
    "Don't assume leaving your bank means penalties — at term maturity you can usually walk — {link} to confirm for your lender.",
  ],
  checklist: [
    "Having your documents ready speeds approval when you switch — {link} and we'll tell you exactly what your file needs.",
    "A clear checklist beats scrambling in the last 30 days — {link} to get a renewal plan before the clock runs out.",
  ],
  "mortgage-financing": [
    "Before you commit to any renewal product, get a second opinion — {link} to see which options fit your financial picture.",
    "Every borrower's situation is different, and the wrong term can cost thousands — {link} to make sure you're set up properly.",
  ],
  "investing-fundamentals": [
    "Investment property renewals have different rules than your primary home — {link} before you auto-renew.",
    "Portfolio renewals need coordination across lenders and terms — {link} to build a plan that scales with you.",
  ],
};

const FUNNEL_STAGE_TEMPLATES: Record<string, string[]> = {
  awareness: [
    "If you're just starting to explore renewal options, {link} — it's free, and there's no obligation.",
    "Not sure where to start? {link} and we'll help you figure out the right first step.",
  ],
  consideration: [
    "Comparing your renewal options is smart — {link} and we'll help you see which path fits best.",
    "Before you narrow down, {link} to get a clear picture of rates and switch costs.",
  ],
  decision: [
    "You already know what you need — {link} and let's lock in your renewal strategy.",
    "Ready to move? {link} and we'll fast-track your comparison.",
  ],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function detectContentTopic(content: string): string | null {
  const contentLower = content.toLowerCase();
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
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestScore >= 3 ? bestTopic : null;
}

/**
 * Insert 1-2 Smart CTAs into article content.
 * Places them after the 2nd and optionally 4th H2 sections.
 */
export function insertSmartCTAs(
  content: string,
  category: string,
  _topicCluster?: string,
  aiGeneratedCTAs?: string[],
  region?: string,
  funnelStage?: "awareness" | "consideration" | "decision",
  locale: string = "en"
): string {
  const inlineLinkPattern = /\[.*?\]\(\/book-a-call\/?\)/;
  if (inlineLinkPattern.test(content)) {
    return content;
  }

  const lang = (locale || "en").toLowerCase();
  const isFr = lang === "fr";

  let cta1: string;
  let cta2: string | null = null;

  const bookingUrl = getBookingUrl(region);
  const linkText1 = isFr
    ? "[réservez un appel stratégique gratuit avec Mortgage Renewal Hub](" +
      bookingUrl +
      ")"
    : "[book a free strategy call with Mortgage Renewal Hub](" + bookingUrl + ")";
  const linkText2 = isFr
    ? "[réservez un appel stratégique gratuit avec nous](" + bookingUrl + ")"
    : "[schedule a free strategy session with us](" + bookingUrl + ")";

  if (aiGeneratedCTAs && aiGeneratedCTAs.length > 0) {
    cta1 = aiGeneratedCTAs[0].replace("{link}", linkText1);
    cta2 =
      aiGeneratedCTAs.length > 1
        ? aiGeneratedCTAs[1].replace("{link}", linkText2)
        : null;
  } else {
    const contentTopic = detectContentTopic(content);
    const topicTemplates = contentTopic
      ? SMART_CTA_TEMPLATES[contentTopic]
      : undefined;
    const categoryTemplates =
      SMART_CTA_TEMPLATES[category] || SMART_CTA_TEMPLATES.renewal;
    const funnelTemplates = funnelStage
      ? FUNNEL_STAGE_TEMPLATES[funnelStage] || []
      : [];
    const allTemplates = [
      ...funnelTemplates,
      ...(topicTemplates || []),
      ...categoryTemplates,
    ];

    const contentHash = hashString(content.slice(0, 2000));
    const idx1 = contentHash % allTemplates.length;
    let idx2 = (contentHash + 1) % allTemplates.length;
    if (idx2 === idx1 && allTemplates.length > 1) {
      idx2 = (idx1 + 1) % allTemplates.length;
    }
    const template1 = allTemplates[idx1];
    const template2 = allTemplates.length > 1 ? allTemplates[idx2] : null;

    cta1 = template1.replace("{link}", linkText1);
    cta2 =
      template2 && template2 !== template1
        ? template2.replace("{link}", linkText2)
        : null;
  }

  const h2Pattern = /\n(## [^\n]+)/g;
  const h2Positions: number[] = [];
  let match;
  while ((match = h2Pattern.exec(content)) !== null) {
    h2Positions.push(match.index);
  }

  if (h2Positions.length < 2) {
    if (h2Positions.length === 1) {
      const insertPos = h2Positions[0];
      return (
        content.slice(0, insertPos) + "\n\n" + cta1 + "\n" + content.slice(insertPos)
      );
    }
    return content + "\n\n" + cta1 + "\n";
  }

  const insertions: Array<{ pos: number; text: string }> = [];
  const cta1Idx = Math.min(2, h2Positions.length - 1);
  insertions.push({ pos: h2Positions[cta1Idx], text: cta1 });

  if (cta2 && h2Positions.length >= 4) {
    const cta2Idx = Math.min(4, h2Positions.length - 1);
    insertions.push({ pos: h2Positions[cta2Idx], text: cta2 });
  }

  insertions.sort((a, b) => b.pos - a.pos);

  let result = content;
  for (const { pos, text } of insertions) {
    result = result.slice(0, pos) + "\n\n" + text + "\n" + result.slice(pos);
  }

  return result;
}

export function stripSmartCTAs(content: string): string {
  const escapedUrl = BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `[^\\n]*\\[[^\\]]+\\]\\(${escapedUrl}[^)]*\\)[^\\n]*`,
    "g"
  );
  let result = content.replace(pattern, "");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

/** Glossary CTAs are not used on this site — stubs for CLI compatibility. */
export function insertGlossaryCTA(
  content: string,
  _term: string,
  _definition: string,
  _locale: string = "en"
): string {
  return content;
}

export function stripGlossaryCTAs(content: string): string {
  return stripSmartCTAs(content);
}
