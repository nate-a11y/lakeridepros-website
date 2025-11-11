import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections and adapters
import { Users } from '../collections/Users'
import { Media } from '../collections/Media'
import { Pages } from '../collections/Pages'
import { BlogPosts } from '../collections/BlogPosts'
import { supabaseAdapter } from '../lib/supabase-adapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  collections: [Users, Media, Pages, BlogPosts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'noreply@lakeridepros.com',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'Lake Ride Pros',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: supabaseAdapter,
          disableLocalStorage: true,
        },
      },
    }),
  ],
})
