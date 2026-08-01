import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateInsiderSession } from '@/lib/supabase/auth-proxy'
import { getCaseSensitiveLegacyRedirect } from '@/lib/seo/case-sensitive-redirects'

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/insiders/:path*',
    '/our-drivers/:path*',
    '/events/:path*',
    '/local-premier-partners/:path*',
    '/wedding-partners/:path*',
    '/partners/:path*',
    '/fleet/:path*',
  ],
}
