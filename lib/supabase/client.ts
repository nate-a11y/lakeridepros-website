/**
 * Centralized Supabase client to avoid multiple GoTrueClient instances
 * Uses singleton pattern to ensure only one client is created
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Server-side client (with service role key)
let serverClient: SupabaseClient<Database> | null = null

export function getSupabaseServerClient(): SupabaseClient<Database> {
  if (!serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase server environment variables')
    }

    serverClient = createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return serverClient
}

// Client-side client (with anon key)
let browserClient: SupabaseClient<Database> | null = null

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    throw new Error('Browser client can only be used in the browser')
  }

  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase browser environment variables')
    }

    browserClient = createClient<Database>(url, key)
  }

  return browserClient
}
