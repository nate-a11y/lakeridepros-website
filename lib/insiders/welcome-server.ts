import 'server-only'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import type { InsiderWelcomeProfile } from '@/lib/insiders/welcome'
import {
  getInsiderWelcomeProfileFromClient,
  type InsiderWelcomeProfileClient,
} from '@/lib/insiders/welcome'

export async function getInsiderWelcomeProfile(
  memberId: string,
): Promise<InsiderWelcomeProfile | null> {
  const supabase =
    getSupabaseServerClient() as unknown as InsiderWelcomeProfileClient

  return getInsiderWelcomeProfileFromClient(supabase, memberId)
}
