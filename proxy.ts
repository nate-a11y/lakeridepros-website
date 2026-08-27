import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateInsiderSession } from '@/lib/supabase/auth-proxy'
import { getCaseSensitiveLegacyRedirect } from '@/lib/seo/case-sensitive-redirects'

function applyCamdenSecurityHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'same-origin')
  return response
}

export async function proxy(request: NextRequest) {
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

  if (
    request.nextUrl.pathname.startsWith('/camden-county') ||
    request.nextUrl.pathname.startsWith('/api/camden')
  ) {
    return applyCamdenSecurityHeaders(NextResponse.next({ request }))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/camden-county/:path*',
    '/api/camden/:path*',
    '/insiders/:path*',
    '/our-drivers/:path*',
    '/events/:path*',
    '/local-premier-partners/:path*',
    '/wedding-partners/:path*',
    '/partners/:path*',
    '/fleet/:path*',
  ],
}
