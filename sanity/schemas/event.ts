import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Event/Concert name (e.g., "ZZ Top & D. Yoakam")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'reference',
      description: 'Select the venue for this event',
      to: [{type: 'venue'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Event date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'Event start time (e.g., "7:00 PM")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the event',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Event poster or image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'rideAvailability',
      title: 'Ride Availability',
      type: 'array',
      description: 'Ride availability for each vehicle type',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'rideType',
              title: 'Ride Type',
              type: 'string',
              description: 'Type of ride/vehicle',
              validation: (rule) => rule.required(),
              options: {
                list: [
                  {title: 'Flex (Seats 1-4)', value: 'flex'},
                  {title: 'Elite (Seats 1-7)', value: 'elite'},
                  {title: 'LRP Black (Seats 1-6)', value: 'lrp-black'},
                  {title: 'Limo Bus (Seats up to 14)', value: 'limo-bus'},
                  {title: 'Rescue Squad (Seats up to 14)', value: 'rescue-squad'},
                  {title: 'Luxury Sprinter (Seats up to 13)', value: 'luxury-sprinter'},
                  {title: 'Luxury Shuttle Bus (Seats up to 37)', value: 'luxury-shuttle'},
                ],
              },
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              description: 'Current availability status',
              initialValue: 'available',
              validation: (rule) => rule.required(),
              options: {
                list: [
                  {title: 'Available', value: 'available'},
                  {title: 'Limited Availability', value: 'limited'},
                  {title: 'Reserved', value: 'reserved'},
                ],
              },
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'string',
              description: 'Optional notes (e.g., "Only 2-3 cars available")',
            }),
          ],
          preview: {
            select: {
              title: 'rideType',
              subtitle: 'status',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this event on the calendar',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this event on the website',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first, events also sort by date)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
      media: 'image',
    },
  },
})
