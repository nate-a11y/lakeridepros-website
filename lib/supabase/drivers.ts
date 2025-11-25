/**
 * Supabase functions for fetching driver profiles for the website
 */

import { getSupabaseServerClient } from './client'

// Types for driver data
export interface DriverMedia {
  id: number
  url: string
  alt: string | null
  filename: string | null
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string | null
  active: boolean
  role: 'owner' | 'dispatcher' | 'driver' | null
  portal_role: 'admin' | 'dispatcher' | 'driver' | null
  priority: number | null
  vehicles: string[] | null
  availability_hours: number | null
  bio: string | null
  display_on_website: boolean | null
  notes: string | null
  created_at: string
  updated_at: string
  image_id: number | null
  // Joined media data
  media: DriverMedia | null
}

// Raw type for Supabase query response (before transformation)
interface DriverRow {
  id: string
  name: string
  email: string
  phone: string | null
  active: boolean
  role: string | null
  portal_role: string | null
  priority: number | null
  vehicles: string[] | null
  availability_hours: number | null
  bio: string | null
  display_on_website: boolean | null
  notes: string | null
  created_at: string
  updated_at: string
  image_id: number | null
  media: {
    id: number
    url: string
    alt: string | null
    filename: string | null
  } | null
}

/**
 * Fetch all drivers that should be displayed on the website
 * Filters by: active = true AND display_on_website = true
 * Orders by: priority ASC (lower priority number = shown first)
 */
export async function getDriversForWebsite(): Promise<Driver[]> {
  try {
    const supabase = getSupabaseServerClient()

    // Query drivers with joined media data
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        id,
        name,
        email,
        phone,
        active,
        role,
        portal_role,
        priority,
        vehicles,
        availability_hours,
        bio,
        display_on_website,
        notes,
        created_at,
        updated_at,
        image_id,
        media:image_id (
          id,
          url,
          alt,
          filename
        )
      `)
      .eq('active', true)
      .eq('display_on_website', true)
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('[Supabase Drivers] Error fetching drivers:', error)
      return []
    }

    // Cast data to our expected type and transform
    const rows = (data || []) as unknown as DriverRow[]
    const drivers: Driver[] = rows.map((driver) => ({
      id: driver.id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      active: driver.active,
      role: driver.role as Driver['role'],
      portal_role: driver.portal_role as Driver['portal_role'],
      priority: driver.priority,
      vehicles: driver.vehicles,
      availability_hours: driver.availability_hours,
      bio: driver.bio,
      display_on_website: driver.display_on_website,
      notes: driver.notes,
      created_at: driver.created_at,
      updated_at: driver.updated_at,
      image_id: driver.image_id,
      media: driver.media,
    }))

    return drivers
  } catch (error) {
    console.error('[Supabase Drivers] Exception fetching drivers:', error)
    return []
  }
}

/**
 * Helper function to get the full image URL for a driver
 * Matches the logic in lib/api/payload.ts getMediaUrl()
 */
export function getDriverImageUrl(driver: Driver): string | null {
  if (!driver.media?.url) return null

  const url = driver.media.url
  // If already a full URL, return as-is
  if (url.startsWith('http')) return url

  // For relative URLs, use the site URL from environment
  // Falls back to production URL only if no env vars are set
  const baseUrl =
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lakeridepros.com'

  return `${baseUrl}${url}`
}

/**
 * Get a display-friendly role label
 */
export function getDriverRoleLabel(role: Driver['role']): string {
  switch (role) {
    case 'owner':
      return 'Owner'
    case 'dispatcher':
      return 'Dispatcher'
    case 'driver':
      return 'Professional Driver'
    default:
      return 'Team Member'
  }
}

/**
 * Fetch a single driver by ID
 * Only returns if active = true AND display_on_website = true
 */
export async function getDriverById(id: string): Promise<Driver | null> {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('drivers')
      .select(`
        id,
        name,
        email,
        phone,
        active,
        role,
        portal_role,
        priority,
        vehicles,
        availability_hours,
        bio,
        display_on_website,
        notes,
        created_at,
        updated_at,
        image_id,
        media:image_id (
          id,
          url,
          alt,
          filename
        )
      `)
      .eq('id', id)
      .eq('active', true)
      .eq('display_on_website', true)
      .single()

    if (error || !data) {
      console.error('[Supabase Drivers] Error fetching driver by ID:', error)
      return null
    }

    const row = data as unknown as DriverRow
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      active: row.active,
      role: row.role as Driver['role'],
      portal_role: row.portal_role as Driver['portal_role'],
      priority: row.priority,
      vehicles: row.vehicles,
      availability_hours: row.availability_hours,
      bio: row.bio,
      display_on_website: row.display_on_website,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      image_id: row.image_id,
      media: row.media,
    }
  } catch (error) {
    console.error('[Supabase Drivers] Exception fetching driver by ID:', error)
    return null
  }
}

/**
 * Format driver name for display
 * For owners: full name
 * For others: First name + last initial (e.g., "John S.")
 */
export function formatDriverDisplayName(driver: Driver): string {
  if (driver.role === 'owner') {
    return driver.name
  }
  const nameParts = driver.name.trim().split(/\s+/)
  return nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
    : nameParts[0]
}
