import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create payload_locked_documents table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create payload_locked_documents_rels table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer,
      "media_id" integer,
      "pages_id" integer,
      "blog_posts_id" integer,
      "products_id" integer,
      "gift_cards_id" integer,
      "orders_id" integer,
      "partners_id" integer
    );
  `)

  // Add columns if they don't exist (for existing tables from dev mode)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "gift_cards_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "orders_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "blog_posts_id" integer;
    END $$;
  `)

  // Add foreign key constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_parent_fk"
        FOREIGN KEY ("parent_id")
        REFERENCES "payload_locked_documents"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add foreign keys for each collection
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_users_fk"
        FOREIGN KEY ("users_id")
        REFERENCES "users"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_media_fk"
        FOREIGN KEY ("media_id")
        REFERENCES "media"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_products_fk"
        FOREIGN KEY ("products_id")
        REFERENCES "products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add indexes for performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx"
      ON "payload_locked_documents" ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx"
      ON "payload_locked_documents_rels" ("parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx"
      ON "payload_locked_documents_rels" ("path");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_idx"
      ON "payload_locked_documents_rels" ("products_id");
  `)

  console.log('✓ Created payload_locked_documents tables and indexes')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;`)
}
