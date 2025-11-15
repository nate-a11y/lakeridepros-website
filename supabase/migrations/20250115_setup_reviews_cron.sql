-- Enable required extensions
-- pg_cron: Allows scheduling of PostgreSQL functions
-- pg_net: Allows making HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to invoke the Edge Function
CREATE OR REPLACE FUNCTION invoke_sync_google_reviews()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be called by the cron job
  -- It uses pg_net extension to make HTTP requests to the Edge Function
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-google-reviews',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object('placeId', current_setting('app.settings.google_place_id'))
    );
END;
$$;

-- Schedule the cron job to run daily at 2 AM
-- You can adjust the schedule using standard cron syntax:
-- * * * * * = every minute (for testing)
-- 0 2 * * * = 2 AM daily (recommended)
-- 0 */6 * * * = every 6 hours
-- 0 0 * * 0 = weekly on Sunday at midnight

SELECT cron.schedule(
  'sync-google-reviews-daily',  -- Job name
  '0 2 * * *',                   -- Cron schedule (2 AM daily)
  $$SELECT invoke_sync_google_reviews()$$
);

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule a job:
-- SELECT cron.unschedule('sync-google-reviews-daily');

-- To update the schedule:
-- SELECT cron.unschedule('sync-google-reviews-daily');
-- Then run the schedule command again with new timing
