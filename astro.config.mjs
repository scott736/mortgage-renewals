// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://mortgagerenewalhub.ca",
  integrations: [mdx(), sitemap(), react()],
  output: "server",
  adapter: vercel(),

  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: "Satoshi",
      cssVariable: "--font-satoshi",
      weights: ["400", "500", "700"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
