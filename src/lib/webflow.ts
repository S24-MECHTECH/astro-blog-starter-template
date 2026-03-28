// Webflow CMS data loader
// Loads from static JSON synced by n8n workflow
import webflowData from '../data/webflow-items.json';

export interface WebflowItem {
  id: string;
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  heroCtaUrl: string;
  heroBanner: string;
  description: string;
  contentArticle: string;
  faqSection: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  footerText: string;
  isDraft: boolean;
  lastUpdated: string;

  // Neue SEO Felder (erweitert)
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoRobots?: string;
  seoPriority?: number;
  seoChangeFreq?: string;
  articleAuthor?: string;
  articlePublished?: string;
  articleSection?: string;
  articleTag?: string;
  schemaType?: string;
  schemaName?: string;
  twitterCard?: string;
  twitterCreator?: string;
  facebookAppId?: string;
  breadcrumbParent?: string;
  breadcrumbOrder?: number;
}

// Helper to safely extract string from Webflow field (handles both string and {url} objects)
function extractString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'url' in (value as Record<string, unknown>)) {
    return String((value as { url: string }).url);
  }
  return '';
}

// Normalize Webflow item to our interface
function normalizeItem(raw: Record<string, unknown>): WebflowItem {
  const fieldData = (raw.fieldData || {}) as Record<string, unknown>;
  // hero-ready: true = published, hero-ready: false = draft
  const heroReady = fieldData['hero-ready'];
  return {
    id: String(raw.id || ''),
    slug: extractString(fieldData.slug) || extractString(fieldData['slug']),
    name: extractString(fieldData.name),
    seoTitle: extractString(fieldData['seo-title']),
    seoDescription: extractString(fieldData['seo-description']),
    heroHeading: extractString(fieldData['hero-heading-2']),
    heroSubheading: extractString(fieldData['hero-subheading-2']),
    heroCtaText: extractString(fieldData['hero-cta-text']),
    heroCtaUrl: extractString(fieldData['hero-cta-url']),
    heroBanner: extractString(fieldData['hero-banner']),
    description: extractString(fieldData.description),
    contentArticle: extractString(fieldData['content-article']),
    faqSection: extractString(fieldData['faq-section']),
    ogTitle: extractString(fieldData['og-title-2']),
    ogDescription: extractString(fieldData['og-description-2']),
    ogImage: extractString(fieldData['og-image-3']),
    footerText: extractString(fieldData['footer-text']),
    // hero-ready === true → published (not draft)
    isDraft: heroReady !== true,
    lastUpdated: String(raw.lastUpdated || ''),

    // Neue SEO Felder (optional)
    seoKeywords: extractString(fieldData['seo-keywords']),
    seoCanonicalUrl: extractString(fieldData['seo-canonical-url']),
    seoRobots: extractString(fieldData['seo-robots']),
    seoPriority: Number(fieldData['seo-priority']) || undefined,
    seoChangeFreq: extractString(fieldData['seo-changefreq']),
    articleAuthor: extractString(fieldData['article-author']),
    articlePublished: extractString(fieldData['article-published']),
    articleSection: extractString(fieldData['article-section']),
    articleTag: extractString(fieldData['article-tag']),
    schemaType: extractString(fieldData['schema-type']),
    schemaName: extractString(fieldData['schema-name']),
    twitterCard: extractString(fieldData['twitter-card']),
    twitterCreator: extractString(fieldData['twitter-creator']),
    facebookAppId: extractString(fieldData['facebook-app-id']),
    breadcrumbParent: extractString(fieldData['breadcrumb-parent']),
    breadcrumbOrder: Number(fieldData['breadcrumb-order']) || undefined,
  };
}

// Get all CMS items
export function getAllItems(): WebflowItem[] {
  const rawItems = webflowData.items as Record<string, unknown>[];
  return rawItems.map(normalizeItem);
}

// Get only published items (hero-ready === true)
export function getPublishedItems(): WebflowItem[] {
  return getAllItems().filter(item => !item.isDraft && item.slug);
}

// Get item by slug
export function getItemBySlug(slug: string): WebflowItem | undefined {
  return getAllItems().find(item => item.slug === slug);
}

// Get first published item (for homepage hero)
export function getFirstPublishedItem(): WebflowItem | undefined {
  const published = getPublishedItems();
  return published.length > 0 ? published[0] : undefined;
}
