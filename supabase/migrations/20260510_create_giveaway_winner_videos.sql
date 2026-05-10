-- Giveaway winner video render jobs
-- Stores recording-safe winner reveal videos generated for giveaway drawings.

CREATE TABLE IF NOT EXISTS giveaway_winner_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
  winner_entry_id UUID REFERENCES giveaway_entries(id) ON DELETE SET NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'rendering', 'succeeded', 'failed')),

  storage_bucket VARCHAR(100) NOT NULL DEFAULT 'giveaway-videos',
  storage_path TEXT,
  render_provider VARCHAR(50) NOT NULL DEFAULT 'gcp-cloud-run',
  render_metadata JSONB,
  error_message TEXT,

  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_giveaway_winner_videos_giveaway_created
  ON giveaway_winner_videos(giveaway_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_giveaway_winner_videos_status
  ON giveaway_winner_videos(status, created_at DESC);

CREATE OR REPLACE FUNCTION giveaway_winner_videos_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS giveaway_winner_videos_updated_at ON giveaway_winner_videos;
CREATE TRIGGER giveaway_winner_videos_updated_at
  BEFORE UPDATE ON giveaway_winner_videos
  FOR EACH ROW
  EXECUTE FUNCTION giveaway_winner_videos_set_updated_at();

ALTER TABLE giveaway_winner_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access giveaway_winner_videos"
  ON giveaway_winner_videos FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Private Supabase Storage bucket for generated MP4s.
INSERT INTO storage.buckets (id, name, public)
VALUES ('giveaway-videos', 'giveaway-videos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Service role full access giveaway videos storage"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'giveaway-videos')
  WITH CHECK (bucket_id = 'giveaway-videos');

COMMENT ON TABLE giveaway_winner_videos IS 'Recording-safe generated winner reveal videos for giveaway campaigns';
