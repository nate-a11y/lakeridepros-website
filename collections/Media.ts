import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      edit: {
        // Custom upload component that compresses images before upload
        // to stay within Vercel's 5MB serverless function limit
        Upload: '@/components/admin/CompressedUpload#CompressedUpload',
      },
    },
  },
  upload: {
    // Resize original to 1024px and convert to WebP
    // This reduces storage by only keeping one optimized version
    resizeOptions: {
      width: 1024,
      height: 1024,
      fit: 'inside', // Maintains aspect ratio, fits within bounds
    },
    // Convert to WebP format with quality optimization
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80, // Good balance between quality and file size
      },
    },
    // No additional image sizes - just the single optimized original
    imageSizes: [],
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
