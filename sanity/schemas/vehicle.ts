import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
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
      name: 'type',
      title: 'Type',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Sedan', value: 'sedan'},
          {title: 'SUV', value: 'suv'},
          {title: 'Van', value: 'van'},
          {title: 'Limousine', value: 'limousine'},
          {title: 'Bus', value: 'bus'},
          {title: 'Boat', value: 'boat'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Passenger capacity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for cards and previews',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'image',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      description: 'Features and amenities (e.g., WiFi, Leather Seats, Sound System)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'amenity',
              title: 'Amenity',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'amenity',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        defineField({
          name: 'make',
          title: 'Make',
          type: 'string',
        }),
        defineField({
          name: 'model',
          title: 'Model',
          type: 'string',
        }),
        defineField({
          name: 'year',
          title: 'Year',
          type: 'number',
        }),
        defineField({
          name: 'color',
          title: 'Color',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'pointToPointMinimum',
          title: 'Point-to-Point Minimum',
          type: 'number',
          description: 'Minimum fare for point-to-point / taxi-style service (e.g., $15)',
        }),
        defineField({
          name: 'hourlyRate',
          title: 'Hourly Rate',
          type: 'number',
          description: 'Hourly rate for chartered service (e.g., $120/hour)',
        }),
        defineField({
          name: 'dailyRate',
          title: 'Daily Rate',
          type: 'number',
          description: 'Full day rate (optional)',
        }),
        defineField({
          name: 'notes',
          title: 'Notes',
          type: 'text',
          description: 'Additional pricing details, terms, or conditions',
        }),
      ],
    }),
    defineField({
      name: 'pricingTiers',
      title: 'Pricing Tiers',
      type: 'array',
      description: 'Which pricing tier(s) does this vehicle fall under? Leave empty for hourly-only vehicles.',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Flex (up to 4 pax)', value: 'flex'},
              {title: 'Elite (up to 7 pax)', value: 'elite'},
              {title: 'LRP Black (24hr advance, beverages)', value: 'lrp-black'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Is this vehicle currently available for booking?',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage and featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'featuredImage',
    },
  },
})
