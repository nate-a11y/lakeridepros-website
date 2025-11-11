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
import { Products } from '../collections/Products'
import { GiftCards } from '../collections/GiftCards'
import { Orders } from '../collections/Orders'
import { Partners } from '../collections/Partners'
import { supabaseAdapter } from '../lib/supabase-adapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Helper to get the appropriate Postgres connection string with SSL disabled
function getPostgresConnectionString() {
  // For serverless: Use POSTGRES_URL (transaction pooler on port 6543) - handles thousands of connections
  // For migrations: Use POSTGRES_URL_NON_POOLING (direct connection on port 5432) - needed for schema changes
  const isMigration = process.argv.includes('migrate') || process.env.PAYLOAD_MIGRATING === 'true'

  let connStr = isMigration
    ? (process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URI || '')
    : (process.env.POSTGRES_URL || process.env.DATABASE_URI || '')

  // Supabase URLs come with sslmode=require - we need to override it to disable cert verification
  if (connStr.includes('sslmode=require')) {
    connStr = connStr.replace('sslmode=require', 'sslmode=no-verify')
  } else if (!connStr.includes('sslmode=')) {
    // If no sslmode param exists, add it
    const separator = connStr.includes('?') ? '&' : '?'
    connStr = `${connStr}${separator}sslmode=no-verify`
  }

  return connStr
}

const config = buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  collections: [Users, Media, Pages, BlogPosts, Products, GiftCards, Orders, Partners],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getPostgresConnectionString(),
      ssl: {
        rejectUnauthorized: false,
      },
      // Serverless-friendly connection pool settings
      max: 1, // Max connections per serverless function instance (keep low for serverless)
      min: 0, // No minimum connections (serverless functions should scale to zero)
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Timeout after 10s if can't connect
      allowExitOnIdle: true, // Allow process to exit when all connections are idle
    },
    // Use migrations only, no auto-push
    push: false,
  }),
  sharp,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000',
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:3000',
  ].filter(Boolean),
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

export default config
export { config }
