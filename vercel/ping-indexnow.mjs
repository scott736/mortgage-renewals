/**
 * Ping IndexNow after production builds so Bing/Copilot pick up new URLs faster.
 * Non-fatal — build succeeds even if the ping fails.
 */
import { existsSync, readFileSync } from "node:fs";

const SITE_URL = "https://mortgagerenewalhub.ca";
const INDEXNOW_KEY = "mrh-indexnow-verification-key";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

async function pingIndexNow(urls) {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  const unique = [...new Set(urls.map((u) => (u.endsWith("/") ? u : `${u}/`)))];
  const host = new URL(SITE_URL).hostname;

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: unique.slice(0, MAX_URLS),
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(`IndexNow ping failed: ${res.status} ${res.statusText}`);
  }
}

function fetchSitemapUrls() {
  const urls = [`${SITE_URL}/`];
  const candidates = [
    "dist/client/sitemap-0.xml",
    ".vercel/output/static/sitemap-0.xml",
  ];

  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const xml = readFileSync(file, "utf-8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(match[1].trim());
    }
    break;
  }

  return [...new Set(urls)].slice(0, MAX_URLS);
}

async function main() {
  const urlList = fetchSitemapUrls();
  if (urlList.length === 0) {
    console.log("IndexNow: skipped (no sitemap URLs found)");
    return;
  }

  console.log(`IndexNow: pinging ${urlList.length} URLs...`);
  await pingIndexNow(urlList);
  console.log("IndexNow: done");
}

main().catch((err) => {
  console.warn("IndexNow ping failed (non-fatal):", err);
});
