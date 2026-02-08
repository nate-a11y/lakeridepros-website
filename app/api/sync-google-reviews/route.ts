import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { transformGoogleReviewToTestimonial } from '@/lib/google-reviews';

/**
 * Sync Google Business Profile reviews to Testimonials CMS
 * Uses Supabase Edge Function + Outscraper API (no Google API access required!)
 *
 * POST /api/sync-google-reviews
 *
 * Protected: Requires admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Payload's payload.auth() is not available with Sanity.
    // Using admin secret header for authentication instead.
    const adminSecret = req.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Please provide valid admin credentials' },
        { status: 401 }
      );
    }

    // Fetch reviews from Supabase Edge Function (which calls Outscraper)
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
        lastSyncTimestamp = lastSynced.syncedAt
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
        message: 'No reviews found from Google Business Profile',
        stats: {
          fetched: 0,
          created: 0,
          updated: 0,
          skipped: 0,
        },
        metadata: metadata || null,
      });
    }

    console.log(`Fetched ${googleReviews.length} reviews from ${metadata?.businessName || 'Google'}`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Process each review
    for (const googleReview of googleReviews) {
      try {
        // Check if review already exists by externalId
        const existing = await writeClient.fetch(
          groq`*[_type == "testimonial" && externalId == $externalId][0]`,
          { externalId: googleReview.reviewId }
        );

        const testimonialData = transformGoogleReviewToTestimonial(googleReview);

        if (existing) {
          // Update existing review
          await writeClient.patch(existing._id).set({
            ...testimonialData,
            // Preserve manual overrides
            featured: existing.featured, // Don't override featured status
            order: existing.order, // Don't override order
          }).commit();
          updated++;
          console.log(`Updated: ${testimonialData.name}`);
        } else {
          // Create new testimonial
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

    const stats = {
      fetched: googleReviews.length,
      created,
      updated,
      skipped,
    };

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
 * Get sync status and last sync time
 *
 * GET /api/sync-google-reviews
 */
export async function GET(_req: NextRequest) {
  try {
    let lastSync;
    let totalGoogleReviews = 0;

    // Try to get testimonials from Google source
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

    // Check if Outscraper is configured
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
