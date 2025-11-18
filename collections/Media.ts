import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Resize the original image to max 1920px (Full HD) for web optimization
    // This applies to the "original" that gets stored
    resizeOptions: {
      width: 1920,
      height: 1920,
      fit: 'inside', // Maintains aspect ratio, fits within bounds
    },
    // Configure image sizes for automatic resizing
    // Just one optimized size for most website use cases
    imageSizes: [
      {
        name: 'optimized',
        width: 1024,
        // Height undefined = maintain aspect ratio
      },
    ],
    // Configure format options for WebP conversion and optimization
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80, // Good balance between quality and file size
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  access: {
    // Public read access for images on website
    read: () => true,
    // Authenticated users can upload/manage media
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      // Only admins can delete media
      return !!user && user.role === 'admin'
    },
  },
}
