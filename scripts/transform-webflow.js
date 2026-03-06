// Webflow to Astro Data Transformer
const fs = require('fs');
const path = require('path');

function transformWebflowData(inputFile, outputDir) {
  const rawData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  const articles = (rawData.items || []).map(item => {
    const fd = item.fieldData;
    const slug = fd.slug || (fd.name || 'unnamed')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    return {
      id: item.id,
      _rawId: item.id,
      slug: slug,
      name: fd.name || '',
      title: fd['seo-title'] || fd.name || '',
      description: fd['seo-description'] || fd.description || '',
      content: fd['content-article'] || '',
      faq: fd['faq-section'] || '',
      hero: {
        heading: fd['hero-heading-2'] || '',
        subheading: fd['hero-subheading-2'] || '',
        banner: fd['hero-banner'] || '',
        ready: fd['hero-ready'] || false,
        ctaText: fd['hero-cta-text'] || 'Jetzt kaufen',
        ctaUrl: fd['hero-cta-url'] || 'https://www.siliconedolls24.com'
      },
      seo: {
        title: fd['seo-title'] || fd.name || '',
        description: fd['seo-description'] || '',
        ogTitle: fd['og-title-2'] || fd['seo-title'] || fd.name || '',
        ogDescription: fd['og-description-2'] || fd['seo-description'] || '',
        ogImage: fd['og-image-3'] || '',
        ogType: fd['og-type'] || 'website',
        ogLocale: fd['og-locale'] || 'de_DE',
        ogUrl: fd['og-url'] || '',
        ogSiteName: fd['og-site-name'] || 'SiliconeDolls24'
      },
      product: {
        brand: fd.brand || '',
        model: fd.model || '',
        ean: fd.ean || '',
        price: fd.price || '0',
        currency: fd.currency || 'EUR',
        description: fd.description || ''
      },
      createdAt: item.createdOn,
      updatedAt: item.lastUpdated,
      publishedAt: item.lastPublished,
      isDraft: item.isDraft
    };
  });
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write combined articles file
  fs.writeFileSync(
    path.join(outputDir, 'articles.json'),
    JSON.stringify(articles, null, 2)
  );
  
  // Write individual article files
  articles.forEach(article => {
    fs.writeFileSync(
      path.join(outputDir, `${article.slug}.json`),
      JSON.stringify(article, null, 2)
    );
  });
  
  // Write metadata
  const metadata = {
    total: articles.length,
    lastSync: new Date().toISOString(),
    collectionId: '68d361b0271a5d106adb4d4a'
  };
  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`✅ Transformed ${articles.length} articles`);
  return articles;
}

// Run if called directly
if (require.main === module) {
  const inputFile = process.argv[2] || 'src/data/webflow-items.json';
  const outputDir = process.argv[3] || 'src/data';
  transformWebflowData(inputFile, outputDir);
}

module.exports = { transformWebflowData };
