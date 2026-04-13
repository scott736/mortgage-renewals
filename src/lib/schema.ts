/**
 * Schema.org structured data utilities for SEO + GEO (Generative Engine Optimization).
 *
 * Designed to be combined into a single connected @graph by BaseHead.astro.
 * Each generator returns a node fragment (no @context — that lives on the @graph root).
 * Nodes use @id values so other nodes (Article -> WebPage, BreadcrumbList -> WebPage,
 * publisher -> Organization) can cross-reference each other, which substantially
 * improves how Google and AI crawlers interpret the page's entity graph.
 */

const SITE_URL = "https://mortgagerenewalhub.ca";
const _ORG_NAME = "MortgageRenewalHub.ca";
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DATE_PUBLISHED = "2025-01-15";
// Build-time default. Individual pages should pass their own `dateModified`
// when they have meaningful edits; leaving this blank forces a freshness
// signal refresh on each deploy, which is the closest a static site can
// get to "last modified" without per-page Git history.
const DEFAULT_DATE_MODIFIED = new Date().toISOString().slice(0, 10);

// Canonicalised path -> trailing slash + leading slash, used for @id stability.
function pageUrl(slug: string) {
  if (!slug || slug === "/") return `${SITE_URL}/`;
  const cleaned = slug.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${cleaned}/`;
}

function pageId(slug: string, suffix: string) {
  return `${pageUrl(slug)}#${suffix}`;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export interface AuthorPerson {
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

export interface ArticleOptions {
  headline: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  wordCount?: number;
  articleSection?: string;
  keywords?: string[];
  about?: string;
  author?: AuthorPerson;
  reviewedBy?: AuthorPerson;
  areaServed?: string;
  inLanguage?: string;
}

export interface HowToOptions {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g. "PT15M"
  image?: string;
  estimatedCost?: { currency: string; value: string };
}

export interface WebApplicationOptions {
  name: string;
  description: string;
  slug: string;
  applicationCategory?: string; // e.g. "FinanceApplication"
  operatingSystem?: string;
  features?: string[];
}

export interface ServiceOptions {
  name: string;
  description: string;
  slug: string;
  serviceType?: string;
  price?: string; // "0" for free
  priceCurrency?: string;
}

/**
 * Default expert author for the site. Real Person authorship is critical for
 * E-E-A-T on YMYL (Your Money or Your Life) financial content. The site is
 * powered by LendCity Mortgages — Scott Dillingham is the principal broker.
 */
export const DEFAULT_AUTHOR: AuthorPerson = {
  name: "Scott Dillingham",
  jobTitle: "Licensed Mortgage Broker",
  url: `${SITE_URL}/about/`,
  sameAs: ["https://lendcity.ca"],
  knowsAbout: [
    "Mortgage Renewal",
    "Canadian Mortgage Rates",
    "Mortgage Refinancing",
    "Bank of Canada Policy Rate",
    "Canadian Mortgage Charter",
  ],
};

function personNode(person: AuthorPerson) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/about/#${person.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: person.name,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.url && { url: person.url }),
    ...(person.sameAs && { sameAs: person.sameAs }),
    ...(person.knowsAbout && { knowsAbout: person.knowsAbout }),
    worksFor: { "@id": ORG_ID },
  };
}

export function webPageNode(opts: {
  slug: string;
  name: string;
  description?: string;
  speakableSelectors?: string[];
  inLanguage?: string;
}) {
  const url = pageUrl(opts.slug);
  return {
    "@type": "WebPage",
    "@id": pageId(opts.slug, "webpage"),
    url,
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    isPartOf: { "@id": SITE_ID },
    inLanguage: opts.inLanguage || "en-CA",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: opts.speakableSelectors || [
        "h1",
        "[data-speakable]",
        "article > p:first-of-type",
        ".key-takeaways",
      ],
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": pageId(items[items.length - 1]?.url || "", "breadcrumbs"),
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : pageUrl(item.url),
      })),
    ],
  };
}

export function articleSchema(opts: ArticleOptions) {
  const url = pageUrl(opts.slug);
  const author = opts.author || DEFAULT_AUTHOR;

  const node: Record<string, unknown> = {
    "@type": "Article",
    "@id": pageId(opts.slug, "article"),
    headline: opts.headline,
    description: opts.description,
    url,
    image: opts.image || DEFAULT_OG_IMAGE,
    datePublished: opts.datePublished || DEFAULT_DATE_PUBLISHED,
    dateModified: opts.dateModified || DEFAULT_DATE_MODIFIED,
    author: personNode(author),
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": pageId(opts.slug, "webpage") },
    inLanguage: opts.inLanguage || "en-CA",
    isPartOf: { "@id": SITE_ID },
  };

  if (opts.reviewedBy) {
    node.reviewedBy = personNode(opts.reviewedBy);
  }
  if (opts.wordCount) node.wordCount = opts.wordCount;
  if (opts.articleSection) node.articleSection = opts.articleSection;
  if (opts.keywords) node.keywords = opts.keywords.join(", ");
  if (opts.about) {
    node.about = {
      "@type": "Thing",
      name: opts.about,
    };
  }
  if (opts.areaServed) {
    node.contentLocation = {
      "@type": "AdministrativeArea",
      name: opts.areaServed,
    };
  }

  return node;
}

