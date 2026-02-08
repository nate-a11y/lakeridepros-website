import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { transformGoogleReviewToTestimonial } from '@/lib/google-reviews';

/**
 * Shared sync logic — fetches Google reviews via Outscraper and upserts into Sanity
 */
async function runSync() {
  try {
    console.log('Starting Google reviews sync via Outscraper...');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Set SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    // Get the last sync timestamp to only fetch new/updated reviews
    let lastSyncTimestamp: string | undefined
    try {
      const lastSynced = await writeClient.fetch(
        groq`*[_type == "testimonial" && source == "google"] | order(syncedAt desc) [0] { syncedAt }`
      )
      if (lastSynced?.syncedAt) {
        lastSyncTimestamp = lastSynced.syncedAt as string
        console.log(`Last sync: ${new Date(lastSyncTimestamp).toLocaleString()} - fetching only new reviews`)
      }
    } catch (error) {
      console.warn('Could not determine last sync time, fetching all reviews:', error)
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/sync-google-reviews`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        placeId: process.env.GOOGLE_PLACE_ID || 'ChIJJ8GI2fuCGWIRW8RfPECoxN4',
        lastSyncTimestamp,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error (${response.status}): ${errorText}`);
    }

    const { success, reviews: googleReviews, metadata, error: edgeError } = await response.json();

    if (!success || edgeError) {
      throw new Error(edgeError || 'Edge function returned unsuccessful response');
    }

    if (!googleReviews || googleReviews.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new reviews found from Google Business Profile',
        stats: { fetched: 0, created: 0, updated: 0, skipped: 0 },
        metadata: metadata || null,
      });
    }

    console.log(`Fetched ${googleReviews.length} reviews from ${metadata?.businessName || 'Google'}`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const googleReview of googleReviews) {
      try {
        const existing = await writeClient.fetch(
          groq`*[_type == "testimonial" && externalId == $externalId][0]`,
          { externalId: googleReview.reviewId }
        );

        const testimonialData = transformGoogleReviewToTestimonial(googleReview);

        if (existing) {
          await writeClient.patch(existing._id).set({
            ...testimonialData,
            featured: existing.featured,
            order: existing.order,
          }).commit();
          updated++;
          console.log(`Updated: ${testimonialData.name}`);
        } else {
          await writeClient.create({
            _type: 'testimonial',
            ...testimonialData,
          });
          created++;
          console.log(`Created: ${testimonialData.name}`);
        }
      } catch (error) {
        console.error(`Error processing review ${googleReview.reviewId}:`, error);
        skipped++;
      }
    }

    const stats = { fetched: googleReviews.length, created, updated, skipped };
    console.log('Sync completed:', stats);

    return NextResponse.json({
      success: true,
      message: `Synced ${created + updated} reviews from ${metadata?.businessName || 'Google Business Profile'}`,
      stats,
      metadata: metadata || null,
    });

  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync Google reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Manual sync trigger
 *
 * POST /api/sync-google-reviews
 * Headers: x-admin-secret
 */
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized - Please provide valid admin credentials' },
      { status: 401 }
    );
  }

  return runSync()
}

/**
 * Cron-triggered sync or status check
 *
 * GET /api/sync-google-reviews
 *
 * With Authorization: Bearer <CRON_SECRET> → runs the sync (Vercel cron)
 * Without auth → returns sync status
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return runSync()
  }

  // Return sync status
  try {
    let lastSync;
    let totalGoogleReviews = 0;

    try {
      const result = await writeClient.fetch(
        groq`{
          "lastSynced": *[_type == "testimonial" && source == "google"] | order(syncedAt desc) [0] { syncedAt },
          "total": count(*[_type == "testimonial" && source == "google"])
        }`
      );

      lastSync = result.lastSynced?.syncedAt;
      totalGoogleReviews = result.total;
    } catch (queryError) {
      console.warn('Could not query Google testimonials:', queryError);
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const placeId = process.env.GOOGLE_PLACE_ID;

    return NextResponse.json({
      configured: !!(supabaseUrl && placeId),
      provider: 'Outscraper (via Supabase Edge Function)',
      lastSync,
      totalGoogleReviews,
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
