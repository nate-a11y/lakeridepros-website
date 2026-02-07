import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'giftCard',
  title: 'Gift Card',
  type: 'document',
  fieldsets: [
    {name: 'digital', title: 'Digital Delivery', options: {collapsible: true}},
    {name: 'physical', title: 'Physical Delivery', options: {collapsible: true}},
    {name: 'payment', title: 'Payment Information', options: {collapsible: true}},
  ],
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'Gift card delivery type',
      initialValue: 'digital',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Digital', value: 'digital'},
          {title: 'Physical', value: 'physical'},
        ],
      },
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Unique gift card code (auto-generated)',
      readOnly: true,
    }),
    defineField({
      name: 'initialAmount',
      title: 'Initial Amount',
      type: 'number',
      description: 'Original purchase amount',
      validation: (rule) => rule.required().min(10).max(1000),
    }),
    defineField({
      name: 'currentBalance',
      title: 'Current Balance',
      type: 'number',
      description: 'Remaining balance',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'active',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Redeemed', value: 'redeemed'},
          {title: 'Expired', value: 'expired'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
    }),
    defineField({
      name: 'purchaserName',
      title: 'Purchaser Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'purchaserEmail',
      title: 'Purchaser Email',
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Must be a valid email address'
        }),
    }),
    defineField({
      name: 'recipientName',
      title: 'Recipient Name',
      type: 'string',
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Recipient Email',
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Must be a valid email address'
        }),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      description: 'Personal message from purchaser',
    }),
    defineField({
      name: 'deliveryMethod',
      title: 'Delivery Method',
      type: 'string',
      description: 'When to deliver the digital gift card',
      fieldset: 'digital',
      options: {
        list: [
          {title: 'Send Immediately', value: 'immediate'},
          {title: 'Schedule for Later', value: 'scheduled'},
        ],
      },
    }),
    defineField({
      name: 'scheduledDeliveryDate',
      title: 'Scheduled Delivery Date',
      type: 'datetime',
      description: 'Date and time to send the gift card email',
      fieldset: 'digital',
    }),
    defineField({
      name: 'deliveryStatus',
      title: 'Delivery Status',
      type: 'string',
      description: 'Email delivery status for digital cards',
      initialValue: 'pending',
      readOnly: true,
      fieldset: 'digital',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Sent', value: 'sent'},
        ],
      },
    }),
    defineField({
      name: 'sentDate',
      title: 'Sent Date',
      type: 'datetime',
      description: 'When the gift card email was sent',
      readOnly: true,
      fieldset: 'digital',
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      description: 'Shipping address for physical gift cards',
      fieldset: 'physical',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'street1',
          title: 'Street Address Line 1',
          type: 'string',
          description: 'Street address line 1',
        }),
        defineField({
          name: 'street2',
          title: 'Street Address Line 2',
          type: 'string',
          description: 'Apartment, suite, etc. (optional)',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
          description: 'State/Province',
        }),
        defineField({
          name: 'zipCode',
          title: 'ZIP Code',
          type: 'string',
          description: 'ZIP/Postal Code',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'United States',
        }),
      ],
    }),
    defineField({
      name: 'fulfillmentStatus',
      title: 'Fulfillment Status',
      type: 'string',
      description: 'Fulfillment status for physical cards',
      initialValue: 'pending',
      fieldset: 'physical',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Processing', value: 'processing'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
        ],
      },
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'USPS tracking number',
      fieldset: 'physical',
    }),
    defineField({
      name: 'shippedDate',
      title: 'Shipped Date',
      type: 'date',
      description: 'Date card was shipped',
      fieldset: 'physical',
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'Stripe Payment Intent ID',
      readOnly: true,
      fieldset: 'payment',
    }),
    defineField({
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
      description: 'Stripe Checkout Session ID',
      readOnly: true,
      fieldset: 'payment',
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'status',
      type: 'type',
      amount: 'initialAmount',
    },
    prepare({title, subtitle, type, amount}) {
      return {
        title: title || 'Gift Card (no code)',
        subtitle: `${type ?? 'digital'} - $${amount ?? 0} - ${subtitle ?? 'active'}`,
      }
    },
  },
})
