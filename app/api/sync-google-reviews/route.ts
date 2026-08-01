import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import {
  fetchAllGoogleReviews,
  transformGoogleReviewToTestimonial,
  type GoogleReview,
} from '@/lib/google-reviews';

export const dynamic = 'force-dynamic';

/**
 * Shared sync logic — fetches the authoritative Google Business Profile review
 * set and upserts current reviews into Sanity. Existing documents absent from
 * Google are intentionally not deleted automatically.
 */
async function runSync() {
  try {
    console.log('Starting Google reviews sync via Google Business Profile...');

    const {
      reviews: googleReviews,
      totalReviewCount,
      averageRating,
    } = await fetchAllGoogleReviews();

    const metadata = {
      businessName: 'Lake Ride Pros',
      totalReviews: totalReviewCount,
      rating: averageRating,
      provider: 'Google Business Profile API',
    };

    if (totalReviewCount !== googleReviews.length) {
      throw new Error(
        `Google returned ${googleReviews.length} of ${totalReviewCount} reviews; refusing partial reconciliation`,
      );
    }

    if (!googleReviews || googleReviews.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new reviews found from Google Business Profile',
        stats: {
          fetched: 0,
          created: 0,
          updated: 0,
          rebound: 0,
          unchanged: 0,
          notFound: 0,
          skipped: 0,
        },
        metadata,
      });
    }

    console.log(`Fetched ${googleReviews.length} current reviews from Google Business Profile`);

    type ExistingTestimonial = {
      _id: string;
      externalId?: string;
      name?: string;
      content?: string;
      rating?: number;
      externalUrl?: string;
      googleReviewStatus?: 'current' | 'not_found';
    };

    const existingTestimonials = await writeClient.fetch<ExistingTestimonial[]>(
      groq`*[_type == "testimonial" && source == "google" && defined(externalId)] {
        _id, externalId, name, content, rating, externalUrl, googleReviewStatus
      }`,
    );
    const existingByExternalId = new Map(
      existingTestimonials.map((testimonial) => [testimonial.externalId, testimonial]),
    );
    const normalize = (value: unknown) => String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    const fingerprint = (testimonial: {
      name?: string;
      content?: string;
      rating?: number;
    }) => [
      normalize(testimonial.name),
      normalize(testimonial.content),
      testimonial.rating,
    ].join('|');
    const legacyByFingerprint = new Map<string, ExistingTestimonial[]>();
    for (const testimonial of existingTestimonials) {
      const key = fingerprint(testimonial);
      const matches = legacyByFingerprint.get(key) || [];
      matches.push(testimonial);
      legacyByFingerprint.set(key, matches);
    }
    const matchedDocumentIds = new Set<string>();

    let created = 0;
    let updated = 0;
    let rebound = 0;
    let unchanged = 0;
    let notFound = 0;
    let skipped = 0;
    const syncedAt = new Date().toISOString();

    const syncReview = async (googleReview: GoogleReview) => {
      try {
        const testimonialData = transformGoogleReviewToTestimonial(googleReview);
        let existing = existingByExternalId.get(googleReview.reviewId);

        // Outscraper and Google Business Profile use different review IDs.
        // Rebind legacy documents only when customer name, review text, and
        // rating all match exactly after harmless whitespace normalization.
        if (!existing) {
          const legacyMatches = legacyByFingerprint.get(fingerprint(testimonialData)) || [];
          existing = legacyMatches.find(
            (candidate) => !matchedDocumentIds.has(candidate._id),
          );
          if (existing) rebound++;
        }

        if (existing) {
          matchedDocumentIds.add(existing._id);
          const changed = existing.name !== testimonialData.name
            || existing.content !== testimonialData.content
            || existing.rating !== testimonialData.rating
            || existing.externalUrl !== testimonialData.externalUrl
            || existing.externalId !== testimonialData.externalId
            || existing.googleReviewStatus !== 'current';

          if (!changed) {
            unchanged++;
            return;
          }

          await writeClient.patch(existing._id).set({
            name: testimonialData.name,
            content: testimonialData.content,
            rating: testimonialData.rating,
            source: testimonialData.source,
            externalId: testimonialData.externalId,
            externalUrl: testimonialData.externalUrl,
            googleReviewStatus: 'current',
            syncedAt,
          }).commit();
          updated++;
        } else {
          await writeClient.create({
            _type: 'testimonial',
            ...testimonialData,
            googleReviewStatus: 'current',
            syncedAt,
          });
          created++;
        }
      } catch (error) {
        console.error(`Error processing review ${googleReview.reviewId}:`, error);
        skipped++;
      }
    };

    // Keep Sanity traffic bounded while avoiding hundreds of serialized calls.
    for (let index = 0; index < googleReviews.length; index += 8) {
      await Promise.all(googleReviews.slice(index, index + 8).map(syncReview));
    }

    if (skipped > 0) {
      throw new Error(`Google review sync skipped ${skipped} review(s); retry required`);
    }

    const staleTestimonials = existingTestimonials.filter(
      (testimonial) => !matchedDocumentIds.has(testimonial._id),
    );
    for (let index = 0; index < staleTestimonials.length; index += 8) {
      await Promise.all(staleTestimonials.slice(index, index + 8).map(async (testimonial) => {
        if (testimonial.googleReviewStatus === 'not_found') return;
        await writeClient.patch(testimonial._id).set({
          googleReviewStatus: 'not_found',
          syncedAt,
        }).commit();
        notFound++;
      }));
    }

    // Record a successful no-change run without rewriting every testimonial.
    if (created === 0 && updated === 0 && notFound === 0 && existingTestimonials[0]?._id) {
      await writeClient.patch(existingTestimonials[0]._id).set({ syncedAt }).commit();
    }

    const stats = {
      fetched: googleReviews.length,
      created,
      updated,
      rebound,
      unchanged,
      notFound,
      skipped,
    };
    console.log('Sync completed:', stats);

    return NextResponse.json({
      success: true,
      message: `Synced ${created + updated} reviews from Google Business Profile`,
      stats,
      metadata,
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
  const cronSecret = process.env.CRON_SECRET

  // Vercel only sends the cron Authorization header when CRON_SECRET exists.
  // Fail closed when a caller supplies credentials but the deployment is
  // missing or does not match the configured secret.
  if (authHeader) {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return runSync()
  }

  // Return sync status
  try {
    let lastSync;
    let totalGoogleReviews = 0;

    try {
      const result = await writeClient.fetch(
        groq`{
          "lastSynced": *[_type == "testimonial" && source == "google" && googleReviewStatus != "not_found"] | order(syncedAt desc) [0] { syncedAt },
          "total": count(*[_type == "testimonial" && source == "google" && googleReviewStatus != "not_found"])
        }`
      );

      lastSync = result.lastSynced?.syncedAt;
      totalGoogleReviews = result.total;
    } catch (queryError) {
      console.warn('Could not query Google testimonials:', queryError);
    }

    const configured = Boolean(
      process.env.GOOGLE_CLIENT_ID
      && process.env.GOOGLE_CLIENT_SECRET
      && process.env.GOOGLE_REFRESH_TOKEN
      && process.env.GOOGLE_BUSINESS_LOCATION_ID,
    );

    return NextResponse.json({
      configured,
      provider: 'Google Business Profile API',
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
