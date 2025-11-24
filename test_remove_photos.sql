-- Temporarily set all photo_id to NULL to test if photo relation is causing edit page to break
-- Run this to test, then check if edit page works

BEGIN;

-- Save current photo_id values for rollback if needed
CREATE TEMP TABLE photo_backup AS
SELECT id, photo_id FROM team_members WHERE photo_id IS NOT NULL;

-- Set all photo_id to NULL
UPDATE team_members SET photo_id = NULL;

COMMIT;

SELECT 'All photo_id set to NULL. Test edit page now.' as status;
SELECT 'Backed up ' || COUNT(*) || ' records with photo references' as backup_info
FROM photo_backup;

-- TO ROLLBACK (restore photo_id values):
-- UPDATE team_members tm
-- SET photo_id = pb.photo_id
-- FROM photo_backup pb
-- WHERE tm.id = pb.id;
