-- Event Waitlist Entries
-- Stores customer waitlist requests when a specific event + vehicle type is sold out.

CREATE TABLE IF NOT EXISTS event_waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT,
  venue_name TEXT,

  ride_type TEXT NOT NULL,
  ride_type_label TEXT NOT NULL,

  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 99),
  pickup_location TEXT,
  dropoff_location TEXT,
  desired_pickup_time TEXT,
  notes TEXT,

  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
  source TEXT NOT NULL DEFAULT 'events_page'
);

-- Prevent duplicate waitlist entries for the same email, event, and vehicle type.
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_waitlist_unique_email_event_ride
  ON event_waitlist_entries(event_id, ride_type, LOWER(email));

CREATE INDEX IF NOT EXISTS idx_event_waitlist_created_at
  ON event_waitlist_entries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_waitlist_event_ride
  ON event_waitlist_entries(event_id, ride_type, created_at DESC);

ALTER TABLE event_waitlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage event waitlist entries"
ON event_waitlist_entries FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON TABLE event_waitlist_entries IS 'Customer event transportation waitlist requests for sold-out vehicle types';
