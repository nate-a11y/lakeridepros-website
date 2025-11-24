import { createClient } from '@supabase/supabase-js';

// Team member type definition
export interface TeamMember {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: string;
  departmentRole?: string;
  photoUrl?: string;
  vehicles?: string[];
  isActive: boolean;
  priority: number;
}

// Get Supabase client
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(url, key);
}

/**
 * Fetch all active team members from Supabase
 * Joins users table with directory table to get complete information
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = getSupabaseClient();

    // Query users table and join with directory table
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        display_name,
        first_name,
        last_name,
        email,
        role,
        employment_status,
        directory (
          role,
          photo_url,
          vehicles,
          is_active,
          priority
        )
      `)
      .eq('employment_status', 'active')
      .eq('directory.is_active', true)
      .order('directory.priority', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Transform the data to our TeamMember interface
    const teamMembers: TeamMember[] = data
      .filter((user: any) => user.directory) // Only include users with directory entries
      .map((user: any) => ({
        id: user.id.toString(),
        name: user.display_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        displayName: user.display_name,
        email: user.email,
        role: user.role || 'user',
        departmentRole: user.directory?.role,
        photoUrl: user.directory?.photo_url,
        vehicles: user.directory?.vehicles || [],
        isActive: user.directory?.is_active ?? true,
        priority: user.directory?.priority ?? 0,
      }));

    return teamMembers;
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return [];
  }
}

/**
 * Fetch team members grouped by their directory role
 */
export async function getTeamMembersByRole(): Promise<{
  owners: TeamMember[];
  dispatchers: TeamMember[];
  drivers: TeamMember[];
}> {
  const teamMembers = await getTeamMembers();

  // Group by directory role
  const owners = teamMembers.filter(
    (member) => member.departmentRole?.toLowerCase().includes('owner')
  );

  const dispatchers = teamMembers.filter(
    (member) => member.departmentRole?.toLowerCase().includes('dispatch')
  );

  const drivers = teamMembers.filter(
    (member) =>
      member.departmentRole?.toLowerCase().includes('driver') &&
      !member.departmentRole?.toLowerCase().includes('owner') &&
      !member.departmentRole?.toLowerCase().includes('dispatch')
  );

  return {
    owners,
    dispatchers,
    drivers,
  };
}
