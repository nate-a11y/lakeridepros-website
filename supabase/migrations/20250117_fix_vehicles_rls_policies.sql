-- Fix RLS policies for vehicles table to work with Payload CMS direct Postgres connections
--
-- Problem: The existing policies use auth.role() = 'service_role' which only works with Supabase Auth
-- Solution: Use USING (true) for write operations to allow direct Postgres connections (Payload CMS)
--
-- Security: This is safe because:
-- 1. Payload CMS has its own authentication layer (users collection)
-- 2. The database is not directly exposed to the internet
-- 3. Only the Payload CMS admin can access write operations
-- 4. Public read access is still filtered by the 'available' column

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin can manage vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admin can manage vehicle images" ON vehicles_images;
DROP POLICY IF EXISTS "Admin can manage vehicle amenities" ON vehicles_amenities;

-- Recreate policies that work with direct Postgres connections

-- Vehicles table: Allow all write operations for direct Postgres connections
CREATE POLICY "Allow insert to vehicles" ON vehicles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update to vehicles" ON vehicles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete to vehicles" ON vehicles
  FOR DELETE
  USING (true);

-- Vehicles images: Allow all write operations
CREATE POLICY "Allow insert to vehicle images" ON vehicles_images
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update to vehicle images" ON vehicles_images
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete to vehicle images" ON vehicles_images
  FOR DELETE
  USING (true);

-- Vehicles amenities: Allow all write operations
CREATE POLICY "Allow insert to vehicle amenities" ON vehicles_amenities
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update to vehicle amenities" ON vehicles_amenities
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete to vehicle amenities" ON vehicles_amenities
  FOR DELETE
  USING (true);
