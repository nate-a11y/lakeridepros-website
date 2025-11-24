import type { CollectionConfig } from 'payload'
// TEMPORARILY REMOVED - Testing if this import causes hydration errors
// import { getSupabaseServerClient } from '../lib/supabase/client'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'role', 'status', 'priority'],
  },
  // TEMPORARILY DISABLED - Testing if hooks are breaking admin UI
  // hooks: {
  //   afterChange: [
  //     async ({ doc, operation }) => {
  //       try {
  //         const supabase = getSupabaseServerClient()
  //         // ... hook code ...
  //       } catch (error) {
  //         console.error('Error syncing team member to directory:', error)
  //       }
  //     },
  //   ],
  //   afterDelete: [
  //     async ({ doc }) => {
  //       try {
  //         const supabase = getSupabaseServerClient()
  //         // ... hook code ...
  //       } catch (error) {
  //         console.error('Error marking team member as inactive:', error)
  //       }
  //     },
  //   ],
  // },
  access: {
    // Allow public read access (like Products and Vehicles)
    read: () => true,
    // Only admins can create, update, or delete
    create: ({ req: { user } }) => !!user && user.role === 'admin',
    update: ({ req: { user } }) => !!user && user.role === 'admin',
    delete: ({ req: { user } }) => !!user && user.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
      defaultValue: '',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
      defaultValue: '',
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Display Name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
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
      defaultValue: 'Driver',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
      required: false,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    // TEMPORARILY DISABLED for testing - vehicles array field might be causing edit page to break
    // {
    //   name: 'vehicles',
    //   type: 'array',
    //   label: 'Assigned Vehicles',
    //   required: false,
    //   fields: [
    //     {
    //       name: 'vehicle',
    //       type: 'text',
    //       required: false,
    //     },
    //   ],
    // },
    {
      name: 'showOnTeamPage',
      type: 'checkbox',
      label: 'Show on Team Page',
      defaultValue: true,
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Display Priority',
      defaultValue: 999,
    },
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
      required: false,
    },
    {
      name: 'department',
      type: 'text',
      label: 'Department',
      required: false,
    },
  ],
}
