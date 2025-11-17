# Cache Revalidation Guide

> **🚀 NEW: Advanced Dual-Layer Revalidation System**
>
> This project now has an advanced revalidation system with database triggers + Payload hooks.
> For complete documentation, see [REVALIDATION_SETUP.md](./REVALIDATION_SETUP.md)

## Overview
The services pages use ISR (Incremental Static Regeneration) with a 60-second revalidation period. This means:
- Pages are fast (pre-built static HTML)
- Content updates automatically every 60 seconds
- **NEW**: Instant cache clearing happens automatically via database triggers
- You can also manually trigger cache clearing

## Automatic Revalidation

### Background Revalidation (60 seconds)
Pages automatically revalidate every 60 seconds. If you update content, changes will appear within 1 minute.

### Instant Revalidation (NEW! ⚡)
The system now has **dual-layer automatic revalidation**:

1. **Payload Hooks** - When you edit content in Payload CMS
2. **Database Triggers** - When content changes from ANY source (direct DB edits, scripts, etc.)

This means cache updates are **instant** regardless of how you modify the data!

## Manual Revalidation

### Setup (One-time)
1. Add this environment variable to Vercel:
   ```
   REVALIDATION_SECRET=your-secret-token-here
   ```
   (Generate a secure random string, e.g., `openssl rand -hex 32`)

### Clear Cache with Smart Detection (NEW!)
```bash
# Using collection + slug (recommended)
curl -X POST 'https://lakeridepros-website.vercel.app/api/revalidate?secret=YOUR_SECRET' \
  -H "Content-Type: application/json" \
  -d '{"collection":"services","slug":"wedding-transportation"}'

# This automatically revalidates:
# - /services/wedding-transportation
# - /services
# - /
# - /sitemap.xml
```

### Clear Cache for Specific Path
```bash
curl -X POST 'https://lakeridepros-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/services/wedding-transportation'
```

### Clear Cache for All Services
```bash
curl -X POST 'https://lakeridepros-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/services'
```

### Clear Homepage Cache
```bash
curl -X POST 'https://lakeridepros-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/'
```

## How It Works

The advanced system uses **two layers** for maximum reliability:

1. **Database Triggers** (PostgreSQL/Supabase)
   - Fires on ANY database change
   - Works with direct SQL edits, scripts, external tools
   - Calls revalidation API via HTTP

2. **Payload Hooks** (Application Layer)
   - Fires when content saved in Payload CMS
   - Provides application-level control
   - Backup layer if database triggers fail

See [REVALIDATION_SETUP.md](./REVALIDATION_SETUP.md) for full details.

## Troubleshooting

### "Invalid secret" error
- Make sure `REVALIDATION_SECRET` environment variable is set in Vercel
- Verify you're using the correct secret in the API call
- Redeploy after adding the environment variable

### Changes still not showing
- Wait 60 seconds for automatic revalidation
- Check if the data is actually updated in the database (not just locally)
- Try clearing the cache manually using the API
- Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

### How to verify it's working
After calling the revalidation API, you should get:
```json
{
  "revalidated": true,
  "path": "/services/wedding-transportation",
  "now": 1234567890
}
```
