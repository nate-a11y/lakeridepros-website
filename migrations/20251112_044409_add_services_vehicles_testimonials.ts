import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enum for vehicle types
  await db.execute(sql`
    CREATE TYPE "public"."enum_vehicles_type" AS ENUM('sedan', 'suv', 'van', 'limousine', 'bus', 'boat', 'other');
  `)

  // Create enum for service pricing types
  await db.execute(sql`
    CREATE TYPE "public"."enum_services_pricing_pricing_type" AS ENUM('hourly', 'fixed', 'custom');
  `)

  // Create Services table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar NOT NULL,
      "short_description" varchar,
      "icon" varchar,
      "image_id" integer,
      "pricing_base_price" numeric,
      "pricing_pricing_type" "enum_services_pricing_pricing_type" DEFAULT 'custom',
      "pricing_notes" varchar,
      "active" boolean DEFAULT true,
      "order" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "services_slug_idx" UNIQUE("slug")
    );
  `)

  // Create Services features array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_features" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "feature" varchar
    );
  `)

  // Create Vehicles table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "vehicles" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "type" "enum_vehicles_type" NOT NULL,
      "description" varchar NOT NULL,
      "capacity" numeric NOT NULL,
      "featured_image_id" integer,
      "specifications_make" varchar,
      "specifications_model" varchar,
      "specifications_year" numeric,
      "specifications_color" varchar,
      "pricing_hourly_rate" numeric,
      "pricing_daily_rate" numeric,
      "pricing_notes" varchar,
      "available" boolean DEFAULT true,
      "featured" boolean DEFAULT false,
      "order" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "vehicles_slug_idx" UNIQUE("slug")
    );
  `)

  // Create Vehicles images array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "vehicles_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt" varchar
    );
  `)

  // Create Vehicles amenities array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "vehicles_amenities" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "amenity" varchar
    );
  `)

  // Create Testimonials table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "testimonials" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "title" varchar,
      "company" varchar,
      "content" varchar NOT NULL,
      "rating" numeric,
      "image_id" integer,
      "featured" boolean DEFAULT false,
      "order" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Add foreign key constraints for media relationships
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "vehicles_images" ADD CONSTRAINT "vehicles_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "vehicles_images" ADD CONSTRAINT "vehicles_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "vehicles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "vehicles_amenities" ADD CONSTRAINT "vehicles_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "vehicles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create indexes for better query performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_created_at_idx" ON "services" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_active_idx" ON "services" USING btree ("active");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_order_idx" ON "services" USING btree ("order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_features_order_idx" ON "services_features" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_created_at_idx" ON "vehicles" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_available_idx" ON "vehicles" USING btree ("available");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_featured_idx" ON "vehicles" USING btree ("featured");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_order_idx" ON "vehicles" USING btree ("order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_images_order_idx" ON "vehicles_images" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_images_parent_id_idx" ON "vehicles_images" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_amenities_order_idx" ON "vehicles_amenities" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "vehicles_amenities_parent_id_idx" ON "vehicles_amenities" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "testimonials_featured_idx" ON "testimonials" USING btree ("featured");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "testimonials_order_idx" ON "testimonials" USING btree ("order");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop tables in reverse order (child tables first)
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_features" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "vehicles_images" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "vehicles_amenities" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "services" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "vehicles" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "testimonials" CASCADE;
  `)

  // Drop enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_vehicles_type";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_services_pricing_pricing_type";
  `)
}
