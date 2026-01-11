-- Bridal Show Registrations Table
-- Stores giveaway entries from bridal show registration form

-- Create bridal_show_registrations table
CREATE TABLE IF NOT EXISTS bridal_show_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Registration Information
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  transportation_needs TEXT NOT NULL,

  -- Winner tracking (optional, for future use)
  is_winner BOOLEAN DEFAULT FALSE,
  winner_selected_at TIMESTAMP WITH TIME ZONE
);

-- Create unique index on email to prevent duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_bridal_show_registrations_email
ON bridal_show_registrations(LOWER(email));

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_bridal_show_registrations_created_at
ON bridal_show_registrations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bridal_show_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow service role to manage all registrations (used by API routes)
CREATE POLICY "Service role can manage all registrations"
ON bridal_show_registrations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON TABLE bridal_show_registrations IS 'Bridal show giveaway registration entries';
COMMENT ON COLUMN bridal_show_registrations.transportation_needs IS 'Description of wedding transportation requirements';
