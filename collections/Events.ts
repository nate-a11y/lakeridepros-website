import type { CollectionConfig } from 'payload'
import { createRevalidationHook } from '../lib/revalidation'

export const Events: CollectionConfig = {
  slug: 'events',
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
    defaultColumns: ['name', 'venue', 'date', 'active', 'order'],
    group: 'Events',
  },
  hooks: {
    afterChange: [createRevalidationHook('events')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Event/Concert name (e.g., "ZZ Top & D. Yoakam")',
      },
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
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      required: true,
      admin: {
        description: 'Select the venue for this event',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Event date',
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'time',
          type: 'text',
          admin: {
            description: 'Event start time (e.g., "7:00 PM")',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the event',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Event poster or image',
      },
    },
    {
      name: 'rideAvailability',
      type: 'array',
      admin: {
        description: 'Ride availability for each vehicle type',
      },
      fields: [
        {
          name: 'rideType',
          type: 'select',
          required: true,
          options: [
            { label: 'Flex (Seats 1-4)', value: 'flex' },
            { label: 'Elite (Seats 1-7)', value: 'elite' },
            { label: 'LRP Black (Seats 1-6)', value: 'lrp-black' },
            { label: 'Limo Bus (Seats up to 14)', value: 'limo-bus' },
            { label: 'Rescue Squad (Seats up to 14)', value: 'rescue-squad' },
            { label: 'Luxury Sprinter (Seats up to 13)', value: 'luxury-sprinter' },
            { label: 'Luxury Shuttle Bus (Seats up to 37)', value: 'luxury-shuttle' },
          ],
          admin: {
            description: 'Type of ride/vehicle',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'available',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Limited Availability', value: 'limited' },
            { label: 'Reserved', value: 'reserved' },
          ],
          admin: {
            description: 'Current availability status',
          },
        },
        {
          name: 'notes',
          type: 'text',
          admin: {
            description: 'Optional notes (e.g., "Only 2-3 cars available")',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Highlight this event on the calendar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this event on the website',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first, events also sort by date)',
      },
    },
  ],
}
