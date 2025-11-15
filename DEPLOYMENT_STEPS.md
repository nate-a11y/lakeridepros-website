# Google Reviews Sync - Quick Deployment Steps

This is a **quick reference** for deploying the new Outscraper-based Google Reviews sync. For detailed documentation, see `OUTSCRAPER_SETUP_GUIDE.md`.

## 🎯 What Changed

**BEFORE:** Required Google My Business API (2-4 weeks approval, OAuth complexity)
**AFTER:** Uses Outscraper API via Supabase Edge Function (5-minute setup, just API key)

## ✅ Deployment Checklist

### 1. Get Outscraper API Key (2 minutes)
```bash
1. Sign up: https://outscraper.com
2. Dashboard → API Key
3. Copy your API key
```

### 2. Deploy Supabase Edge Function (2 minutes)

**Option A - CLI (Recommended):**
```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set OUTSCRAPER_API_KEY=your_api_key_here
supabase secrets set GOOGLE_PLACE_ID=ChIJJ8GI2fuCGWIRW8RfPECoxN4

# Deploy function
supabase functions deploy sync-google-reviews
```

**Option B - Dashboard:**
```
1. Supabase Dashboard → Edge Functions
2. Create new function: sync-google-reviews
3. Copy code from supabase/functions/sync-google-reviews/index.ts
4. Deploy
5. Settings → Secrets:
   - OUTSCRAPER_API_KEY
   - GOOGLE_PLACE_ID
```

### 3. Enable Cron Job for Auto-Sync (1 minute)

**Enable pg_cron:**
```
1. Supabase Dashboard → Database → Extensions
2. Search "pg_cron"
3. Click Enable
```

**Run migration:**
```bash
# Option A - CLI
supabase db push

# Option B - Dashboard
1. Dashboard → SQL Editor
2. Copy from: supabase/migrations/20250115_setup_reviews_cron.sql
3. Run SQL
```

### 4. Update Vercel Environment Variables (1 minute)

```
Vercel Dashboard → Project Settings → Environment Variables

Add:
GOOGLE_PLACE_ID = ChIJJ8GI2fuCGWIRW8RfPECoxN4

(All environments: Production, Preview, Development)
```

### 5. Test the Integration (1 minute)

**Method 1 - Admin Dashboard:**
```
1. Go to: https://yourdomain.com/admin
2. Click "Sync Google Reviews"
3. Verify success message
```

**Method 2 - Direct Edge Function Test:**
```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/sync-google-reviews' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"placeId": "ChIJJ8GI2fuCGWIRW8RfPECoxN4"}'
```

---

## 🔧 Configuration Reference

**Place ID:** `ChIJJ8GI2fuCGWIRW8RfPECoxN4` (Lake Ride Pros)
**Cron Schedule:** Daily at 2 AM (customizable in migration SQL)
**Free Tier:** 500 reviews/month
**Cost After:** ~$1-2 per 1,000 reviews

---

## 📊 What Gets Synced

- ✅ All reviews (not limited to 5)
- ✅ Review text, rating, author name
- ✅ Review timestamps
- ✅ Automatic deduplication (via `externalId`)
- ✅ Preserves manual overrides (`featured`, `order`)

---

## 🚨 Troubleshooting

**Function not found (404):**
```bash
supabase functions deploy sync-google-reviews
```

**No reviews returned:**
- Verify Place ID: https://www.google.com/maps/search/?api=1&query_place_id=ChIJJ8GI2fuCGWIRW8RfPECoxN4
- Check Outscraper dashboard for errors

**Cron not running:**
```sql
-- Check if job exists
SELECT * FROM cron.job;

-- View run history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;
```

---

## 📝 Files Changed

```
NEW FILES:
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── _shared/cors.ts
│   │   └── sync-google-reviews/index.ts
│   └── migrations/
│       └── 20250115_setup_reviews_cron.sql
├── OUTSCRAPER_SETUP_GUIDE.md (detailed docs)
└── DEPLOYMENT_STEPS.md (this file)

MODIFIED FILES:
├── app/api/sync-google-reviews/route.ts (calls Edge Function now)
└── .env.example (added GOOGLE_PLACE_ID)

KEEP AS-IS (backward compatible):
├── lib/google-reviews.ts (transformGoogleReviewToTestimonial still used)
├── collections/Testimonials.ts
├── components/admin/Dashboard.tsx
└── All other files unchanged
```

---

## 🎉 Benefits

1. **No Google API approval needed** - works immediately
2. **Service Area Business compatible** - no physical location required
3. **Automated daily syncs** - zero maintenance
4. **All reviews synced** - not limited to 5
5. **Bulletproof architecture** - Edge Functions + Cron + Retry logic
6. **Cost-effective** - Free tier covers most usage
7. **Same admin UI** - no retraining needed

---

## 📞 Support

- Full guide: `OUTSCRAPER_SETUP_GUIDE.md`
- Outscraper API: https://outscraper.com/api-docs/
- Supabase Docs: https://supabase.com/docs
