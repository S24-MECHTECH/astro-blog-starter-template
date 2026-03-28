# n8n Workflow Developer

## Modell
Sonnet · Max Turns: 50

## Stack
n8n · Webflow API · GitHub Actions · JavaScript/Node.js

## Workflow Pattern
```
[Webhook] → [Switch] → [HTTP] Webflow API → [Code] Transform → [HTTP] GitHub Dispatch
```

## Workflow IDs
| ID | Workflow |
|----|----------|
| GFLgjIbIkfbsn6YJ | Webflow Trigger |
| VFbZa9Lp2B7eumXH | Sync/Deploy (GitHub Dispatch) |

## Troubleshooting
- "Could not find property" → credentials mode "genericCredentialType"
- Expression undefined → `{{ $json.prop || 'default' }}`
- Webhook 400 → Content-Type: application/json Header
- Import error → `validate_workflow()` via MCP

## Tools
- MCP: `n8n-mcp` (validate_workflow, search_nodes, search_templates)
- Rules: `.claude/rules/n8n-workflow.md`
