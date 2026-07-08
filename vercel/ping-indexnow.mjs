/**
 * Ping IndexNow after production builds so Bing/Copilot pick up new URLs faster.
 * Batches requests and tries Bing endpoint if api.indexnow.org rejects the payload.
 * Non-fatal — build succeeds even if the ping fails.
 */
import { existsSync, readFileSync } from "node:fs";

const SITE_URL = "https://mortgagerenewalhub.ca";
const INDEXNOW_KEY = "84decfd7b2af3b9a131c364a80c17e2e";
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];
const BATCH_SIZE = 100;
const MAX_URLS = 10_000;

async function pingBatch(urls, endpoint) {
  const host = new URL(SITE_URL).hostname;
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, status: res.status, statusText: res.statusText, endpoint };
}

async function pingIndexNow(urls) {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  const unique = [...new Set(urls.map((u) => (u.endsWith("/") ? u : `${u}/`)))].slice(
    0,
    MAX_URLS,
  );

  let lastError = null;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    let batchOk = false;

    for (const endpoint of ENDPOINTS) {
      const result = await pingBatch(batch, endpoint);
      if (result.ok) {
        batchOk = true;
        break;
      }
      lastError = `${result.endpoint}: ${result.status} ${result.statusText}`;
    }

    if (!batchOk) {
      // Non-fatal: never fail the Vercel/Astro build on IndexNow auth/network issues.
      console.warn(`IndexNow batch ${i / BATCH_SIZE + 1} failed: ${lastError}`);
      return;
    }
  }

  console.log(`IndexNow: submitted ${unique.length} URLs`);
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

  console.log(`IndexNow: pinging ${urlList.length} URLs in batches of ${BATCH_SIZE}...`);
  await pingIndexNow(urlList);
  console.log("IndexNow: done");
}

main().catch((err) => {
  console.warn("IndexNow ping failed (non-fatal):", err);
});
