-- Event waitlist customer status lookup support.
-- Keeps passed events hidden from customer lookup and protects lookup with emailed OTP codes.

ALTER TABLE event_waitlist_entries
  ADD COLUMN IF NOT EXISTS phone_normalized TEXT,
  ADD COLUMN IF NOT EXISTS event_date_iso DATE;

UPDATE event_waitlist_entries
SET phone_normalized = NULLIF(regexp_replace(COALESCE(phone, ''), '\D', '', 'g'), '')
WHERE phone_normalized IS NULL;

CREATE INDEX IF NOT EXISTS idx_event_waitlist_phone_normalized
  ON event_waitlist_entries(phone_normalized)
  WHERE phone_normalized IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_event_waitlist_event_date_iso
  ON event_waitlist_entries(event_date_iso)
  WHERE event_date_iso IS NOT NULL;

CREATE TABLE IF NOT EXISTS event_waitlist_lookup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  identifier TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 10)
);

CREATE INDEX IF NOT EXISTS idx_event_waitlist_lookup_codes_identifier
  ON event_waitlist_lookup_codes(identifier, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_waitlist_lookup_codes_expires_at
  ON event_waitlist_lookup_codes(expires_at);

ALTER TABLE event_waitlist_lookup_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage event waitlist lookup codes"
ON event_waitlist_lookup_codes FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
