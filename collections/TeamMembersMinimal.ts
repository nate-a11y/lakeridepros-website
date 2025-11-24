import type { CollectionConfig } from 'payload'

// Minimal test version to isolate what's breaking the admin panel
export const TeamMembersMinimal: CollectionConfig = {
  slug: 'team-members-test',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
}
