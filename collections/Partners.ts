import type { CollectionConfig } from 'payload'
import { createRevalidationHook } from '../lib/revalidation'

export const Partners: CollectionConfig = {
  slug: 'partners',
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
    defaultColumns: ['name', 'category', 'active', 'publish_date', 'featured', 'order'],
  },
  hooks: {
    afterChange: [createRevalidationHook('partners')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Partner business name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "example-venue") - Required for detail pages to work',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Wedding Partners', value: 'wedding' },
        { label: 'Local Premier Partners', value: 'local-premier' },
        { label: 'Trusted Referral Partners', value: 'trusted-referral' },
        { label: 'Promotions', value: 'promotions' },
      ],
      admin: {
        description: 'Partner category/type',
      },
    },
    {
      name: 'subcategory',
      type: 'select',
      options: [
        { label: 'Advertising / Marketing / Technology', value: 'advertising-marketing-technology' },
        { label: 'Auto & Marine Services', value: 'auto-marine-services' },
        { label: 'Bars & Restaurants', value: 'bars-restaurants' },
        { label: 'Boat Captains & Charters', value: 'boat-captains-charters' },
        { label: 'Condos / Hotels / Short Term / Long Term Rentals / Airbnb-VRBO', value: 'lodging-rentals' },
        { label: 'Construction / Developers', value: 'construction-developers' },
        { label: 'Home Services', value: 'home-services' },
        { label: 'Campgrounds / RV Parks / Camps', value: 'campgrounds-rv-parks' },
        { label: 'Entertainers / Venues', value: 'entertainers-venues' },
        { label: 'Event Planners & Concierge Services', value: 'event-planners-concierge' },
        { label: 'Family Fun', value: 'family-fun' },
        { label: 'Nutrition Services / Personal Care', value: 'nutrition-personal-care' },
        { label: 'Golf Courses / Golf Simulators / Golf Equipment / Golf Carts', value: 'golf' },
        { label: 'Real Estate / Financial Services', value: 'real-estate-financial' },
        { label: 'Shopping', value: 'shopping' },
      ],
      admin: {
        description: 'Subcategory for organizing partners (mainly for Trusted Referral Partners)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Partner logo image',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the partner',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Partner website URL',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Contact email',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: {
        description: 'Business address',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage or featured sections',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'blurb',
      type: 'textarea',
      admin: {
        description: 'Short 1-2 sentence description for quick summaries',
      },
    },
    {
      name: 'sms_template',
      type: 'textarea',
      admin: {
        description: 'Optional SMS message template (auto-generates if left blank when sending)',
      },
    },
    {
      name: 'bulkUploadImages',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/BulkUploadForArray#BulkUploadForArray',
        },
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Additional images (max 5MB per image, MMS support)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle to activate/deactivate this partner',
      },
    },
    {
      name: 'publish_date',
      type: 'date',
      admin: {
        description: 'Optional publish date for scheduled publishing',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
