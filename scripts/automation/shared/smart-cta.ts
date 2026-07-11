// ============================================
// Smart CTA — Mortgage Renewal Hub (fresh copy)
// ============================================
// Renewer-focused inline CTAs. Booking URL: /book-a-call/
// Do NOT reuse LendCity investor templates.

export const BOOKING_URL = "/book-a-call/";

export const CTA_BUTTON = `<a href="/book-a-call/" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-zinc-600 h-10 px-8 no-underline">Book Free Renewal Call</a>`;

/**
 * Keyword signals → renewal topics (also feed service-cta hub mapping).
 */
export const CONTENT_CTA_SIGNALS: Record<string, string[]> = {
  "switch-vs-stay": [
    "switch lender",
    "switching lender",
    "change lender",
    "transfer mortgage",
    "stay with your bank",
    "leave my bank",
    "discharge fee",
  ],
  "payment-shock": [
    "payment shock",
    "payment increase",
    "payment jump",
    "higher payment",
    "renewal payment",
  ],
  "rates-and-news": [
    "renewal rate",
    "best rate",
    "bank of canada",
    "overnight rate",
    "posted rate",
    "rate forecast",
  ],
  "checklist-timeline": [
    "renewal checklist",
    "document checklist",
    "renewal letter",
    "120 days",
    "60 days",
    "renewal window",
    "renewal reminder",
  ],
  "stress-test-fees": [
    "stress test",
    "osfi",
    "b-20",
    "qualifying rate",
    "discharge",
    "legal fee",
    "ird",
    "mortgage penalty",
  ],
  "calculators": [
    "calculator",
    "break-even",
    "switch vs stay",
    "run the numbers",
  ],
  "first-renewal": [
    "first renewal",
    "first-time renewal",
    "never renewed",
    "first mortgage renewal",
  ],
};

/**
 * Category / topic template banks — MortgageRenewalHub.ca voice only.
 * Each template uses {link} for the booking markdown link.
 */
const SMART_CTA_TEMPLATES: Record<string, string[]> = {
  "renewal-process": [
    "Don't sign your bank's renewal letter on autopilot — {link} and we'll compare real offers from 30+ lenders for your maturity date.",
    "Your renewal window is the easiest time to lock a better rate without the usual red tape — {link} for a free 15-minute plan.",
    "A small rate gap on a $400K balance compounds for years — {link} before you auto-renew.",
  ],
  "switch-vs-stay": [
    "Stay vs switch isn't a guess — {link} and we'll net out discharge fees against the rate savings.",
    "Most straight switches at maturity skip the stress test — {link} to see if leaving your bank is the cheaper move.",
    "If your bank won't match a broker rate, switching is often cleaner than you think — {link} and we'll map the timeline.",
  ],
  "rates-and-payments": [
    "Posted renewal rates aren't what sharp borrowers pay — {link} and we'll show discounted options that fit your file.",
    "BoC headlines matter less than the offer on your letter — {link} to pressure-test your renewal rate.",
  ],
  "payment-shock": [
    "Facing a payment jump? {link} and we'll model term, amortization, and switch scenarios before you panic-sign.",
    "Payment shock is fixable with the right structure — {link} for a free renewal strategy call.",
  ],
  "checklist-and-docs": [
    "Documents ready? Next step is comparing offers — {link} while your 120-day window is still open.",
    "A checklist without a rate plan still leaves money on the table — {link} once your paperwork is lined up.",
  ],
  "qualification-and-rules": [
    "Stress-test rules decide whether a switch is easy or hard — {link} and we'll confirm what applies to your file.",
    "OSFI quirks shouldn't trap you with a weak bank offer — {link} for a clear yes/no on switching.",
  ],
  "tools-and-calculators": [
    "Numbers looked good in the calculator? {link} and we'll turn the scenario into actual lender quotes.",
    "Tools show the math — a broker finds the rate — {link} when you're ready to act on the result.",
  ],
  "life-situations": [
    "Special situations need a custom renewal plan, not a generic bank letter — {link} with a licensed broker.",
    "Divorce, self-employed income, or a rental property changes the playbook — {link} before you renew.",
  ],
  "lenders-and-provinces": [
    "Your bank's renewal desk only shops one shelf — {link} and we'll compare across the market.",
    "Provincial fees and lender habits differ — {link} so your switch plan matches where you live.",
  ],
  // Topic-key fallbacks (from CONTENT_CTA_SIGNALS)
  "switch-vs-stay-topic": [
    "Thinking about leaving your lender? {link} and we'll price the switch end-to-end.",
  ],
  "rates-and-news": [
    "Rate news is noisy — your renewal letter is the signal — {link} to get a second opinion on the offer.",
  ],
  "checklist-timeline": [
    "Still inside your renewal window? {link} before the 30-day scramble starts.",
  ],
  "stress-test-fees": [
    "Discharge fees and stress-test rules can flip the stay-vs-switch math — {link} before you decide.",
  ],
  calculators: [
    "Got a calculator result you trust? {link} and we'll match it to live lender pricing.",
  ],
  "first-renewal": [
    "First renewal is when most Canadians overpay by auto-signing — {link} and do it once the right way.",
  ],
};

