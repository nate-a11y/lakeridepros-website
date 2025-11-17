-- Fix RLS policies to filter unpublished content
-- Drop and recreate policies to add proper filtering on status fields

-- Pages: Filter by published field
DROP POLICY IF EXISTS "Public can view pages" ON pages;
CREATE POLICY "Public can view published pages" ON pages
  FOR SELECT
  USING (published = true OR auth.role() = 'service_role');

-- Blog Posts: Filter by published field
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT
  USING (published = true OR auth.role() = 'service_role');

-- Services: Filter by active field
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view active services" ON services
  FOR SELECT
  USING (active = true OR auth.role() = 'service_role');

-- Vehicles: Filter by available field
DROP POLICY IF EXISTS "Public can view vehicles" ON vehicles;
CREATE POLICY "Public can view available vehicles" ON vehicles
  FOR SELECT
  USING (available = true OR auth.role() = 'service_role');
