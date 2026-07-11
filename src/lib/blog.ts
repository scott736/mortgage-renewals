import { type CollectionEntry, getCollection } from "astro:content";

import { CURATED_NEWS } from "@/data/curated-news";

/** Calendar date in America/Toronto as YYYY-MM-DD for queue gating. */
export function torontoDateString(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function pubDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getPublishedBlogPosts() {
  const today = torontoDateString();
  return getCollection(
    "blog",
    ({ data }) => !data.draft && pubDateKey(data.pubDate) <= today,
  );
}

export function formatNewsDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export function blogPostHref(post: CollectionEntry<"blog">): string {
  if (post.data.canonicalSlug) {
    return `/${post.data.canonicalSlug}/`;
  }
  return `/blog/${post.id}/`;
}

export function curatedNewsRssItems() {
  return CURATED_NEWS.map((item) => ({
    date: new Date(item.pubDate),
    title: item.title,
    excerpt: item.rssExcerpt,
    link: item.href,
  })).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function curatedNewsIndexItems() {
  return CURATED_NEWS.map((item) => ({
    sortDate: new Date(item.pubDate),
    date: formatNewsDate(new Date(item.pubDate)),
    category: item.category,
    title: item.title,
    excerpt: item.excerpt,
    href: item.href,
    readTime: item.readTime,
  }));
}
