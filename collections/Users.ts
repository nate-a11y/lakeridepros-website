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
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
    },
  ],
}
