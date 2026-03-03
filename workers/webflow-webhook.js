/**
 * Webflow CMS Sync Worker
 * Empfängt Daten von n8n und schreibt sie ins Webflow CMS
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', { headers: corsHeaders })
  }

  // Nur POST Requests erlauben
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Nur POST erlaubt',
      method: request.method
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  try {
    // Request Body lesen
    const payload = await request.json()

    console.log('Empfangen:', JSON.stringify(payload, null, 2))

    // Webflow API Config - aus Environment Variable
    const WEBFLOW_TOKEN = env.WEBFLOW_API_TOKEN || 'cb07f5cf4719b948ffe39b9a60de5ac10baf34968992975fae2e6f61efef5e2e'
    const COLLECTION_ID = '68d361b0271a5d106adb4d4a'

    // Prüfen ob action vorhanden
    const action = payload.action || 'create'
    const fieldData = payload.fieldData || payload

    // Pflichtfelder prüfen
    if (!fieldData.name || !fieldData.slug) {
      return new Response(JSON.stringify({
        error: 'Pflichtfelder fehlen: name und slug erforderlich'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Bild-URLs formatieren
    const formatImage = (url) => {
      if (!url) return null
      if (typeof url === 'object') return url
      return { url: url }
    }

    // Link-URLs formatieren
    const formatLink = (url) => {
      if (!url) return ''
      if (typeof url === 'string') return url
      return url.url || url.href || ''
    }

    // Feld Daten formatieren
    const formattedData = {
      name: fieldData.name,
      slug: fieldData.slug,
      'seo-title': fieldData['seo-title'] || fieldData.seo_title || fieldData.name,
      'seo-description': fieldData['seo-description'] || fieldData.seo_description || '',
      'keyword-2': fieldData['keyword-2'] || fieldData.keyword || '',
      'keywords-2': fieldData['keywords-2'] || fieldData.keywords || '',
      'og-title-2': fieldData['og-title-2'] || fieldData.og_title || fieldData.name,
      'og-description-2': fieldData['og-description-2'] || fieldData.og_description || fieldData['seo-description'] || '',
      'og-image-3': formatImage(fieldData['og-image-3'] || fieldData.og_image),
      'og-url': formatLink(fieldData['og-url'] || fieldData.og_url),
      'og-type': fieldData['og-type'] || fieldData.og_type || 'article',
      'og-locale': fieldData['og-locale'] || fieldData.og_locale || 'de_DE',
      'og-site-name': fieldData['og-site-name'] || fieldData.og_site_name || 'S24 CMS Content Side',
      'og-slug': fieldData['og-slug'] || fieldData.og_slug || fieldData.slug,
      brand: fieldData.brand || '',
      model: fieldData.model || '',
      ean: fieldData.ean || '',
      price: fieldData.price || '',
      currency: fieldData.currency || 'EUR',
      'hero-ready': fieldData['hero-ready'] === true || fieldData['hero-ready'] === 'true',
      'hero-img-2': formatImage(fieldData['hero-img-2'] || fieldData.hero_img),
      'hero-heading-2': fieldData['hero-heading-2'] || fieldData.hero_heading || '',
      'hero-subheading-2': fieldData['hero-subheading-2'] || fieldData.hero_subheading || '',
      'hero-cta-url': formatLink(fieldData['hero-cta-url'] || fieldData.hero_cta_url),
      'hero-cta-text': fieldData['hero-cta-text'] || fieldData.hero_cta_text || 'Mehr erfahren',
      'content-article': fieldData['content-article'] || fieldData.content_article || '',
      'faq-section': fieldData['faq-section'] || fieldData.faq_section || '',
    }

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
    )

    const result = await webflowResponse.json()

    if (!webflowResponse.ok) {
      return new Response(JSON.stringify({
        error: 'Webflow API Fehler',
        details: result,
        status: webflowResponse.status
      }), {
        status: webflowResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const itemId = result.items?.[0]?.id

    return new Response(JSON.stringify({
      success: true,
      action: action,
      itemId: itemId,
      message: itemId ? 'Item erstellt!' : 'Item aktualisiert!',
      fields: {
        name: formattedData.name,
        slug: formattedData.slug
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('Error:', error.message)

    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}
