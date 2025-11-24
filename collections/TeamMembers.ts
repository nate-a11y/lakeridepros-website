import type { CollectionConfig } from 'payload'
import { getSupabaseServerClient } from '../lib/supabase/client'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'role', 'status', 'priority'],
    group: 'Content',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        try {
          const supabase = getSupabaseServerClient()

          // Extract photo URL if it exists
          let photoUrl: string | null = null
          if (doc.photo && typeof doc.photo === 'object' && 'url' in doc.photo) {
            photoUrl = doc.photo.url
          }

          // Extract vehicles array
          const vehicles = Array.isArray(doc.vehicles)
            ? doc.vehicles.map((v: any) => v.vehicle).filter(Boolean)
            : []

          if (operation === 'create') {
            // Create new user in users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .insert({
                name: doc.displayName || `${doc.firstName} ${doc.lastName}`,
                email: doc.email,
                display_name: doc.displayName,
                first_name: doc.firstName,
                last_name: doc.lastName,
                phone: doc.phone,
                employment_status: doc.status,
                hire_date: doc.hireDate,
                role: 'user', // CMS role default
              } as any)
              .select()
              .single()

            if (userError || !userData) {
              console.error('Error creating user in users table:', userError)
              return
            }

            // Create directory entry
            const { error: dirError } = await supabase
              .from('directory')
              .insert({
                user_id: (userData as any).id,
                role: doc.role,
                department: doc.department,
                priority: doc.priority ?? 999,
                is_active: doc.showOnTeamPage && doc.status === 'active',
                photo_url: photoUrl,
                vehicles: vehicles,
              } as any)

            if (dirError) {
              console.error('Error creating directory entry:', dirError)
            } else {
              console.log(`Synced new team member to directory: ${doc.displayName}`)
            }
          } else if (operation === 'update') {
            // Find the corresponding user by email or name
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', doc.email)
              .single()

            if (existingUser) {
              // Update users table
              await supabase
                .from('users')
                .update({
                  name: doc.displayName || `${doc.firstName} ${doc.lastName}`,
                  display_name: doc.displayName,
                  first_name: doc.firstName,
                  last_name: doc.lastName,
                  phone: doc.phone,
                  employment_status: doc.status,
                  hire_date: doc.hireDate,
                } as any)
                .eq('id', existingUser.id)

              // Update directory table
              await supabase
                .from('directory')
                .update({
                  role: doc.role,
                  department: doc.department,
                  priority: doc.priority ?? 999,
                  is_active: doc.showOnTeamPage && doc.status === 'active',
                  photo_url: photoUrl,
                  vehicles: vehicles,
                } as any)
                .eq('user_id', existingUser.id)

              console.log(`Synced team member update to directory: ${doc.displayName}`)
            }
          }
        } catch (error) {
          console.error('Error syncing team member to directory:', error)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const supabase = getSupabaseServerClient()

          // Mark as inactive in directory instead of deleting
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', doc.email)
            .single()

          if (existingUser) {
            await supabase
              .from('directory')
              .update({
                is_active: false,
              } as any)
              .eq('user_id', existingUser.id)

            await supabase
              .from('users')
              .update({
                employment_status: 'terminated',
              } as any)
              .eq('id', existingUser.id)

            console.log(`Marked team member as inactive in directory: ${doc.displayName}`)
          }
        } catch (error) {
          console.error('Error marking team member as inactive:', error)
        }
      },
    ],
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
