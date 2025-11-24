import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Create enums for team members
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_team_members_role" AS ENUM('Owner', 'Dispatcher', 'Driver');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_team_members_status" AS ENUM('active', 'inactive', 'on_leave', 'terminated');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create team_members table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "team_members" (
      "id" serial PRIMARY KEY NOT NULL,
      "first_name" varchar NOT NULL,
      "last_name" varchar NOT NULL,
      "display_name" varchar,
      "email" varchar,
      "phone" varchar,
      "show_on_team_page" boolean DEFAULT true NOT NULL,
      "role" "enum_team_members_role" NOT NULL,
      "photo_id" integer,
      "priority" numeric DEFAULT 999,
      "status" "enum_team_members_status" DEFAULT 'active' NOT NULL,
      "hire_date" timestamp(3) with time zone,
      "department" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create team_members_vehicles array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "team_members_vehicles" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "vehicle" varchar NOT NULL
    );
  `)

  // Add foreign keys
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "team_members_vehicles" ADD CONSTRAINT "team_members_vehicles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_photo_idx" ON "team_members" USING btree ("photo_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_show_on_team_page_idx" ON "team_members" USING btree ("show_on_team_page");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_status_idx" ON "team_members" USING btree ("status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_priority_idx" ON "team_members" USING btree ("priority");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_created_at_idx" ON "team_members" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_vehicles_order_idx" ON "team_members_vehicles" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "team_members_vehicles_parent_id_idx" ON "team_members_vehicles" USING btree ("_parent_id");`)

  // Migrate existing team data from directory + users tables
  await db.execute(sql`
    DO $$
    DECLARE
      dir_record RECORD;
      new_team_member_id INTEGER;
      vehicle_text TEXT;
      vehicle_index INTEGER;
    BEGIN
      -- Check if directory table exists
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'directory'
      ) THEN
        -- Migrate each directory record
        FOR dir_record IN
          SELECT
            d.id as dir_id,
            d.role,
            d.department,
            d.priority,
            d.is_active,
            d.photo_url,
            d.vehicles,
            d.created_at,
            d.updated_at,
            u.id as user_id,
            u.name,
            u.email,
            u.display_name,
            u.phone,
            u.employment_status,
            u.first_name,
            u.last_name,
            u.hire_date
          FROM directory d
          INNER JOIN users u ON d.user_id = u.id
          WHERE d.is_active = true
        LOOP
          -- Map role to enum value
          DECLARE
            mapped_role TEXT;
            mapped_status TEXT;
          BEGIN
            -- Map role (case insensitive)
            mapped_role := CASE
              WHEN LOWER(dir_record.role) LIKE '%owner%' THEN 'Owner'
              WHEN LOWER(dir_record.role) LIKE '%dispatch%' THEN 'Dispatcher'
              WHEN LOWER(dir_record.role) LIKE '%driver%' THEN 'Driver'
              ELSE 'Driver' -- default
            END;

            -- Map status
            mapped_status := CASE
              WHEN dir_record.employment_status = 'active' THEN 'active'
              WHEN dir_record.employment_status = 'inactive' THEN 'inactive'
              ELSE 'active' -- default
            END;

            -- Insert team member
            INSERT INTO team_members (
              first_name,
              last_name,
              display_name,
              email,
              phone,
              show_on_team_page,
              role,
              priority,
              status,
              hire_date,
              department,
              created_at,
              updated_at
            ) VALUES (
              COALESCE(dir_record.first_name, SPLIT_PART(dir_record.name, ' ', 1), 'Unknown'),
              COALESCE(dir_record.last_name, SPLIT_PART(dir_record.name, ' ', 2), ''),
              dir_record.display_name,
              dir_record.email,
              dir_record.phone,
              true,
              mapped_role::"enum_team_members_role",
              COALESCE(dir_record.priority, 999),
              mapped_status::"enum_team_members_status",
              dir_record.hire_date,
              dir_record.department,
              COALESCE(dir_record.created_at, NOW()),
              COALESCE(dir_record.updated_at, NOW())
            ) RETURNING id INTO new_team_member_id;

            -- Migrate vehicles if they exist
            IF dir_record.vehicles IS NOT NULL AND array_length(dir_record.vehicles, 1) > 0 THEN
              vehicle_index := 0;
              FOREACH vehicle_text IN ARRAY dir_record.vehicles
              LOOP
                INSERT INTO team_members_vehicles (
                  "_order",
                  "_parent_id",
                  "id",
                  "vehicle"
                ) VALUES (
                  vehicle_index,
                  new_team_member_id,
                  dir_record.dir_id || '-' || vehicle_index,
                  vehicle_text
                );
                vehicle_index := vehicle_index + 1;
              END LOOP;
            END IF;

          EXCEPTION
            WHEN OTHERS THEN
              -- Log error but continue migration
              RAISE NOTICE 'Error migrating directory record %: %', dir_record.dir_id, SQLERRM;
          END;
        END LOOP;

        RAISE NOTICE 'Successfully migrated directory data to team_members';
      END IF;
    END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop team members tables
  await db.execute(sql`DROP TABLE IF EXISTS "team_members_vehicles" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "team_members" CASCADE;`)

  // Drop enum types
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_team_members_role";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_team_members_status";`)
}
