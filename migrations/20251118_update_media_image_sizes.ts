import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add new optimized image size columns
  await db.execute(sql`
    ALTER TABLE "media"
    ADD COLUMN IF NOT EXISTS "sizes_optimized_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_optimized_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_optimized_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_optimized_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_optimized_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_optimized_filename" varchar;
  `)

  // Drop old image size columns (thumbnail, card, tablet, desktop)
  await db.execute(sql`
    ALTER TABLE "media"
    DROP COLUMN IF EXISTS "sizes_thumbnail_url",
    DROP COLUMN IF EXISTS "sizes_thumbnail_width",
    DROP COLUMN IF EXISTS "sizes_thumbnail_height",
    DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type",
    DROP COLUMN IF EXISTS "sizes_thumbnail_filesize",
    DROP COLUMN IF EXISTS "sizes_thumbnail_filename",
    DROP COLUMN IF EXISTS "sizes_card_url",
    DROP COLUMN IF EXISTS "sizes_card_width",
    DROP COLUMN IF EXISTS "sizes_card_height",
    DROP COLUMN IF EXISTS "sizes_card_mime_type",
    DROP COLUMN IF EXISTS "sizes_card_filesize",
    DROP COLUMN IF EXISTS "sizes_card_filename",
    DROP COLUMN IF EXISTS "sizes_tablet_url",
    DROP COLUMN IF EXISTS "sizes_tablet_width",
    DROP COLUMN IF EXISTS "sizes_tablet_height",
    DROP COLUMN IF EXISTS "sizes_tablet_mime_type",
    DROP COLUMN IF EXISTS "sizes_tablet_filesize",
    DROP COLUMN IF EXISTS "sizes_tablet_filename",
    DROP COLUMN IF EXISTS "sizes_desktop_url",
    DROP COLUMN IF EXISTS "sizes_desktop_width",
    DROP COLUMN IF EXISTS "sizes_desktop_height",
    DROP COLUMN IF EXISTS "sizes_desktop_mime_type",
    DROP COLUMN IF EXISTS "sizes_desktop_filesize",
    DROP COLUMN IF EXISTS "sizes_desktop_filename";
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Restore old image size columns
  await db.execute(sql`
    ALTER TABLE "media"
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_tablet_filename" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_desktop_filename" varchar;
  `)

  // Drop optimized size columns
  await db.execute(sql`
    ALTER TABLE "media"
    DROP COLUMN IF EXISTS "sizes_optimized_url",
    DROP COLUMN IF EXISTS "sizes_optimized_width",
    DROP COLUMN IF EXISTS "sizes_optimized_height",
    DROP COLUMN IF EXISTS "sizes_optimized_mime_type",
    DROP COLUMN IF EXISTS "sizes_optimized_filesize",
    DROP COLUMN IF EXISTS "sizes_optimized_filename";
  `)
}
