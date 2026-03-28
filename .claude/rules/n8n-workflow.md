# n8n Workflow Rules

## Flow
```
[Webhook Trigger] → [Switch] → [HTTP] Webflow API → [Code] Transform → [HTTP] GitHub Dispatch
```

## Workflow IDs
| ID | Workflow | Trigger |
|----|----------|---------|
| GFLgjIbIkfbsn6YJ | Webflow Trigger | Webhook |
| VFbZa9Lp2B7eumXH | Sync/Deploy | GitHub Dispatch |

## Code Node JS Pattern
```javascript
const all = $input.all();
return all.map(item => ({ json: {
  slug: item.json.slug || item.json.name?.toLowerCase().replace(/\s+/g,'-'),
  title: item.json.name,
  content: item.json['post-body'] || item.json.body || '',
  _meta: { webflowId: item.json._id, lastModified: item.json['updated-at'] }
}}));
```

## HTTP Node – GitHub Dispatch
```json
{
  "method": "POST",
  "url": "=https://api.github.com/repos/{{ $env.GH_OWNER }}/{{ $env.GH_REPO }}/dispatches",
  "headerParameters": [{ "name": "Authorization", "value": "=Bearer {{ $env.GITHUB_TOKEN }}" }],
  "bodyJson": { "event_type": "webflow-update", "client_payload": { "collection": "={{ $json.collection }}", "itemId": "={{ $json.itemId }}" } }
}
```

## Super Skills (bei Bedarf)
`/n8n-code-javascript` · `/n8n-expression-syntax` · `/n8n-mcp-tools-expert`

## Troubleshooting
- "Could not find property" → credentials mode "genericCredentialType"
- Expression undefined → `{{ $json.prop || 'default' }}`
- Webhook 400 → Content-Type: application/json Header prüfen

## Path Triggers
`n8n/workflows/**` · `.github/workflows/**` · `scripts/*.js`
