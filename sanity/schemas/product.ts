import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this product',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description for product listings',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price in USD',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare At Price',
      type: 'number',
      description: 'Original price (for showing discounts)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Apparel', value: 'apparel'},
              {title: 'Accessories', value: 'accessories'},
              {title: 'Drinkware', value: 'drinkware'},
              {title: 'Home & Living', value: 'home'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'tag',
              title: 'Tag',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'tag',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Leave empty for unlimited stock',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage and featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      description: 'Product variants (sizes, colors, etc.)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'e.g., "Small - Black" or "Large - White"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              description: 'Unique SKU for this variant',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
              description: 'Override base price (leave empty to use base price)',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'compareAtPrice',
              title: 'Compare At Price',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'inStock',
              title: 'In Stock',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'stockQuantity',
              title: 'Stock Quantity',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              description: 'e.g., "Small", "Medium", "Large", "XL"',
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
              description: 'e.g., "Black", "White", "Navy"',
            }),
            defineField({
              name: 'colorHex',
              title: 'Color Hex',
              type: 'string',
              description: 'Hex color code from Printify (e.g., "#000000")',
            }),
            defineField({
              name: 'printifyVariantId',
              title: 'Printify Variant ID',
              type: 'string',
              description: 'Printify variant ID for fulfillment',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'sku',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'printifyProductId',
      title: 'Printify Product ID',
      type: 'string',
      description: 'Printify product ID for print-on-demand',
    }),
    defineField({
      name: 'printifyBlueprintId',
      title: 'Printify Blueprint ID',
      type: 'string',
      description: 'Printify blueprint ID',
    }),
    defineField({
      name: 'printifyPrintProviderId',
      title: 'Printify Print Provider ID',
      type: 'string',
      description: 'Printify print provider ID',
    }),
    defineField({
      name: 'personalization',
      title: 'Personalization',
      type: 'object',
      description: 'Personalization settings from Printify',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          description: 'Enable personalization for this product',
          initialValue: false,
        }),
        defineField({
          name: 'instructions',
          title: 'Instructions',
          type: 'string',
          description: 'Instructions shown to customers (e.g., "Enter name to be printed")',
        }),
        defineField({
          name: 'maxLength',
          title: 'Max Length',
          type: 'number',
          description: 'Maximum character limit for personalization',
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'draft',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Active', value: 'active'},
        ],
      },
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO meta title',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'SEO meta description',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'featuredImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `$${subtitle}` : undefined,
        media,
      }
    },
  },
})