export function howToSchema(opts: HowToOptions) {
  const node: Record<string, unknown> = {
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
    })),
  };
  if (opts.totalTime) node.totalTime = opts.totalTime;
  if (opts.image) node.image = opts.image;
  if (opts.estimatedCost) {
    node.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: opts.estimatedCost.currency,
      value: opts.estimatedCost.value,
    };
  }
  return node;
}

export function faqSchema(items: FAQItem[], slug?: string) {
  const node: Record<string, unknown> = {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      inLanguage: "en-CA",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
        inLanguage: "en-CA",
      },
    })),
  };
  if (slug !== undefined) {
    node["@id"] = pageId(slug, "faqpage");
    node.inLanguage = "en-CA";
    node.isPartOf = { "@id": SITE_ID };
  }
  return node;
}

/**
 * WebApplication schema for the calculator page (and other interactive tools).
 * Lets Google surface the page as a tool card in rich results, and gives AI
 * crawlers (Perplexity especially) the signal to cite it as a usable utility.
 */
export function webApplicationSchema(opts: WebApplicationOptions) {
  return {
    "@type": "WebApplication",
    "@id": pageId(opts.slug, "application"),
    name: opts.name,
    description: opts.description,
    url: pageUrl(opts.slug),
    applicationCategory: opts.applicationCategory || "FinanceApplication",
    applicationSubCategory: "MortgageCalculator",
    operatingSystem: opts.operatingSystem || "All (web browser)",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-CA",
    ...(opts.features && {
      featureList: opts.features.join(", "),
    }),
  };
}

/** Service schema for booking, broker, and consultation pages. */
export function serviceSchema(opts: ServiceOptions) {
  return {
    "@type": "Service",
    "@id": pageId(opts.slug, "service"),
    name: opts.name,
    description: opts.description,
    url: pageUrl(opts.slug),
    provider: { "@id": ORG_ID },
    serviceType: opts.serviceType || "Mortgage Broker Consultation",
    areaServed: { "@type": "Country", name: "Canada" },
    audience: {
      "@type": "Audience",
      audienceType: "Canadian homeowners approaching mortgage renewal",
    },
    offers: {
      "@type": "Offer",
      price: opts.price ?? "0",
      priceCurrency: opts.priceCurrency || "CAD",
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * DefinedTermSet for the glossary page — purpose-built schema type for term lists.
 * Each term becomes a DefinedTerm with name + description, allowing AI assistants
 * to extract authoritative definitions verbatim.
 */
export function definedTermSetSchema(opts: {
  name: string;
  description: string;
  slug: string;
  terms: { term: string; definition: string }[];
}) {
  return {
    "@type": "DefinedTermSet",
    "@id": pageId(opts.slug, "termset"),
    name: opts.name,
    description: opts.description,
    url: pageUrl(opts.slug),
    inLanguage: "en-CA",
    hasDefinedTerm: opts.terms.map((t, i) => ({
      "@type": "DefinedTerm",
      "@id": pageId(opts.slug, `term-${i}`),
      name: t.term,
      description: t.definition,
      inDefinedTermSet: { "@id": pageId(opts.slug, "termset") },
    })),
  };
}

/**
 * Combine arbitrary schema nodes into a JSON string suitable for the BaseHead
 * `schema` prop. BaseHead unwraps this back into the @graph and adds the
 * Organization + WebSite root nodes plus @context.
 */
export function combineSchemas(...schemas: Record<string, unknown>[]) {
  return JSON.stringify(schemas.filter(Boolean));
}

// Backwards-compat shim for legacy `speakableSchema(slug)` calls. Emits a
// WebPage node with the same canonical @id used by webPageNode() so that
// articleSchema's `mainEntityOfPage` reference still resolves. Intentionally
// omits `name` — passing the slug as a placeholder is worse than leaving the
// field unset (parsers can fall back to the linked Article headline).
// New code should call webPageNode() directly with a real name + description.
export function speakableSchema(slug: string, cssSelectors?: string[]) {
  return {
    "@type": "WebPage",
    "@id": pageId(slug, "webpage"),
    url: pageUrl(slug),
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en-CA",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors || [
        "h1",
        "[data-speakable]",
        "article > p:first-of-type",
        ".key-takeaways",
      ],
    },
  };
}

// Legacy alias retained so historical FinancialProduct usage on index.astro
// continues to work, but maps to the more accurate Service schema.
export function financialGuideSchema(opts: {
  name: string;
  description: string;
  slug: string;
  about?: string;
}) {
  return serviceSchema({
    name: opts.name,
    description: opts.description,
    slug: opts.slug,
    serviceType: opts.about || "Mortgage Renewal Education",
  });
}
