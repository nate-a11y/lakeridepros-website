-- Add missing SELECT policy for partners_images table
-- This allows reading partner images which was blocked by RLS

DROP POLICY IF EXISTS "Allow public read access to partner images" ON partners_images;

CREATE POLICY "Allow public read access to partner images"
  ON partners_images
  FOR SELECT
  USING (true);
