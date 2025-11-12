import type { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'capacity', 'available', 'featured', 'order'],
  },
  access: {
    // Allow public read access to available vehicles
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Van', value: 'van' },
        { label: 'Limousine', value: 'limousine' },
        { label: 'Bus', value: 'bus' },
        { label: 'Boat', value: 'boat' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      admin: {
        description: 'Passenger capacity',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for cards and previews',
      },
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [
        {
          name: 'amenity',
          type: 'text',
        },
      ],
      admin: {
        description: 'Features and amenities (e.g., WiFi, Leather Seats, Sound System)',
      },
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'make',
          type: 'text',
        },
        {
          name: 'model',
          type: 'text',
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'color',
          type: 'text',
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'hourlyRate',
          type: 'number',
        },
        {
          name: 'dailyRate',
          type: 'number',
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this vehicle currently available for booking?',
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
  ],
}
