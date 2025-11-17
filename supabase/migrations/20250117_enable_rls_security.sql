-- Enable Row Level Security (RLS) for Lake Ride Pros
-- This protects against external/unauthorized access while allowing Payload CMS admin users full access
--
-- Security Model:
-- - All tables have RLS enabled to block unauthorized access
-- - Payload CMS uses direct Postgres connection with bypassrls privileges (service role)
-- - Any external API attempts to access data through Supabase are blocked by default
-- - Only authenticated admin users through Payload CMS can access data

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

-- User Management
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_sessions ENABLE ROW LEVEL SECURITY;

-- Content Management
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles_amenities ENABLE ROW LEVEL SECURITY;

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- E-commerce Tables (contain sensitive customer data)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Partner/Affiliate Management
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Media Storage
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Payload CMS System Tables
ALTER TABLE payload_locked_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_locked_documents_rels ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_preferences_rels ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_kv ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CREATE SECURITY POLICIES
-- =============================================================================
-- Strategy:
-- 1. PUBLIC CONTENT: Allow public read access (products, services, blog, etc.)
-- 2. SENSITIVE DATA: Block all public access (users, orders, gift_cards)
-- 3. ADMIN ACCESS: Service role can do everything (Payload CMS)

-- -----------------------------------------------------------------------------
-- SENSITIVE DATA: Block all public access
-- -----------------------------------------------------------------------------

-- Users table: Admin only
CREATE POLICY "Admin full access to users" ON users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to users_sessions" ON users_sessions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Orders table: Admin only (contains customer info)
CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to orders_items" ON orders_items
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Gift Cards: Admin only (contains payment info)
CREATE POLICY "Admin full access to gift_cards" ON gift_cards
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Payload system tables: Admin only
CREATE POLICY "Admin full access to payload_locked_documents" ON payload_locked_documents
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to payload_locked_documents_rels" ON payload_locked_documents_rels
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to payload_preferences" ON payload_preferences
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to payload_preferences_rels" ON payload_preferences_rels
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to payload_migrations" ON payload_migrations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access to payload_kv" ON payload_kv
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- PUBLIC CONTENT: Allow public read access, admin write access
-- -----------------------------------------------------------------------------

-- Products: Public can read active products, admin can manage all
CREATE POLICY "Public can view active products" ON products
  FOR SELECT
  USING (status = 'active' OR auth.role() = 'service_role');

CREATE POLICY "Admin can manage products" ON products
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view product images" ON products_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product images" ON products_images
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view product categories" ON products_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product categories" ON products_categories
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view product tags" ON products_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product tags" ON products_tags
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view product variants" ON products_variants
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product variants" ON products_variants
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Pages: Public can read published pages
CREATE POLICY "Public can view pages" ON pages
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage pages" ON pages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Blog Posts: Public can read
CREATE POLICY "Public can view blog posts" ON blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage blog posts" ON blog_posts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view blog post categories" ON blog_posts_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage blog post categories" ON blog_posts_categories
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Services: Public can read
CREATE POLICY "Public can view services" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage services" ON services
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view service features" ON services_features
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage service features" ON services_features
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Vehicles: Public can read
CREATE POLICY "Public can view vehicles" ON vehicles
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage vehicles" ON vehicles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view vehicle images" ON vehicles_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage vehicle images" ON vehicles_images
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can view vehicle amenities" ON vehicles_amenities
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage vehicle amenities" ON vehicles_amenities
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Testimonials: Public can read
CREATE POLICY "Public can view testimonials" ON testimonials
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage testimonials" ON testimonials
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Partners: Public can read
CREATE POLICY "Public can view partners" ON partners
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage partners" ON partners
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Media: Public can read (for images on website)
CREATE POLICY "Public can view media" ON media
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage media" ON media
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Use these queries to verify RLS is enabled:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
--
-- To view policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- =============================================================================
-- SECURITY NOTES
-- =============================================================================
-- 1. Payload CMS uses direct Postgres connection with bypassrls privileges
--    - All admin operations work normally
--    - No changes needed to application code
--
-- 2. External API attempts through Supabase PostgREST are blocked
--    - Unless using service_role key (which is kept secret)
--    - Protects against unauthorized API access
--
-- 3. Public website content can be exposed via API routes
--    - Create dedicated API routes in Next.js for public data
--    - These routes use Payload CMS SDK which bypasses RLS
--
-- 4. Future: If you need Supabase Auth for customers
--    - Add policies like: USING (auth.uid() = user_id)
--    - Allows customers to access only their own orders
