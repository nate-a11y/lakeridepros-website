import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Create enum for defect severity
  await db.execute(sql`
    CREATE TYPE "public"."enum_defects_severity" AS ENUM('critical', 'major', 'minor');
  `)

  // Create enum for defect status
  await db.execute(sql`
    CREATE TYPE "public"."enum_defects_status" AS ENUM('open', 'in_progress', 'corrected', 'deferred');
  `)

  // Create enum for DVIR inspection type
  await db.execute(sql`
    CREATE TYPE "public"."enum_dvirs_inspection_type" AS ENUM('pre_trip', 'post_trip', 'routine');
  `)

  // Create enum for DVIR status
  await db.execute(sql`
    CREATE TYPE "public"."enum_dvirs_status" AS ENUM('draft', 'submitted', 'reviewed', 'approved', 'requires_repair');
  `)

  // Create enum for inspection item category
  await db.execute(sql`
    CREATE TYPE "public"."enum_dvirs_inspection_items_category" AS ENUM('exterior', 'interior', 'engine', 'brakes', 'tires', 'lights', 'safety', 'other');
  `)

  // Create enum for inspection item condition
  await db.execute(sql`
    CREATE TYPE "public"."enum_dvirs_inspection_items_condition" AS ENUM('satisfactory', 'needs_attention', 'defective');
  `)

  // Create DVIRs table first (without defect references yet)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "dvirs" (
      "id" serial PRIMARY KEY NOT NULL,
      "vehicle_id" integer NOT NULL,
      "inspector_id" integer NOT NULL,
      "inspection_date" timestamp(3) with time zone NOT NULL,
      "inspection_type" "enum_dvirs_inspection_type" NOT NULL,
      "status" "enum_dvirs_status" DEFAULT 'draft' NOT NULL,
      "odometer_reading" numeric,
      "has_defects" boolean DEFAULT false,
      "safe_to_operate" boolean DEFAULT true,
      "inspector_signature" varchar,
      "inspector_notes" varchar,
      "reviewed_by_id" integer,
      "reviewed_date" timestamp(3) with time zone,
      "review_notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create Defects table (can now reference dvirs)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "defects" (
      "id" serial PRIMARY KEY NOT NULL,
      "vehicle_id" integer NOT NULL,
      "origin_dvir_id" integer NOT NULL,
      "description" varchar NOT NULL,
      "location" varchar,
      "severity" "enum_defects_severity" DEFAULT 'minor' NOT NULL,
      "status" "enum_defects_status" DEFAULT 'open' NOT NULL,
      "identified_by_id" integer NOT NULL,
      "identified_date" timestamp(3) with time zone NOT NULL,
      "corrected_by_id" integer,
      "corrected_date" timestamp(3) with time zone,
      "correction_notes" varchar,
      "deferral_reason" varchar,
      "deferral_approved_by_id" integer,
      "carried_over_count" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create Defects images array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "defects_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar
    );
  `)

  // Create DVIRs inspection items array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "dvirs_inspection_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL,
      "category" "enum_dvirs_inspection_items_category",
      "condition" "enum_dvirs_inspection_items_condition" NOT NULL,
      "notes" varchar
    );
  `)

  // Create DVIRs new defects array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "dvirs_new_defects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "defect_id" integer NOT NULL
    );
  `)

  // Create DVIRs carried over defects array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "dvirs_carried_over_defects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "defect_id" integer NOT NULL,
      "carried_over_from_id" integer
    );
  `)

  // Add foreign key constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects" ADD CONSTRAINT "defects_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects" ADD CONSTRAINT "defects_origin_dvir_id_dvirs_id_fk" FOREIGN KEY ("origin_dvir_id") REFERENCES "dvirs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects" ADD CONSTRAINT "defects_identified_by_id_users_id_fk" FOREIGN KEY ("identified_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects" ADD CONSTRAINT "defects_corrected_by_id_users_id_fk" FOREIGN KEY ("corrected_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects" ADD CONSTRAINT "defects_deferral_approved_by_id_users_id_fk" FOREIGN KEY ("deferral_approved_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects_images" ADD CONSTRAINT "defects_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "defects_images" ADD CONSTRAINT "defects_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "defects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs" ADD CONSTRAINT "dvirs_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs" ADD CONSTRAINT "dvirs_inspector_id_users_id_fk" FOREIGN KEY ("inspector_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs" ADD CONSTRAINT "dvirs_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_inspection_items" ADD CONSTRAINT "dvirs_inspection_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "dvirs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_new_defects" ADD CONSTRAINT "dvirs_new_defects_defect_id_defects_id_fk" FOREIGN KEY ("defect_id") REFERENCES "defects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_new_defects" ADD CONSTRAINT "dvirs_new_defects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "dvirs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_carried_over_defects" ADD CONSTRAINT "dvirs_carried_over_defects_defect_id_defects_id_fk" FOREIGN KEY ("defect_id") REFERENCES "defects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_carried_over_defects" ADD CONSTRAINT "dvirs_carried_over_defects_carried_over_from_id_dvirs_id_fk" FOREIGN KEY ("carried_over_from_id") REFERENCES "dvirs"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "dvirs_carried_over_defects" ADD CONSTRAINT "dvirs_carried_over_defects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "dvirs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create indexes for better query performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_vehicle_idx" ON "defects" USING btree ("vehicle_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_origin_dvir_idx" ON "defects" USING btree ("origin_dvir_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_status_idx" ON "defects" USING btree ("status");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_severity_idx" ON "defects" USING btree ("severity");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_identified_date_idx" ON "defects" USING btree ("identified_date");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_created_at_idx" ON "defects" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_images_order_idx" ON "defects_images" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "defects_images_parent_id_idx" ON "defects_images" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_vehicle_idx" ON "dvirs" USING btree ("vehicle_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_inspector_idx" ON "dvirs" USING btree ("inspector_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_status_idx" ON "dvirs" USING btree ("status");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_inspection_date_idx" ON "dvirs" USING btree ("inspection_date");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_inspection_type_idx" ON "dvirs" USING btree ("inspection_type");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_created_at_idx" ON "dvirs" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_inspection_items_order_idx" ON "dvirs_inspection_items" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_inspection_items_parent_id_idx" ON "dvirs_inspection_items" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_new_defects_order_idx" ON "dvirs_new_defects" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_new_defects_parent_id_idx" ON "dvirs_new_defects" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_carried_over_defects_order_idx" ON "dvirs_carried_over_defects" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "dvirs_carried_over_defects_parent_id_idx" ON "dvirs_carried_over_defects" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop tables in reverse order (child tables first)
  await db.execute(sql`
    DROP TABLE IF EXISTS "dvirs_carried_over_defects" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "dvirs_new_defects" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "dvirs_inspection_items" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "defects_images" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "dvirs" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "defects" CASCADE;
  `)

  // Drop enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_defects_severity";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_defects_status";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_dvirs_inspection_type";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_dvirs_status";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_dvirs_inspection_items_category";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_dvirs_inspection_items_condition";
  `)
}
