// ============================================
// Smart Linker — per-site voice & quality knobs
// ============================================
// Satellite repos keep their own copy of this file (brand/templates).
// Shared logic (quality-score, force-orphan) imports from here.

export type LinkerPageType = "post" | "pillar" | "tool" | "page" | "other";

export interface LinkerSiteConfig {
  brand: string;
  /** Minimum intent overlap to insert a force-bridge (raise = fewer filler links). */
  minForceOverlap: number;
  /** Max force-bridges inserted into a single source article. */
  maxForceBridgesPerSource: number;
  /** Marker left in markdown so force-bridges can be audited / upgraded. */
  forceBridgeMarker: string;
  /** URLs that should never receive forced inbound bridges. */
  skipForceOrphanUrls: string[];
  /** Build one mid-article bridge sentence with a single markdown link. */
  buildForceBridge: (args: {
    title: string;
    url: string;
    type: LinkerPageType | string;
  }) => string;
}

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function cleanAnchor(title: string): string {
  return title.replace(/[\[\]]/g, "").slice(0, 80);
}

const FORCE_BRIDGE_MARKER = "<!-- linker-force-bridge -->";

export const LINKER_SITE: LinkerSiteConfig = {
  brand: "MortgageRenewalHub",
  minForceOverlap: 0.14,
  maxForceBridgesPerSource: 2,
  forceBridgeMarker: FORCE_BRIDGE_MARKER,
  skipForceOrphanUrls: ["/", "/blog/", "/book-a-call/", "/about/"],
  buildForceBridge({ title, url, type }) {
    const href = normalizeUrl(url);
    const anchor = cleanAnchor(title);
    const link = `[${anchor}](${href})`;

    if (type === "tool") {
      return `${FORCE_BRIDGE_MARKER}\nWhen you're comparing stay-vs-switch numbers, ${link} walks through the inputs renewers actually use before booking a call.`;
    }
    if (type === "pillar" || type === "page") {
      return `${FORCE_BRIDGE_MARKER}\nThat decision sits inside our ${link} hub, where MortgageRenewalHub maps the renewal path and what lenders usually ask for.`;
    }
    // posts / other — rotate lightly by title length to avoid identical filler
    const variants = [
      `${FORCE_BRIDGE_MARKER}\nRelated reading for renewers: ${link} covers the practical angles we see on similar files.`,
      `${FORCE_BRIDGE_MARKER}\nFor a closer look at the same renewal decision, ${link} breaks down how MortgageRenewalHub approaches it.`,
      `${FORCE_BRIDGE_MARKER}\nHomeowners comparing options often continue with ${link} before booking a renewal strategy call.`,
    ];
    return variants[anchor.length % variants.length]!;
  },
};

/** Detect legacy filler bridges that predate the marker. */
export const LEGACY_FORCE_BRIDGE_PATTERNS: RegExp[] = [
  /If you're exploring this further,\s*our guide to\s*\[[^\]]+\]\([^)]+\)\s*covers the details\./gi,
  /If you're exploring this further,\s*\[[^\]]+\]\([^)]+\)\s*covers the details[^.]*\./gi,
  /For homeowners navigating renewal options,\s*\[[^\]]+\]\([^)]+\)\s*covers the details\./gi,
  /For a deeper look at the financing angle behind this topic,\s*see our guide to\s*\[[^\]]+\]\([^)]+\)\./gi,
];
