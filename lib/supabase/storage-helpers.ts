/**
 * Supabase Storage Helper Functions
 * Server-side utilities for working with private storage buckets
 */

import { getSupabaseServerClient } from '@/lib/supabase/client'

/**
 * Generate a signed URL for a file in the driver-applications bucket
 * @param filePath - The file path or full URL
 * @param expiresIn - Expiration time in seconds (default: 1 year)
 * @returns Signed URL or null if error
 */
export async function getSignedImageUrl(
  filePath: string,
  expiresIn: number = 31536000 // 1 year default
): Promise<string | null> {
  try {
    const supabase = getSupabaseServerClient()

    // Extract path from full URL if provided
    let path = filePath

    // Handle full Supabase URLs
    if (filePath.includes('/storage/v1/object/')) {
      const matches = filePath.match(/\/storage\/v1\/object\/(?:public|sign)\/driver-applications\/(.+?)(\?|$)/)
      if (matches && matches[1]) {
        path = matches[1]
      }
    }
    // Handle partial paths with bucket name
    else if (filePath.includes('driver-applications/')) {
      path = filePath.split('driver-applications/')[1]?.split('?')[0] || filePath
    }

    // Generate signed URL
    const { data, error } = await supabase.storage
      .from('driver-applications')
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Error generating signed URL:', error)
      return null
    }

    return data?.signedUrl || null
  } catch (error) {
    console.error('Unexpected error in getSignedImageUrl:', error)
    return null
  }
}

/**
 * Generate signed URLs for both license images
 * @param frontUrl - Front license image path/URL
 * @param backUrl - Back license image path/URL
 * @param expiresIn - Expiration time in seconds (default: 1 year)
 * @returns Object with front and back signed URLs
 */
export async function getLicenseImageUrls(
  frontUrl: string | null | undefined,
  backUrl: string | null | undefined,
  expiresIn: number = 31536000
): Promise<{ front: string | null; back: string | null }> {
  const [front, back] = await Promise.all([
    frontUrl ? getSignedImageUrl(frontUrl, expiresIn) : Promise.resolve(null),
    backUrl ? getSignedImageUrl(backUrl, expiresIn) : Promise.resolve(null)
  ])

  return { front, back }
}

/**
 * Delete a file from the driver-applications bucket
 * @param filePath - The file path to delete
 * @returns Success boolean
 */
export async function deleteDriverApplicationFile(filePath: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient()

    // Extract path from full URL if needed
    let path = filePath
    if (filePath.includes('driver-applications/')) {
      path = filePath.split('driver-applications/')[1]?.split('?')[0] || filePath
    }

    const { error } = await supabase.storage
      .from('driver-applications')
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error in deleteDriverApplicationFile:', error)
    return false
  }
}
