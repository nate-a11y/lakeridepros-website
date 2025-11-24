-- Fix team_members_vehicles IDs to use proper UUIDs instead of "123-0" format
-- This fixes the server serialization error causing blank edit pages

DO $$
DECLARE
  vehicle_rec RECORD;
BEGIN
  -- Update each vehicle record with a new UUID
  FOR vehicle_rec IN
    SELECT id, "_parent_id", "_order", vehicle
    FROM team_members_vehicles
    WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  LOOP
    -- Delete old record and insert with new UUID
    DELETE FROM team_members_vehicles WHERE id = vehicle_rec.id;

    INSERT INTO team_members_vehicles ("_order", "_parent_id", "id", "vehicle")
    VALUES (
      vehicle_rec."_order",
      vehicle_rec."_parent_id",
      gen_random_uuid()::text,
      vehicle_rec.vehicle
    );

    RAISE NOTICE 'Fixed vehicle ID for parent %, order %', vehicle_rec."_parent_id", vehicle_rec."_order";
  END LOOP;

  RAISE NOTICE 'Completed fixing vehicle IDs';
END $$;

-- Verify the fix
SELECT COUNT(*) as total_vehicles,
       COUNT(CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as uuid_format,
       COUNT(CASE WHEN id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as bad_format
FROM team_members_vehicles;
