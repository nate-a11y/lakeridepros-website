import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add events_id column to payload_locked_documents_rels if it doesn't exist
  // This is required for Payload's document locking feature to work with the Events collection
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'payload_locked_documents_rels'
        AND column_name = 'events_id'
      ) THEN
        ALTER TABLE payload_locked_documents_rels
        ADD COLUMN events_id INTEGER REFERENCES events(id) ON DELETE CASCADE;

        CREATE INDEX IF NOT EXISTS idx_payload_locked_documents_rels_events_id
        ON payload_locked_documents_rels(events_id);
      END IF;
    END $$;
  `);

  // Also add venues_id column if it doesn't exist
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'payload_locked_documents_rels'
        AND column_name = 'venues_id'
      ) THEN
        ALTER TABLE payload_locked_documents_rels
        ADD COLUMN venues_id INTEGER REFERENCES venues(id) ON DELETE CASCADE;

        CREATE INDEX IF NOT EXISTS idx_payload_locked_documents_rels_venues_id
        ON payload_locked_documents_rels(venues_id);
      END IF;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE payload_locked_documents_rels DROP COLUMN IF EXISTS events_id;
    ALTER TABLE payload_locked_documents_rels DROP COLUMN IF EXISTS venues_id;
  `);
}
