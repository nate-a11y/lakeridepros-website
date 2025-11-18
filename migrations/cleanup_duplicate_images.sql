-- ============================================================================
-- Clean up duplicate images: Keep WebP, delete JPG/JPEG versions
-- ============================================================================

-- STEP 1: Preview what will be deleted (RUN THIS FIRST)
-- This shows all JPG/JPEG files that have a corresponding WebP version
SELECT
  jpeg.id,
  jpeg.filename as jpeg_filename,
  jpeg.mime_type as jpeg_mime,
  jpeg.filesize as jpeg_size,
  webp.filename as webp_filename,
  webp.mime_type as webp_mime,
  webp.filesize as webp_size
FROM media jpeg
JOIN media webp
  ON REGEXP_REPLACE(jpeg.filename, '\.(jpe?g)$', '', 'i') =
     REGEXP_REPLACE(webp.filename, '\.webp$', '', 'i')
WHERE jpeg.mime_type IN ('image/jpeg', 'image/jpg')
  AND webp.mime_type = 'image/webp'
ORDER BY jpeg.filename;

-- STEP 2: Delete the JPG/JPEG duplicates (RUN AFTER REVIEWING STEP 1)
-- This deletes JPG/JPEG files only if a WebP version exists
DELETE FROM media
WHERE id IN (
  SELECT jpeg.id
  FROM media jpeg
  JOIN media webp
    ON REGEXP_REPLACE(jpeg.filename, '\.(jpe?g)$', '', 'i') =
       REGEXP_REPLACE(webp.filename, '\.webp$', '', 'i')
  WHERE jpeg.mime_type IN ('image/jpeg', 'image/jpg')
    AND webp.mime_type = 'image/webp'
);

-- Optional: Get count of deleted records
-- SELECT COUNT(*) as deleted_count FROM (
--   SELECT jpeg.id
--   FROM media jpeg
--   JOIN media webp
--     ON REGEXP_REPLACE(jpeg.filename, '\.(jpe?g)$', '', 'i') =
--        REGEXP_REPLACE(webp.filename, '\.webp$', '', 'i')
--   WHERE jpeg.mime_type IN ('image/jpeg', 'image/jpg')
--     AND webp.mime_type = 'image/webp'
-- ) as duplicates;
