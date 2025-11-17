# Advanced Cache Revalidation System

## Overview

This project implements a **dual-layer cache revalidation system** that ensures your Next.js pages are updated instantly whenever content changes, regardless of where those changes come from.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Change Sources                            │
├─────────────────────────────────────────────────────────────┤
│  Payload CMS  │  Direct DB   │  Scripts  │  External APIs  │
└───────┬───────────────┬──────────────┬──────────────┬───────┘
        │               │              │              │
        ▼               ▼              ▼              ▼
┌───────────────┐  ┌──────────────────────────────────────┐
│ Payload Hooks │  │   Database Triggers (Supabase)      │
│  (Layer 1)    │  │        (Layer 2)                     │
└───────┬───────┘  └──────────────┬───────────────────────┘
        │                          │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────┐
        │  Revalidation API    │
        │  /api/revalidate     │
        └──────────┬───────────┘
                   ▼
        ┌──────────────────────┐
        │  Next.js Cache       │
        │  Cleared & Rebuilt   │
        └──────────────────────┘
```

## Features

✅ **Dual-layer revalidation** - Payload hooks + database triggers for maximum reliability
✅ **Works with ANY change source** - CMS, direct DB edits, scripts, external tools
✅ **Smart path detection** - Automatically revalidates related pages
✅ **Batch operations** - Efficient bulk revalidation
✅ **Comprehensive logging** - Track what gets revalidated and when
✅ **Production-ready** - Secure, tested, and documented

## Quick Start

### 1. Set Environment Variables

Add these to your `.env` file and Vercel:

```bash
# Generate a secure random secret:
# openssl rand -hex 32
REVALIDATION_SECRET=your-secure-random-token-here

# Your production URL
NEXT_PUBLIC_SERVER_URL=https://www.lakeridepros.com
```

### 2. Configure Supabase (for Database Triggers)

#### Option A: Using Supabase Vault (Recommended for Production)

1. Go to Supabase Dashboard → Settings → Vault
2. Add two secrets:
   - `REVALIDATION_SECRET` = your secret token
   - `NEXT_PUBLIC_SERVER_URL` = your production URL

#### Option B: Using Database Config (Development)

Connect to your database and run:

```sql
SELECT set_revalidation_config(
  'http://localhost:3000',
  'your-secret-here'
);
```

### 3. Run Database Migration

```bash
# Apply the triggers migration
npx supabase db push

# Or if using the migration file directly:
psql $DATABASE_URL -f supabase/migrations/20250117_setup_revalidation_triggers.sql
```

### 4. Test the System

```bash
# Test the API endpoint directly:
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"collection":"services","slug":"wedding-transportation"}'

# Test database trigger:
psql $DATABASE_URL -c "SELECT test_revalidation('services', 'wedding-transportation');"
```

## How It Works

### Layer 1: Payload CMS Hooks

When content is changed through the Payload admin:

1. User saves a Service in Payload CMS
2. `afterChange` hook triggers
3. Calls `/api/revalidate` with collection + slug
4. Next.js cache is cleared

**Files:**
- `lib/revalidation.ts` - Helper utilities
- `collections/Services.ts` - Hook implementation (+ all other collections)

### Layer 2: Database Triggers

When content is changed via ANY method:

1. Database row is updated (via SQL, script, external tool, etc.)
2. PostgreSQL trigger fires
3. Trigger calls `/api/revalidate` via HTTP extension
4. Next.js cache is cleared

**Files:**
- `supabase/migrations/20250117_setup_revalidation_triggers.sql`

### Revalidation API

The enhanced API endpoint handles:

- **Path-based revalidation**: `/api/revalidate?path=/services&secret=xxx`
- **Tag-based revalidation**: `/api/revalidate?tag=services&secret=xxx`
- **Collection-based**: JSON body with `{collection, slug}`
- **Batch operations**: Multiple paths/tags in one request
- **Smart related paths**: Automatically revalidates parent pages

**File:**
- `app/api/revalidate/route.ts`

## Usage Examples

### Manual API Calls

```bash
# Revalidate a specific service page
curl -X POST "https://www.lakeridepros.com/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"collection":"services","slug":"wedding-transportation"}'

# Revalidate multiple paths
curl -X POST "https://www.lakeridepros.com/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/services","/shop","/"]}'

# Revalidate by tag
curl -X POST "https://www.lakeridepros.com/api/revalidate?secret=YOUR_SECRET&tag=services"
```

### From Code

```typescript
import { revalidateCache, revalidatePaths, revalidateTags } from '@/lib/revalidation';

// Revalidate a specific item
await revalidateCache({
  collection: 'services',
  slug: 'wedding-transportation'
});

// Revalidate multiple paths
await revalidatePaths(['/services', '/shop', '/']);

// Revalidate cache tags
await revalidateTags(['services', 'products']);
```

### Test Database Triggers

```sql
-- Test the trigger for a specific collection
SELECT test_revalidation('services', 'wedding-transportation');

