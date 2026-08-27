import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getCamdenServerConfig } from "./config"

let client: SupabaseClient | null = null

export function createCamdenServiceClient(): SupabaseClient {
  if (client) return client
  const config = getCamdenServerConfig()
  client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
    global: { headers: { "X-Client-Info": "lrp-camden-bff" } },
  })
  return client
}
