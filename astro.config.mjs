// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pageDatesPath = path.join(__dirname, "src/data/page-dates.json");

/** @type {Record<string, string>} */
function loadPageDates() {
  try {
    return JSON.parse(fs.readFileSync(pageDatesPath, "utf8"));
  } catch {
    return {};
  }
}

const pageDates = loadPageDates();

// https://astro.build/config
export default defineConfig({
  site: "https://mortgagerenewalhub.ca",
  trailingSlash: "always",
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const excluded = [
          '/investment-property-mortgage-renewal/',
          '/mortgage-renewal-divorce-separation/',
          '/faq/',
          '/404/',
        ];
        if (excluded.some((path) => page.endsWith(path))) return false;
        if (page.includes('/api/')) return false;
        return true;
      },
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname;

        const tier1 = ['/'];
        const tier2 = [
          '/book-a-call/',
          '/mortgage-renewal-calculator/',
          '/mortgage-renewal-guide/',
          '/best-mortgage-renewal-rates/',
        ];
        const tier3 = [
          '/alberta-mortgage-renewal/',
          '/bc-mortgage-renewal/',
          '/ontario-mortgage-renewal/',
          '/quebec-mortgage-renewal/',
          '/saskatchewan-manitoba-mortgage-renewal/',
          '/mortgage-rate-forecast/',
          '/what-is-a-mortgage-renewal/',
        ];
        const legal = ['/privacy/', '/terms/', '/cookie-policy/'];
        const weekly = [
          '/',
          '/mortgage-rate-forecast/',
          '/best-mortgage-renewal-rates/',
          '/mortgage-renewal-calculator/',
        ];

        if (tier1.includes(path)) item.priority = 1.0;
        else if (tier2.includes(path)) item.priority = 0.9;
        else if (tier3.includes(path)) item.priority = 0.8;
        else if (legal.includes(path)) item.priority = 0.3;
        else item.priority = 0.7;

        if (legal.includes(path)) item.changefreq = ChangeFreqEnum.YEARLY;
        else if (weekly.includes(path)) item.changefreq = ChangeFreqEnum.WEEKLY;
        else item.changefreq = ChangeFreqEnum.MONTHLY;

        if (!legal.includes(path)) {
          const lastmod = pageDates[path];
          if (lastmod) {
            item.lastmod = new Date(lastmod);
          }
        }

        return item;
      },
    }),
    react(),
  ],
  // Static by default; only API routes and booking pages opt into SSR.
  output: "static",
  adapter: vercel({
    // Images are optimized at build time for static pages; skip Vercel Image
    // Optimization in the SSR bundle to avoid bundling sharp (~16MB).
    imageService: false,
  }),

  vite: {
    // @ts-expect-error - @tailwindcss/vite Plugin type differs from Astro's bundled Vite types
    plugins: [tailwindcss()],
    build: {
      target: "es2022",
    },
  },
});
