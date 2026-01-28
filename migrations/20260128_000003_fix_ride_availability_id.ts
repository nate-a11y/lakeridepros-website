import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix the events_ride_availability.id column type
  // Payload generates string IDs for array items, not integers

  // First, drop the existing primary key constraint and recreate with VARCHAR type
  await db.execute(sql`
    -- Drop existing data (if any) since we're changing the primary key type
    DELETE FROM events_ride_availability;

    -- Drop the old table and recreate with correct column type
    DROP TABLE IF EXISTS events_ride_availability;

    CREATE TABLE events_ride_availability (
      id VARCHAR(255) PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      _order INTEGER NOT NULL DEFAULT 0,
      ride_type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'available',
      notes VARCHAR(255)
    );

    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_parent ON events_ride_availability(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_ride_type ON events_ride_availability(ride_type);
    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_status ON events_ride_availability(status);

    COMMENT ON TABLE events_ride_availability IS 'Ride availability per event (array field)';
    COMMENT ON COLUMN events_ride_availability.ride_type IS 'flex, elite, lrp-black, limo-bus, rescue-squad, luxury-sprinter, luxury-shuttle';
    COMMENT ON COLUMN events_ride_availability.status IS 'available, limited, reserved';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Revert to integer ID (would lose data)
  await db.execute(sql`
    DROP TABLE IF EXISTS events_ride_availability;

    CREATE TABLE events_ride_availability (
      id SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      _order INTEGER NOT NULL DEFAULT 0,
      ride_type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'available',
      notes VARCHAR(255)
    );

    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_parent ON events_ride_availability(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_ride_type ON events_ride_availability(ride_type);
    CREATE INDEX IF NOT EXISTS idx_events_ride_availability_status ON events_ride_availability(status);
  `);
}