const FUNNEL_STAGE_TEMPLATES: Record<string, string[]> = {
  awareness: [
    "New to renewals? {link} — free, no obligation, and we'll explain your options in plain English.",
    "Not sure where to start? {link} and we'll map your next 120 days.",
  ],
  consideration: [
    "Comparing offers? {link} and we'll help you read the fine print before you commit.",
    "Two quotes aren't enough — {link} to see what 30+ lenders would actually price.",
  ],
  decision: [
    "Ready to lock something in? {link} and we'll move on your maturity timeline.",
    "Don't let the bank's deadline box you in — {link} this week.",
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

const TOPIC_TO_TEMPLATE_KEY: Record<string, string> = {
  "switch-vs-stay": "switch-vs-stay",
  "payment-shock": "payment-shock",
  "rates-and-news": "rates-and-news",
  "checklist-timeline": "checklist-timeline",
  "stress-test-fees": "stress-test-fees",
  calculators: "calculators",
  "first-renewal": "first-renewal",
};

/**
 * Insert 1–2 Smart CTAs after early H2 sections.
 */
export function insertSmartCTAs(
  content: string,
  category: string,
  _topicCluster?: string,
  aiGeneratedCTAs?: string[],
  _region?: string,
  funnelStage?: "awareness" | "consideration" | "decision",
  locale: string = "en"
): string {
  const inlineLinkPattern = /\[.*?\]\(\/book-a-call\/?\)/;
  if (inlineLinkPattern.test(content)) {
    return content;
  }

  const isFr = (locale || "en").toLowerCase() === "fr";
  const bookingUrl = BOOKING_URL;
  const linkText1 = isFr
    ? "[réservez un appel gratuit de renouvellement avec Mortgage Renewal Hub](" +
      bookingUrl +
      ")"
    : "[book a free renewal strategy call with Mortgage Renewal Hub](" +
      bookingUrl +
      ")";
  const linkText2 = isFr
    ? "[réservez un appel gratuit avec nous](" + bookingUrl + ")"
    : "[book a free renewal call with us](" + bookingUrl + ")";

  let cta1: string;
  let cta2: string | null = null;

  if (aiGeneratedCTAs && aiGeneratedCTAs.length > 0) {
    cta1 = aiGeneratedCTAs[0].replace("{link}", linkText1);
    cta2 =
      aiGeneratedCTAs.length > 1
        ? aiGeneratedCTAs[1].replace("{link}", linkText2)
        : null;
  } else {
    const contentTopic = detectContentTopic(content);
    const topicKey = contentTopic
      ? TOPIC_TO_TEMPLATE_KEY[contentTopic] || contentTopic
      : null;
    const topicTemplates = topicKey
      ? SMART_CTA_TEMPLATES[topicKey]
      : undefined;
    const categoryTemplates =
      SMART_CTA_TEMPLATES[category] || SMART_CTA_TEMPLATES["renewal-process"];
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
        content.slice(0, insertPos) +
        "\n\n" +
        cta1 +
        "\n" +
        content.slice(insertPos)
      );
    }
    return content + "\n\n" + cta1 + "\n";
  }

  const insertions: Array<{ pos: number; text: string }> = [];
  insertions.push({
    pos: h2Positions[Math.min(2, h2Positions.length - 1)],
    text: cta1,
  });
  if (cta2 && h2Positions.length >= 4) {
    insertions.push({
      pos: h2Positions[Math.min(4, h2Positions.length - 1)],
      text: cta2,
    });
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
  return content.replace(pattern, "").replace(/\n{3,}/g, "\n\n");
}

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
