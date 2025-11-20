import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add personalization columns to products table
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_enabled" boolean DEFAULT false;
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_instructions" varchar;
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_max_length" integer;
    END $$;
  `)

  console.log('✓ Added personalization columns to products table')
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove personalization columns from products table
  await db.execute(sql`
    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "personalization_enabled",
      DROP COLUMN IF EXISTS "personalization_instructions",
      DROP COLUMN IF EXISTS "personalization_max_length";
  `)

  console.log('✓ Removed personalization columns from products table')
}
