import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'role', 'status', 'priority'],
    group: 'Content',
  },
  access: {
    // Public can read active team members shown on team page
    read: ({ req: { user } }) => {
      // Authenticated users can read all
      if (user) return true
      // Public can only read active team members shown on the page
      return {
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
      }
    },
    // Only admins can create, update, or delete
    create: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              label: 'First Name',
              required: true,
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
              required: true,
            },
            {
              name: 'displayName',
              type: 'text',
              label: 'Display Name',
              admin: {
                description: 'Name shown on the website (defaults to First + Last name if not set)',
              },
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email Address',
              admin: {
                description: 'Contact email for this team member',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
              admin: {
                description: 'Contact phone number',
              },
            },
          ],
        },
        {
          label: 'Team Profile',
          fields: [
            {
              name: 'showOnTeamPage',
              type: 'checkbox',
              label: 'Show on Team Page',
              defaultValue: true,
              admin: {
                description: 'Display this person on the public "Our Drivers" team page',
              },
            },
            {
              name: 'role',
              type: 'select',
              label: 'Department Role',
              options: [
                { label: 'Owner', value: 'Owner' },
                { label: 'Dispatcher', value: 'Dispatcher' },
                { label: 'Driver', value: 'Driver' },
              ],
              required: true,
              admin: {
                description: 'Role shown on the team page (Owner, Dispatcher, or Driver)',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Profile Photo',
              admin: {
                description: 'Photo displayed on the team page',
              },
            },
            {
              name: 'vehicles',
              type: 'array',
              label: 'Assigned Vehicles',
              admin: {
                description: 'Vehicles this person drives',
              },
              fields: [
                {
                  name: 'vehicle',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., Cadillac Escalade, Mercedes Sprinter',
                  },
                },
              ],
            },
            {
              name: 'priority',
              type: 'number',
              label: 'Display Priority',
              defaultValue: 999,
              admin: {
                description: 'Lower numbers appear first (0 = highest priority)',
              },
            },
          ],
        },
        {
          label: 'Employment',
          fields: [
            {
              name: 'status',
              type: 'select',
              label: 'Employment Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'On Leave', value: 'on_leave' },
                { label: 'Terminated', value: 'terminated' },
              ],
              defaultValue: 'active',
              required: true,
            },
            {
              name: 'hireDate',
              type: 'date',
              label: 'Hire Date',
              admin: {
                description: 'Date this person was hired',
              },
            },
            {
              name: 'department',
              type: 'text',
              label: 'Department',
              admin: {
                description: 'Optional department classification',
              },
            },
          ],
        },
      ],
    },
  ],
}
