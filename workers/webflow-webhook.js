/**
 * Webflow CMS Sync Worker
 * Empfängt Daten von n8n und schreibt sie ins Webflow CMS
 */

export default {
  async fetch(request, env, ctx) {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response('', { headers: corsHeaders });
    }

    // Nur POST Requests erlauben
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Nur POST erlaubt',
        method: request.method
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      // Request Body lesen
      const payload = await request.json();

      console.log('📥 Empfangen:', JSON.stringify(payload, null, 2));

      // Webflow API Config - Token aus Environment Variable
      const WEBFLOW_TOKEN = env.WEBFLOW_API_TOKEN;
      const COLLECTION_ID = '68d361b0271a5d106adb4d4a';
      const SITE_ID = '68d2fd81a3e41128755efbe7';

      // Token Prüfung
      if (!WEBFLOW_TOKEN) {
        return new Response(JSON.stringify({
          error: 'WEBFLOW_API_TOKEN nicht konfiguriert'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Prüfen ob action vorhanden
      const action = payload.action || 'create';
      const fieldData = payload.fieldData || payload;

      // Pflichtfelder prüfen
      if (!fieldData.name || !fieldData.slug) {
        return new Response(JSON.stringify({
          error: 'Pflichtfelder fehlen: name und slug erforderlich',
          received: fieldData
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Bild-URLs formatieren (Image Fields)
      const formatImage = (url) => {
        if (!url) return null;
        if (typeof url === 'object') return url;
        return { url: url };
      };

      // Link-URLs formatieren (Link Fields) - MUSS String sein!
      const formatLink = (url) => {
        if (!url) return '';
        if (typeof url === 'string') return url;
        return url.url || url.href || '';
      };

      // Feld Daten formatieren
      const formattedData = {
        name: fieldData.name,
        slug: fieldData.slug,
        'seo-title': fieldData['seo-title'] || fieldData.seo_title || fieldData.name,
        'seo-description': fieldData['seo-description'] || fieldData.seo_description || '',
        'keyword-2': fieldData['keyword-2'] || fieldData.keyword || '',
        'keywords-2': fieldData['keywords-2'] || fieldData.keywords || '',

        // Open Graph
        'og-title-2': fieldData['og-title-2'] || fieldData.og_title || fieldData.name,
        'og-description-2': fieldData['og-description-2'] || fieldData.og_description || fieldData['seo-description'] || '',
        'og-image-3': formatImage(fieldData['og-image-3'] || fieldData.og_image),
        'og-url': formatLink(fieldData['og-url'] || fieldData.og_url),
        'og-type': fieldData['og-type'] || fieldData.og_type || 'article',
        'og-locale': fieldData['og-locale'] || fieldData.og_locale || 'de_DE',
        'og-site-name': fieldData['og-site-name'] || fieldData.og_site_name || 'S24 CMS Content Side',
        'og-slug': fieldData['og-slug'] || fieldData.og_slug || fieldData.slug,
        'og-brand': fieldData['og-brand'] || fieldData.og_brand || fieldData.brand || '',
        'og-model': fieldData['og-model'] || fieldData.og_model || fieldData.model || '',

        // Product
        brand: fieldData.brand || '',
        model: fieldData.model || '',
        ean: fieldData.ean || '',
        price: fieldData.price || '',
        currency: fieldData.currency || 'EUR',
        tax: fieldData.tax || '',
        categories: fieldData.categories || fieldData.category || '',
        shipping: fieldData.shipping || '',

        // Hero
        'hero-ready': fieldData['hero-ready'] === true || fieldData['hero-ready'] === 'true',
        'hero-img-2': formatImage(fieldData['hero-img-2'] || fieldData.hero_img),
        'hero-heading-2': fieldData['hero-heading-2'] || fieldData.hero_heading || '',
        'hero-subheading-2': fieldData['hero-subheading-2'] || fieldData.hero_subheading || '',
        'hero-cta-url': formatLink(fieldData['hero-cta-url'] || fieldData.hero_cta_url),
        'hero-cta-text': fieldData['hero-cta-text'] || fieldData.hero_cta_text || 'Mehr erfahren',

        // Content
        'content-article': fieldData['content-article'] || fieldData.content_article || '',
        'faq-section': fieldData['faq-section'] || fieldData.faq_section || '',

        // Images
        'banner-image': formatImage(fieldData['banner-image'] || fieldData.banner_image),
        'banner-url': formatLink(fieldData['banner-url'] || fieldData.banner_url),
        'banner-text-2': fieldData['banner-text-2'] || fieldData.banner_text || '',
        'logo-img-2': formatImage(fieldData['logo-img-2'] || fieldData.logo_img),
        'logo-url-3': formatLink(fieldData['logo-url-3'] || fieldData.logo_url),
        'article-image': formatImage(fieldData['article-image'] || fieldData.article_image),

        // Footer
        'footer-img': formatImage(fieldData['footer-img'] || fieldData.footer_img),
        'footer-url': formatLink(fieldData['footer-url'] || fieldData.footer_url),
        'footer-text': fieldData['footer-text'] || fieldData.footer_text || '',
      };

      // An Webflow API senden
      const webflowResponse = await fetch(
        `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              fieldData: formattedData
            }]
          })
        }
      );

      const result = await webflowResponse.json();

      console.log('📤 Webflow Response:', JSON.stringify(result, null, 2));

      if (!webflowResponse.ok) {
        return new Response(JSON.stringify({
          error: 'Webflow API Fehler',
          details: result,
          status: webflowResponse.status
        }), {
          status: webflowResponse.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Erfolgreich!
      const itemId = result.items?.[0]?.id;

      return new Response(JSON.stringify({
        success: true,
        action: action,
        itemId: itemId,
        item: result.items?.[0],
        message: itemId ? 'Item erstellt!' : 'Item aktualisiert!',
        fields: {
          name: formattedData.name,
          slug: formattedData.slug,
          brand: formattedData.brand,
          model: formattedData.model
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      console.error('❌ Error:', error.message);

      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
