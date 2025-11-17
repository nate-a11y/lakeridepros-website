-- Enable RLS on partners_images table
ALTER TABLE partners_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow insert to partner images" ON partners_images;
DROP POLICY IF EXISTS "Allow update to partner images" ON partners_images;
DROP POLICY IF EXISTS "Allow delete to partner images" ON partners_images;

-- Create policies for partners_images
CREATE POLICY "Allow insert to partner images" ON partners_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to partner images" ON partners_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete to partner images" ON partners_images FOR DELETE USING (true);
