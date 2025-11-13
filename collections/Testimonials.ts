import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'source', 'featured', 'order'],
  },
  access: {
    // Allow public read access to testimonials
    read: () => true,
    // Require authentication for create, update, delete
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer or client name',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Job title or role',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Company or organization name',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The testimonial text',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Star rating (1-5)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Customer photo or avatar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage and featured sections',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Google Business Profile', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Yelp', value: 'yelp' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Source of this testimonial',
        position: 'sidebar',
      },
    },
    {
      name: 'externalId',
      type: 'text',
      admin: {
        description: 'External review ID (e.g., Google Review ID) for deduplication',
        position: 'sidebar',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Link to original review (if from external source)',
        position: 'sidebar',
      },
    },
    {
      name: 'syncedAt',
      type: 'date',
      admin: {
        description: 'Last time this review was synced from external source',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
