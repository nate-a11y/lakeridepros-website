-- ============================================================================
-- Safely delete Printify PNG files and allow re-import with WebP
-- ============================================================================

-- STEP 1: Check the current constraint on products.featured_image_id
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'products'
  AND kcu.column_name = 'featured_image_id';

-- STEP 2: Preview how many products will be affected
SELECT
  COUNT(DISTINCT p.id) as affected_products
FROM products p
JOIN media m ON p.featured_image_id = m.id
WHERE m.mime_type = 'image/png'
  AND m.filename ~ '-[0-9]{10,}\.png$';

-- STEP 3: Preview affected products and their images
SELECT
  p.id as product_id,
  p.title as product_title,
  p.featured_image_id,
  m.filename as featured_image_filename,
  m.filesize
FROM products p
JOIN media m ON p.featured_image_id = m.id
WHERE m.mime_type = 'image/png'
  AND m.filename ~ '-[0-9]{10,}\.png$'
LIMIT 20;

-- STEP 4: Temporarily allow NULL for both image columns
ALTER TABLE products
ALTER COLUMN featured_image_id DROP NOT NULL;

ALTER TABLE products_images
ALTER COLUMN image_id DROP NOT NULL;

-- STEP 5: Delete product image associations that reference Printify PNGs
-- (This prevents orphaned rows in products_images)
DELETE FROM products_images
WHERE image_id IN (
  SELECT id FROM media
  WHERE mime_type = 'image/png'
    AND filename ~ '-[0-9]{10,}\.png$'
);

-- STEP 6: Delete Printify PNG files
-- This will cascade and set featured_image_id to NULL for affected products
DELETE FROM media
WHERE mime_type = 'image/png'
  AND filename ~ '-[0-9]{10,}\.png$';

-- STEP 7: Verify products with NULL featured_image_id
SELECT
  id,
  title,
  featured_image_id,
  printify_id
FROM products
WHERE featured_image_id IS NULL;

-- STEP 8: After Printify re-sync completes, restore the NOT NULL constraints
-- (Only run this AFTER the Printify sync has completed successfully)
-- ALTER TABLE products
-- ALTER COLUMN featured_image_id SET NOT NULL;
--
-- ALTER TABLE products_images
-- ALTER COLUMN image_id SET NOT NULL;

-- NOTE: After running STEP 5, immediately run the Printify sync to re-import
-- all products with WebP images. Once that completes, you can run STEP 7
-- to restore the NOT NULL constraint.
