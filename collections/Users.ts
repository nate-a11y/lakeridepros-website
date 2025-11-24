import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Allow authenticated users to read user list (for dashboard counts)
    read: ({ req: { user } }) => {
      // Authenticated users can read
      if (user) return true
      // Public cannot read users
      return false
    },
    // Only admins can create new users
    create: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
    // Users can update their own profile, admins can update anyone
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Users can only update themselves
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
    // Basic Information
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'firstName',
              type: 'text',
              label: 'First Name',
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
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
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
            },
            {
              name: 'role',
              type: 'select',
              label: 'CMS Role',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'User', value: 'user' },
              ],
              defaultValue: 'user',
              required: true,
              admin: {
                description: 'Permission level for accessing the CMS',
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
              defaultValue: false,
              admin: {
                description: 'Display this person on the public "Our Drivers" team page',
              },
            },
            {
              name: 'departmentRole',
              type: 'select',
              label: 'Department Role',
              options: [
                { label: 'Owner', value: 'Owner' },
                { label: 'Dispatcher', value: 'Dispatcher' },
                { label: 'Driver', value: 'Driver' },
              ],
              admin: {
                description: 'Role shown on the team page (Owner, Dispatcher, or Driver)',
                condition: (data) => data.showOnTeamPage === true,
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Profile Photo',
              admin: {
                description: 'Photo displayed on the team page',
                condition: (data) => data.showOnTeamPage === true,
              },
            },
            {
              name: 'vehicles',
              type: 'array',
              label: 'Assigned Vehicles',
              admin: {
                description: 'Vehicles this person drives',
                condition: (data) => data.showOnTeamPage === true,
              },
              fields: [
                {
                  name: 'vehicle',
                  type: 'text',
                  required: true,
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
                condition: (data) => data.showOnTeamPage === true,
              },
            },
          ],
        },
        {
          label: 'Employment',
          fields: [
            {
              name: 'employmentStatus',
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
            },
          ],
        },
      ],
    },
  ],
}
