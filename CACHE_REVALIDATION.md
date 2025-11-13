# Cache Revalidation Guide

## Overview
The services pages use ISR (Incremental Static Regeneration) with a 60-second revalidation period. This means:
- Pages are fast (pre-built static HTML)
- Content updates automatically every 60 seconds
- You can manually trigger instant cache clearing

## Automatic Revalidation
Pages automatically revalidate every 60 seconds. If you update a service in Payload CMS, the changes will appear within 1 minute on the live site.

## Manual/Instant Revalidation

### Setup (One-time)
1. Add this environment variable to Vercel:
   ```
   REVALIDATION_SECRET=your-secret-token-here
   ```
   (Generate a secure random string, e.g., `openssl rand -hex 32`)

### Clear Cache for Specific Service
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

## Integrate with Payload CMS Webhooks (Optional)

You can set up Payload CMS to automatically trigger revalidation when content changes:

1. In Payload CMS admin, go to Settings → Webhooks
2. Add a new webhook:
   - **URL**: `https://lakeridepros-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/services`
   - **Events**: Select "afterChange" for the Services collection
   - **Method**: POST

Now whenever you update a service in Payload CMS, the cache will automatically clear!

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
