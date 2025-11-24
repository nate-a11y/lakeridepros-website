import { getPayload } from 'payload';
import config from '@payload-config';
import type { User } from '@/src/payload-types';

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

    // Query users from Payload CMS
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            showOnTeamPage: {
              equals: true,
            },
          },
          {
            employmentStatus: {
              equals: 'active',
            },
          },
        ],
      },
      sort: 'priority',
      limit: 100,
    });

    if (!users || users.length === 0) {
      console.log('No team members found in Payload CMS');
      return [];
    }

    console.log(`Found ${users.length} team members from Payload CMS`);

    // Transform the data to our TeamMember interface
    const teamMembers: TeamMember[] = users.map((user) => {
      // Get photo URL
      let photoUrl: string | undefined;
      if (user.photo && typeof user.photo === 'object' && 'url' in user.photo) {
        photoUrl = user.photo.url as string;
      }

      // Get vehicles array
      const vehicles = Array.isArray(user.vehicles)
        ? user.vehicles.map((v: any) => v.vehicle).filter(Boolean)
        : [];

      return {
        id: user.id.toString(),
        name: user.displayName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
        displayName: user.displayName,
        email: user.email,
        role: user.role || 'user',
        departmentRole: user.departmentRole,
        photoUrl,
        vehicles,
        isActive: true, // Already filtered in query
        priority: (user.priority as number) ?? 999,
      };
    });

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
