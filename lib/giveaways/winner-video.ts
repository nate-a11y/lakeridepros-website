import { getSupabaseServerClient } from '@/lib/supabase/client';
import type { Giveaway, GiveawayEntry } from '@/lib/supabase/giveaways';
import type { GiveawayWinnerVideoJob } from './winner-video-types';
import type { WinnerDrawVideoProps } from '@/remotion/winner-video/types';

const VIDEO_BUCKET = 'giveaway-videos';

interface WinnerVideoData {
  job: GiveawayWinnerVideoJob;
  giveaway: Giveaway;
  winner: GiveawayEntry;
  entryCount: number;
  entryNames: string[];
}

export async function getLatestWinnerVideoJob(giveawayId: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('giveaway_winner_videos')
    .select('*')
    .eq('giveaway_id', giveawayId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as GiveawayWinnerVideoJob | null;
}

export async function createWinnerVideoJob(giveawayId: string) {
  const supabase = getSupabaseServerClient();

  const { data: winner, error: winnerErr } = await supabase
    .from('giveaway_entries')
    .select('*')
    .eq('giveaway_id', giveawayId)
    .eq('is_winner', true)
    .order('winner_selected_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (winnerErr) throw winnerErr;
  if (!winner) {
    throw new Error('Pick a winner before generating a video.');
  }

  const { data: job, error } = await supabase
    .from('giveaway_winner_videos')
    .insert({
      giveaway_id: giveawayId,
      winner_entry_id: winner.id,
      status: 'queued',
      storage_bucket: VIDEO_BUCKET,
      render_provider: process.env.WINNER_VIDEO_RENDERER_URL ? 'gcp-cloud-run' : 'local-node',
      render_metadata: {
        requestedBy: 'giveaways-admin',
        format: 'vertical-1080x1920-mp4',
      },
    })
    .select('*')
    .single();

  if (error) throw error;
  return job as GiveawayWinnerVideoJob;
}

export async function getWinnerVideoSignedUrl(jobId: string) {
  const supabase = getSupabaseServerClient();
  const { data: job, error } = await supabase
    .from('giveaway_winner_videos')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  const typed = job as GiveawayWinnerVideoJob;
  if (typed.status !== 'succeeded' || !typed.storage_path) {
    throw new Error('Video is not ready yet.');
  }

  const { data, error: signedErr } = await supabase.storage
    .from(typed.storage_bucket)
    .createSignedUrl(typed.storage_path, 60 * 60);

  if (signedErr) throw signedErr;
  return data.signedUrl;
}

export async function markWinnerVideoJobFailed(jobId: string, errorMessage: string) {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('giveaway_winner_videos')
    .update({
      status: 'failed',
      error_message: errorMessage.slice(0, 4000),
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);
}


export async function requestExternalWinnerVideoRender(args: { jobId: string; giveawayId: string }) {
  const rendererUrl = process.env.WINNER_VIDEO_RENDERER_URL;
  const token = process.env.WINNER_VIDEO_RENDER_TOKEN;

  if (!rendererUrl) {
    throw new Error('WINNER_VIDEO_RENDERER_URL is required to generate winner videos.');
  }
  if (!token) {
    throw new Error('WINNER_VIDEO_RENDER_TOKEN is required when WINNER_VIDEO_RENDERER_URL is set.');
  }

  const supabase = getSupabaseServerClient();
  await supabase
    .from('giveaway_winner_videos')
    .update({
      status: 'rendering',
      started_at: new Date().toISOString(),
      error_message: null,
      render_provider: 'gcp-cloud-run',
    })
    .eq('id', args.jobId);

  try {
    const data = await loadWinnerVideoData(args.jobId, args.giveawayId);
    const props = buildWinnerDrawProps(data);
    const response = await fetch(`${rendererUrl.replace(/\/$/, '')}/render-winner-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId: args.jobId, inputProps: props }),
    });

    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.error || `Renderer failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storagePath = `${data.giveaway.slug}/${args.jobId}.mp4`;

    const { error: uploadErr } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadErr) throw uploadErr;

    await supabase
      .from('giveaway_winner_videos')
      .update({
        status: 'succeeded',
        storage_bucket: VIDEO_BUCKET,
        storage_path: storagePath,
        completed_at: new Date().toISOString(),
        render_metadata: {
          format: 'vertical-1080x1920-mp4',
          renderer: 'gcp-cloud-run',
          entryCount: data.entryCount,
          winnerEntryId: data.winner.id,
          fileSizeBytes: buffer.byteLength,
        },
        error_message: null,
      })
      .eq('id', args.jobId);

    return { storagePath, fileSizeBytes: buffer.byteLength };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown render error';
    await markWinnerVideoJobFailed(args.jobId, message);
    throw err;
  }
}

async function loadWinnerVideoData(jobId: string, giveawayId: string): Promise<WinnerVideoData> {
  const supabase = getSupabaseServerClient();

  const [{ data: job, error: jobErr }, { data: giveaway, error: giveawayErr }, countResult] = await Promise.all([
    supabase.from('giveaway_winner_videos').select('*').eq('id', jobId).single(),
    supabase.from('giveaways').select('*').eq('id', giveawayId).single(),
    supabase.from('giveaway_entries').select('id', { count: 'exact', head: true }).eq('giveaway_id', giveawayId),
  ]);

  if (jobErr) throw jobErr;
  if (giveawayErr) throw giveawayErr;
  if (countResult.error) throw countResult.error;

  const typedJob = job as GiveawayWinnerVideoJob;
  if (!typedJob.winner_entry_id) throw new Error('Winner entry missing for video job.');

  const { data: winner, error: winnerErr } = await supabase
    .from('giveaway_entries')
    .select('*')
    .eq('id', typedJob.winner_entry_id)
    .single();

  if (winnerErr) throw winnerErr;

  const { data: entrantRows, error: entrantsErr } = await supabase
    .from('giveaway_entries')
    .select('name')
    .eq('giveaway_id', giveawayId)
    .order('created_at', { ascending: true });

  if (entrantsErr) throw entrantsErr;

  return {
    job: typedJob,
    giveaway: giveaway as Giveaway,
    winner: winner as GiveawayEntry,
    entryCount: countResult.count || 0,
    entryNames: (entrantRows || [])
      .map((entry) => entry.name)
      .filter((name): name is string => Boolean(name && name.trim())),
  };
}

function buildWinnerDrawProps(data: WinnerVideoData): WinnerDrawVideoProps {
  return {
    giveawayTitle: data.giveaway.title || 'Lake Ride Pros Giveaway',
    prizeDescription: data.giveaway.prize_description || 'Concert Ticket Giveaway',
    winnerName: data.winner.name,
    entryCount: data.entryCount,
    entryNames: data.entryNames,
    drawDate: data.winner.winner_selected_at || data.job.requested_at,
    brand: 'lake-ride-pros',
  };
}
