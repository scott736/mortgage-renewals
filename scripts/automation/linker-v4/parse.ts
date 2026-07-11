// ============================================
// Smart Linker v4 — Markdown/Frontmatter Parsing
// ============================================
// Self-contained parsing utilities. No imports from existing automation code.

import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import matter from "gray-matter";
import type { ParsedArticle, NumberedParagraph } from "./types";

// ----------------
// Directory Constants
// ----------------

export const BLOG_LANGS = ["en"] as const;
export type BlogLang = (typeof BLOG_LANGS)[number];

/** Mortgage Renewal Hub uses a flat blog dir (no en/es/fr folders). */
export function getBlogDir(_lang?: string): string {
  return "src/content/blog";
}

export const BLOG_DIR = getBlogDir();
export const QUEUE_DIR = "src/drafts/queue";
export const BLOG_EXTENSIONS = [".mdx", ".md"] as const;

export interface LoadMarkdownOptions {
  lang?: string;
}

// ----------------
// Frontmatter Parsing
// ----------------

/**
 * Parse YAML frontmatter from a markdown file's content.
 * Returns the frontmatter object and body text.
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const result = matter(content);
  return {
    frontmatter: result.data as Record<string, unknown>,
    body: result.content,
  };
}

/**
 * Extract just the body text (everything after frontmatter).
 */
export function parseBody(content: string): string {
  const match = content.match(/^---[\s\S]*?---\n/);
  return match ? content.slice(match[0].length) : content;
}

/**
 * Extract raw frontmatter string (including --- delimiters).
 */
export function extractRawFrontmatter(content: string): string {
  const match = content.match(/^(---[\s\S]*?---\n)/);
  return match ? match[1] : "";
}

// ----------------
// Paragraph Numbering
// ----------------

/**
 * Split body into numbered paragraphs.
 * Content blocks (regular text) are marked as isContent: true.
 * Non-content blocks (headings, images, HTML, code fences) are isContent: false.
 */
export function numberParagraphs(body: string): NumberedParagraph[] {
  const parts = body.split(/(\n\n+)/);
  const paragraphs: NumberedParagraph[] = [];

  let offset = 0;
  let index = 1;

  for (const part of parts) {
    // If it's a separator (matches \n\n+), just advance offset
    if (/^\n\n+$/.test(part)) {
      offset += part.length;
      continue;
    }

    const trimmed = part.trim();
    if (!trimmed) {
      offset += part.length;
      continue;
    }

    // This is a content block — find its exact position within the part
    const blockStart = offset + part.indexOf(trimmed);
    const isContent = isContentBlock(trimmed);

    paragraphs.push({
      index,
      text: trimmed,
      isContent,
      offset: blockStart,
    });

    index++;
    offset += part.length;
  }

  return paragraphs;
}

/**
 * Determine if a text block is regular content (paragraphs of prose)
 * vs structural elements (headings, code, images, HTML, etc.)
 */
function isContentBlock(text: string): boolean {
  // Headings
  if (/^#{1,6}\s/.test(text)) return false;

  // Images
  if (/^!\[/.test(text)) return false;

  // Code fences
  if (/^```/.test(text)) return false;

  // HTML blocks (components, divs, etc.)
  if (/^<[a-zA-Z]/.test(text)) return false;

  // Horizontal rules
  if (/^(---|\*\*\*|___)$/.test(text.trim())) return false;

  // Tables (lines starting with |)
  if (/^\|/.test(text)) return false;

  // Blockquotes
  if (/^>/.test(text)) return false;

  return true;
}

// ----------------
// File Loading
// ----------------

/**
 * Load all markdown files from a directory.
 * Returns parsed articles with frontmatter, body, and metadata.
 * Pass `options.lang` or a lang string as the second arg to load a blog locale dir.
 */
export async function loadMarkdownFiles(
  dir: string = BLOG_DIR,
  optionsOrLang?: LoadMarkdownOptions | string
): Promise<ParsedArticle[]> {
  let resolvedDir = dir;
  if (typeof optionsOrLang === "string") {
    resolvedDir = getBlogDir(optionsOrLang);
  } else if (optionsOrLang?.lang) {
    resolvedDir = getBlogDir(optionsOrLang.lang);
  }

  const absDir = path.resolve(resolvedDir);
  let entries: string[];

  try {
    entries = await fs.readdir(absDir);
  } catch {
    return [];
  }

  const mdFiles = entries.filter(
    (f) =>
      BLOG_EXTENSIONS.some((ext) => f.endsWith(ext)) &&
      !f.startsWith("example-")
  );

  const results = await Promise.all(
    mdFiles.map(async (file) => {
      const filePath = path.join(absDir, file);
      const rawContent = await fs.readFile(filePath, "utf-8");
      let frontmatter: Record<string, unknown>;
      let body: string;
      try {
        ({ frontmatter, body } = parseFrontmatter(rawContent));
      } catch (err) {
        console.warn(`⚠ Skipping ${file}: YAML parse error — ${(err as Error).message?.split("\n")[0]}`);
        return null;
      }

      // Skip drafts without titles
      if (!frontmatter.title) return null;

      const slug = file.replace(/\.mdx?$/, "");

      return {
        slug,
        filePath,
        frontmatter,
        body,
        rawContent,
      } as ParsedArticle;
    })
  );

  return results.filter(Boolean) as ParsedArticle[];
}

/**
 * Load all published blog posts for a locale (default: en).
 */
export async function loadBlogPosts(lang?: string): Promise<ParsedArticle[]> {
  return lang ? loadMarkdownFiles(BLOG_DIR, lang) : loadMarkdownFiles(BLOG_DIR);
}

// ----------------
// Content Hashing
// ----------------

/**
 * Compute SHA-256 hash of article body for drift detection.
 */
export function computeContentHash(body: string): string {
  return createHash("sha256").update(body).digest("hex");
}

// ----------------
// Excerpt Extraction
// ----------------

/**
 * Extract the first 2-3 content paragraphs from a body for context.
 */
export function extractExcerpt(body: string, maxParagraphs = 3): string {
  const paragraphs = numberParagraphs(body);
  const contentParagraphs = paragraphs.filter((p) => p.isContent);

  return contentParagraphs
    .slice(0, maxParagraphs)
    .map((p) => p.text)
    .join("\n\n");
}
