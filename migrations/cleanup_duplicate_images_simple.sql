-- ============================================================================
-- Simple cleanup: Delete JPG/JPEG images that have WebP equivalents
-- ============================================================================

-- STEP 1: Count how many duplicates exist
SELECT COUNT(*) as duplicate_count
FROM media jpeg
WHERE jpeg.mime_type IN ('image/jpeg', 'image/jpg')
  AND EXISTS (
    SELECT 1
    FROM media webp
    WHERE webp.mime_type = 'image/webp'
      AND REPLACE(REPLACE(webp.filename, '.webp', ''), '-1024x1024', '') =
          REPLACE(REPLACE(REPLACE(jpeg.filename, '.jpeg', ''), '.jpg', ''), '-1024x1024', '')
  );

-- STEP 2: Preview which files will be deleted (RUN THIS FIRST!)
SELECT
  id,
  filename,
  mime_type,
  filesize,
  url
FROM media
WHERE mime_type IN ('image/jpeg', 'image/jpg')
  AND EXISTS (
    SELECT 1
    FROM media webp
    WHERE webp.mime_type = 'image/webp'
      AND REPLACE(REPLACE(webp.filename, '.webp', ''), '-1024x1024', '') =
          REPLACE(REPLACE(REPLACE(filename, '.jpeg', ''), '.jpg', ''), '-1024x1024', '')
  )
ORDER BY filename;

-- STEP 3: Delete the duplicates (ONLY RUN AFTER REVIEWING STEP 2!)
DELETE FROM media
WHERE mime_type IN ('image/jpeg', 'image/jpg')
  AND EXISTS (
    SELECT 1
    FROM media webp
    WHERE webp.mime_type = 'image/webp'
      AND REPLACE(REPLACE(webp.filename, '.webp', ''), '-1024x1024', '') =
          REPLACE(REPLACE(REPLACE(filename, '.jpeg', ''), '.jpg', ''), '-1024x1024', '')
  );

-- NOTE: This only removes database records. To clean up Supabase storage,
-- you'll need to manually delete the orphaned files from the 'media' bucket,
-- or they'll be cleaned up gradually over time.
