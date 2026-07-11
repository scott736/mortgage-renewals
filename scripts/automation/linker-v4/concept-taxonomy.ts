// ============================================
// Smart Linker — Renewal Concept Taxonomy
// ============================================

import { tokenize } from "./semantic-filter";

export type FinancingConcept =
  | "renewal-process"
  | "switch-vs-stay"
  | "stress-test-osfi"
  | "discharge-fees"
  | "rate-environment"
  | "payment-shock"
  | "fixed-vs-variable"
  | "renewal-checklist"
  | "renewal-timeline"
  | "penalty-and-break"
  | "refinance-vs-renew"
  | "calculator-tools"
  | "broker-help"
  | "first-renewal"
  | "lender-specific"
  | "provincial-rules"
  | "amortization-terms"
  | "prepayment-privileges";

export type AssetClass =
  | "owner-occupied"
  | "investment-property"
  | "insured"
  | "conventional"
  | "variable"
  | "fixed";

const CONCEPT_PATTERNS: Record<FinancingConcept, RegExp[]> = {
  "renewal-process": [
    /\bmortgage\s+renewal\b/i,
    /\brenew(?:ing|al)\s+(?:your\s+)?mortgage\b/i,
    /\brenewal\s+(?:letter|offer|window|date|maturity)\b/i,
    /\bauto[- ]?renew\b/i,
  ],
  "switch-vs-stay": [
    /\bswitch(?:ing)?\s+(?:lenders?|banks?)\b/i,
    /\bstay(?:ing)?\s+(?:with\s+)?(?:your\s+)?(?:lender|bank)\b/i,
    /\btransfer\s+(?:your\s+)?mortgage\b/i,
    /\bchange\s+lenders?\b/i,
  ],
  "stress-test-osfi": [
    /\bstress\s+test\b/i,
    /\bosfi\b/i,
    /\bb[- ]?20\b/i,
    /\bqualifying\s+rate\b/i,
    /\bstress[- ]test\s+exempt/i,
  ],
  "discharge-fees": [
    /\bdischarge\s+fee/i,
    /\bdischarge\s+cost/i,
    /\blegal\s+fees?\s+(?:to\s+)?switch/i,
    /\btitle\s+insurance\b/i,
  ],
  "rate-environment": [
    /\bbank\s+of\s+canada\b/i,
    /\bovernight\s+rate\b/i,
    /\brenewal\s+rates?\b/i,
    /\bposted\s+rate\b/i,
    /\bmortgage\s+rate\s+forecast\b/i,
  ],
  "payment-shock": [
    /\bpayment\s+shock\b/i,
    /\bpayment\s+(?:increase|jump|spike)\b/i,
    /\bhigher\s+payment\b/i,
    /\brenewal\s+payment\b/i,
  ],
  "fixed-vs-variable": [
    /\bfixed\s+(?:vs\.?|versus|or)\s+variable\b/i,
    /\bvariable\s+rate\b/i,
    /\bfixed\s+rate\b/i,
    /\btrigger\s+rate\b/i,
  ],
  "renewal-checklist": [
    /\brenewal\s+checklist\b/i,
    /\bdocument\s+checklist\b/i,
    /\brenewal\s+letter\s+decoder\b/i,
    /\bwhat\s+(?:documents?|paperwork)\b/i,
  ],
  "renewal-timeline": [
    /\b120\s+days?\b/i,
    /\b60\s+days?\b/i,
    /\b30\s+days?\b/i,
    /\brenewal\s+(?:window|timeline|countdown)\b/i,
    /\brenewal\s+reminder\b/i,
  ],
  "penalty-and-break": [
    /\bmortgage\s+penalty\b/i,
    /\bird\b/i,
    /\binterest\s+rate\s+differential\b/i,
    /\bthree[- ]month\s+interest\b/i,
    /\bbreak(?:ing)?\s+(?:your\s+)?mortgage\b/i,
  ],
  "refinance-vs-renew": [
    /\brenewal\s+vs\.?\s+refinanc/i,
    /\brefinanc(?:e|ing)\b/i,
    /\bheloc\b/i,
    /\bcash[- ]out\b/i,
    /\bequity\s+takeout\b/i,
  ],
  "calculator-tools": [
    /\bcalculator\b/i,
    /\bbreak[- ]even\b/i,
    /\bswitch\s+vs\.?\s+stay\b/i,
    /\brun\s+the\s+numbers\b/i,
  ],
  "broker-help": [
    /\bmortgage\s+broker\b/i,
    /\b30\+\s+lenders\b/i,
    /\blicensed\s+broker\b/i,
    /\bbook\s+a\s+(?:free\s+)?(?:call|strategy)\b/i,
  ],
  "first-renewal": [
    /\bfirst\s+renewal\b/i,
    /\bfirst[- ]time\s+renew/i,
    /\bfirst\s+mortgage\s+renewal\b/i,
  ],
  "lender-specific": [
    /\b(?:td|rbc|scotiabank|bmo|cibc|national\s+bank)\s+mortgage\s+renewal\b/i,
  ],
  "provincial-rules": [
    /\b(?:ontario|bc|alberta|quebec|manitoba|saskatchewan)\s+mortgage\s+renewal\b/i,
    /\bnotary\s+fees?\b/i,
  ],
  "amortization-terms": [
    /\bamortization\b/i,
    /\b30[- ]year\s+amort/i,
    /\bterm\s+length\b/i,
  ],
  "prepayment-privileges": [
    /\bprepayment\s+privileg/i,
    /\blump[- ]sum\s+payment\b/i,
    /\baccelerated\s+(?:bi[- ]?weekly|payment)\b/i,
  ],
};

