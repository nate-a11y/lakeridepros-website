import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Import collections and adapters
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { BlogPosts } from './collections/BlogPosts'
// import { supabaseAdapter } from './lib/supabase-adapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
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
  cors: process.env.CORS_ORIGINS?.split(',') || [],
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  ...(process.env.RESEND_API_KEY ? {
    email: resendAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'noreply@lakeridepros.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'Lake Ride Pros',
      apiKey: process.env.RESEND_API_KEY,
    }),
  } : {}),
  // Temporarily disable cloud storage to debug config issue
  // plugins: [
  //   cloudStoragePlugin({
  //     collections: {
  //       media: {
  //         adapter: supabaseAdapter,
  //         disableLocalStorage: true,
  //       },
  //     },
  //   }),
  // ],
})

export default config
