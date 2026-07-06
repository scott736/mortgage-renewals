import { INDEXNOW_KEY, SITE_URL } from "../consts";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
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

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`IndexNow ping chunk failed: ${res.status} ${res.statusText}`);
    }
  }
}
