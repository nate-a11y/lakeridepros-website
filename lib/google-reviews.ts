import { google } from 'googleapis';

/**
 * Google Business Profile API Integration
 *
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID from Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 * - GOOGLE_REFRESH_TOKEN: OAuth refresh token (obtained via OAuth flow)
 * - GOOGLE_BUSINESS_LOCATION_ID: Your Google Business Profile location ID
 */

export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

/**
 * Convert Google star rating enum to numeric value
 */
export function convertStarRating(rating: string): number {
  const ratingMap: Record<string, number> = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
  };
  return ratingMap[rating] || 5;
}

/**
 * Initialize Google OAuth2 client
 */
function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-auth/callback'
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

/**
 * Fetch reviews from Google Business Profile
 *
 * @param locationId - Google Business Profile location ID (optional, uses env var if not provided)
 * @param pageSize - Number of reviews to fetch (default: 50, max: 50)
 * @returns Array of Google reviews
 */
export async function fetchGoogleReviews(
  locationId?: string,
  pageSize: number = 50
): Promise<GoogleReview[]> {
  try {
    const location = locationId || process.env.GOOGLE_BUSINESS_LOCATION_ID;

    if (!location) {
      throw new Error('Google Business Location ID not configured');
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured');
    }

    const auth = getOAuth2Client();

    // Get access token
    const { token } = await auth.getAccessToken();

    if (!token) {
      throw new Error('Failed to get access token from Google');
    }

    // Use the Google My Business API v4 for reviews
    // Note: Reviews are still on v4, even though most of the API is deprecated
    // Location format: "accounts/{accountId}/locations/{locationId}"
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/${location}/reviews?pageSize=${pageSize}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error response:', errorText);
      throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    throw error;
  }
}

/**
 * Get OAuth authorization URL for initial setup
 * Use this to generate the authorization URL for obtaining refresh token
 */
export function getAuthorizationUrl(): string {
  const oauth2Client = getOAuth2Client();

  // OAuth scope for Google My Business API (reviews use v4)
  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

/**
 * Exchange authorization code for tokens
 * Use this in your OAuth callback to get the refresh token
 */
export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  };
}

/**
 * Transform Google review to Payload CMS testimonial format
 */
export function transformGoogleReviewToTestimonial(review: GoogleReview) {
  return {
    name: review.reviewer.displayName,
    content: review.comment || 'No comment provided',
    rating: convertStarRating(review.starRating),
    source: 'google' as const,
    externalId: review.reviewId,
    externalUrl: `https://www.google.com/maps/reviews/${review.reviewId}`,
    syncedAt: new Date().toISOString(),
    featured: false, // Default to not featured, admin can curate
    order: 999, // Default low priority, admin can adjust
  };
}
