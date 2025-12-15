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
    defaultColumns: ['name', 'isPremierPartner', 'isReferralPartner', 'isWeddingPartner', 'active', 'featured', 'order'],
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
    // Partner Type Checkboxes - allows a partner to appear in multiple sections
    {
      type: 'row',
      fields: [
        {
          name: 'isPremierPartner',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show on Local Premier Partners page (also shows on Referral Partners)',
            width: '33%',
          },
        },
        {
          name: 'isReferralPartner',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show on Trusted Referral Partners page',
            width: '33%',
          },
        },
        {
          name: 'isWeddingPartner',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show on Wedding Partners page',
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'isPromotion',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'This is a promotional partner',
      },
    },
    // Legacy category field - kept for backward compatibility during migration
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Wedding Partners', value: 'wedding' },
        { label: 'Local Premier Partners', value: 'local-premier' },
        { label: 'Trusted Referral Partners', value: 'trusted-referral' },
        { label: 'Promotions', value: 'promotions' },
      ],
      admin: {
        description: '(Legacy) This field is being phased out - use the checkboxes above instead',
        condition: () => false, // Hide from admin UI
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
        description: 'Subcategory for organizing Referral Partners',
      },
    },
    // Wedding-specific fields
    {
      name: 'weddingCategory',
      type: 'select',
      options: [
        { label: 'Venues & Destinations', value: 'venues-destinations' },
        { label: 'Photography & Videography', value: 'photography-videography' },
        { label: 'Catering/Culinary', value: 'catering-culinary' },
        { label: 'Floral & Decor', value: 'floral-decor' },
        { label: 'Planning & Coordination', value: 'planning-coordination' },
        { label: 'Bridal Beauty & Style', value: 'bridal-beauty-style' },
        { label: 'Transportation', value: 'transportation' },
        { label: 'Hotels & Lodging', value: 'hotels-lodging' },
        { label: 'Other Services', value: 'other-services' },
      ],
      admin: {
        description: 'Wedding category for organizing wedding partners',
        condition: (data) => data?.isWeddingPartner === true,
      },
    },
    {
      name: 'weddingDescription',
      type: 'textarea',
      admin: {
        description: 'Wedding-specific description (optional - if different from main description)',
        condition: (data) => data?.isWeddingPartner === true,
      },
    },
    {
      name: 'weddingBlurb',
      type: 'textarea',
      admin: {
        description: 'Wedding-specific short blurb (optional - if different from main blurb)',
        condition: (data) => data?.isWeddingPartner === true,
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
