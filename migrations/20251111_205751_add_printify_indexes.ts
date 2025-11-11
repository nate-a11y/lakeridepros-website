import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add indexes on Printify ID fields for faster lookups
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "products_printify_product_id_idx" ON "products" USING btree ("printify_product_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "products_printify_blueprint_id_idx" ON "products" USING btree ("printify_blueprint_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "products_printify_print_provider_id_idx" ON "products" USING btree ("printify_print_provider_id");
  `)

  console.log('✓ Added indexes on Printify ID fields')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "products_printify_product_id_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "products_printify_blueprint_id_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "products_printify_print_provider_id_idx";`)
}
