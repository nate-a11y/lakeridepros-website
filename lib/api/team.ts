import { createClient } from '@/lib/supabase/server';

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

/**
 * Fetch all active team members from Supabase (users + directory JOIN)
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createClient();

    // Query users and directory tables with JOIN
    const { data: teamMembers, error } = await supabase
      .from('directory')
      .select(`
        id,
        role,
        department,
        priority,
        is_active,
        photo_url,
        vehicles,
        user_id,
        users!inner (
          id,
          name,
          email,
          display_name,
          phone,
          employment_status,
          first_name,
          last_name
        )
      `)
      .eq('is_active', true)
      .eq('users.employment_status', 'active')
      .order('priority', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching team members from Supabase:', error);
      return [];
    }

    if (!teamMembers || teamMembers.length === 0) {
      console.log('No team members found in Supabase');
      return [];
    }

    console.log(`Found ${teamMembers.length} team members from Supabase`);

    // Transform the data to our TeamMember interface
    const teamMembersData: TeamMember[] = teamMembers.map((member) => {
      const user = member.users as any;

      return {
        id: member.id,
        name: user.display_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
        displayName: user.display_name,
        email: user.email,
        role: member.role || '',
        departmentRole: member.role,
        photoUrl: member.photo_url || undefined,
        vehicles: member.vehicles || [],
        isActive: member.is_active,
        priority: member.priority ?? 999,
      };
    });

    return teamMembersData;
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
