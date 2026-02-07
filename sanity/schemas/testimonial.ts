import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Customer or client name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Job title or role',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Company or organization name',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      description: 'The testimonial text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Star rating (1-5)',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Customer photo or avatar',
      options: {
        hotspot: true,
      },
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
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Source of this testimonial',
      initialValue: 'manual',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Manual Entry', value: 'manual'},
          {title: 'Google Business Profile', value: 'google'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'Yelp', value: 'yelp'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'externalId',
      title: 'External ID',
      type: 'string',
      description: 'External review ID (e.g., Google Review ID) for deduplication',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'string',
      description: 'Link to original review (if from external source)',
    }),
    defineField({
      name: 'syncedAt',
      title: 'Synced At',
      type: 'datetime',
      description: 'Last time this review was synced from external source',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'source',
      media: 'image',
    },
  },
})
