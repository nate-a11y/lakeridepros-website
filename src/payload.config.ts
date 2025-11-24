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
import { ServiceAnalytics } from '../collections/ServiceAnalytics'
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

// Detect if we're in a build environment (CI/Vercel build phase)
const isBuild = process.env.CI === 'true' || process.env.VERCEL_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'

// Helper to get the appropriate Postgres connection string with SSL disabled
function getPostgresConnectionString() {
  // For migrations: Use POSTGRES_URL_NON_POOLING (direct connection on port 5432) - needed for DDL operations like ALTER TABLE
  // For serverless runtime: Use POSTGRES_PRISMA_URL (transaction pooler on port 6543) - handles thousands of connections
  let connStr = isMigration
    ? (process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URI || '')
    : (process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URI || '')

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

// Get pool configuration based on environment
function getPoolConfig() {
  if (isMigration) {
    // Migration pool config: more connections, longer timeouts for slow build environments
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      min: 0,
      idleTimeoutMillis: 180000,
      connectionTimeoutMillis: 180000,
      allowExitOnIdle: true,
      options: '-c statement_timeout=120000',
    }
  } else if (isBuild) {
    // Build-time config: moderate pool for parallel static page generation
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      min: 0,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 60000,
      allowExitOnIdle: true,
      options: '-c statement_timeout=90000',
    }
  } else {
    // Serverless runtime: balanced for performance
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 3,
      min: 0,
      idleTimeoutMillis: 120000,
      connectionTimeoutMillis: 120000,
      allowExitOnIdle: true,
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
    },
    components: {
      graphics: {
        Icon: '@/components/admin/Icon#Icon',
        Logo: '@/components/admin/Logo#Logo',
      },
      beforeDashboard: ['@/components/admin/Dashboard#Dashboard'],
    },
  },
  collections: [BlogPosts, GiftCards, Media, Orders, Pages, Partners, Products, Services, ServiceAnalytics, Testimonials, Users, Vehicles],
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
    'https://www.lakeridepros.com',
    'https://lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean) as string[],
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com',
    'https://www.lakeridepros.com',
    'https://lakeridepros.com',
    'https://lakeridepros-website.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean) as string[],
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
