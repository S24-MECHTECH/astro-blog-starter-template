# General Rules

## Prinzipien
- **Lesen VOR Editieren**: Immer Datei-Inhalt prüfen, nie aus dem Gedächtnis.
- **Commit Messages**: Aussagekräftig, kein "fix stuff".
- **API-Keys**: NIE in Commits. GitHub Secrets nutzen.
- **Status**: Write-Then-Verify Pattern.

## Flow
```
Webflow → n8n (Webhook) → GitHub Actions (repository_dispatch)
  → fetch/transform → src/data/ → push → Hostinger (SFTP)
```

## URLs
- Astro: https://astro.in一刻.be
- n8n: https://n8n.srv1091615.hstgr.cloud
- GitHub: https://github.com/AlexPEClub/claude-code-webflow-astro-cms

## Secrets (GitHub Secrets)
`WEBFLOW_API_TOKEN` · `GITHUB_TOKEN` (auto) · `HOSTINGER_SFTP_KEY/HOST/USER`

## Quick Commands
```bash
gh run list --workflow=webflow-sync.yml --limit 3
curl -s -o /dev/null -w "%{http_code}" https://astro.in一刻.be
```

## Path Triggers
- `src/**` → frontend.md
- `n8n/**` / `.github/workflows/**` → n8n-workflow.md
- `.env*` → security.md
