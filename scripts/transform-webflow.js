/**
 * Webflow to Astro Content Transformer
 * Converts Webflow CMS items to Astro content format
 */

import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2];
const outputDir = process.argv[3];

if (!inputFile || !outputDir) {
  console.error('Usage: node transform-webflow.js <input-file> <output-dir>');
  process.exit(1);
}

// Read Webflow data
const webflowData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const items = webflowData.items || [];

console.log(`Processing ${items.length} items from Webflow...`);

// Transform each item to Astro markdown/content
items.forEach(item => {
  const { slug, name, 'publish-date': publishDate, 'seo-title': seoTitle, 'seo-description': seoDescription, content } = item.fieldData;
  
  if (!slug || !name) {
    console.warn(`Skipping item without slug or name: ${JSON.stringify(item.fieldData)}`);
    return;
  }
  
  // Create frontmatter
  const frontmatter = `---
title: "${name.replace(/"/g, '\\"')}"
date: ${publishDate ? new Date(publishDate).toISOString() : new Date().toISOString()}
description: "${(seoDescription || '').replace(/"/g, '\\"')}"
slug: "${slug}"
---

${content || ''}
`;
  
  // Write to file
  const outputPath = path.join(outputDir, 'posts', `${slug}.md`);
  const postsDir = path.join(outputDir, 'posts');
  
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, frontmatter);
  console.log(`Created: ${outputPath}`);
});

console.log(`Successfully processed ${items.length} items!`);
