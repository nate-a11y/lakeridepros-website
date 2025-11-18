-- ============================================================================
-- Delete PNG files with long filenames (likely Printify imports)
-- Keep PNG files with short filenames (likely manual uploads)
-- ============================================================================

-- STEP 1: Preview PNGs that will be DELETED (filename > 15 chars)
SELECT
  id,
  filename,
  LENGTH(filename) as name_length,
  filesize,
  ROUND(filesize / 1024.0, 2) as size_kb,
  created_at
FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) > 15
ORDER BY created_at DESC
LIMIT 20;

-- STEP 2: Count how many will be deleted
SELECT COUNT(*) as files_to_delete
FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) > 15;

-- STEP 3: Preview PNGs that will be KEPT (filename <= 15 chars)
SELECT
  id,
  filename,
  LENGTH(filename) as name_length,
  filesize,
  ROUND(filesize / 1024.0, 2) as size_kb,
  created_at
FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) <= 15
ORDER BY created_at DESC;

-- STEP 4: Calculate storage savings
SELECT
  'To Delete' as category,
  COUNT(*) as file_count,
  SUM(filesize) as total_bytes,
  ROUND(SUM(filesize) / 1024.0 / 1024.0, 2) as total_mb
FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) > 15

UNION ALL

SELECT
  'To Keep' as category,
  COUNT(*) as file_count,
  SUM(filesize) as total_bytes,
  ROUND(SUM(filesize) / 1024.0 / 1024.0, 2) as total_mb
FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) <= 15;

-- STEP 5: DELETE the long-filename PNGs (RUN ONLY AFTER REVIEWING ABOVE!)
DELETE FROM media
WHERE mime_type = 'image/png'
  AND LENGTH(filename) > 15;
