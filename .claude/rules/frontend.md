# Frontend Rules (Astro)

## Page Pattern
```astro
---
import Layout from '../layouts/Layout.astro';
import { getCollection } from '../lib/webflow';
const posts = await getCollection('posts');
---
<Layout title="Titel">
  {posts.map(post => (
    <article>
      <h2>{post.data.title}</h2>
      <Fragment set:html={post.data.content} />
    </article>
  ))}
</Layout>
```

## Dynamic Routing
```astro
---
export async function getStaticPaths() {
  const posts = await fetchWebflowPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

## Webflow Data Structure
```typescript
interface WebflowItem {
  _id: string; slug: string; name: string;
  'post-body': string; 'published-on': string;
  _meta: { webflowId: string; lastModified: string; }
}
```

## Component Structure
```
src/
├── components/   # Astro Components
├── layouts/      # Layouts
├── pages/        # [slug].astro, index.astro
├── lib/webflow.ts
└── data/         # Webflow-sync generiert
```

## Build
```bash
npm run build   # Astro build
npm run dev     # Dev: http://localhost:4321
```

## Path Triggers
`src/components/**` · `src/pages/**` · `src/lib/**` · `astro.config.*`
