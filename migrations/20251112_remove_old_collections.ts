import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Remove old collection columns that no longer exist in the config
  await db.execute(sql`
    DO $$ BEGIN
      -- Drop constraints first if they exist
      ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk";
      ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_vehicles_fk";
      ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_testimonials_fk";

      -- Drop indexes if they exist
      DROP INDEX IF EXISTS "payload_locked_documents_rels_services_idx";
      DROP INDEX IF EXISTS "payload_locked_documents_rels_vehicles_idx";
      DROP INDEX IF EXISTS "payload_locked_documents_rels_testimonials_idx";

      -- Drop the columns if they exist
      ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "services_id";
      ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "vehicles_id";
      ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "testimonials_id";
    END $$;
  `)

  console.log('✓ Removed old collection references (services, vehicles, testimonials) from payload_locked_documents_rels')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Re-add the columns if rolling back (though they would be empty)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "vehicles_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "testimonials_id" integer;
    END $$;
  `)
}
