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

    // First, try to get directory entries with user info using a different approach
    // Query directory table and join with users table
    const { data, error } = await supabase
      .from('directory')
      .select(`
        id,
        role,
        photo_url,
        vehicles,
        is_active,
        priority,
        user_id,
        users!inner (
          id,
          name,
          display_name,
          first_name,
          last_name,
          email,
          role,
          employment_status
        )
      `)
      .eq('is_active', true)
      .eq('users.employment_status', 'active')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No team members found in database');
      return [];
    }

    console.log(`Found ${data.length} team members`);

    // Transform the data to our TeamMember interface
    const teamMembers: TeamMember[] = data
      .map((directory: any) => {
        const user = directory.users;
        if (!user) return null;

        return {
          id: user.id.toString(),
          name: user.display_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          displayName: user.display_name,
          email: user.email,
          role: user.role || 'user',
          departmentRole: directory.role,
          photoUrl: directory.photo_url,
          vehicles: directory.vehicles || [],
          isActive: directory.is_active ?? true,
          priority: directory.priority ?? 0,
        };
      })
      .filter((member): member is TeamMember => member !== null);

    return teamMembers;
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
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
