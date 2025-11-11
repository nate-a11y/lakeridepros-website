import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Partner business name',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Wedding Partners', value: 'wedding' },
        { label: 'Local Premier Partners', value: 'local-premier' },
        { label: 'Trusted Referral Partners', value: 'trusted-referral' },
      ],
      admin: {
        description: 'Partner category/type',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Partner logo image',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the partner',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Partner website URL',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Contact email',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: {
        description: 'Business address',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage or featured sections',
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
