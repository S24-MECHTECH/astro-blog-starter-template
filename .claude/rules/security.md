# Security Rules

## Secrets Checklist
- [ ] Keine API-Keys in Commits
- [ ] `.env*` in `.gitignore`
- [ ] n8n Credentials verschlüsselt
- [ ] GitHub Secrets korrekt konfiguriert

## Input Validation (Webflow Webhook)
```javascript
const { collection, itemId } = $input.first().json;
if (!collection || !itemId) throw new Error('Invalid webhook payload');
```

## User Input Sanitization
```javascript
const slug = input.toLowerCase().replace(/[^a-z0-9-]/g,'-').substring(0,100);
```

## GitHub Actions Secrets
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  WEBFLOW_API_TOKEN: ${{ secrets.WEBFLOW_API_TOKEN }}
  HOSTINGER_SFTP_KEY: ${{ secrets.HOSTINGER_SFTP_KEY }}
  HOSTINGER_SFTP_HOST: ${{ secrets.HOSTINGER_SFTP_HOST }}
  HOSTINGER_SFTP_USER: ${{ secrets.HOSTINGER_SFTP_USER }}
```

## Security Headers (Astro middleware.ts)
```typescript
export const onRequest = ({ locals }, next) => {
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
};
```

## Path Triggers
`.env*` · `n8n/workflows/**` · `.github/workflows/**`
