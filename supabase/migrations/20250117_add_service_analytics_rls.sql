-- Add RLS policies for service_analytics table
-- This table tracks service popularity and should be publicly readable

-- Enable RLS on service_analytics table (if not already enabled)
ALTER TABLE service_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to analytics data
-- This is needed for the popular services feature to work during build time
-- Note: Using USING (true) allows all connections to read, including Payload CMS direct connections
CREATE POLICY "Public can view service analytics" ON service_analytics
  FOR SELECT
  USING (true);

-- Allow all write operations for admin/API
-- Note: Using USING (true) for direct Postgres connections (Payload CMS)
-- If using Supabase Auth in the future, you can add: AND (auth.role() = 'service_role' OR current_user = 'postgres')
CREATE POLICY "Allow write to service analytics" ON service_analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update to service analytics" ON service_analytics
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete to service analytics" ON service_analytics
  FOR DELETE
  USING (true);
