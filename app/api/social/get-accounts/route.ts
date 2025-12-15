import { NextResponse } from 'next/server'

/**
 * GET /api/social/get-accounts
 *
 * Use this endpoint to get your Facebook Page ID and Instagram Account ID.
 * Requires META_PAGE_ACCESS_TOKEN to be set in environment variables.
 *
 * IMPORTANT: Remove or protect this endpoint in production!
 */
export async function GET() {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json(
      { error: 'META_PAGE_ACCESS_TOKEN not configured' },
      { status: 500 }
    )
  }

  try {
    // First, try to get the page info directly (works if token is a Page Access Token)
    const pageResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account{id,username}&access_token=${accessToken}`
    )

    if (!pageResponse.ok) {
      const error = await pageResponse.json()
      return NextResponse.json(
        { error: 'Facebook API error', details: error },
        { status: pageResponse.status }
      )
    }

    const pageData = await pageResponse.json()

    // Check if this is a page token (has instagram_business_account field available)
    if (pageData.id) {
      const result = {
        facebookPageId: pageData.id,
        facebookPageName: pageData.name || 'Unknown',
        instagramAccountId: pageData.instagram_business_account?.id || null,
        instagramUsername: pageData.instagram_business_account?.username || null,
      }

      return NextResponse.json({
        message: 'Add these to your .env file:',
        account: result,
        envExample: `
# Add to .env and Vercel
FACEBOOK_PAGE_ID=${result.facebookPageId}
INSTAGRAM_ACCOUNT_ID=${result.instagramAccountId || 'NOT_CONNECTED - Make sure Instagram is linked to your Facebook Page'}
        `.trim(),
      })
    }

    return NextResponse.json({
      error: 'Could not determine page info from token',
      data: pageData,
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts', details: String(error) },
      { status: 500 }
    )
  }
}
