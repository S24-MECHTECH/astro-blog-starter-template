/**
 * Webflow CMS Sync API
 * Empfängt Daten von n8n und schreibt sie ins Webflow CMS
 */

export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const payload = await request.json();

    console.log('📥 Empfangen:', JSON.stringify(payload, null, 2));

    // Webflow API Config
    const WEBFLOW_TOKEN = 'b315849767498eab62aadd2a3f4d47cf7c40052cfaed19189a6b84ba7f8639c7';
    const COLLECTION_ID = '68d361b0271a5d106adb4d4a';

    const fieldData = payload.fieldData || payload;
    const slug = fieldData.slug || fieldData.name?.toLowerCase().replace(/\s+/g, '-');

    if (!fieldData.name || !slug) {
      return new Response(JSON.stringify({
        error: 'Pflichtfelder fehlen: name und slug erforderlich'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Format helpers
    const formatImage = (url) => {
      if (!url) return null;
      if (typeof url === 'object') return url;
      return { url };
    };

    const formatLink = (url) => {
      if (!url) return '';
      if (typeof url === 'string') return url;
      return url.url || url.href || '';
    };

    const formattedData = {
      name: fieldData.name,
      slug: slug,
      'seo-title': fieldData['seo-title'] || fieldData.seo_title || fieldData.name,
      'seo-description': fieldData['seo-description'] || fieldData.seo_description || '',
      'keyword-2': fieldData['keyword-2'] || fieldData.keyword || '',
      'keywords-2': fieldData['keywords-2'] || fieldData.keywords || '',
      'og-title-2': fieldData['og-title-2'] || fieldData.og_title || fieldData.name,
      'og-description-2': fieldData['og-description-2'] || fieldData.og_description || '',
      'og-image-3': formatImage(fieldData['og-image-3'] || fieldData.og_image),
      'og-url': formatLink(fieldData['og-url'] || fieldData.og_url),
      'og-type': fieldData['og-type'] || 'article',
      'og-locale': fieldData['og-locale'] || 'de_DE',
      'og-site-name': fieldData['og-site-name'] || 'S24 CMS',
      'og-slug': fieldData['og-slug'] || slug,
      'og-brand': fieldData['og-brand'] || fieldData.brand || '',
      'og-model': fieldData['og-model'] || fieldData.model || '',
      brand: fieldData.brand || '',
      model: fieldData.model || '',
      ean: fieldData.ean || '',
      price: fieldData.price || '',
      currency: fieldData.currency || 'EUR',
      tax: fieldData.tax || '',
      categories: fieldData.categories || '',
      shipping: fieldData.shipping || '',
      'hero-ready': fieldData['hero-ready'] === true,
      'hero-img-2': formatImage(fieldData['hero-img-2'] || fieldData.hero_img),
      'hero-heading-2': fieldData['hero-heading-2'] || fieldData.hero_heading || '',
      'hero-subheading-2': fieldData['hero-subheading-2'] || fieldData.hero_subheading || '',
      'hero-cta-url': formatLink(fieldData['hero-cta-url'] || fieldData.hero_cta_url),
      'hero-cta-text': fieldData['hero-cta-text'] || 'Mehr erfahren',
      'content-article': fieldData['content-article'] || fieldData.content_article || '',
      'faq-section': fieldData['faq-section'] || fieldData.faq_section || '',
      'banner-image': formatImage(fieldData['banner-image'] || fieldData.banner_image),
      'banner-url': formatLink(fieldData['banner-url'] || fieldData.banner_url),
      'banner-text-2': fieldData['banner-text-2'] || '',
      'logo-img-2': formatImage(fieldData['logo-img-2'] || fieldData.logo_img),
      'logo-url-3': formatLink(fieldData['logo-url-3'] || fieldData.logo_url),
      'article-image': formatImage(fieldData['article-image'] || fieldData.article_image),
      'footer-img': formatImage(fieldData['footer-img'] || fieldData.footer_img),
      'footer-url': formatLink(fieldData['footer-url'] || fieldData.footer_url),
      'footer-text': fieldData['footer-text'] || '',
    };

    const webflowResponse = await fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [{ fieldData: formattedData }] })
      }
    );

    const result = await webflowResponse.json();

    if (!webflowResponse.ok) {
      return new Response(JSON.stringify({
        error: 'Webflow API Fehler',
        details: result
      }), { status: webflowResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true,
      itemId: result.items?.[0]?.id,
      fields: { name: formattedData.name, slug: formattedData.slug }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
