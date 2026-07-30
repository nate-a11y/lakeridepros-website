import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInsiderDemoMode } from '@/lib/insiders/demo-mode'

const PUBLIC_INSIDER_PATHS = [
  '/insiders/login',
  '/insiders/auth/callback',
]

export async function updateInsiderSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  if (isInsiderDemoMode()) {
    return response
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const isPublicPath = PUBLIC_INSIDER_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  if (!data?.claims && !isPublicPath) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/insiders/login'
    loginUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )
    const redirectResponse = NextResponse.redirect(loginUrl)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return response
}
