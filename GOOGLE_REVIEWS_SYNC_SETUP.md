# Google Business Profile Reviews Sync Setup Guide

This guide explains how to configure automated Google Business Profile reviews syncing to your Lake Ride Pros website testimonials.

## Features

- ✅ Automatically fetch reviews from your Google Business Profile
- ✅ Import reviews into Payload CMS Testimonials collection
- ✅ Deduplication (won't create duplicate testimonials)
- ✅ Preserves manual overrides (featured status, order)
- ✅ One-click sync from admin dashboard
- ✅ Review schema for SEO rich snippets

## Prerequisites

1. A Google Business Profile account
2. Access to Google Cloud Console
3. Your Google Business Profile location ID

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "Lake Ride Pros Reviews")
3. Enable the **Google My Business API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "My Business Account Management API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen if prompted:
   - User type: External
   - App name: Lake Ride Pros Admin
   - Add your email as developer contact
4. Application type: Web application
5. Authorized redirect URIs:
   ```
   http://localhost:3000/api/google-auth/callback
   https://yourdomain.com/api/google-auth/callback
   ```
6. Save and copy:
   - Client ID
   - Client Secret

### 3. Get Your Location ID

You can find your Google Business Profile location ID using the Google My Business API:

1. Go to [Google My Business API Explorer](https://developers.google.com/my-business/reference/rest/v4/accounts.locations/list)
2. Authenticate with your Google account
3. Call the `accounts.locations.list` API
4. Find your location in the response and copy the `name` field (format: `accounts/{accountId}/locations/{locationId}`)

Alternatively, use the Google Business Profile dashboard URL:
```
https://business.google.com/locations/dashboard?hl=en&lid=LOCATION_ID
```
The `lid` parameter is your location ID.

### 4. Get Refresh Token

You need to obtain a refresh token using OAuth 2.0 flow:

**Option A: Using the built-in authorization helper (recommended)**

1. Add these env vars temporarily:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-auth/callback
   ```

2. Run this in your browser console (on your admin dashboard):
   ```javascript
   fetch('/api/google-auth/url').then(r => r.json()).then(data => window.location.href = data.url)
   ```

3. Authorize the app and you'll receive a refresh token

**Option B: Manual OAuth flow**

1. Generate authorization URL:
   ```
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id=YOUR_CLIENT_ID&
     redirect_uri=YOUR_REDIRECT_URI&
     response_type=code&
     scope=https://www.googleapis.com/auth/business.manage&
     access_type=offline&
     prompt=consent
   ```

2. Visit the URL, authorize, and copy the `code` from the redirect URL

3. Exchange code for tokens:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET \
     -d code=YOUR_CODE \
     -d redirect_uri=YOUR_REDIRECT_URI \
     -d grant_type=authorization_code
   ```

4. Copy the `refresh_token` from the response

### 5. Configure Environment Variables

Add these to your `.env` file:

```env
# Google Business Profile API Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_BUSINESS_LOCATION_ID=accounts/123456789/locations/987654321
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/google-auth/callback
```

### 6. Deploy and Test

1. Deploy your application with the new environment variables
2. Go to your Payload admin dashboard (`/admin`)
3. Log in with your admin credentials
4. You should see a "Google Business Profile Integration" section
5. Status should show "✅ Configured"
6. Click "🔄 Sync Reviews Now"
7. Reviews will be imported into Testimonials collection (no API key needed - uses your admin session)

## How It Works

### Testimonial Source Field

Each testimonial now has a `source` field:
- `manual` - Manually added via CMS (default)
- `google` - Synced from Google Business Profile
- `facebook` - Facebook reviews (future)
- `yelp` - Yelp reviews (future)
- `other` - Other sources

### Deduplication

Reviews are deduplicated using the `externalId` field:
- First sync: Creates new testimonials
- Subsequent syncs: Updates existing reviews
- Preserves your manual changes to `featured` and `order` fields

### Review Schema

All testimonials include proper Review schema markup for SEO:
```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Customer Name"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5
  }
}
```

This enables **star ratings in Google search results** (rich snippets).

## Manual Sync via API

You can trigger sync from the admin dashboard by clicking the "🔄 Sync Reviews Now" button. The endpoint uses your admin session for authentication, so you must be logged in.

If you need to trigger sync programmatically (e.g., via cron job), you can use the API endpoint with a valid Payload admin session cookie:

```bash
# Note: Requires valid Payload admin session cookie
curl -X POST https://yourdomain.com/api/sync-google-reviews \
  -H "Content-Type: application/json" \
  -H "Cookie: payload-token=YOUR_SESSION_TOKEN"
```

Response:
```json
{
  "success": true,
  "message": "Synced 15 reviews from Google Business Profile",
  "stats": {
    "fetched": 15,
    "created": 10,
    "updated": 5,
    "skipped": 0
  }
}
```

## Automated Syncing (Optional)

**Note:** Automated syncing requires additional setup since the sync endpoint uses admin session authentication. For automated syncs, you have two options:

1. **Create a separate API endpoint** with API key authentication specifically for cron jobs
2. **Use Payload's API to authenticate programmatically** in your cron job

### Option 1: Vercel Cron Jobs with API Key (requires separate endpoint)

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync-google-reviews",
    "schedule": "0 2 * * *"
  }]
}
```

### Option 2: GitHub Actions with Payload Auth (`.github/workflows/sync-reviews.yml`):
```yaml
name: Sync Google Reviews
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Reviews
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/sync-google-reviews \
            -H "Authorization: Bearer ${{ secrets.SYNC_API_KEY }}"
```

## Troubleshooting

### "Not Configured" Status

- Check that all environment variables are set correctly
- Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_BUSINESS_LOCATION_ID` are present

### "Unauthorized" Error

- Ensure you are logged into the admin panel (`/admin`)
- Your admin session may have expired - try logging out and back in
- The endpoint uses Payload session authentication

### No Reviews Found

- Verify your location ID is correct
- Check that your Google Business Profile has reviews
- Ensure the API is enabled in Google Cloud Console
- Check API quota limits (default is 1,000 requests/day)

### OAuth Errors

- Ensure redirect URI in Google Cloud Console matches your environment
- Verify the refresh token is valid (they can expire if not used for 6 months)
- Re-authorize if needed by generating a new refresh token

## Best Practices

1. **Curate Featured Reviews**: After sync, manually mark your best reviews as "featured"
2. **Set Display Order**: Adjust the `order` field to control which testimonials show first
3. **Sync Regularly**: Run sync weekly or monthly to keep testimonials fresh
4. **Monitor Sync**: Check dashboard after sync to ensure proper import
5. **Moderate Content**: Review imported testimonials for appropriateness

## Security Notes

- ✅ Sync endpoint uses Payload admin session authentication
- ✅ Only authenticated admin users can trigger sync
- ✅ OAuth tokens stored securely in environment variables
- ✅ Never commit `.env` to version control
- ✅ Refresh tokens have limited scope (only read reviews)
- ✅ Session-based auth prevents unauthorized API access

## Support

For issues with:
- Google API setup → [Google My Business API Docs](https://developers.google.com/my-business)
- OAuth flow → [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- Testimonials CMS → Check Payload CMS documentation

## Future Enhancements

Potential features to add:
- [ ] Facebook reviews sync
- [ ] Yelp reviews sync
- [ ] Automated daily sync via cron
- [ ] Email notifications on sync
- [ ] Review response management
- [ ] Analytics dashboard for review trends
