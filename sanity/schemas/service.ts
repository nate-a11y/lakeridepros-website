import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Full description of the service',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief summary for cards and listings',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or identifier (e.g., lucide icon name)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'List of key features or benefits',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'feature',
              title: 'Feature',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'feature',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'basePrice',
          title: 'Base Price',
          type: 'number',
        }),
        defineField({
          name: 'pricingType',
          title: 'Pricing Type',
          type: 'string',
          initialValue: 'custom',
          options: {
            list: [
              {title: 'Hourly', value: 'hourly'},
              {title: 'Fixed Rate', value: 'fixed'},
              {title: 'Custom', value: 'custom'},
            ],
          },
        }),
        defineField({
          name: 'notes',
          title: 'Notes',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this service on the website',
      initialValue: true,
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
      title: 'title',
      subtitle: 'shortDescription',
      media: 'image',
    },
  },
})
