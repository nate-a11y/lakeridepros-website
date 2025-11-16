import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Add pointToPointMinimum column to vehicles pricing
    ALTER TABLE "vehicles"
    ADD COLUMN IF NOT EXISTS "pricing_pointToPointMinimum" numeric;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Remove pointToPointMinimum column from vehicles pricing
    ALTER TABLE "vehicles"
    DROP COLUMN IF EXISTS "pricing_pointToPointMinimum";
  `)
}
