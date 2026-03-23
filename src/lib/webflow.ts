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
    isDraft: Boolean(fieldData['hero-ready'] === false),
    lastUpdated: String(raw.lastUpdated || ''),
  };
}

// Get all published items (hero-ready = false means NOT ready = draft)
// hero-ready: false = draft, hero-ready: true = published
export function getAllItems(): WebflowItem[] {
  const rawItems = webflowData.items as Record<string, unknown>[];
  return rawItems.map(normalizeItem);
}

// Get only published items (hero-ready === true)
export function getPublishedItems(): WebflowItem[] {
  return getAllItems().filter(item => item.isDraft === false && item.slug);
}

// Get item by slug
export function getItemBySlug(slug: string): WebflowItem | undefined {
  return getAllItems().find(item => item.slug === slug);
}

// Get first published item (for homepage hero)
export function getFirstPublishedItem(): WebflowItem | undefined {
  const published = getPublishedItems();
  return published.length > 0 ? published[0] : getAllItems()[0];
}
