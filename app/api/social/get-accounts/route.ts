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
    // Fetch pages and their Instagram business accounts
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account{id,username}&access_token=${accessToken}`
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Facebook API error', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Format the response for easy reading
    const accounts = data.data.map((page: {
      id: string
      name: string
      instagram_business_account?: {
        id: string
        username: string
      }
    }) => ({
      facebookPageId: page.id,
      facebookPageName: page.name,
      instagramAccountId: page.instagram_business_account?.id || null,
      instagramUsername: page.instagram_business_account?.username || null,
    }))

    return NextResponse.json({
      message: 'Add these to your .env file:',
      accounts,
      envExample: accounts[0] ? `
# Add to .env
FACEBOOK_PAGE_ID=${accounts[0].facebookPageId}
INSTAGRAM_ACCOUNT_ID=${accounts[0].instagramAccountId || 'NOT_CONNECTED'}
      `.trim() : 'No pages found',
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts', details: String(error) },
      { status: 500 }
    )
  }
}