const ASSET_PATTERNS: Record<AssetClass, RegExp[]> = {
  "owner-occupied": [
    /\bprimary\s+(?:home|residence)\b/i,
    /\bowner[- ]occupied\b/i,
    /\bprincipal\s+residence\b/i,
  ],
  "investment-property": [
    /\binvestment\s+propert/i,
    /\brental\s+(?:propert|income)\b/i,
    /\binvestor\s+renewal\b/i,
  ],
  insured: [/\binsured\s+mortgage\b/i, /\bcmhc\b/i, /\bhigh[- ]ratio\b/i],
  conventional: [/\bconventional\s+mortgage\b/i, /\blow[- ]ratio\b/i],
  variable: [/\bvariable\s+rate\b/i, /\btrigger\s+rate\b/i],
  fixed: [/\bfixed\s+rate\b/i, /\bfixed\s+term\b/i],
};

/** Concept pairs that should not be linked across when context is strongly one-sided. */
const CONCEPT_CONFLICTS: Array<[FinancingConcept, FinancingConcept]> = [
  ["penalty-and-break", "renewal-timeline"], // mid-term break vs maturity window
];

const ASSET_INCOMPATIBLE: Array<[AssetClass, AssetClass]> = [
  ["owner-occupied", "investment-property"],
  ["fixed", "variable"],
];

export function inferConcepts(text: string): Set<FinancingConcept> {
  const found = new Set<FinancingConcept>();
  for (const [concept, patterns] of Object.entries(CONCEPT_PATTERNS) as [
    FinancingConcept,
    RegExp[],
  ][]) {
    if (patterns.some((p) => p.test(text))) found.add(concept);
  }
  return found;
}

export function inferAssetClasses(text: string): Set<AssetClass> {
  const found = new Set<AssetClass>();
  for (const [asset, patterns] of Object.entries(ASSET_PATTERNS) as [
    AssetClass,
    RegExp[],
  ][]) {
    if (patterns.some((p) => p.test(text))) found.add(asset);
  }
  if (found.size === 0) found.add("owner-occupied");
  return found;
}

export function deriveConceptsFromMeta(
  title: string,
  description: string,
  tags: string[] = [],
  topicsCovered: string[] = [],
  readerPromise = ""
): FinancingConcept[] {
  const text = [
    title,
    description,
    readerPromise,
    tags.join(" "),
    topicsCovered.join(" "),
  ].join(" ");
  const concepts = Array.from(inferConcepts(text));

  const tagConceptMap: Record<string, FinancingConcept[]> = {
    renewal: ["renewal-process"],
    "first-renewal": ["first-renewal", "payment-shock"],
    "payment-shock": ["payment-shock"],
    rates: ["rate-environment"],
    "bank-of-canada": ["rate-environment"],
    switching: ["switch-vs-stay"],
    "discharge-fees": ["discharge-fees", "switch-vs-stay"],
    "stress-test": ["stress-test-osfi"],
    osfi: ["stress-test-osfi"],
    checklist: ["renewal-checklist"],
    documents: ["renewal-checklist"],
    timeline: ["renewal-timeline"],
    "fixed-rate": ["fixed-vs-variable"],
    "variable-rate": ["fixed-vs-variable"],
    penalty: ["penalty-and-break"],
    refinance: ["refinance-vs-renew"],
    heloc: ["refinance-vs-renew"],
    calculator: ["calculator-tools"],
    broker: ["broker-help"],
  };

  for (const tag of tags) {
    const mapped = tagConceptMap[tag.toLowerCase()];
    if (mapped) mapped.forEach((c) => concepts.push(c));
  }

  if (/\bfirst\s+renewal\b/i.test(title)) concepts.push("first-renewal");
  if (/\bpayment\s+shock\b/i.test(title)) concepts.push("payment-shock");
  if (/\bstress\s+test\b|\bosfi\b/i.test(title)) concepts.push("stress-test-osfi");
  if (/\bdischarge\b/i.test(title)) concepts.push("discharge-fees");
  if (/\bfixed\s+vs\.?\s+variable\b/i.test(title)) concepts.push("fixed-vs-variable");

  return [...new Set(concepts)];
}

