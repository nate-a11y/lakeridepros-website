import type { CollectionConfig } from 'payload'

export const GiftCards: CollectionConfig = {
  slug: 'gift-cards',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'initialAmount', 'currentBalance', 'status', 'fulfillmentStatus', 'createdAt'],
  },
  access: {
    // Only authenticated users can read gift cards (admin dashboard needs this)
    read: ({ req: { user } }) => !!user,
    // Only authenticated admins can create gift cards
    // For webhook/API integration, validate signed secrets in API routes before creation
    create: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
    // Only authenticated users can update gift cards
    update: ({ req: { user } }) => !!user,
    // Only admins can delete gift cards
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'digital',
      options: [
        { label: 'Digital', value: 'digital' },
        { label: 'Physical', value: 'physical' },
      ],
      admin: {
        description: 'Gift card delivery type',
      },
    },
    {
      name: 'code',
      type: 'text',
      unique: true,
      admin: {
        description: 'Unique gift card code (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'initialAmount',
      type: 'number',
      required: true,
      min: 10,
      max: 1000,
      admin: {
        description: 'Original purchase amount',
      },
    },
    {
      name: 'currentBalance',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Remaining balance',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Redeemed', value: 'redeemed' },
        { label: 'Expired', value: 'expired' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'purchaserName',
      type: 'text',
      required: true,
    },
    {
      name: 'purchaserEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'recipientName',
      type: 'text',
    },
    {
      name: 'recipientEmail',
      type: 'email',
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: 'Personal message from purchaser',
      },
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      defaultValue: 'immediate',
      options: [
        { label: 'Send Immediately', value: 'immediate' },
        { label: 'Schedule for Later', value: 'scheduled' },
      ],
      admin: {
        description: 'When to deliver the digital gift card',
        condition: (data) => data.type === 'digital',
      },
    },
    {
      name: 'scheduledDeliveryDate',
      type: 'date',
      admin: {
        description: 'Date and time to send the gift card email',
        condition: (data) => data.type === 'digital' && data.deliveryMethod === 'scheduled',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
      ],
      admin: {
        description: 'Email delivery status for digital cards',
        condition: (data) => data.type === 'digital',
        readOnly: true,
      },
    },
    {
      name: 'sentDate',
      type: 'date',
      admin: {
        description: 'When the gift card email was sent',
        condition: (data) => data.type === 'digital' && data.deliveryStatus === 'sent',
        readOnly: true,
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      admin: {
        description: 'Shipping address for physical gift cards',
        condition: (data) => data.type === 'physical',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'street1',
          type: 'text',
          required: true,
          admin: {
            description: 'Street address line 1',
          },
        },
        {
          name: 'street2',
          type: 'text',
          admin: {
            description: 'Apartment, suite, etc. (optional)',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
          admin: {
            description: 'ZIP/Postal Code',
          },
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'United States',
        },
      ],
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
      ],
      admin: {
        description: 'Fulfillment status for physical cards',
        condition: (data) => data.type === 'physical',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        description: 'USPS tracking number',
        condition: (data) => data.type === 'physical' && (data.fulfillmentStatus === 'shipped' || data.fulfillmentStatus === 'delivered'),
      },
    },
    {
      name: 'shippedDate',
      type: 'date',
      admin: {
        description: 'Date card was shipped',
        condition: (data) => data.type === 'physical' && (data.fulfillmentStatus === 'shipped' || data.fulfillmentStatus === 'delivered'),
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        description: 'Stripe Payment Intent ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      admin: {
        description: 'Stripe Checkout Session ID',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        // Auto-generate gift card code for digital cards on creation
        if (operation === 'create' && !data.code && data.type === 'digital') {
          data.code = generateGiftCardCode()
        }

        // For physical cards, generate code when marked as shipped
        if (data.type === 'physical' && !data.code && data.fulfillmentStatus === 'shipped') {
          data.code = generateGiftCardCode()
          // Set shipped date if not already set
          if (!data.shippedDate) {
            data.shippedDate = new Date().toISOString()
          }
        }

        // If balance reaches 0, mark as redeemed
        if (data.currentBalance === 0 && data.status === 'active') {
          data.status = 'redeemed'
        }

        return data
      },
    ],
  },
}

// Generate a unique gift card code
function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude similar chars (0/O, 1/I)
  const segments = 4
  const segmentLength = 4

  const code = Array.from({ length: segments }, () => {
    return Array.from(
      { length: segmentLength },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  }).join('-')

  return `LRP-${code}`
}
