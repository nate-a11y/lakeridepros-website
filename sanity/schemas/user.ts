import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  description:
    'User profile data. Sanity handles authentication separately; this stores user metadata for references.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return 'Email is required'
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Must be a valid email address'
        }),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Permission level for accessing the CMS',
      initialValue: 'user',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'Editor', value: 'editor'},
          {title: 'User', value: 'user'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})
