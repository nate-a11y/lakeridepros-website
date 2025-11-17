import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Create service_analytics table
    -- This table tracks service popularity based on views and booking requests
    CREATE TABLE IF NOT EXISTS "service_analytics" (
      "id" serial PRIMARY KEY NOT NULL,
      "service_id" integer,
      "views" numeric DEFAULT 0 NOT NULL,
      "bookings" numeric DEFAULT 0 NOT NULL,
      "views_last30_days" numeric DEFAULT 0 NOT NULL,
      "bookings_last30_days" numeric DEFAULT 0 NOT NULL,
      "popularity_score" numeric DEFAULT 0 NOT NULL,
      "last_viewed_at" timestamp(3) with time zone,
      "last_booked_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Create dailyStats table (for array field)
    CREATE TABLE IF NOT EXISTS "service_analytics_daily_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "date" timestamp(3) with time zone,
      "views" numeric DEFAULT 0,
      "bookings" numeric DEFAULT 0
    );

    -- Create indexes for main table
    CREATE UNIQUE INDEX IF NOT EXISTS "service_analytics_service_idx" ON "service_analytics" ("service_id");
    CREATE INDEX IF NOT EXISTS "service_analytics_popularity_score_idx" ON "service_analytics" ("popularity_score");
    CREATE INDEX IF NOT EXISTS "service_analytics_created_at_idx" ON "service_analytics" ("created_at");

    -- Create indexes for dailyStats table
    CREATE INDEX IF NOT EXISTS "service_analytics_daily_stats_order_idx" ON "service_analytics_daily_stats" ("_order");
    CREATE INDEX IF NOT EXISTS "service_analytics_daily_stats_parent_idx" ON "service_analytics_daily_stats" ("_parent_id");

    -- Add foreign key for dailyStats
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_analytics_daily_stats_parent_fk'
      ) THEN
        ALTER TABLE "service_analytics_daily_stats" ADD CONSTRAINT "service_analytics_daily_stats_parent_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "service_analytics"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    -- Add foreign key constraint
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_analytics_service_id_services_id_fk'
      ) THEN
        ALTER TABLE "service_analytics" ADD CONSTRAINT "service_analytics_service_id_services_id_fk"
        FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    -- Enable RLS on both tables
    ALTER TABLE "service_analytics" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "service_analytics_daily_stats" ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist (for idempotency)
    DROP POLICY IF EXISTS "Public can view service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow write to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow update to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow delete to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Public can view daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow write to daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow update to daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow delete to daily stats" ON "service_analytics_daily_stats";

    -- RLS policies for service_analytics table
    CREATE POLICY "Public can view service analytics" ON "service_analytics"
      FOR SELECT
      USING (true);

    CREATE POLICY "Allow write to service analytics" ON "service_analytics"
      FOR INSERT
      WITH CHECK (true);

    CREATE POLICY "Allow update to service analytics" ON "service_analytics"
      FOR UPDATE
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Allow delete to service analytics" ON "service_analytics"
      FOR DELETE
      USING (true);

    -- RLS policies for service_analytics_daily_stats table
    CREATE POLICY "Public can view daily stats" ON "service_analytics_daily_stats"
      FOR SELECT
      USING (true);

    CREATE POLICY "Allow write to daily stats" ON "service_analytics_daily_stats"
      FOR INSERT
      WITH CHECK (true);

    CREATE POLICY "Allow update to daily stats" ON "service_analytics_daily_stats"
      FOR UPDATE
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Allow delete to daily stats" ON "service_analytics_daily_stats"
      FOR DELETE
      USING (true);
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Remove RLS policies from both tables
    DROP POLICY IF EXISTS "Public can view service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow write to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow update to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Allow delete to service analytics" ON "service_analytics";
    DROP POLICY IF EXISTS "Public can view daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow write to daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow update to daily stats" ON "service_analytics_daily_stats";
    DROP POLICY IF EXISTS "Allow delete to daily stats" ON "service_analytics_daily_stats";

    -- Drop the tables (CASCADE will drop the foreign keys)
    DROP TABLE IF EXISTS "service_analytics_daily_stats" CASCADE;
    DROP TABLE IF EXISTS "service_analytics" CASCADE;
  `)
}
