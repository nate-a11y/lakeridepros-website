import type { CollectionConfig } from 'payload'

export const GiftCards: CollectionConfig = {
  slug: 'gift-cards',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'initialAmount', 'currentBalance', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique gift card code',
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
      async ({ data, operation }) => {
        // Auto-generate gift card code on creation
        if (operation === 'create' && !data.code) {
          data.code = generateGiftCardCode()
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
