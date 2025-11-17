# Row Level Security (RLS) Setup

This document explains the database security setup for Lake Ride Pros using Supabase Row Level Security (RLS).

## Overview

**Goal:** Secure the database from external threats while allowing your admin team full access to manage the site.

**Security Model:**
1. **Admin Access:** All logged-in users (via Payload CMS) have full access to everything
2. **Public Access:** Website visitors can read public content (products, services, blog) but not sensitive data
3. **Protected Data:** Users, orders, and gift cards are completely blocked from external access

## How It Works

### Authentication Layer
- **Payload CMS handles authentication** for your 3 admin users
- Payload connects to Postgres using **service role credentials** which bypass RLS
- Admins can see and manage everything through the Payload admin panel

### Database Layer (RLS)
- **Row Level Security is enabled** on all tables
- **Public content** (products, services, vehicles, blog, testimonials, partners, media, pages) allows:
  - ✅ Public **read** access (for website display)
  - ❌ Public **write** access blocked
  - ✅ Admin **full** access (via service role)

- **Sensitive data** (users, orders, gift_cards) allows:
  - ❌ Public **read** access blocked
  - ❌ Public **write** access blocked
  - ✅ Admin **full** access (via service role)

### Why This Works

```
┌─────────────────────────────────────────────────────────┐
│                   Public Website                         │
│  (Displays products, services, blog posts)              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Payload CMS API Routes                        │
│  (/api/products, /api/services, etc.)                   │
│  → Uses service role credentials                         │
│  → Bypasses RLS (admin access)                          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Postgres Database                  │
│  with Row Level Security (RLS)                          │
│                                                          │
│  ✅ Service role = bypass RLS (admin access)            │
│  ❌ Direct access = blocked by RLS policies             │
└──────────────────────────────────────────────────────────┘
```

## Applying the Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard:**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar

3. **Run the migration:**
   - Copy the contents of `supabase/migrations/20250117_enable_rls_security.sql`
   - Paste into the SQL Editor
   - Click "Run"

4. **Verify RLS is enabled:**
   ```sql
   -- Check which tables have RLS enabled
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```

   Expected: All tables should show `rowsecurity = true`

5. **Verify policies exist:**
   ```sql
   -- View all RLS policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

### Option 2: Via Supabase CLI

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Link to your project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Push the migration:**
   ```bash
   supabase db push
   ```

## Testing RLS Policies

### Test 1: Admin Access Works
1. Log into Payload CMS admin panel at `/admin`
2. Verify you can:
   - View all orders
   - Create/edit products
   - Manage users
   - Upload media

### Test 2: Public Website Works
1. Visit your public website
2. Verify these pages load correctly:
   - Shop page (`/shop`) - displays products
   - Services page (`/services`) - displays services
   - Fleet page (`/fleet`) - displays vehicles
   - Blog page (`/blog`) - displays blog posts
   - Homepage testimonials

### Test 3: Direct Database Access is Blocked (Optional)
If you want to verify external access is blocked, try querying the database using the `anon` key:

```bash
# This should FAIL (blocked by RLS)
curl 'YOUR_SUPABASE_URL/rest/v1/users?select=*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# This should SUCCEED (public read access)
curl 'YOUR_SUPABASE_URL/rest/v1/products?select=*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## What's Protected

### 🔒 Completely Blocked from Public Access
- **users** - Admin user accounts
- **orders** - Customer order data (names, addresses, payment info)
- **gift_cards** - Gift card codes and balances
- **payload_locked_documents** - CMS system data
- **payload_preferences** - User preferences
- **payload_migrations** - Database schema versions

### 👁️ Public Read Access (Website Display)
- **products** - Shop merchandise (public can view active products only)
- **services** - Transportation services
- **vehicles** - Fleet information
- **blog_posts** - Blog content
- **testimonials** - Customer reviews
- **partners** - Partner/affiliate listings
- **media** - Images and files
- **pages** - Static page content

## Security Benefits

1. **Defense in Depth:** Even if someone bypasses your application layer, they can't access sensitive data
2. **API Security:** Direct PostgREST API calls are automatically secured by RLS
3. **Zero Application Changes:** Your existing code works exactly the same
4. **Admin Convenience:** Your 3 admin users still have full access to everything
5. **Compliance Ready:** Clear separation of public vs private data for GDPR/privacy compliance

## Troubleshooting

### "Permission denied" errors in Payload CMS
**Cause:** Payload is not using service role credentials

**Fix:** Verify your environment variables:
```bash
# Check these are set:
POSTGRES_URL=postgresql://postgres:[password]@[host]:5432/postgres
# OR
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Public website not displaying content
**Cause:** RLS policies may be too restrictive

**Fix:** Check if the table has a public read policy:
```sql
SELECT * FROM pg_policies
WHERE tablename = 'your_table_name'
AND cmd = 'SELECT';
```

### Want to add customer authentication later?
If you want to add customer accounts where users can see only their own orders:

```sql
-- Example: Allow customers to see only their orders
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT
  USING (
    auth.uid()::text = customer_email OR  -- Customer access
    auth.role() = 'service_role'           -- Admin access
  );
```

## Environment Variables Reference

Required for RLS to work with Payload CMS:

```bash
# Database connection (service role - bypasses RLS)
POSTGRES_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://postgres:[password]@[host]:5432/postgres

# For migrations
POSTGRES_PRISMA_URL=${POSTGRES_URL}

# Supabase (for storage, optional for auth later)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps (Optional Enhancements)

1. **Add Audit Logging:** Track who changes sensitive data
2. **Add Customer Auth:** Let customers create accounts and view their order history
3. **Add Email Notifications:** Alert on suspicious access attempts
4. **Add Rate Limiting:** Prevent brute force attacks on API endpoints

## Questions?

- **Who has access to the database?** Only your 3 Payload CMS admin users
- **Can customers see other customers' data?** No, customer data (orders) is completely hidden
- **Does RLS affect performance?** Minimal impact; Postgres evaluates policies efficiently
- **Can I disable RLS temporarily?** Yes, but NOT recommended in production

---

**Last Updated:** 2025-01-17
**Migration File:** `supabase/migrations/20250117_enable_rls_security.sql`
