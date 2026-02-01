import type { CollectionConfig } from 'payload'
import { createRevalidationHook } from '../lib/revalidation'

export const Venues: CollectionConfig = {
  slug: 'venues',
  access: {
    // Allow public read access for frontend
    read: () => true,
    // Require authentication for write operations
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortName', 'active', 'order'],
    group: 'Events',
  },
  hooks: {
    afterChange: [createRevalidationHook('venues')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full venue name (e.g., "Ozarks Amphitheater")',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Short name for display in tight spaces (e.g., "OAMP")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "ozarks-amphitheater")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the venue',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Primary venue photo or logo',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional venue photos — exterior, interior, parking, etc.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional photo caption',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      admin: {
        description: 'Venue address',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Venue website URL',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Venue contact phone',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this venue on the website',
      },
    },
    {
      name: 'additionalInfo',
      type: 'richText',
      admin: {
        description: 'Additional venue details — parking, group rates, tips, etc.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
}
