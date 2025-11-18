-- ============================================================================
-- Delete PNG files with Printify timestamp pattern (e.g., -1763359279828.png)
-- Keeps manually uploaded PNG files without timestamp patterns
-- ============================================================================

-- STEP 1: Preview PNGs that will be DELETED (has timestamp pattern)
-- Matches filenames ending with: -[digits].png
SELECT
  id,
  filename,
  filesize,
  ROUND(filesize / 1024.0, 2) as size_kb,
  created_at
FROM media
WHERE mime_type = 'image/png'
  AND filename ~ '-[0-9]{10,}\.png$'
ORDER BY created_at DESC
LIMIT 20;

-- STEP 2: Count how many will be deleted
SELECT COUNT(*) as files_to_delete
FROM media
WHERE mime_type = 'image/png'
  AND filename ~ '-[0-9]{10,}\.png$';

-- STEP 3: Preview PNGs that will be KEPT (no timestamp pattern)
SELECT
  id,
  filename,
  filesize,
  ROUND(filesize / 1024.0, 2) as size_kb,
  created_at
FROM media
WHERE mime_type = 'image/png'
  AND filename !~ '-[0-9]{10,}\.png$'
ORDER BY created_at DESC;

-- STEP 4: Calculate storage savings
SELECT
  'Printify (To Delete)' as category,
  COUNT(*) as file_count,
  SUM(filesize) as total_bytes,
  ROUND(SUM(filesize) / 1024.0 / 1024.0, 2) as total_mb
FROM media
WHERE mime_type = 'image/png'
  AND filename ~ '-[0-9]{10,}\.png$'

UNION ALL

SELECT
  'Manual Uploads (To Keep)' as category,
  COUNT(*) as file_count,
  SUM(filesize) as total_bytes,
  ROUND(SUM(filesize) / 1024.0 / 1024.0, 2) as total_mb
FROM media
WHERE mime_type = 'image/png'
  AND filename !~ '-[0-9]{10,}\.png$';

-- STEP 5: DELETE Printify PNG files (RUN ONLY AFTER REVIEWING ABOVE!)
DELETE FROM media
WHERE mime_type = 'image/png'
  AND filename ~ '-[0-9]{10,}\.png$';

-- Pattern explanation:
-- ~ is PostgreSQL regex match operator
-- -[0-9]{10,} matches a hyphen followed by 10 or more digits
-- \.png$ matches .png at the end of the filename
-- This catches patterns like: -1763359279828.png
