import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { blogPostHref, curatedNewsRssItems, getPublishedBlogPosts } from "@/lib/blog";
import { SITE_METADATA } from "../consts";

async function getPosts() {
  try {
    const blogPosts = await getPublishedBlogPosts();
    if (blogPosts.length > 0) {
      return blogPosts
        .map((post) => ({
          date: post.data.pubDate,
          title: post.data.title,
          excerpt: post.data.description,
          link: blogPostHref(post),
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  } catch {
    // Collection unavailable — use fallback below.
  }
  return curatedNewsRssItems();
}

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${SITE_METADATA.openGraph.siteName} — Renewal News`,
    description:
      "Canadian mortgage renewal news: Bank of Canada decisions, OSFI rule changes, and market trends for 2026 renewals.",
    site: context.site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `<language>en-ca</language>`,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.excerpt,
      link: post.link,
    })),
  });
}
