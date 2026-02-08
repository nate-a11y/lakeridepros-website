import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'memberLogo',
  title: 'Member Logo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Organization name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Organization logo image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this logo',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
