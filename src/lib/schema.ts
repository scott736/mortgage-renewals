/**
 * Schema.org structured data utilities for GEO (Generative Engine Optimization).
 * Generates JSON-LD schema markup for AI discoverability and search engine understanding.
 */

const SITE_URL = "https://mortgagerenewalhub.ca";
const ORG_NAME = "MortgageRenewalHub.ca";

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
}

export interface ArticleOptions {
  headline: string;
  description: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
}

export interface HowToOptions {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    ],
  };
}

export function articleSchema(opts: ArticleOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: `${SITE_URL}/${opts.slug}`,
    datePublished: opts.datePublished || "2025-01-15",
    dateModified: opts.dateModified || "2026-03-30",
    author: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon/favicon-96x96.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/${opts.slug}` },
    inLanguage: "en-CA",
  };
}

export function howToSchema(opts: HowToOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function financialGuideSchema(opts: {
  name: string;
  description: string;
  slug: string;
  about?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}/${opts.slug}`,
    provider: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
    ...(opts.about && { category: opts.about }),
  };
}

export function speakableSchema(slug: string, cssSelectors: string[] = ["h1", "article > p:first-of-type"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
    url: `${SITE_URL}/${slug}`,
  };
}

/** Combine multiple schema objects into a single JSON string for the schema prop. */
export function combineSchemas(...schemas: Record<string, unknown>[]) {
  return JSON.stringify(schemas);
}
