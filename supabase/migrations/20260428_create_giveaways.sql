-- Giveaways System
-- Supports multiple giveaway campaigns (e.g. concert tickets, swag) with
-- per-campaign entries, date windows, and random winner selection.

CREATE TABLE IF NOT EXISTS giveaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  prize_description TEXT,
  social_post_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT giveaways_dates_valid CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_giveaways_slug ON giveaways(slug);
CREATE INDEX IF NOT EXISTS idx_giveaways_active_dates
  ON giveaways(active, start_date, end_date);

CREATE TABLE IF NOT EXISTS giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,

  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(200) NOT NULL,
  address_line2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip VARCHAR(20) NOT NULL,

  has_used_service BOOLEAN NOT NULL,
  has_app BOOLEAN,
  knows_apple_music BOOLEAN NOT NULL DEFAULT FALSE,
  knows_spotify BOOLEAN NOT NULL DEFAULT FALSE,

  is_winner BOOLEAN NOT NULL DEFAULT FALSE,
  winner_selected_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- One entry per email per giveaway
CREATE UNIQUE INDEX IF NOT EXISTS idx_giveaway_entries_email_per_giveaway
  ON giveaway_entries(giveaway_id, LOWER(email));

CREATE INDEX IF NOT EXISTS idx_giveaway_entries_giveaway_created
  ON giveaway_entries(giveaway_id, created_at DESC);

-- Auto-update updated_at on giveaways
CREATE OR REPLACE FUNCTION giveaways_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS giveaways_updated_at ON giveaways;
CREATE TRIGGER giveaways_updated_at
  BEFORE UPDATE ON giveaways
  FOR EACH ROW
  EXECUTE FUNCTION giveaways_set_updated_at();

-- RLS
ALTER TABLE giveaways ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access giveaways"
  ON giveaways FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access giveaway_entries"
  ON giveaway_entries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE giveaways IS 'Giveaway campaigns (concerts, swag, etc.)';
COMMENT ON TABLE giveaway_entries IS 'Entries submitted to a giveaway campaign';
