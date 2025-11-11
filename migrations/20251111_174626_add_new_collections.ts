import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enums for new collections
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_products_categories" AS ENUM('apparel', 'accessories', 'drinkware', 'home');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'active');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_gift_cards_status" AS ENUM('active', 'redeemed', 'expired', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_orders_status" AS ENUM('processing', 'sent_to_printify', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_partners_category" AS ENUM('wedding', 'local-premier', 'trusted-referral');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_partners_subcategory" AS ENUM('advertising-marketing-technology', 'auto-marine-services', 'bars-restaurants', 'boat-captains-charters', 'lodging-rentals', 'construction-developers', 'home-services', 'campgrounds-rv-parks', 'entertainers-venues', 'event-planners-concierge', 'family-fun', 'nutrition-personal-care', 'golf', 'real-estate-financial', 'shopping');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create products tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" jsonb NOT NULL,
      "short_description" varchar,
      "featured_image_id" integer NOT NULL,
      "price" numeric NOT NULL,
      "compare_at_price" numeric,
      "sku" varchar,
      "in_stock" boolean DEFAULT true NOT NULL,
      "stock_quantity" numeric,
      "featured" boolean DEFAULT false,
      "printify_product_id" varchar,
      "printify_blueprint_id" varchar,
      "printify_print_provider_id" varchar,
      "status" "enum_products_status" DEFAULT 'draft' NOT NULL,
      "meta_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_categories" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_products_categories",
      "id" serial PRIMARY KEY NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_variants" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "sku" varchar NOT NULL,
      "price" numeric,
      "compare_at_price" numeric,
      "in_stock" boolean DEFAULT true,
      "stock_quantity" numeric,
      "size" varchar,
      "color" varchar,
      "printify_variant_id" varchar
    );
  `)

  // Create gift_cards table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "gift_cards" (
      "id" serial PRIMARY KEY NOT NULL,
      "code" varchar NOT NULL,
      "initial_amount" numeric NOT NULL,
      "current_balance" numeric NOT NULL,
      "status" "enum_gift_cards_status" DEFAULT 'active' NOT NULL,
      "purchaser_name" varchar NOT NULL,
      "purchaser_email" varchar NOT NULL,
      "recipient_name" varchar,
      "recipient_email" varchar,
      "message" varchar,
      "stripe_payment_intent_id" varchar,
      "stripe_checkout_session_id" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create orders tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "orders" (
      "id" serial PRIMARY KEY NOT NULL,
      "order_number" varchar NOT NULL,
      "customer_name" varchar NOT NULL,
      "customer_email" varchar NOT NULL,
      "status" "enum_orders_status" DEFAULT 'processing' NOT NULL,
      "shipping_address_line1" varchar NOT NULL,
      "shipping_address_line2" varchar,
      "shipping_address_city" varchar NOT NULL,
      "shipping_address_state" varchar NOT NULL,
      "shipping_address_postal_code" varchar NOT NULL,
      "shipping_address_country" varchar DEFAULT 'US' NOT NULL,
      "subtotal" numeric NOT NULL,
      "shipping" numeric NOT NULL,
      "tax" numeric NOT NULL,
      "total" numeric NOT NULL,
      "stripe_payment_intent_id" varchar,
      "stripe_checkout_session_id" varchar,
      "printify_order_id" varchar,
      "tracking_number" varchar,
      "tracking_url" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "orders_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "product_id" varchar NOT NULL,
      "product_name" varchar NOT NULL,
      "variant_id" varchar NOT NULL,
      "variant_name" varchar NOT NULL,
      "quantity" numeric NOT NULL,
      "price" numeric NOT NULL
    );
  `)

  // Create partners table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partners" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "category" "enum_partners_category" NOT NULL,
      "subcategory" "enum_partners_subcategory",
      "logo_id" integer NOT NULL,
      "description" varchar,
      "website" varchar,
      "phone" varchar,
      "email" varchar,
      "address" varchar,
      "featured" boolean DEFAULT false,
      "order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Add foreign keys and indexes
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products" ADD CONSTRAINT "products_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products_categories" ADD CONSTRAINT "products_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create indexes
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "products_featured_image_idx" ON "products" USING btree ("featured_image_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");`)
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "gift_cards_code_idx" ON "gift_cards" USING btree ("code");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "gift_cards_updated_at_idx" ON "gift_cards" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "gift_cards_created_at_idx" ON "gift_cards" USING btree ("created_at");`)
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders" USING btree ("order_number");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "orders_updated_at_idx" ON "orders" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "partners_logo_idx" ON "partners" USING btree ("logo_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "partners_updated_at_idx" ON "partners" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "products_images" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "products_categories" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "products_tags" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "products_variants" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "products" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "gift_cards" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "orders_items" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "orders" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "partners" CASCADE;`)

  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_products_categories";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_products_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_gift_cards_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_orders_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_partners_category";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_partners_subcategory";`)
}
