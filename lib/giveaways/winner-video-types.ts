export type WinnerVideoStatus = 'queued' | 'rendering' | 'succeeded' | 'failed';

export interface GiveawayWinnerVideoJob {
  id: string;
  giveaway_id: string;
  winner_entry_id: string | null;
  status: WinnerVideoStatus;
  storage_bucket: string;
  storage_path: string | null;
  render_provider: string;
  render_metadata: Record<string, unknown> | null;
  error_message: string | null;
  requested_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
