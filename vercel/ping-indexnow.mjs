/**
 * Ping IndexNow after production builds so search engines pick up new URLs faster.
 * Tries multiple partner endpoints (Yandex/Seznam first, then api.indexnow.org/Bing).
 * Non-fatal — build always succeeds.
 */
import { existsSync, readFileSync } from "node:fs";

const SITE_URL = "https://mortgagerenewalhub.ca";
const INDEXNOW_KEY = "99b2c673-7efd-4784-86f5-ba6cbb781989";
const ENDPOINTS = [
  "https://www.bing.com/indexnow",
  "https://api.indexnow.org/indexnow",
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
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

  // 200 = accepted; 202 = accepted, key validation pending
  const ok = res.ok || res.status === 202;
  let detail = "";
  if (!ok) {
    try {
      detail = (await res.text()).slice(0, 200);
    } catch {
      detail = "";
    }
  }

  return {
    ok,
    status: res.status,
    statusText: res.statusText,
    endpoint,
    detail,
  };
}

async function pingIndexNow(urls) {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  const unique = [...new Set(urls.map((u) => (u.endsWith("/") ? u : `${u}/`)))].slice(
    0,
    MAX_URLS,
  );

  let submitted = 0;
  let lastError = null;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    let batchOk = false;
    let acceptedVia = null;

    for (const endpoint of ENDPOINTS) {
      try {
        const result = await pingBatch(batch, endpoint);
        if (result.ok) {
          batchOk = true;
          acceptedVia = result.endpoint;
          break;
        }
        lastError = `${result.endpoint}: ${result.status} ${result.statusText}${
          result.detail ? ` (${result.detail})` : ""
        }`;
      } catch (err) {
        lastError = `${endpoint}: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    if (!batchOk) {
      console.warn(
        `IndexNow: no partner accepted batch ${i / BATCH_SIZE + 1} (non-fatal). Last: ${lastError}`,
      );
      return;
    }

    submitted += batch.length;
    console.log(
      `IndexNow: batch ${i / BATCH_SIZE + 1} accepted via ${acceptedVia} (${batch.length} URLs)`,
    );
  }

  console.log(`IndexNow: submitted ${submitted} URLs`);
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
