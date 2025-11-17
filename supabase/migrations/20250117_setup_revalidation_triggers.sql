-- =====================================================
-- Cache Revalidation Triggers for Next.js
-- =====================================================
-- This migration sets up database triggers that automatically
-- call the Next.js revalidation API when content changes,
-- regardless of how the change is made (Payload CMS, direct DB,
-- scripts, external tools, etc.)
--
-- Requirements:
-- 1. http extension enabled in Supabase
-- 2. Database secrets configured:
--    - REVALIDATION_SECRET
--    - NEXT_PUBLIC_SERVER_URL
-- =====================================================

-- Enable the HTTP extension (allows database to make HTTP requests)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- =====================================================
-- HELPER FUNCTION: Make HTTP request to revalidation API
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_cache_revalidation(
  collection_name TEXT,
  item_slug TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  revalidation_secret TEXT;
  server_url TEXT;
  api_url TEXT;
  response extensions.http_response;
  request_body TEXT;
BEGIN
  -- Get secrets from Supabase Vault (configure these in Supabase dashboard)
  -- Fallback to environment variables if vault not configured yet
  BEGIN
    SELECT decrypted_secret INTO revalidation_secret
    FROM vault.decrypted_secrets
    WHERE name = 'REVALIDATION_SECRET'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    -- Vault not configured, use pg_catalog setting as fallback
    revalidation_secret := current_setting('app.settings.revalidation_secret', true);
  END;

  BEGIN
    SELECT decrypted_secret INTO server_url
    FROM vault.decrypted_secrets
    WHERE name = 'NEXT_PUBLIC_SERVER_URL'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    -- Vault not configured, use pg_catalog setting as fallback
    server_url := current_setting('app.settings.server_url', true);
  END;

  -- If secrets are not configured, log warning and exit
  IF revalidation_secret IS NULL OR server_url IS NULL THEN
    RAISE WARNING 'Revalidation skipped: secrets not configured (REVALIDATION_SECRET: %, SERVER_URL: %)',
      CASE WHEN revalidation_secret IS NULL THEN 'missing' ELSE 'set' END,
      CASE WHEN server_url IS NULL THEN 'missing' ELSE 'set' END;
    RETURN;
  END IF;

  -- Build the API URL
  api_url := server_url || '/api/revalidate?secret=' || revalidation_secret;

  -- Build JSON body with collection and slug
  request_body := json_build_object(
    'collection', collection_name,
    'slug', item_slug
  )::text;

  -- Make the HTTP POST request
  BEGIN
    SELECT * INTO response FROM extensions.http((
      'POST',
      api_url,
      ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      request_body
    ));

    -- Log the response
    IF response.status >= 200 AND response.status < 300 THEN
      RAISE NOTICE 'Revalidation successful for %/% (status: %)', collection_name, item_slug, response.status;
    ELSE
      RAISE WARNING 'Revalidation failed for %/% (status: %, body: %)',
        collection_name, item_slug, response.status, response.content;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Don't fail the transaction if revalidation fails, just log it
    RAISE WARNING 'Revalidation HTTP request failed for %/%: %', collection_name, item_slug, SQLERRM;
  END;
END;
$$;

-- =====================================================
-- TRIGGER FUNCTIONS for each collection
-- =====================================================

-- Services collection trigger
CREATE OR REPLACE FUNCTION services_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Use NEW.slug for the slug, handle both INSERT and UPDATE
  PERFORM trigger_cache_revalidation('services', NEW.slug);
  RETURN NEW;
END;
$$;

-- Products collection trigger
CREATE OR REPLACE FUNCTION products_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM trigger_cache_revalidation('products', NEW.slug);
  RETURN NEW;
END;
$$;

-- Vehicles collection trigger
CREATE OR REPLACE FUNCTION vehicles_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM trigger_cache_revalidation('vehicles', NEW.slug);
  RETURN NEW;
END;
$$;

-- Partners collection trigger (no slug, just revalidates the partners page)
CREATE OR REPLACE FUNCTION partners_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Partners don't have individual pages, just trigger the main page revalidation
  PERFORM trigger_cache_revalidation('partners', 'index');
  RETURN NEW;
END;
$$;

-- Blog Posts collection trigger
CREATE OR REPLACE FUNCTION blog_posts_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM trigger_cache_revalidation('blog-posts', NEW.slug);
  RETURN NEW;
END;
$$;

-- Testimonials collection trigger (appears on multiple pages)
CREATE OR REPLACE FUNCTION testimonials_revalidation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Testimonials appear on multiple pages, trigger blanket revalidation
  PERFORM trigger_cache_revalidation('testimonials', 'index');
  RETURN NEW;
END;
$$;

-- =====================================================
-- CREATE TRIGGERS on tables
-- =====================================================

-- Drop existing triggers if they exist (for idempotency)
DROP TRIGGER IF EXISTS services_cache_revalidation ON services;
DROP TRIGGER IF EXISTS products_cache_revalidation ON products;
DROP TRIGGER IF EXISTS vehicles_cache_revalidation ON vehicles;
DROP TRIGGER IF EXISTS partners_cache_revalidation ON partners;
DROP TRIGGER IF EXISTS blog_posts_cache_revalidation ON blog_posts;
DROP TRIGGER IF EXISTS testimonials_cache_revalidation ON testimonials;

-- Services trigger
CREATE TRIGGER services_cache_revalidation
AFTER INSERT OR UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION services_revalidation_trigger();

-- Products trigger
CREATE TRIGGER products_cache_revalidation
AFTER INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION products_revalidation_trigger();

-- Vehicles trigger
CREATE TRIGGER vehicles_cache_revalidation
AFTER INSERT OR UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION vehicles_revalidation_trigger();

-- Partners trigger
CREATE TRIGGER partners_cache_revalidation
AFTER INSERT OR UPDATE ON partners
FOR EACH ROW
EXECUTE FUNCTION partners_revalidation_trigger();

-- Blog Posts trigger
CREATE TRIGGER blog_posts_cache_revalidation
AFTER INSERT OR UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION blog_posts_revalidation_trigger();

-- Testimonials trigger
CREATE TRIGGER testimonials_cache_revalidation
AFTER INSERT OR UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION testimonials_revalidation_trigger();

-- =====================================================
-- CONFIGURATION HELPER FUNCTIONS
-- =====================================================

-- Function to set configuration (for local development without vault)
CREATE OR REPLACE FUNCTION set_revalidation_config(
  p_server_url TEXT,
  p_secret TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Note: These settings are session-scoped
  -- For permanent settings, use Supabase Vault in production
  PERFORM set_config('app.settings.server_url', p_server_url, false);
  PERFORM set_config('app.settings.revalidation_secret', p_secret, false);

  RAISE NOTICE 'Revalidation configuration updated (session scope)';
  RAISE NOTICE 'Server URL: %', p_server_url;
  RAISE NOTICE 'Secret: %', CASE WHEN p_secret IS NOT NULL THEN '***configured***' ELSE 'NOT SET' END;
END;
$$;

-- Function to test revalidation
CREATE OR REPLACE FUNCTION test_revalidation(
  collection TEXT,
  slug TEXT
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE NOTICE 'Testing revalidation for %/%', collection, slug;
  PERFORM trigger_cache_revalidation(collection, slug);
END;
$$;

-- =====================================================
-- USAGE EXAMPLES
-- =====================================================

-- Example: Set configuration for local development
-- SELECT set_revalidation_config('http://localhost:3000', 'your-secret-here');

-- Example: Test revalidation
-- SELECT test_revalidation('services', 'wedding-transportation');

-- Example: Manually trigger revalidation for a service
-- SELECT trigger_cache_revalidation('services', 'wedding-transportation');

COMMENT ON FUNCTION trigger_cache_revalidation IS 'Triggers Next.js cache revalidation via HTTP POST to /api/revalidate';
COMMENT ON FUNCTION set_revalidation_config IS 'Configure revalidation settings (for development). Use Supabase Vault in production.';
COMMENT ON FUNCTION test_revalidation IS 'Test the revalidation system for a specific collection and slug';
