/**
 * Supabase types and functions for bridal show registrations
 */

export interface BridalShowRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  transportation_needs: string;
  created_at: string;
  is_winner?: boolean;
  winner_selected_at?: string;
}

/**
 * Fetch all bridal show registrations via API
 * @param adminKey - The admin key for authentication
 * @returns Array of registrations
 */
export async function fetchRegistrations(
  adminKey: string
): Promise<{ data: BridalShowRegistration[] | null; error: Error | null }> {
  try {
    const response = await fetch(`/api/bridal-show-registration?key=${encodeURIComponent(adminKey)}`);
    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: new Error(result.error || 'Failed to fetch registrations') };
    }

    return { data: result.registrations, error: null };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}
