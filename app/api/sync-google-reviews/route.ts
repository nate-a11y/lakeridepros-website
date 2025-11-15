import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { transformGoogleReviewToTestimonial, type GoogleReview } from '@/lib/google-reviews';

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
    const payload = await getPayload({ config });

    // Verify admin authentication using Payload session
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to the admin panel' },
        { status: 401 }
      );
    }

    // Optional: Check if user has admin role (if your Users collection has roles)
    // if (!user.roles?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: 'Forbidden - Admin access required' },
    //     { status: 403 }
    //   );
    // }

    // Fetch reviews from Supabase Edge Function (which calls Outscraper)
    console.log('🔄 Starting Google reviews sync via Outscraper...');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Set SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
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

    console.log(`📥 Fetched ${googleReviews.length} reviews from ${metadata?.businessName || 'Google'}`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Process each review
    for (const googleReview of googleReviews) {
      try {
        // Check if review already exists by externalId
        const existing = await payload.find({
          collection: 'testimonials',
          where: {
            externalId: {
              equals: googleReview.reviewId,
            },
          },
          limit: 1,
        });

        const testimonialData = transformGoogleReviewToTestimonial(googleReview);

        if (existing.docs.length > 0) {
          // Update existing review
          await payload.update({
            collection: 'testimonials',
            id: existing.docs[0].id,
            data: {
              ...testimonialData,
              // Preserve manual overrides
              featured: existing.docs[0].featured, // Don't override featured status
              order: existing.docs[0].order, // Don't override order
            },
          });
          updated++;
          console.log(`✅ Updated: ${testimonialData.name}`);
        } else {
          // Create new testimonial
          await payload.create({
            collection: 'testimonials',
            data: testimonialData,
          });
          created++;
          console.log(`✨ Created: ${testimonialData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error processing review ${googleReview.reviewId}:`, error);
        skipped++;
      }
    }

    const stats = {
      fetched: googleReviews.length,
      created,
      updated,
      skipped,
    };

    console.log('✅ Sync completed:', stats);

    return NextResponse.json({
      success: true,
      message: `Synced ${created + updated} reviews from ${metadata?.businessName || 'Google Business Profile'}`,
      stats,
      metadata: metadata || null,
    });

  } catch (error) {
    console.error('❌ Error syncing Google reviews:', error);
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
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    let lastSync;
    let totalGoogleReviews = 0;

    // Try to get testimonials from Google source
    // This might fail if the schema hasn't been updated yet
    try {
      const googleTestimonials = await payload.find({
        collection: 'testimonials',
        where: {
          source: {
            equals: 'google',
          },
        },
        sort: '-syncedAt',
        limit: 1,
      });

      lastSync = googleTestimonials.docs[0]?.syncedAt;
      totalGoogleReviews = googleTestimonials.totalDocs;
    } catch (queryError) {
      console.warn('Schema not yet updated - Google sync fields not available:', queryError);
      // Continue with default values (lastSync undefined, totalGoogleReviews 0)
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
