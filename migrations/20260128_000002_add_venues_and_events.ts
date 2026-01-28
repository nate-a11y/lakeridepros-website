import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create venues table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS venues (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      short_name VARCHAR(100),
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      address TEXT,
      website VARCHAR(500),
      phone VARCHAR(50),
      active BOOLEAN DEFAULT true,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
    CREATE INDEX IF NOT EXISTS idx_venues_active ON venues(active);
    CREATE INDEX IF NOT EXISTS idx_venues_order ON venues("order");
  `);

  // Create events table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      time VARCHAR(50),
      description TEXT,
      image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      featured BOOLEAN DEFAULT false,
      active BOOLEAN DEFAULT true,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
    CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_active ON events(active);
    CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
  `);

  // Create events ride availability table (array field)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS events_ride_availability (
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

  // Add table comments
  await db.execute(sql`
    COMMENT ON TABLE venues IS 'Event venues (OAMP, Shady Gators, Encore, etc.)';
    COMMENT ON TABLE events IS 'Concerts and events with ride availability tracking';
    COMMENT ON TABLE events_ride_availability IS 'Ride availability per event (array field)';
    COMMENT ON COLUMN events_ride_availability.ride_type IS 'flex, elite, lrp-black, limo-bus, rescue-squad, luxury-sprinter, luxury-shuttle';
    COMMENT ON COLUMN events_ride_availability.status IS 'available, limited, reserved';
  `);

  // Insert sample venues
  await db.execute(sql`
    INSERT INTO venues (name, short_name, slug, active, "order") VALUES
      ('Ozarks Amphitheater', 'OAMP', 'ozarks-amphitheater', true, 1),
      ('Shady Gators', 'Shady Gators', 'shady-gators', true, 2),
      ('Encore', 'Encore', 'encore', true, 3),
      ('Capital Region MU Health Care Amphitheater', 'Cap Region', 'capital-region-amphitheater', true, 4),
      ('SHOOTOUT', 'SHOOTOUT', 'shootout', true, 5)
    ON CONFLICT (slug) DO NOTHING;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS events_ride_availability CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS venues CASCADE;
  `);
}