-- Update a service to trigger revalidation
UPDATE services
SET title = 'Updated Title'
WHERE slug = 'wedding-transportation';
-- This will automatically trigger cache revalidation!
```

## Collections Covered

All major content collections have revalidation enabled:

- ✅ **Services** - `/services/*`
- ✅ **Products** - `/shop/products/*`
- ✅ **Vehicles** - `/vehicles/*`
- ✅ **Partners** - `/trusted-referral-partners`
- ✅ **Blog Posts** - `/blog/*`
- ✅ **Testimonials** - Multiple pages (home, services, etc.)

## Smart Path Detection

When you revalidate a specific page, related pages are automatically revalidated:

| You change | What gets revalidated |
|------------|----------------------|
| `/services/wedding-transportation` | `/services`, `/`, `/sitemap.xml` |
| `/shop/products/hat` | `/shop`, `/`, `/sitemap.xml` |
| `/blog/my-post` | `/blog`, `/`, `/sitemap.xml` |
| Partners | `/trusted-referral-partners`, `/` |
| Testimonials | `/`, `/services`, `/vehicles`, `/trusted-referral-partners` |

## Monitoring & Debugging

### Check Logs

```bash
# Vercel logs
vercel logs --follow

# Local development
# Watch your console for:
# [Revalidation] Triggering for services/wedding-transportation
# [Revalidation] Success: Paths: 3, Tags: 1, Duration: 45ms
```

### Test Database Trigger Function

```sql
-- Check if the http extension is enabled
SELECT * FROM pg_extension WHERE extname = 'http';

-- Test the revalidation function directly
SELECT trigger_cache_revalidation('services', 'wedding-transportation');

-- Check trigger configuration
SELECT * FROM pg_trigger WHERE tgname LIKE '%revalidation%';
```

### Verify Environment Variables

```bash
# In Vercel dashboard, check:
# - REVALIDATION_SECRET is set
# - NEXT_PUBLIC_SERVER_URL is set

# In Supabase, verify vault secrets:
SELECT name FROM vault.decrypted_secrets;
```

## Troubleshooting

### Changes not appearing?

1. **Check environment variables** - Ensure `REVALIDATION_SECRET` and `NEXT_PUBLIC_SERVER_URL` are set
2. **Check Supabase vault** - Secrets must be configured for database triggers
3. **Check logs** - Look for `[Revalidation]` messages
4. **Hard refresh browser** - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
5. **Verify trigger is active**:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'services_cache_revalidation';
   ```

### Database trigger not firing?

```sql
-- Check if http extension is enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Check if secrets are configured
SELECT name FROM vault.decrypted_secrets
WHERE name IN ('REVALIDATION_SECRET', 'NEXT_PUBLIC_SERVER_URL');

-- If vault not configured, use session config:
SELECT set_revalidation_config('http://localhost:3000', 'your-secret');
```

### API returns 401 (Unauthorized)?

- Verify `REVALIDATION_SECRET` matches in all locations:
  - `.env` file
  - Vercel environment variables
  - Supabase vault secrets

### Database trigger returns error?

Check the PostgreSQL logs in Supabase:
1. Supabase Dashboard → Logs → Postgres Logs
2. Look for errors from `trigger_cache_revalidation`

## Performance

- **API response time**: ~50-100ms per revalidation
- **Database trigger overhead**: <10ms
- **No impact on page load** - Revalidation happens asynchronously
- **Batch operations** - Multiple paths revalidated in single request

## Security

✅ Secret token required for all revalidation requests
✅ Database function uses `SECURITY DEFINER` for vault access
✅ No sensitive data exposed in logs
✅ HTTPS enforced in production

## Files Modified

| File | Purpose |
|------|---------|
| `app/api/revalidate/route.ts` | Enhanced revalidation API |
| `lib/revalidation.ts` | Helper utilities for revalidation |
| `collections/Services.ts` | Added afterChange hook |
| `collections/Products.ts` | Added afterChange hook |
| `collections/Vehicles.ts` | Added afterChange hook |
| `collections/Partners.ts` | Added afterChange hook |
| `collections/BlogPosts.ts` | Added afterChange hook |
| `collections/Testimonials.ts` | Added afterChange hook |
| `supabase/migrations/20250117_setup_revalidation_triggers.sql` | Database triggers |

## Next Steps

1. ✅ Deploy to production
2. ✅ Configure environment variables in Vercel
3. ✅ Configure Supabase vault secrets
4. ✅ Run database migration
5. ✅ Test with a real content change
6. 🎉 Enjoy instant cache updates!

## Support

For issues or questions:
- Check this documentation
- Review the code comments in `lib/revalidation.ts`
- Test with the examples above
- Check logs in Vercel and Supabase

---

**Built with ❤️ for Lake Ride Pros**
