import { getPayload } from 'payload';
import config from '@payload-config';

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
 * Fetch all active team members from Payload CMS
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const payload = await getPayload({ config });

    // Query team members from Payload CMS
    const { docs: teamMembers } = await payload.find({
      collection: 'team-members',
      where: {
        and: [
          {
            showOnTeamPage: {
              equals: true,
            },
          },
          {
            status: {
              equals: 'active',
            },
          },
        ],
      },
      sort: 'priority',
      limit: 100,
    });

    if (!teamMembers || teamMembers.length === 0) {
      console.log('No team members found in Payload CMS');
      return [];
    }

    console.log(`Found ${teamMembers.length} team members from Payload CMS`);

    // Transform the data to our TeamMember interface
    const teamMembersData: TeamMember[] = teamMembers.map((member) => {
      // Get photo URL
      let photoUrl: string | undefined;
      if (member.photo && typeof member.photo === 'object' && 'url' in member.photo) {
        photoUrl = member.photo.url as string;
      }

      // TEMPORARILY DISABLED - vehicles field removed for testing
      // Get vehicles array
      // const vehicles = Array.isArray(member.vehicles)
      //   ? member.vehicles.map((v: any) => v.vehicle).filter(Boolean)
      //   : [];
      const vehicles: string[] = [];

      return {
        id: member.id.toString(),
        name: member.displayName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown',
        displayName: member.displayName,
        email: member.email || '',
        role: member.role || '',
        departmentRole: member.role,
        photoUrl,
        vehicles,
        isActive: true, // Already filtered in query
        priority: (member.priority as number) ?? 999,
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
