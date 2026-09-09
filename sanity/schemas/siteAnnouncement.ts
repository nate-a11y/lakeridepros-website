import { defineField, defineType } from 'sanity'
import { isSafeAnnouncementLink, validateAnnouncementExpiry } from '../../lib/announcements/announcement'

export default defineType({
  name: 'siteAnnouncement',
  title: 'Site announcement',
  type: 'document',
  initialValue: { enabled: false, mode: 'banner' },
  fields: [
    defineField({
      name: 'enabled', title: 'Enabled', type: 'boolean',
      description: 'Only this one announcement can be live. Turn off and publish to remove it early. Expiration always hides it automatically.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mode', title: 'Display style', type: 'string',
      options: { list: [{ title: 'Scrolling banner', value: 'banner' }, { title: 'Popup', value: 'popup' }], layout: 'radio' },
      validation: (rule) => rule.required().custom((value) => value === 'banner' || value === 'popup' || 'Choose scrolling banner or popup.'),
    }),
    defineField({ name: 'title', title: 'Headline', type: 'string', validation: (rule) => rule.required().max(100) }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 3, validation: (rule) => rule.required().max(500) }),
    defineField({
      name: 'image', title: 'Image (optional)', type: 'image',
      description: 'One image: featured in the popup or compact beside the banner. Keep essential details in the text, too.',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp,image/avif,image/gif' },
      fields: [defineField({
        name: 'alt', title: 'Image description (alt text)', type: 'string',
        validation: (rule) => rule.max(200).custom((value, context) => {
          const image = context.parent as { asset?: { _ref?: string } } | undefined
          return !image?.asset?._ref || Boolean(value?.trim()) || 'Describe the image for people using screen readers.'
        }),
      })],
    }),
    defineField({
      name: 'expiresAt', title: 'Expiration date and time', type: 'datetime',
      description: 'Required. The announcement disappears at this time, including on pages already open. Check the time zone shown in the date picker.',
      validation: (rule) => rule.required().custom((value, context) => validateAnnouncementExpiry(value, context.document?.enabled === true)),
    }),
    defineField({
      name: 'linkLabel', title: 'Button / link label (optional)', type: 'string',
      validation: (rule) => rule.max(60).custom((value, context) => !context.document?.linkUrl || Boolean(value?.trim()) || 'Add a label for the announcement link.'),
    }),
    defineField({
      name: 'linkUrl', title: 'Button / link destination (optional)', type: 'string',
      description: 'Use a site path such as /book or a full https:// URL.',
      validation: (rule) => rule.max(1000).custom((value, context) => {
        if (!value) return !context.document?.linkLabel || 'Add a destination for the announcement link.'
        return isSafeAnnouncementLink(value) || 'Use a site-relative path or an HTTPS URL.'
      }),
    }),
  ],
  preview: {
    select: { title: 'title', enabled: 'enabled', mode: 'mode', expiresAt: 'expiresAt', media: 'image' },
    prepare({ title, enabled, mode, expiresAt, media }) {
      const live = enabled && Number.isFinite(Date.parse(expiresAt)) && Date.parse(expiresAt) > Date.now()
      return { title: title || 'Site announcement', subtitle: `${live ? 'Active' : 'Off / expired'} · ${mode === 'popup' ? 'Popup' : 'Scrolling banner'}`, media }
    },
  },
})
