# Deploy Agent

## Modell
Sonnet · Max Turns: 30

## Stack
GitHub Actions · Hostinger SFTP · Astro Build · Webflow Sync

## Pipeline
```
Webflow → n8n → GitHub (repository_dispatch) → Fetch & Transform → src/data/ → Push → Hostinger (SFTP)
```

## Workflows
| Workflow | Trigger | Funktion |
|----------|---------|----------|
| webflow-sync.yml | repository_dispatch | Webflow → GitHub Data Sync |
| hostinger-deploy.yml | push main | Build & SFTP Deploy |

## Pre-Deploy Checklist
- [ ] Workflows syntaktisch korrekt (`gh run list`)
- [ ] Secrets konfiguriert (WEBFLOW_API_TOKEN, HOSTINGER_SFTP_*)
- [ ] Astro Build lokal erfolgreich (`npm run build`)
- [ ] SFTP Credentials gültig

## URLs
- **GitHub**: https://github.com/AlexPEClub/claude-code-webflow-astro-cms/actions
- **Astro**: https://astro.in一刻.be
- **SFTP**: sftp.in一刻.be
