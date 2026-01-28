-- Migration: Add Venues and Events collections
-- Run this SQL in your Supabase SQL editor or via psql

-- ============================================
-- VENUES TABLE
-- ============================================
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

-- Create indexes for venues
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_active ON venues(active);
CREATE INDEX IF NOT EXISTS idx_venues_order ON venues("order");

-- ============================================
-- EVENTS TABLE
-- ============================================
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

-- Create indexes for events
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(active);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

-- ============================================
-- EVENTS RIDE AVAILABILITY (Array Field)
-- ============================================
CREATE TABLE IF NOT EXISTS events_ride_availability (
    id SERIAL PRIMARY KEY,
    _parent_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    _order INTEGER NOT NULL DEFAULT 0,
    ride_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    notes VARCHAR(255)
);

-- Create indexes for ride availability
CREATE INDEX IF NOT EXISTS idx_events_ride_availability_parent ON events_ride_availability(_parent_id);
CREATE INDEX IF NOT EXISTS idx_events_ride_availability_ride_type ON events_ride_availability(ride_type);
CREATE INDEX IF NOT EXISTS idx_events_ride_availability_status ON events_ride_availability(status);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE venues IS 'Event venues (OAMP, Shady Gators, Encore, etc.)';
COMMENT ON TABLE events IS 'Concerts and events with ride availability tracking';
COMMENT ON TABLE events_ride_availability IS 'Ride availability per event (array field)';

COMMENT ON COLUMN events_ride_availability.ride_type IS 'flex, elite, lrp-black, limo-bus, rescue-squad, luxury-sprinter, luxury-shuttle';
COMMENT ON COLUMN events_ride_availability.status IS 'available, limited, reserved';

-- ============================================
-- SAMPLE DATA (Optional - uncomment to use)
-- ============================================

-- Insert sample venues
INSERT INTO venues (name, short_name, slug, active, "order") VALUES
    ('Ozarks Amphitheater', 'OAMP', 'ozarks-amphitheater', true, 1),
    ('Shady Gators', 'Shady Gators', 'shady-gators', true, 2),
    ('Encore', 'Encore', 'encore', true, 3),
    ('Capital Region MU Health Care Amphitheater', 'Cap Region', 'capital-region-amphitheater', true, 4),
    ('SHOOTOUT', 'SHOOTOUT', 'shootout', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Example: Insert a sample event (uncomment and modify as needed)
-- INSERT INTO events (name, slug, venue_id, date, time, active, featured) VALUES
--     ('ZZ Top & D. Yoakam', 'zz-top-d-yoakam-2026', 1, '2026-05-08', '7:00 PM', true, true);

-- Example: Insert ride availability for an event
-- INSERT INTO events_ride_availability (_parent_id, _order, ride_type, status, notes) VALUES
--     (1, 0, 'flex', 'available', NULL),
--     (1, 1, 'elite', 'limited', 'Only 2-3 cars available'),
--     (1, 2, 'lrp-black', 'available', NULL),
--     (1, 3, 'limo-bus', 'available', NULL),
--     (1, 4, 'rescue-squad', 'reserved', NULL),
--     (1, 5, 'luxury-sprinter', 'available', NULL),
--     (1, 6, 'luxury-shuttle', 'available', NULL);
