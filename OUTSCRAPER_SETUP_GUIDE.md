# Google Reviews Sync Setup Guide (Outscraper + Supabase)

This guide explains how to set up automated Google Reviews syncing using **Outscraper API** (no Google API access required!) via **Supabase Edge Functions**.

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│  AUTOMATED SYNC (Daily at 2 AM)                           │
│  Supabase Cron → Edge Function → Outscraper API           │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│  MANUAL SYNC (Admin Dashboard)                            │
│  Admin Button → Next.js API → Edge Function → Outscraper  │
└────────────────────────────────────────────────────────────┘
                         ↓
              Payload CMS (Testimonials)
                         ↓
              Website Display + SEO Schema
```

## Why Outscraper Instead of Google API?

| Feature | Google Places API | Google My Business API | **Outscraper** ✅ |
|---------|-------------------|------------------------|-------------------|
| Reviews Limit | Only 5 reviews | All reviews | **All reviews** |
| Setup Complexity | API key only | 2-4 weeks approval + OAuth | **API key only** |
| Service Area Business | ⚠️ Limited | ✅ Yes | **✅ Yes** |
| Free Tier | 10k calls/mo | N/A | **500 reviews/mo** |
| Cost (after free) | Free | Free | **$1-2 per 1k reviews** |

---

## Step 1: Get Your Outscraper API Key

1. Sign up at **https://outscraper.com** (free account)
2. Navigate to **Dashboard → API Key**
3. Copy your API key (starts with `YourApiKey-...`)
4. Keep it secure - you'll add it to Supabase secrets

**Free Tier:** 500 reviews/month
**Cost:** After free tier, ~$1-2 per 1,000 reviews

---

## Step 2: Verify Your Google Place ID

Your business Place ID is already configured:
```
ChIJJ8GI2fuCGWIRW8RfPECoxN4
```

This is for **Lake Ride Pros** at Lake of the Ozarks.

### How to Verify/Update Place ID (if needed):

**Option A - Google Maps Search:**
1. Go to https://www.google.com/maps
2. Search for your business
3. Click on your listing
4. Look at URL: `place_id:ChIJJ8GI2fuCGWIRW8RfPECoxN4`

**Option B - Use Outscraper's Place ID Finder:**
1. Go to https://outscraper.com/google-place-id-finder/
2. Enter your business name and location
3. Copy the Place ID

---

## Step 3: Deploy Supabase Edge Function

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link to your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

   Find your project ref in Supabase Dashboard → Settings → General

4. **Set environment secrets:**
   ```bash
   # Set Outscraper API key
   supabase secrets set OUTSCRAPER_API_KEY=YourApiKey-xxxxx

   # Set Google Place ID
   supabase secrets set GOOGLE_PLACE_ID=ChIJJ8GI2fuCGWIRW8RfPECoxN4
   ```

5. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy sync-google-reviews
   ```

6. **Verify deployment:**
   ```bash
   supabase functions list
   ```

### Option B: Using Supabase Dashboard

1. **Go to:** Supabase Dashboard → Edge Functions
2. **Create new function:** `sync-google-reviews`
3. **Copy contents** from `supabase/functions/sync-google-reviews/index.ts`
4. **Deploy**
5. **Add secrets:**
   - Dashboard → Settings → Edge Functions → Secrets
   - Add `OUTSCRAPER_API_KEY`
   - Add `GOOGLE_PLACE_ID`

---

## Step 4: Set Up Cron Job (Automated Daily Sync)

### Enable pg_cron Extension:

1. **Go to:** Supabase Dashboard → Database → Extensions
2. **Search for:** `pg_cron`
3. **Click Enable**

### Run the Migration:

**Option A - Using Supabase CLI:**
```bash
supabase db push
```

**Option B - Using Supabase Dashboard:**
1. Dashboard → SQL Editor
2. Copy contents from `supabase/migrations/20250115_setup_reviews_cron.sql`
3. Run the SQL

**⚠️ Note:** The SQL migration uses database settings which need to be configured first:

```sql
-- Set these in Supabase Dashboard → Settings → Vault (or update the migration)
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
ALTER DATABASE postgres SET app.settings.google_place_id = 'ChIJJ8GI2fuCGWIRW8RfPECoxN4';
```

### Adjust Cron Schedule (Optional):

The default is **daily at 2 AM**. To change:

```sql
-- Every 6 hours
SELECT cron.schedule('sync-google-reviews-daily', '0 */6 * * *',
  $$SELECT invoke_sync_google_reviews()$$);

-- Weekly on Sunday at midnight
SELECT cron.schedule('sync-google-reviews-daily', '0 0 * * 0',
  $$SELECT invoke_sync_google_reviews()$$);
```

---

## Step 5: Update Environment Variables

Add to your `.env.local` and **Vercel environment variables**:

```bash
# Google Place ID for Lake Ride Pros
GOOGLE_PLACE_ID=ChIJJ8GI2fuCGWIRW8RfPECoxN4

# Supabase (already configured, just verify)
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**In Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add `GOOGLE_PLACE_ID` (all environments)
3. Redeploy if needed

---

## Step 6: Test the Sync

### Test Edge Function Directly:

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/sync-google-reviews' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"placeId": "ChIJJ8GI2fuCGWIRW8RfPECoxN4"}'
```

Expected response:
```json
{
  "success": true,
  "reviews": [...],
  "metadata": {
    "businessName": "Lake Ride Pros",
    "totalReviews": 25,
    "rating": 4.8,
    "placeId": "ChIJJ8GI2fuCGWIRW8RfPECoxN4"
  }
}
```

### Test via Admin Dashboard:

1. Login to **https://yourdomain.com/admin**
2. Go to **Dashboard**
3. Click **"Sync Google Reviews"**
4. Check the success message for stats

---

## Step 7: Verify Sync in CMS

1. **Go to:** `/admin/collections/testimonials`
2. **Look for:**
   - Reviews with `source: google`
   - `externalId` populated
   - `syncedAt` timestamp
   - Proper ratings and content

---

## Monitoring & Maintenance

### View Cron Job Status:

```sql
-- List all scheduled jobs
SELECT * FROM cron.job;

-- View job run history
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

### View Edge Function Logs:

1. Supabase Dashboard → Edge Functions
2. Click `sync-google-reviews`
3. View **Logs** tab

### Check Outscraper Usage:

1. Outscraper Dashboard → Usage
2. Monitor free tier (500 reviews/month)
3. Set up billing alerts if needed

---

## Troubleshooting

### "OUTSCRAPER_API_KEY not configured"
- Run: `supabase secrets set OUTSCRAPER_API_KEY=your_key`
- Or add via Dashboard → Settings → Edge Functions → Secrets

### "No reviews found"
- Verify Place ID is correct
- Check if business has public reviews on Google Maps
- Test Place ID at: https://www.google.com/maps/search/?api=1&query=Google&query_place_id=YOUR_PLACE_ID

### "Edge function error 404"
- Function not deployed: `supabase functions deploy sync-google-reviews`
- Check function name matches exactly

### "Cron job not running"
- Verify pg_cron extension is enabled
- Check job exists: `SELECT * FROM cron.job;`
- View errors: `SELECT * FROM cron.job_run_details WHERE status = 'failed';`

### "Rate limit exceeded" (Outscraper)
- Free tier: 500 reviews/month
- Upgrade plan or reduce cron frequency
- Current usage: Check Outscraper Dashboard

---

## Cost Estimation

**Scenario:** 50 reviews, syncing daily

| Month | Reviews Fetched | Cost |
|-------|----------------|------|
| Month 1 | 50 reviews | **Free** (under 500 limit) |
| Month 2-12 | 50/day = 1,500/mo | **$1.50-3/mo** |

**Optimization:**
- Sync weekly instead of daily: **Free** (200/month)
- Or sync only when you get notifications of new reviews

---

## Comparison to Old System

| Feature | Old (Google My Business API) | **New (Outscraper)** ✅ |
|---------|------------------------------|-------------------------|
| Setup Time | 2-4 weeks approval | **5 minutes** |
| Complexity | OAuth flow + refresh tokens | **API key only** |
| Service Area Support | Required verification | **Works instantly** |
| Automation | Manual only | **Daily cron + manual** |
| Cost | Free (but inaccessible) | **Free tier, then $1-2/mo** |
| Maintenance | High (token refresh) | **Zero** |

---

## Migration from Old System

The new system is **backward compatible**. No data migration needed:

1. ✅ Existing testimonials remain unchanged
2. ✅ Same CMS structure (`source: 'google'`)
3. ✅ Same admin dashboard UI
4. ✅ Same deduplication logic (`externalId`)

**You can safely remove old Google API credentials:**
```bash
# Old env vars (no longer needed)
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REFRESH_TOKEN=...
# GOOGLE_BUSINESS_LOCATION_ID=...
```

---

## Support

- **Outscraper API Docs:** https://outscraper.com/api-docs/
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Supabase Cron Jobs:** https://supabase.com/docs/guides/database/extensions/pg_cron

---

## Quick Reference

**Outscraper Dashboard:** https://outscraper.com/dashboard
**Supabase Dashboard:** https://app.supabase.com
**Place ID:** `ChIJJ8GI2fuCGWIRW8RfPECoxN4`
**Business:** Lake Ride Pros, Lake of the Ozarks

**Manual Sync:**
```bash
curl -X POST 'https://yourdomain.com/api/sync-google-reviews' \
  --cookie 'payload-token=YOUR_ADMIN_TOKEN'
```

**Deploy Edge Function:**
```bash
supabase functions deploy sync-google-reviews
```

**View Cron Jobs:**
```sql
SELECT * FROM cron.job;
```
