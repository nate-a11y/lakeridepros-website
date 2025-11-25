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

    // Transform the data to match our Driver interface
    const drivers: Driver[] = (data || []).map((driver) => ({
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
      media: driver.media as DriverMedia | null,
    }))

    return drivers
  } catch (error) {
    console.error('[Supabase Drivers] Exception fetching drivers:', error)
    return []
  }
}

/**
 * Helper function to get the full image URL for a driver
 */
export function getDriverImageUrl(driver: Driver): string | null {
  if (!driver.media?.url) return null

  const url = driver.media.url
  // If already a full URL, return as-is
  if (url.startsWith('http')) return url

  // Otherwise, prepend the server URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
    ''

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
