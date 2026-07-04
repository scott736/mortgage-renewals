const DEFAULT_DATE_PUBLISHED = "2025-01-15";
const DEFAULT_DATE_MODIFIED = new Date().toISOString().slice(0, 10);

export type PageMeta = {
  slug: string;
  datePublished: string;
  dateModified: string;
};

export function getPageMeta(
  slug: string,
  overrides?: Partial<Pick<PageMeta, "datePublished" | "dateModified">>,
): PageMeta {
  return {
    slug,
    datePublished: overrides?.datePublished ?? DEFAULT_DATE_PUBLISHED,
    dateModified: overrides?.dateModified ?? DEFAULT_DATE_MODIFIED,
  };
}
