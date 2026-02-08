import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fieldsets: [
    {name: 'partnerType', title: 'Partner Type', options: {collapsible: true}},
    {name: 'promotion', title: 'Promotion Details', options: {collapsible: true}},
    {name: 'wedding', title: 'Wedding Partner Details', options: {collapsible: true}},
    {name: 'contact', title: 'Contact Information', options: {collapsible: true}},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Partner business name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "example-venue") - Required for detail pages to work',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'isPromotion',
      title: 'Is Promotion',
      type: 'boolean',
      description: 'This is a promotion (simplified entry - no logo/contact info required)',
      initialValue: false,
      fieldset: 'partnerType',
    }),
    defineField({
      name: 'isPremierPartner',
      title: 'Is Premier Partner',
      type: 'boolean',
      description: 'Show on Local Premier Partners page (also shows on Referral Partners)',
      initialValue: false,
      fieldset: 'partnerType',
    }),
    defineField({
      name: 'isReferralPartner',
      title: 'Is Referral Partner',
      type: 'boolean',
      description: 'Show on Trusted Referral Partners page',
      initialValue: false,
      fieldset: 'partnerType',
    }),
    defineField({
      name: 'isWeddingPartner',
      title: 'Is Wedding Partner',
      type: 'boolean',
      description: 'Show on Wedding Partners page',
      initialValue: false,
      fieldset: 'partnerType',
    }),
    defineField({
      name: 'promotionCategory',
      title: 'Promotion Category',
      type: 'string',
      description: 'Type of promotion',
      fieldset: 'promotion',
      options: {
        list: [
          {title: 'Food & Dining', value: 'food-dining'},
          {title: 'Entertainment', value: 'entertainment'},
          {title: 'Shopping & Retail', value: 'shopping-retail'},
          {title: 'Services', value: 'services'},
          {title: 'Events', value: 'events'},
          {title: 'Travel & Lodging', value: 'travel-lodging'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'promotionStartDate',
      title: 'Promotion Start Date',
      type: 'date',
      description: 'When the promotion starts',
      fieldset: 'promotion',
    }),
    defineField({
      name: 'promotionEndDate',
      title: 'Promotion End Date',
      type: 'date',
      description: 'When the promotion ends',
      fieldset: 'promotion',
    }),
    defineField({
      name: 'promotionDetails',
      title: 'Promotion Details',
      type: 'text',
      description: 'Details of the promotion',
      fieldset: 'promotion',
    }),
    defineField({
      name: 'category',
      title: 'Category (Legacy)',
      type: 'string',
      description: '(Legacy) This field is being phased out - use the checkboxes above instead',
      hidden: true,
      options: {
        list: [
          {title: 'Wedding Partners', value: 'wedding'},
          {title: 'Local Premier Partners', value: 'local-premier'},
          {title: 'Trusted Referral Partners', value: 'trusted-referral'},
          {title: 'Promotions', value: 'promotions'},
        ],
      },
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'Subcategory for organizing Referral Partners',
      options: {
        list: [
          {title: 'Advertising / Marketing / Technology', value: 'advertising-marketing-technology'},
          {title: 'Auto & Marine Services', value: 'auto-marine-services'},
          {title: 'Bars & Restaurants', value: 'bars-restaurants'},
          {title: 'Boat Captains & Charters', value: 'boat-captains-charters'},
          {title: 'Condos / Hotels / Short Term / Long Term Rentals / Airbnb-VRBO', value: 'lodging-rentals'},
          {title: 'Construction / Developers', value: 'construction-developers'},
          {title: 'Home Services', value: 'home-services'},
          {title: 'Campgrounds / RV Parks / Camps', value: 'campgrounds-rv-parks'},
          {title: 'Entertainers / Venues', value: 'entertainers-venues'},
          {title: 'Event Planners & Concierge Services', value: 'event-planners-concierge'},
          {title: 'Family Fun', value: 'family-fun'},
          {title: 'Nutrition Services / Personal Care', value: 'nutrition-personal-care'},
          {title: 'Golf Courses / Golf Simulators / Golf Equipment / Golf Carts', value: 'golf'},
          {title: 'Real Estate / Financial Services', value: 'real-estate-financial'},
          {title: 'Shopping', value: 'shopping'},
        ],
      },
    }),
    defineField({
      name: 'weddingCategory',
      title: 'Wedding Category',
      type: 'string',
      description: 'Wedding category for organizing wedding partners',
      fieldset: 'wedding',
      options: {
        list: [
          {title: 'Venues & Destinations', value: 'venues-destinations'},
          {title: 'Photography & Videography', value: 'photography-videography'},
          {title: 'Catering/Culinary', value: 'catering-culinary'},
          {title: 'Floral & Decor', value: 'floral-decor'},
          {title: 'Planning & Coordination', value: 'planning-coordination'},
          {title: 'Bridal Beauty & Style', value: 'bridal-beauty-style'},
          {title: 'Transportation', value: 'transportation'},
          {title: 'Hotels & Lodging', value: 'hotels-lodging'},
          {title: 'Other Services', value: 'other-services'},
        ],
      },
    }),
    defineField({
      name: 'weddingDescription',
      title: 'Wedding Description',
      type: 'text',
      description: 'Wedding-specific description (optional - if different from main description)',
      fieldset: 'wedding',
    }),
    defineField({
      name: 'weddingBlurb',
      title: 'Wedding Blurb',
      type: 'text',
      description: 'Wedding-specific short blurb (optional - if different from main blurb)',
      fieldset: 'wedding',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Partner logo image (required for partners, optional for promotions)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the partner',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'string',
      description: 'Partner website URL',
      fieldset: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Contact phone number',
      fieldset: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Contact email',
      fieldset: 'contact',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Must be a valid email address'
        }),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Business address',
      fieldset: 'contact',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage or featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      description: 'Short 1-2 sentence description for quick summaries',
    }),
    defineField({
      name: 'smsTemplate',
      title: 'SMS Template',
      type: 'text',
      description: 'Optional SMS message template (auto-generates if left blank when sending)',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Additional images (max 5MB per image, MMS support)',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to activate/deactivate this partner',
      initialValue: true,
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      description: 'Optional publish date for scheduled publishing',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      isPremier: 'isPremierPartner',
      isReferral: 'isReferralPartner',
      isWedding: 'isWeddingPartner',
      isPromotion: 'isPromotion',
    },
    prepare({title, media, isPremier, isReferral, isWedding, isPromotion}) {
      const types: string[] = []
      if (isPromotion) types.push('Promotion')
      if (isPremier) types.push('Premier')
      if (isReferral) types.push('Referral')
      if (isWedding) types.push('Wedding')
      return {
        title,
        subtitle: types.length > 0 ? types.join(', ') : 'No type set',
        media,
      }
    },
  },
})
