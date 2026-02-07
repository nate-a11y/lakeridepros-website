import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'serviceAnalytics',
  title: 'Service Analytics',
  type: 'document',
  description: 'Tracks service popularity based on views and booking requests',
  fields: [
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      description: 'The service being tracked',
      to: [{type: 'service'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      description: 'Total number of page views',
      initialValue: 0,
    }),
    defineField({
      name: 'bookings',
      title: 'Bookings',
      type: 'number',
      description: 'Total number of booking requests',
      initialValue: 0,
    }),
    defineField({
      name: 'viewsLast30Days',
      title: 'Views (Last 30 Days)',
      type: 'number',
      description: 'Views in the last 30 days (for time decay)',
      initialValue: 0,
    }),
    defineField({
      name: 'bookingsLast30Days',
      title: 'Bookings (Last 30 Days)',
      type: 'number',
      description: 'Bookings in the last 30 days (for time decay)',
      initialValue: 0,
    }),
    defineField({
      name: 'popularityScore',
      title: 'Popularity Score',
      type: 'number',
      description: 'Calculated popularity score (bookings x 10 + recent views)',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastViewedAt',
      title: 'Last Viewed At',
      type: 'datetime',
      description: 'Timestamp of last view',
      readOnly: true,
    }),
    defineField({
      name: 'lastBookedAt',
      title: 'Last Booked At',
      type: 'datetime',
      description: 'Timestamp of last booking request',
      readOnly: true,
    }),
    defineField({
      name: 'dailyStats',
      title: 'Daily Stats',
      type: 'array',
      description: 'Rolling 30-day stats for time decay calculation',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'views',
              title: 'Views',
              type: 'number',
              initialValue: 0,
            }),
            defineField({
              name: 'bookings',
              title: 'Bookings',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              date: 'date',
              views: 'views',
              bookings: 'bookings',
            },
            prepare({date, views, bookings}) {
              return {
                title: date || 'No date',
                subtitle: `Views: ${views ?? 0} | Bookings: ${bookings ?? 0}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.max(30),
    }),
  ],
  preview: {
    select: {
      title: 'service.title',
      views: 'views',
      bookings: 'bookings',
      score: 'popularityScore',
    },
    prepare({title, views, bookings, score}) {
      return {
        title: title || 'Unknown Service',
        subtitle: `Views: ${views ?? 0} | Bookings: ${bookings ?? 0} | Score: ${score ?? 0}`,
      }
    },
  },
})
