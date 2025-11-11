import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
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
    defaultColumns: ['name', 'price', 'inStock', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this product',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description for product listings',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in USD',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price (for showing discounts)',
      },
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        description: 'Stock Keeping Unit',
      },
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Apparel', value: 'apparel' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Drinkware', value: 'drinkware' },
        { label: 'Home & Living', value: 'home' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
    {
      name: 'stockQuantity',
      type: 'number',
      min: 0,
      admin: {
        description: 'Leave empty for unlimited stock',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage and featured sections',
      },
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants (sizes, colors, etc.)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Small - Black" or "Large - White"',
          },
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique SKU for this variant',
          },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Override base price (leave empty to use base price)',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'stockQuantity',
          type: 'number',
          min: 0,
        },
        {
          name: 'size',
          type: 'text',
          admin: {
            description: 'e.g., "Small", "Medium", "Large", "XL"',
          },
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'e.g., "Black", "White", "Navy"',
          },
        },
        {
          name: 'printifyVariantId',
          type: 'text',
          admin: {
            description: 'Printify variant ID for fulfillment',
          },
        },
      ],
    },
    {
      name: 'printifyProductId',
      type: 'text',
      admin: {
        description: 'Printify product ID for print-on-demand',
      },
    },
    {
      name: 'printifyBlueprintId',
      type: 'text',
      admin: {
        description: 'Printify blueprint ID',
      },
    },
    {
      name: 'printifyPrintProviderId',
      type: 'text',
      admin: {
        description: 'Printify print provider ID',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
      ],
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'SEO meta title',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO meta description',
      },
    },
  ],
}
