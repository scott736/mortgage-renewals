/** Reciprocal en/fr hreflang pairs for Quebec-focused French content. */
export const HREFLANG_PAIRS: Record<string, string> = {
  "/quebec-mortgage-renewal/": "/fr/renouvellement-hypothecaire-quebec/",
  "/fr/renouvellement-hypothecaire-quebec/": "/quebec-mortgage-renewal/",
  "/switching-lenders-at-renewal/": "/fr/changer-preteur-renouvellement/",
  "/fr/changer-preteur-renouvellement/": "/switching-lenders-at-renewal/",
  "/mortgage-renewal-guide/": "/fr/guide-renouvellement-hypothecaire/",
  "/fr/guide-renouvellement-hypothecaire/": "/mortgage-renewal-guide/",
  "/mortgage-renewal-faq/": "/fr/faq-renouvellement-hypothecaire/",
  "/fr/faq-renouvellement-hypothecaire/": "/mortgage-renewal-faq/",
  "/mortgage-renewal-calculator/": "/fr/calculateur-renouvellement-hypothecaire/",
  "/fr/calculateur-renouvellement-hypothecaire/": "/mortgage-renewal-calculator/",
  "/mortgage-penalty-calculator/": "/fr/calculateur-penalite-hypothecaire/",
  "/fr/calculateur-penalite-hypothecaire/": "/mortgage-penalty-calculator/",
  "/best-mortgage-renewal-rates/": "/fr/meilleurs-taux-renouvellement-hypothecaire/",
  "/fr/meilleurs-taux-renouvellement-hypothecaire/": "/best-mortgage-renewal-rates/",
  "/what-is-a-mortgage-renewal/": "/fr/qu-est-ce-que-renouvellement-hypothecaire/",
  "/fr/qu-est-ce-que-renouvellement-hypothecaire/": "/what-is-a-mortgage-renewal/",
  "/mortgage-rate-forecast/": "/fr/prevision-taux-hypothecaire/",
  "/fr/prevision-taux-hypothecaire/": "/mortgage-rate-forecast/",
};

export function normalizeTrailingSlash(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function getHreflangAlternate(pathname: string): string | undefined {
  return HREFLANG_PAIRS[normalizeTrailingSlash(pathname)];
}

export function isFrenchPath(pathname: string): boolean {
  return normalizeTrailingSlash(pathname).startsWith("/fr/");
}

/** HTML `<link rel="alternate">` targets — mirrors BaseHead logic. */
export function resolveHreflangUrls(pathname: string, site: URL | string) {
  const normalizedPath = normalizeTrailingSlash(pathname);
  const siteOrigin = typeof site === "string" ? site : site.origin;
  const hreflangAlternate = HREFLANG_PAIRS[normalizedPath];
  const isFrenchPage = normalizedPath.startsWith("/fr/");
  const canonicalURL = new URL(normalizedPath, siteOrigin);

  const enHreflangURL =
    isFrenchPage && hreflangAlternate
      ? new URL(hreflangAlternate, siteOrigin)
      : canonicalURL;
  const frHreflangURL = isFrenchPage
    ? canonicalURL
    : hreflangAlternate
      ? new URL(hreflangAlternate, siteOrigin)
      : null;
  const xDefaultURL =
    isFrenchPage && hreflangAlternate ? enHreflangURL : canonicalURL;

  return { canonicalURL, enHreflangURL, frHreflangURL, xDefaultURL, isFrenchPage };
}

/** Sitemap xhtml:link alternates for paired EN/FR pages. */
export function buildSitemapHreflangLinks(
  pathname: string,
  siteUrl: string
): Array<{ url: string; lang: string }> | undefined {
  const normalizedPath = normalizeTrailingSlash(pathname);
  const alternate = HREFLANG_PAIRS[normalizedPath];
  if (!alternate) return undefined;

  const origin = siteUrl.replace(/\/$/, "");
  const isFrench = normalizedPath.startsWith("/fr/");
  const enPath = isFrench ? alternate : normalizedPath;
  const frPath = isFrench ? normalizedPath : alternate;

  return [
    { url: `${origin}${enPath}`, lang: "en-ca" },
    { url: `${origin}${frPath}`, lang: "fr-ca" },
    { url: `${origin}${enPath}`, lang: "x-default" },
  ];
}
