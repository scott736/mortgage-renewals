// ============================================
// Mortgage Renewal Hub Automation — Type Definitions
// ============================================
// Renewal-native categories & clusters (not LendCity investor taxonomy).

export type Category =
  | "renewal-process"
  | "switch-vs-stay"
  | "rates-and-payments"
  | "checklist-and-docs"
  | "qualification-and-rules"
  | "tools-and-calculators"
  | "life-situations"
  | "lenders-and-provinces";

/**
 * Spoke-level topic clusters for hub-and-spoke linking.
 * Guide hubs → blog news / situation pages → book-a-call.
 */
export type TopicCluster =
  | "renewal-basics"
  | "first-renewal"
  | "subsequent-renewal"
  | "switch-mechanics"
  | "stress-test-osfi"
  | "rate-environment"
  | "payment-shock"
  | "fixed-vs-variable"
  | "renewal-checklist"
  | "renewal-timeline"
  | "penalty-and-break"
  | "refinance-vs-renew"
  | "calculator-tools"
  | "bank-lender-renewal"
  | "provincial-renewal"
  | "situation-renewal"
  | "broker-help";

export type FunnelStage = "awareness" | "consideration" | "decision";

/** Who the page serves — Canadian homeowners at renewal. */
export type TargetPersona =
  | "first-time-renewer"
  | "repeat-renewer"
  | "rate-shopper"
  | "switcher"
  | "payment-stressed"
  | "special-situation";

export type Region = "canada" | "ontario" | "bc" | "alberta" | "quebec" | "other";

export type Priority = "low" | "normal" | "high";
export type QueueStatus = "ready" | "merged" | "hold";
export type QueueRegion = "canada";

export type ArticleSource = "manual" | "news" | "import";

// ----------------
// Blog Post
// ----------------

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
  authorImage?: string;
  authorName?: string;
  category?: Category;
  tags: string[];
  keyTerms?: string[];

  topicCluster?: TopicCluster;
  funnelStage?: FunnelStage;
  targetPersona?: TargetPersona;
  region?: Region;
  extractedKeywords?: string[];
  contentSummary?: string;
  qualityScore?: number;
  isPillar?: boolean;
  isEvergreen?: boolean;
  seasonalRelevance?: string[];
  semanticThemes?: string[];
  linkableTopics?: string[];
  idealIncomingAnchors?: string[];
  focusKeyphrase?: string;

  enrichedAt?: string;
  metaGeneratedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
  filePath: string;
}

// ----------------
// Queue Article
// ----------------

export interface QueueArticleFrontmatter {
  title: string;
  description?: string;
  category?: Category;
  tags?: string[];
  queuedAt: Date;
  status?: QueueStatus;
  region?: QueueRegion;
  priority?: Priority;
  topicCluster?: TopicCluster;
}

export interface QueueArticle {
  slug: string;
  frontmatter: QueueArticleFrontmatter;
  content: string;
  filePath: string;
}

// ----------------
// CLI
// ----------------

export interface CLIOptions {
  feature?: string;
  mode?: string;
  slug?: string;
  file?: string;
  episodeId?: string;
  shareUrl?: string;
  showId?: string;
  useApi?: boolean;
  all?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  concurrency?: number;
  model?: string;
  highConfidenceOnly?: boolean;
  rerank?: boolean;
  force?: boolean;
  skipExisting?: boolean;
  category?: string;
  noApi?: boolean;
  /** Fail quality-score when grade is D/F. */
  strict?: boolean;
  locale?: string;
  collection?: string;
  threshold?: number;
  maxPosts?: number;
  competitor?: string;
  keywords?: string;
  url?: string;
  prompt?: string;
  to?: string;
  baselineDate?: string;
  count?: number;
  confirmSend?: boolean;
  edition?: string;
  subject?: string;
  htmlFile?: string;
  preserveCta?: boolean;
}

// ----------------
// Automation config shape (minimal stub for config.json)
// ----------------

export interface AutomationConfig {
  scheduler?: {
    publishFrequency?: number;
    publishTime?: string;
    minScheduledPosts?: number;
    defaultCategory?: Category;
    shuffleQueue?: boolean;
  };
  podcast?: Record<string, unknown>;
  images?: {
    maxWidth?: number;
    quality?: number;
    format?: string;
  };
}

// Linker / enrichment report helpers still referenced by shared code
export interface EnrichmentStats {
  topicClusters: TopicCluster[];
  clusterDistribution: Partial<Record<TopicCluster, number>>;
}

export interface ContentPlanItem {
  category: Category;
  topicCluster?: TopicCluster;
  title?: string;
}

export interface ShowMappingEntry {
  category: Category;
  defaultPersona: TargetPersona;
  defaultCluster: TopicCluster;
  autoPublish?: boolean;
}
