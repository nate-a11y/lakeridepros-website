import type { CollectionConfig } from 'payload'

export const ServiceAnalytics: CollectionConfig = {
  slug: 'service-analytics',
  admin: {
    useAsTitle: 'service',
    defaultColumns: ['service', 'views', 'bookings', 'popularityScore'],
    description: 'Tracks service popularity based on views and booking requests',
  },
  access: {
    // Allow public read access for popularity data
    read: () => true,
    // API can create/update analytics
    create: () => true,
    update: () => true,
    // Only admins can delete
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The service being tracked',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Total number of page views',
      },
    },
    {
      name: 'bookings',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Total number of booking requests',
      },
    },
    {
      name: 'viewsLast30Days',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Views in the last 30 days (for time decay)',
      },
    },
    {
      name: 'bookingsLast30Days',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Bookings in the last 30 days (for time decay)',
      },
    },
    {
      name: 'popularityScore',
      type: 'number',
      defaultValue: 0,
      required: true,
      index: true,
      admin: {
        description: 'Calculated popularity score (bookings × 10 + recent views)',
        readOnly: true,
      },
    },
    {
      name: 'lastViewedAt',
      type: 'date',
      admin: {
        description: 'Timestamp of last view',
        readOnly: true,
      },
    },
    {
      name: 'lastBookedAt',
      type: 'date',
      admin: {
        description: 'Timestamp of last booking request',
        readOnly: true,
      },
    },
    {
      name: 'dailyStats',
      type: 'array',
      admin: {
        description: 'Rolling 30-day stats for time decay calculation',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'bookings',
          type: 'number',
          defaultValue: 0,
        },
      ],
      maxRows: 30, // Keep only last 30 days
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Calculate popularity score before saving
        // Formula: (bookingsLast30Days × 10) + viewsLast30Days
        if (operation === 'create' || operation === 'update') {
          const bookings = data.bookingsLast30Days || 0
          const views = data.viewsLast30Days || 0
          data.popularityScore = (bookings * 10) + views
        }
        return data
      },
    ],
  },
}
