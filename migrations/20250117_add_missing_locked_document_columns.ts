import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add missing collection foreign key columns to payload_locked_documents_rels
  await db.execute(sql`
    DO $$ BEGIN
      -- Add columns for collections that were added after initial locked_documents table creation
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "service_analytics_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "vehicles_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "testimonials_id" integer;
    END $$;
  `)

  // Add foreign key constraints for the new columns
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_services_fk"
        FOREIGN KEY ("services_id")
        REFERENCES "services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_service_analytics_fk"
        FOREIGN KEY ("service_analytics_id")
        REFERENCES "service_analytics"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk"
        FOREIGN KEY ("vehicles_id")
        REFERENCES "vehicles"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk"
        FOREIGN KEY ("testimonials_id")
        REFERENCES "testimonials"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add indexes for performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_idx"
      ON "payload_locked_documents_rels" ("services_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_analytics_idx"
      ON "payload_locked_documents_rels" ("service_analytics_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vehicles_idx"
      ON "payload_locked_documents_rels" ("vehicles_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_testimonials_idx"
      ON "payload_locked_documents_rels" ("testimonials_id");
  `)

  console.log('✓ Added missing collection columns to payload_locked_documents_rels')
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove the indexes
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_services_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_service_analytics_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_vehicles_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_testimonials_idx";`)

  // Remove foreign key constraints
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_service_analytics_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_vehicles_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_testimonials_fk";
  `)

  // Remove columns
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "services_id",
      DROP COLUMN IF EXISTS "service_analytics_id",
      DROP COLUMN IF EXISTS "vehicles_id",
      DROP COLUMN IF EXISTS "testimonials_id";
  `)
}
