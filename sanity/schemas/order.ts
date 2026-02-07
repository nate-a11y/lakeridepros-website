import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Unique order number',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return 'Email is required'
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Must be a valid email address'
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'processing',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Processing', value: 'processing'},
          {title: 'Sent to Printify', value: 'sent_to_printify'},
          {title: 'In Production', value: 'in_production'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Refunded', value: 'refunded'},
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'productId',
              title: 'Product ID',
              type: 'string',
            }),
            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
            }),
            defineField({
              name: 'variantId',
              title: 'Variant ID',
              type: 'string',
            }),
            defineField({
              name: 'variantName',
              title: 'Variant Name',
              type: 'string',
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
          ],
          preview: {
            select: {
              title: 'productName',
              quantity: 'quantity',
              price: 'price',
            },
            prepare({title, quantity, price}) {
              return {
                title: title || 'Item',
                subtitle: `Qty: ${quantity ?? 0} - $${price ?? 0}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'line1',
          title: 'Address Line 1',
          type: 'string',
        }),
        defineField({
          name: 'line2',
          title: 'Address Line 2',
          type: 'string',
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
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'US',
        }),
      ],
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'tax',
      title: 'Tax',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'Stripe Payment Intent ID',
      readOnly: true,
    }),
    defineField({
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
      description: 'Stripe Checkout Session ID',
      readOnly: true,
    }),
    defineField({
      name: 'printifyOrderId',
      title: 'Printify Order ID',
      type: 'string',
      description: 'Printify Order ID',
      readOnly: true,
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipping tracking number',
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Tracking URL',
      type: 'string',
      description: 'Shipping tracking URL',
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'status',
    },
  },
})
