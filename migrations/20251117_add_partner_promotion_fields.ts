import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add 'promotions' to the partners category enum
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_partners_category" ADD VALUE IF NOT EXISTS 'promotions';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add new columns to partners table
  await db.execute(sql`
    ALTER TABLE "partners"
    ADD COLUMN IF NOT EXISTS "slug" varchar UNIQUE,
    ADD COLUMN IF NOT EXISTS "blurb" varchar,
    ADD COLUMN IF NOT EXISTS "sms_template" varchar,
    ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "publish_date" timestamp(3) with time zone;
  `)

  // Create index on slug for faster lookups
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "partners_slug_idx" ON "partners" USING btree ("slug");
  `)

  // Create partners_images table for multiple image uploads
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partners_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );
  `)

  // Add foreign key constraint for partners_images
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "partners_images"
      ADD CONSTRAINT "partners_images_parent_id_partners_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "partners_images"
      ADD CONSTRAINT "partners_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create index on partners_images parent_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "partners_images_order_idx" ON "partners_images" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "partners_images_parent_id_idx" ON "partners_images" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop partners_images table
  await db.execute(sql`
    DROP TABLE IF EXISTS "partners_images";
  `)

  // Remove new columns from partners table
  await db.execute(sql`
    ALTER TABLE "partners"
    DROP COLUMN IF EXISTS "slug",
    DROP COLUMN IF EXISTS "blurb",
    DROP COLUMN IF EXISTS "sms_template",
    DROP COLUMN IF EXISTS "active",
    DROP COLUMN IF EXISTS "publish_date";
  `)

  // Note: We cannot remove values from an enum in PostgreSQL without recreating it
  // This would require dropping and recreating the entire enum and updating all references
  // For safety, we leave the 'promotions' value in the enum even when rolling back
}
