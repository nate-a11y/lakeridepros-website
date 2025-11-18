-- ============================================================================
-- Investigation: See what images exist and their naming patterns
-- ============================================================================

-- Query 1: Show all JPG/JPEG files
SELECT
  id,
  filename,
  mime_type,
  filesize,
  created_at
FROM media
WHERE mime_type IN ('image/jpeg', 'image/jpg')
ORDER BY created_at DESC
LIMIT 20;

-- Query 2: Show all WebP files
SELECT
  id,
  filename,
  mime_type,
  filesize,
  created_at
FROM media
WHERE mime_type = 'image/webp'
ORDER BY created_at DESC
LIMIT 20;

-- Query 3: Show side-by-side comparison of similar filenames
SELECT
  jpeg.filename as jpeg_file,
  jpeg.mime_type as jpeg_type,
  webp.filename as webp_file,
  webp.mime_type as webp_type,
  jpeg.id as jpeg_id,
  webp.id as webp_id
FROM media jpeg
CROSS JOIN media webp
WHERE jpeg.mime_type IN ('image/jpeg', 'image/jpg')
  AND webp.mime_type = 'image/webp'
  AND (
    -- Try different matching patterns
    jpeg.filename LIKE REPLACE(REPLACE(webp.filename, '.webp', ''), '-1024x1024', '') || '%'
    OR webp.filename LIKE REPLACE(REPLACE(REPLACE(jpeg.filename, '.jpg', ''), '.jpeg', ''), '-1024x1024', '') || '%'
  )
LIMIT 20;

-- Query 4: Group by base filename to see duplicates
SELECT
  REGEXP_REPLACE(filename, '\.(webp|jpe?g)$', '', 'i') as base_filename,
  ARRAY_AGG(mime_type) as mime_types,
  ARRAY_AGG(filename) as filenames,
  ARRAY_AGG(id) as ids,
  COUNT(*) as file_count
FROM media
WHERE mime_type IN ('image/webp', 'image/jpeg', 'image/jpg')
GROUP BY REGEXP_REPLACE(filename, '\.(webp|jpe?g)$', '', 'i')
HAVING COUNT(*) > 1
ORDER BY file_count DESC;
