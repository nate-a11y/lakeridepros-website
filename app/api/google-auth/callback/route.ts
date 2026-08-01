import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Relays the approved Google OAuth web-client callback to the local operator
 * completing reauthorization. Tokens are exchanged locally and never pass
 * through this route.
 */
export function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams
  const state = incoming.get('state')

  if (!state) {
    return NextResponse.json({ error: 'Missing OAuth state' }, { status: 400 })
  }

  const localCallback = new URL('http://localhost:3000/')
  for (const key of ['code', 'state', 'error', 'error_description']) {
    const value = incoming.get(key)
    if (value) localCallback.searchParams.set(key, value)
  }

  const response = NextResponse.redirect(localCallback, 307)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
