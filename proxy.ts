import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateInsiderSession } from '@/lib/supabase/auth-proxy'
import { getCaseSensitiveLegacyRedirect } from '@/lib/seo/case-sensitive-redirects'

export async function proxy(request: NextRequest) {
  // Next's optimizer rejects widths that are no longer configured. Preserve
  // old image URLs retained by crawlers/browser caches by mapping the former
  // 3840px candidate to the current 1200px maximum.
  if (
    request.nextUrl.pathname === '/_next/image' &&
    request.nextUrl.searchParams.get('w') === '3840'
  ) {
    const destination = request.nextUrl.clone()
    destination.searchParams.set('w', '1200')
    destination.searchParams.set('q', '65')
    return NextResponse.rewrite(destination)
  }

  const legacyDestination = getCaseSensitiveLegacyRedirect(
    request.nextUrl.pathname,
  )

  if (legacyDestination) {
    const destination = request.nextUrl.clone()
    destination.pathname = legacyDestination
    return NextResponse.redirect(destination, 308)
  }

  if (request.nextUrl.pathname.startsWith('/insiders')) {
    return updateInsiderSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      source: '/_next/image',
      has: [{ type: 'query', key: 'w', value: '3840' }],
    },
    '/insiders/:path*',
    '/our-drivers/:path*',
    '/events/:path*',
    '/local-premier-partners/:path*',
    '/wedding-partners/:path*',
    '/partners/:path*',
    '/fleet/:path*',
  ],
}
