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
        condition: (data) => data?.isPromotion !== true,
      },
    },
    // Promotion checkbox - shown first, mutually exclusive with partner types
    {
      name: 'isPromotion',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'This is a promotion (simplified entry - no logo/contact info required)',
      },
    },
    // Partner Type Checkboxes - only show when NOT a promotion
    {
      type: 'row',
      admin: {
        condition: (data) => data?.isPromotion !== true,
      },
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
    // Promotion-specific fields - only show when isPromotion is checked
    {
      name: 'promotionCategory',
      type: 'select',
      options: [
        { label: 'Food & Dining', value: 'food-dining' },
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Shopping & Retail', value: 'shopping-retail' },
        { label: 'Services', value: 'services' },
        { label: 'Events', value: 'events' },
        { label: 'Travel & Lodging', value: 'travel-lodging' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of promotion',
        condition: (data) => data?.isPromotion === true,
      },
    },
    {
      type: 'row',
      admin: {
        condition: (data) => data?.isPromotion === true,
      },
      fields: [
        {
          name: 'promotionStartDate',
          type: 'date',
          admin: {
            description: 'When the promotion starts',
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'promotionEndDate',
          type: 'date',
          admin: {
            description: 'When the promotion ends',
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'promotionDetails',
      type: 'textarea',
      admin: {
        description: 'Details of the promotion',
        condition: (data) => data?.isPromotion === true,
      },
    },
    // Legacy category field - kept for backward compatibility during migration
    {
      name: 'category',
      type: 'select',
      required: false, // Explicitly allow null - this field is deprecated
      options: [
        { label: 'Wedding Partners', value: 'wedding' },
        { label: 'Local Premier Partners', value: 'local-premier' },
        { label: 'Trusted Referral Partners', value: 'trusted-referral' },
        { label: 'Promotions', value: 'promotions' },
      ],
      admin: {
        description: '(Legacy) This field is being phased out - use the checkboxes above instead',
        hidden: true, // Completely hide from admin UI including table columns
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
        condition: (data) => data?.isPromotion !== true,
      },
    },
    // Wedding-specific fields - only show when wedding partner AND not a promotion
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
        condition: (data) => data?.isWeddingPartner === true && data?.isPromotion !== true,
      },
    },
    {
      name: 'weddingDescription',
      type: 'textarea',
      admin: {
        description: 'Wedding-specific description (optional - if different from main description)',
        condition: (data) => data?.isWeddingPartner === true && data?.isPromotion !== true,
      },
    },
    {
      name: 'weddingBlurb',
      type: 'textarea',
      admin: {
        description: 'Wedding-specific short blurb (optional - if different from main blurb)',
        condition: (data) => data?.isWeddingPartner === true && data?.isPromotion !== true,
      },
    },
    // Partner-specific fields - hide when it's a promotion
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Partner logo image (required for partners, optional for promotions)',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the partner',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Partner website URL',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Contact email',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: {
        description: 'Business address',
        condition: (data) => data?.isPromotion !== true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage or featured sections',
        condition: (data) => data?.isPromotion !== true,
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
        condition: (data) => data?.isPromotion !== true,
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
        condition: (data) => data?.isPromotion !== true,
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
        condition: (data) => data?.isPromotion !== true,
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
