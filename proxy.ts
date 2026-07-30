import type { NextRequest } from 'next/server'
import { updateInsiderSession } from '@/lib/supabase/auth-proxy'

export async function proxy(request: NextRequest) {
  return updateInsiderSession(request)
}

export const config = {
  matcher: ['/insiders/:path*'],
}
