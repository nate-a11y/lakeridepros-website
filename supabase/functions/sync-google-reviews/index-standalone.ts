// Supabase Edge Function for syncing Google Reviews via Outscraper
// STANDALONE VERSION - No external imports needed
// Deno runtime - copy this entire file to Supabase Dashboard

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers (inlined)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OutscraperReview {
  review_id: string
  author_title: string
  author_link?: string
  author_reviews_count?: number
  review_text?: string
  review_rating: number
  review_timestamp: number
  review_datetime_utc: string
  review_likes?: number
  owner_answer?: string
  owner_answer_timestamp?: number
  owner_answer_timestamp_datetime_utc?: string
  review_photo_links?: string[]
}

interface OutscraperResponse {
  id: string
  status: string
  data: Array<{
    name: string
    place_id: string
    reviews?: OutscraperReview[]
    reviews_count?: number
    rating?: number
  }>
}

interface TransformedReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 🔒 SECURITY: Verify authentication
    // Check for valid Supabase anon key or service role key
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the token (format: "Bearer TOKEN")
    const token = authHeader.replace('Bearer ', '')

    // Verify it matches your Supabase anon key or service role key
    const validAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const validServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (token !== validAnonKey && token !== validServiceKey) {
      console.error('Unauthorized access attempt - invalid token')
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - Invalid API key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Outscraper API key from environment
    const outscraperApiKey = Deno.env.get('OUTSCRAPER_API_KEY')
    if (!outscraperApiKey) {
      throw new Error('OUTSCRAPER_API_KEY not configured in Supabase secrets')
    }

    // Get Place ID from request or environment
    const { placeId } = await req.json().catch(() => ({}))
    const googlePlaceId = placeId || Deno.env.get('GOOGLE_PLACE_ID') || 'ChIJJ8GI2fuCGWIRW8RfPECoxN4'

    console.log('Fetching reviews for Place ID:', googlePlaceId)

    // Call Outscraper API with retry logic
    let response: Response | null = null
    let lastError: Error | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Outscraper Google Maps Reviews API endpoint (correct base URL)
        // Note: query parameter takes the Place ID directly, NOT with "place_id:" prefix
        const outscraperUrl = `https://api.app.outscraper.com/maps/reviews-v2?query=${googlePlaceId}&reviewsLimit=250&language=en&async=false`

        response = await fetch(outscraperUrl, {
          method: 'GET',
          headers: {
            'X-API-KEY': outscraperApiKey,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Outscraper API error (${response.status}): ${errorText}`)
        }

        // Success - break retry loop
        break
      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error)

        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000
          console.log(`Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('Failed to fetch reviews after retries')
    }

    const data: OutscraperResponse = await response.json()
    console.log('Outscraper response status:', data.status)
    console.log('Outscraper data array length:', data.data?.length || 0)
    console.log('Full Outscraper response:', JSON.stringify(data, null, 2))

    // Extract reviews from response
    const placeData = data.data?.[0]
    if (!placeData) {
      console.error('No place data in response!')
      return new Response(
        JSON.stringify({
          success: true,
          reviews: [],
          message: 'No place data found',
          metadata: {
            businessName: null,
            totalReviews: 0,
            rating: null
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    const outscraperReviews = placeData.reviews_data || []
    console.log(`Found ${outscraperReviews.length} reviews for ${placeData.name} (${placeData.reviews} total)`)

    // Transform Outscraper reviews to Google My Business API format
    // This ensures compatibility with existing Payload CMS logic
    const transformedReviews: TransformedReview[] = outscraperReviews.map(review => {
      // Convert 1-5 rating to Google's enum format
      const ratingMap: Record<number, TransformedReview['starRating']> = {
        1: 'ONE',
        2: 'TWO',
        3: 'THREE',
        4: 'FOUR',
        5: 'FIVE'
      }

      return {
        reviewId: review.review_id,
        reviewer: {
          displayName: review.author_title,
          profilePhotoUrl: undefined, // Outscraper doesn't provide author photos
        },
        starRating: ratingMap[review.review_rating] || 'FIVE',
        comment: review.review_text || '',
        createTime: review.review_datetime_utc,
        updateTime: review.review_datetime_utc,
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        reviews: transformedReviews,
        metadata: {
          businessName: placeData.name,
          totalReviews: placeData.reviews_count || transformedReviews.length,
          rating: placeData.rating,
          placeId: placeData.place_id
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        reviews: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