export function deriveTopicsExcluded(concepts: FinancingConcept[]): string[] {
  const excluded: string[] = [];
  const excludeMap: Partial<Record<FinancingConcept, string[]>> = {
    "penalty-and-break": ["maturity-only-renewal"],
    "first-renewal": ["subsequent-portfolio-renewal"],
    "stress-test-osfi": ["rate-shopping-only"],
    "rate-environment": ["document-checklist-only"],
  };
  for (const c of concepts) {
    const items = excludeMap[c];
    if (items) excluded.push(...items);
  }
  return [...new Set(excluded)];
}

export function conceptOverlap(
  contextConcepts: Set<FinancingConcept>,
  targetConcepts: FinancingConcept[]
): number {
  if (targetConcepts.length === 0) return 0;
  let n = 0;
  for (const c of targetConcepts) {
    if (contextConcepts.has(c)) n++;
  }
  return n;
}

export function hasConceptConflict(
  contextConcepts: Set<FinancingConcept>,
  targetConcepts: FinancingConcept[]
): boolean {
  const targetSet = new Set(targetConcepts);
  for (const [a, b] of CONCEPT_CONFLICTS) {
    if (contextConcepts.has(a) && targetSet.has(b)) return true;
    if (contextConcepts.has(b) && targetSet.has(a)) return true;
  }
  return false;
}

export function hasAssetConflict(
  contextAssets: Set<AssetClass>,
  targetAssets: string[] | undefined
): boolean {
  if (!targetAssets?.length) return false;
  const targetSet = new Set(targetAssets.map((a) => a.toLowerCase()));

  for (const [a, b] of ASSET_INCOMPATIBLE) {
    const ctxHasA = contextAssets.has(a);
    const ctxHasB = contextAssets.has(b);
    const tgtHasA = targetSet.has(a);
    const tgtHasB = targetSet.has(b);
    if (ctxHasA && !ctxHasB && tgtHasB && !tgtHasA) return true;
    if (ctxHasB && !ctxHasA && tgtHasA && !tgtHasB) return true;
  }
  return false;
}

export function scoreReaderIntentAlignment(
  anchor: string,
  context: string,
  questionsAnswered: string[] = [],
  readerPromise = ""
): number {
  if (!questionsAnswered.length && !readerPromise) return 0.5;

  const ctxTokens = new Set(tokenize(`${anchor} ${context}`));
  const sources = [...questionsAnswered, readerPromise].filter(Boolean);

  let best = 0;
  for (const q of sources) {
    const qTokens = tokenize(q.replace(/\?/g, ""));
    if (qTokens.length === 0) continue;
    let overlap = 0;
    for (const t of qTokens) {
      if (ctxTokens.has(t)) overlap++;
    }
    const ratio = overlap / qTokens.length;
    if (ratio > best) best = ratio;
  }

  return Math.min(1, best);
}

export function hitsTopicsExcluded(
  anchor: string,
  context: string,
  topicsExcluded: string[] = []
): boolean {
  if (!topicsExcluded.length) return false;
  const text = `${anchor} ${context}`.toLowerCase();

  const exclusionPatterns: Record<string, RegExp[]> = {
    "maturity-only-renewal": [
      /\bat\s+maturity\b/i,
      /\brenewal\s+window\b/i,
      /\bno\s+penalty\b/i,
    ],
    "subsequent-portfolio-renewal": [
      /\bportfolio\s+renewal\b/i,
      /\bmultiple\s+propert/i,
    ],
    "rate-shopping-only": [/\bbest\s+rates?\b/i, /\brate\s+shopping\b/i],
    "document-checklist-only": [
      /\bchecklist\b/i,
      /\bdocuments?\s+needed\b/i,
    ],
  };

  for (const topic of topicsExcluded) {
    const patterns = exclusionPatterns[topic];
    if (patterns?.some((p) => p.test(text))) return true;
  }
  return false;
}
