# Resend Email Setup Guide

## Current Status: Not Configured ❌

Your Resend email integration is set up in the code but not properly configured. Here's why you're not seeing emails in the Resend UI:

## Issues Found

### 1. Missing `.env` File
You don't have a `.env` file with your Resend API key. The application can't send emails without this.

### 2. Domain Not Verified (FIXED)
Emails are now configured to send from `hello@updates.lakeridepros.com` which matches your verified domain.

### 3. Where Emails Are Sent From

Your application sends emails in these scenarios:

- **Order confirmations** (`lib/email.ts:10`) - When Stripe checkout completes
- **Gift card emails** (`app/api/email/send-gift-card/route.ts`) - Digital gift cards
- **Physical gift card confirmations** (`app/api/email/send-physical-gift-card-confirmation/route.ts`)
- **Scheduled gift card confirmations** (`app/api/email/send-scheduled-gift-card-confirmation/route.ts`)
- **Payload CMS emails** (`src/payload.config.ts:131`) - Password resets, etc.

## Setup Instructions

### Step 1: Get Your Resend API Key

1. Go to https://resend.com/api-keys
2. Create or copy your API key (starts with `re_`)
3. Keep it secure - don't commit it to git

### Step 2: Create `.env` File

Create a `.env` file in your project root with:

```bash
# Copy from .env.example and add your actual keys
RESEND_API_KEY=re_your_actual_key_here

# Other required variables
PAYLOAD_SECRET=your-payload-secret-minimum-32-characters
POSTGRES_URL=your-postgres-connection-string
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# For email configuration
EMAIL_FROM=hello@updates.lakeridepros.com
EMAIL_FROM_NAME=Lake Ride Pros
```

### Step 3: Domain Already Verified ✅

Your domain `updates.lakeridepros.com` is already verified in Resend! All email FROM addresses have been updated to use `hello@updates.lakeridepros.com`.

**Updated files:**
- ✅ `lib/email.ts:20` - Order confirmations
- ✅ `app/api/email/send-gift-card/route.ts:19` - Gift card emails
- ✅ `app/api/email/send-physical-gift-card-confirmation/route.ts:27` - Physical gift cards
- ✅ `app/api/email/send-scheduled-gift-card-confirmation/route.ts:43` - Scheduled gift cards
- ✅ `src/payload.config.ts:132` - Payload CMS emails

### Step 4: Test Your Configuration

Run the test script:

```bash
node test-resend.js
```

This will check:
- ✅ API key is set
- ✅ Resend client initializes
- ✅ Test email sends successfully

### Step 5: Check Resend Dashboard

After testing or triggering an email in your app:
1. Go to https://resend.com/emails
2. You should see your sent emails listed
3. Click on any email to see delivery status and details

## Troubleshooting

### "Domain not verified" Error

**Symptoms:** Email fails with domain error
**Solution:** Either verify your domain OR use `onboarding@resend.dev` for testing

### No Emails in Resend Dashboard

**Check:**
1. Is `RESEND_API_KEY` set in `.env`?
2. Is the domain verified?
3. Check server logs for errors (run `npm run dev` and watch console)
4. Are you triggering the email correctly? (e.g., completing a Stripe checkout)

### Emails Not Being Triggered

**Test email sending directly:**

```bash
# Test gift card email
curl -X POST http://localhost:3000/api/email/send-gift-card \
  -H "Content-Type: application/json" \
  -d '{
    "giftCard": {
      "code": "TEST123",
      "currentBalance": 100
    },
    "recipientName": "Test User",
    "recipientEmail": "your-email@example.com",
    "purchaserName": "Test Purchaser",
    "message": "Test message"
  }'
```

### Silent Failures

The code catches errors but only logs them. Check your server console output for:
- `Email send error:`
- `Failed to send email`
- `RESEND_API_KEY is not set`

## Production Deployment (Vercel)

If deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add `RESEND_API_KEY` with your production API key
4. Make sure your domain is verified in Resend
5. Redeploy your application

## Quick Reference

- **Resend Dashboard:** https://resend.com
- **API Keys:** https://resend.com/api-keys
- **Domains:** https://resend.com/domains
- **Email Logs:** https://resend.com/emails
- **Docs:** https://resend.com/docs

## Next Steps

1. ✅ Create `.env` file with your `RESEND_API_KEY`
2. ✅ Verify your domain OR use sandbox for testing
3. ✅ Run `node test-resend.js`
4. ✅ Check Resend dashboard for sent emails
5. ✅ Test actual flows (gift card purchase, order, etc.)
