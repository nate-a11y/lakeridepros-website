import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE products_variants
    ADD COLUMN IF NOT EXISTS color_hex VARCHAR(10);

    COMMENT ON COLUMN products_variants.color_hex IS 'Hex color code from Printify (e.g., "#000000")';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE products_variants
    DROP COLUMN IF EXISTS color_hex;
  `);
}
