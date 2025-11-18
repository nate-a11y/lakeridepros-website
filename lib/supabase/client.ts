/**
 * Centralized Supabase client to avoid multiple GoTrueClient instances
 * Uses singleton pattern to ensure only one client is created
 */

import { createClient } from '@supabase/supabase-js'

// Server-side client (with service role key)
let serverClient: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  if (!serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase server environment variables')
    }

    serverClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return serverClient
}

// Client-side client (with anon key)
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('Browser client can only be used in the browser')
  }

  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase browser environment variables')
    }

    browserClient = createClient(url, key)
  }

  return browserClient
}
