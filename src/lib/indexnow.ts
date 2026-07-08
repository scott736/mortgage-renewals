import { INDEXNOW_KEY, SITE_URL } from "../consts";

/** Prefer partners that accept key-file verification without Bing Webmaster ownership. */
const INDEXNOW_ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;
const MAX_URLS_PER_REQUEST = 10_000;

export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) {
    return;
  }

  const unique = [
    ...new Set(urls.map((u) => (u.endsWith("/") ? u : `${u}/`))),
  ];
  const host = new URL(SITE_URL).hostname;

  for (let i = 0; i < unique.length; i += MAX_URLS_PER_REQUEST) {
    const chunk = unique.slice(i, i + MAX_URLS_PER_REQUEST);
    const body = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: chunk,
    };

    let ok = false;
    for (const endpoint of INDEXNOW_ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(body),
        });
        if (res.ok || res.status === 202) {
          ok = true;
          break;
        }
      } catch {
        // try next partner
      }
    }

    if (!ok) {
      console.warn(`IndexNow ping chunk failed (non-fatal): no partner accepted`);
    }
  }
}
