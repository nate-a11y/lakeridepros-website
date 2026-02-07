import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full venue name (e.g., "Ozarks Amphitheater")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
      description: 'Short name for display in tight spaces (e.g., "OAMP")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "ozarks-amphitheater")',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the venue',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Primary venue photo or logo',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional venue photos -- exterior, interior, parking, etc.',
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
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional photo caption',
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'image',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Venue address',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'string',
      description: 'Venue website URL',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Venue contact phone',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this venue on the website',
      initialValue: true,
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Additional Info',
      type: 'array',
      description: 'Additional venue details -- parking, group rates, tips, etc.',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortName',
      media: 'image',
    },
  },
})
