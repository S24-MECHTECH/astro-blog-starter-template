# Astro Deployment Setup Guide

## Status: Astro Build ✅ Working | Deployment ❌ Missing Secrets

### Diagnosed Issue
```
##[error]Input required and not supplied: apiToken
```
The GitHub Actions workflow builds Astro perfectly but fails at deployment because required secrets are not configured.

---

## STEP 1: Configure GitHub Actions Secrets

Go to: **https://github.com/S24-MECHTECH/astro-blog-starter-template/settings/secrets/actions**

Add these secrets:

### A. Cloudflare Pages (required for `deploy-cloudflare` job)

| Secret Name | Value | Where to get |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | https://dash.cloudflare.com → Profile → API Tokens → Create Token |

**Cloudflare Token Setup:**
1. Go to https://dash.cloudflare.com
2. Profile → API Tokens
3. Create Token → **Account-level: Cloudflare Pages: Edit** (or Edit Cloudflare Workers)
4. Copy the token and add as `CLOUDFLARE_API_TOKEN`

> **Note:** `CLOUDFLARE_ACCOUNT_ID` is now hardcoded in the workflow — no secret needed for this.

### B. Hostinger SFTP (required for `deploy-hostinger-realdollz` and `deploy-hostinger-realdollz-cloud` jobs)

| Secret Name | Value | Where to get |
|---|---|---|
| `SSH_PRIVATE_KEY` | Private SSH key | Hostinger hPanel → SSH Access |
| `HOSTINGER_SFTP_HOST` | `server1.hostinger.com` | Hostinger hPanel → Hosting → Advanced → SSH |
| `HOSTINGER_SFTP_PORT` | `22` (or custom port) | Check Hostinger SSH settings |
| `HOSTINGER_SFTP_USER` | `u781914439` | Username from Hostinger |

**Hostinger SSH Key Setup:**
1. Log into Hostinger hPanel
2. Hosting → Advanced → SSH Access
3. Generate SSH key or use existing key
4. The public key must be added to Hostinger
5. Add private key content as `SSH_PRIVATE_KEY` (including `-----BEGIN OPENSSH PRIVATE KEY-----`)

---

## STEP 2: Verify Secrets After Adding

After adding secrets, go to Actions tab and trigger a workflow run:
https://github.com/S24-MECHTECH/astro-blog-starter-template/actions

Click "Deploy Astro to Hostinger & Cloudflare" → "Run workflow" → check if all 3 jobs succeed.

---

## Current Build Output (Working ✅)

```
src/pages/about.astro            → /about/index.html
src/pages/blog/index.astro       → /blog/index.html
src/pages/blog/[...slug].astro   → /blog/*.html (5 pages)
src/pages/[slug].astro          → /*.html (5 pages from Webflow CMS)
src/pages/index.astro            → /index.html
/rss.xml
/sitemap-index.xml
```

## Workflow Architecture

```
deploy-astro.yml (3 parallel jobs):
├── deploy-hostinger-realdollz      → realdollz.de via SFTP
├── deploy-hostinger-realdollz-cloud → realdollz.cloud via SFTP
└── deploy-cloudflare              → s24-cms-content-site via Cloudflare Pages

webflow-sync.yml:
├── Fetches Webflow CMS items
├── Saves to src/data/webflow-items.json
└── Triggers deploy-astro.yml
```

## Repository Info

- **Repo**: https://github.com/S24-MECHTECH/astro-blog-starter-template
- **Build**: Astro v5 with @astrojs/cloudflare adapter
- **Last Build**: 2026-03-28T16:51 (succeeded ✅)
- **Sync Bot**: Webflow Sync Bot commits every ~15 minutes
