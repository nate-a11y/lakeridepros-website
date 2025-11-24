-- Comprehensive fix for team_members data causing blank edit pages
-- Run this to fix the server serialization errors

BEGIN;

-- 1. Fix any broken photo_id references (set to NULL if media doesn't exist)
UPDATE team_members tm
SET photo_id = NULL
WHERE photo_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.id = tm.photo_id);

SELECT 'Fixed broken photo references: ' || ROW_COUNT();

-- 2. Fix vehicle IDs to use proper UUIDs (only if bad format exists)
DO $$
DECLARE
  vehicle_rec RECORD;
  fixed_count INTEGER := 0;
BEGIN
  FOR vehicle_rec IN
    SELECT id, "_parent_id", "_order", vehicle
    FROM team_members_vehicles
    WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  LOOP
    DELETE FROM team_members_vehicles WHERE id = vehicle_rec.id;

    INSERT INTO team_members_vehicles ("_order", "_parent_id", "id", "vehicle")
    VALUES (
      vehicle_rec."_order",
      vehicle_rec."_parent_id",
      gen_random_uuid()::text,
      vehicle_rec.vehicle
    );

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE 'Fixed % vehicle IDs', fixed_count;
END $$;

-- 3. Verify data integrity
SELECT
  'team_members' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN photo_id IS NOT NULL THEN 1 END) as with_photos,
  COUNT(CASE WHEN first_name = '' OR last_name = '' THEN 1 END) as empty_required_fields
FROM team_members

UNION ALL

SELECT
  'team_members_vehicles' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as valid_uuid_format,
  COUNT(CASE WHEN id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as invalid_uuid_format
FROM team_members_vehicles;

COMMIT;

-- Alternative: If above doesn't work, uncomment to delete all migrated data and start fresh
-- (You can recreate team members through "Create New" which works perfectly)
/*
BEGIN;
DELETE FROM team_members_vehicles;
DELETE FROM team_members;
COMMIT;
SELECT 'All team_members data cleared. Use "Create New" in admin panel to recreate team members.';
*/
