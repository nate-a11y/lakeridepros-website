import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'driverProfile',
  title: 'Driver Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the team member',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from name)',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Short biography displayed on the website',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      description: 'Profile photo for the team member',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'displayOnWebsite',
      title: 'Display on Website',
      type: 'boolean',
      description: 'Show this team member on the public website',
      initialValue: true,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this team member is currently active',
      initialValue: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'array',
      description: 'Team member roles',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Owner', value: 'owner'},
              {title: 'Driver', value: 'driver'},
              {title: 'Dispatcher', value: 'dispatcher'},
              {title: 'Manager', value: 'manager'},
              {title: 'Trainer', value: 'trainer'},
              {title: 'CDL Trainer', value: 'cdl_trainer'},
              {title: 'Aesthetic Master Technician', value: 'aesthetic_master_technician'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'vehicles',
      title: 'Vehicles',
      type: 'array',
      description: 'Vehicles this team member is trained on',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Limo Bus', value: 'limo_bus'},
              {title: 'Rescue Squad', value: 'rescue_squad'},
              {title: 'Sprinter', value: 'sprinter'},
              {title: 'Suburban', value: 'suburban'},
              {title: 'Shuttle Bus', value: 'shuttle_bus'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'assignmentNumber',
      title: 'Assignment Number',
      type: 'string',
      description: 'Badge/assignment number (e.g., LRP1, LRP2)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
    defineField({
      name: 'supabaseId',
      title: 'Supabase ID',
      type: 'string',
      description: 'Linked Supabase driver UUID (for bi-directional sync)',
      readOnly: true,
      hidden: false,
    }),
    defineField({
      name: 'lastSyncSource',
      title: 'Last Sync Source',
      type: 'string',
      description: 'Which system last updated this record (prevents sync loops)',
      readOnly: true,
      hidden: true,
      options: {
        list: [
          {title: 'Sanity', value: 'sanity'},
          {title: 'Supabase', value: 'supabase'},
        ],
      },
    }),
    defineField({
      name: 'lastSyncedAt',
      title: 'Last Synced At',
      type: 'datetime',
      description: 'When this record was last synced',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      role: 'role',
      active: 'active',
      displayOnWebsite: 'displayOnWebsite',
    },
    prepare({title, media, role, active, displayOnWebsite}) {
      const roleLabels = (role || []).map((r: string) => {
        switch (r) {
          case 'owner': return 'Owner'
          case 'driver': return 'Driver'
          case 'dispatcher': return 'Dispatcher'
          case 'manager': return 'Manager'
          case 'trainer': return 'Trainer'
          case 'cdl_trainer': return 'CDL Trainer'
          case 'aesthetic_master_technician': return 'Aesthetic Tech'
          default: return r
        }
      })
      const status = active === false ? ' [INACTIVE]' : displayOnWebsite === false ? ' [HIDDEN]' : ''
      return {
        title: `${title}${status}`,
        subtitle: roleLabels.length > 0 ? roleLabels.join(', ') : 'No role set',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
