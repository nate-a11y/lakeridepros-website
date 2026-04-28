/**
 * Supabase types for the giveaways system
 */

export interface Giveaway {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  prize_description: string | null;
  social_post_url: string | null;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GiveawayEntry {
  id: string;
  giveaway_id: string;
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  has_used_service: boolean;
  has_app: boolean | null;
  knows_apple_music: boolean;
  knows_spotify: boolean;
  is_winner: boolean;
  winner_selected_at: string | null;
  created_at: string;
}

export interface GiveawayWithCount extends Giveaway {
  entry_count: number;
}
