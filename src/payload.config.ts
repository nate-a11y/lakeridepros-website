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
import { Services } from '../collections/Services'
import { Vehicles } from '../collections/Vehicles'
import { Testimonials } from '../collections/Testimonials'
import { Products } from '../collections/Products'
import { GiftCards } from '../collections/GiftCards'
import { Orders } from '../collections/Orders'
import { Partners } from '../collections/Partners'
import { supabaseAdapter } from '../lib/supabase-adapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Detect if we're running migrations
const isMigration = process.argv.includes('migrate') || process.env.PAYLOAD_MIGRATING === 'true'

// Helper to get the appropriate Postgres connection string with SSL disabled
function getPostgresConnectionString() {
  // For serverless: Use POSTGRES_URL (transaction pooler on port 6543) - handles thousands of connections
  // For migrations: Use POSTGRES_URL_NON_POOLING (direct connection on port 5432) - needed for schema changes
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

// Get pool configuration based on whether we're migrating or running serverless
function getPoolConfig() {
  if (isMigration) {
    // Migration pool config: more connections, longer timeouts for slow build environments
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5, // Reduced from 10 to avoid overwhelming the database
      min: 0,
      idleTimeoutMillis: 180000, // 3 minutes - allow time for slow migrations
      connectionTimeoutMillis: 180000, // 3 minutes - handle network latency and cold starts
      allowExitOnIdle: true,
      // Set statement timeout to prevent queries from hanging indefinitely (120 seconds)
      options: '-c statement_timeout=120000',
    }
  } else {
    // Serverless pool config: allow concurrent operations while avoiding pool exhaustion
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 3, // Allow up to 3 concurrent connections per serverless function
      min: 0,
      idleTimeoutMillis: 120000, // 2 minutes - allow time for image uploads and heavy operations
      connectionTimeoutMillis: 120000, // 2 minutes - handle cold starts and connection pooler delays
      allowExitOnIdle: true,
      // Set statement timeout to prevent queries from hanging indefinitely (60 seconds)
      options: '-c statement_timeout=60000',
    }
  }
}

const config = buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    meta: {
      titleSuffix: '- Lake Ride Pros',
      favicon: '/Color logo - no background.png',
      ogImage: '/Color logo - no background.png',
    },
    components: {
      graphics: {
        Icon: '@/components/admin/Icon#Icon',
        Logo: '@/components/admin/Logo#Logo',
      },
      beforeDashboard: ['@/components/admin/Dashboard#Dashboard'],
    },
    css: path.resolve(dirname, 'styles/admin.css'),
  },
  collections: [Users, Media, Pages, BlogPosts, Services, Vehicles, Testimonials, Products, GiftCards, Orders, Partners],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: getPoolConfig(),
    // Use migrations only, no auto-push
    push: false,
  }),
  sharp,
  // CRITICAL: Use NEXT_PUBLIC_ prefix so the admin client can access this in the browser
  // Falls back to server-side vars for backward compatibility and build-time usage
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000',
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:3000',
  ].filter(Boolean),
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'hello@updates.lakeridepros.com',
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
