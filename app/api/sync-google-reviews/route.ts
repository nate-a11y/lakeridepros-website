import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { fetchGoogleReviews, transformGoogleReviewToTestimonial } from '@/lib/google-reviews';

/**
 * Sync Google Business Profile reviews to Testimonials CMS
 *
 * POST /api/sync-google-reviews
 *
 * Protected: Requires admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const payload = await getPayload({ config });

    // Verify admin access (you can check session/auth header here)
    // For now, we'll require an API key
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.SYNC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Sync functionality not configured (missing SYNC_API_KEY)' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    // Fetch reviews from Google
    console.log('🔄 Starting Google reviews sync...');
    const googleReviews = await fetchGoogleReviews();

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
      });
    }

    console.log(`📥 Fetched ${googleReviews.length} reviews from Google`);

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
      message: `Synced ${created + updated} reviews from Google Business Profile`,
      stats,
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

    return NextResponse.json({
      configured: !!(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_BUSINESS_LOCATION_ID
      ),
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
