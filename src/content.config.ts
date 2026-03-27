import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      published: z.date(),
      tagline: z.string().optional(),
      intro: z.string().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      coverImage: z.string().optional(),
      image: z.string().optional(),
      featured: z.boolean().optional(),
    })
    .transform((data) => ({
      ...data,
      coverImage: data.coverImage ?? data.image,
    })),
});

const integrations = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/integrations",
  }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    badges: z.array(z.string()).optional(),
    website: z.string().optional(),
    pricing: z.string().optional(),
    terms: z.string().optional(),
    published: z.coerce.date().optional(),
  }),
});

export const collections = { blog, integrations };
