import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { auditLogPlugin } from '@ghosthaise/payload-audit-log'
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
// CI=true is set during Vercel builds (NOT at runtime)
// NEXT_PHASE=phase-production-build is set during Next.js build
// NOTE: VERCEL=1 is set at BOTH build and runtime, so don't use it here
const isBuild = !!(
  process.env.CI === 'true' ||
  process.env.NEXT_PHASE === 'phase-production-build'
)

// Convert a Supabase pooler URL to direct connection URL
// Pooler uses port 6543, direct uses port 5432
// Pooler hostname: aws-0-region.pooler.supabase.com
// Direct hostname: db.projectref.supabase.co
function convertToDirectConnection(url: string): string {
  if (!url) return url

  try {
    const parsed = new URL(url)

    // If using pooler port 6543, switch to direct port 5432
    if (parsed.port === '6543') {
      parsed.port = '5432'
    }

    // If hostname contains 'pooler.supabase.com', we need the direct host
    // This requires POSTGRES_URL_NON_POOLING to be set correctly
    // We can't auto-convert the hostname as it requires project ref

    return parsed.toString()
  } catch {
    // If URL parsing fails, try simple port replacement
    return url.replace(':6543/', ':5432/')
  }
}

// Helper to get the appropriate Postgres connection string with SSL disabled
function getPostgresConnectionString() {
  // For migrations and builds: Use POSTGRES_URL_NON_POOLING (direct connection on port 5432)
  // - Migrations need direct connection for DDL operations like ALTER TABLE
  // - Builds need direct connection for parallel static page generation (pooler has limits)
  // For serverless runtime: Use POSTGRES_PRISMA_URL (transaction pooler on port 6543)
  let connStr: string

  if (isMigration || isBuild) {
    // Prefer non-pooling, but convert pooler URL to direct if needed
    connStr = process.env.POSTGRES_URL_NON_POOLING
      || convertToDirectConnection(process.env.POSTGRES_URL || '')
      || process.env.DATABASE_URI
      || ''

    // Log connection info during build for debugging (redacted for security)
    if (isBuild && connStr) {
      const redacted = connStr.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
      console.log(`[Payload DB] Build mode - using connection: ${redacted.substring(0, 80)}...`)
      console.log(`[Payload DB] POSTGRES_URL_NON_POOLING set: ${!!process.env.POSTGRES_URL_NON_POOLING}`)
    }
  } else {
    // Runtime: use pooler for connection multiplexing
    connStr = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URI || ''
  }

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
    // Build-time config for static page generation
    // WARNING: If POSTGRES_URL_NON_POOLING is not set, this falls back to pooler
    // which has strict session limits. Keep max low to avoid exhaustion.
    const usingPooler = !process.env.POSTGRES_URL_NON_POOLING
    if (usingPooler) {
      console.warn('[Payload DB] WARNING: POSTGRES_URL_NON_POOLING not set - using pooler with limited connections')
    }
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: usingPooler ? 3 : 10, // Low pool for pooler, higher for direct
      min: 0,
      idleTimeoutMillis: usingPooler ? 5000 : 30000, // Release quickly on pooler
      connectionTimeoutMillis: 120000, // 2 min timeout for slow cold starts
      allowExitOnIdle: true,
      options: '-c statement_timeout=90000',
    }
  } else {
    // Serverless runtime: balanced settings for Supabase pooler
    // The pooler (port 6543) handles connection multiplexing
    return {
      connectionString: getPostgresConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5, // Allow parallel queries within a single request
      min: 0,
      idleTimeoutMillis: 10000, // Release idle connections after 10 seconds
      connectionTimeoutMillis: 30000, // 30 second connection timeout
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
    migrationDir: path.resolve(dirname, '../migrations'),
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
    defaultFromAddress: process.env.EMAIL_FROM || 'contactus@updates.lakeridepros.com',
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
    // SEO plugin - adds meta fields with live Google preview
    seoPlugin({
      collections: ['blog-posts', 'services', 'pages', 'vehicles'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title || 'Lake Ride Pros'} | Lake Ride Pros`,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.description || '',
      generateURL: ({ doc, collectionSlug }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.lakeridepros.com'
        if (collectionSlug === 'blog-posts') return `${baseURL}/blog/${doc?.slug}`
        if (collectionSlug === 'services') return `${baseURL}/services/${doc?.slug}`
        if (collectionSlug === 'vehicles') return `${baseURL}/fleet/${doc?.slug}`
        if (collectionSlug === 'pages') return `${baseURL}/${doc?.slug}`
        return baseURL
      },
    }),
    // Redirects plugin - manage redirects from admin UI
    redirectsPlugin({
      collections: ['blog-posts', 'services', 'pages', 'vehicles'],
      overrides: {
        admin: {
          group: 'Settings',
        },
      },
    }),
    // Search plugin - full-text search across collections
    searchPlugin({
      collections: ['blog-posts', 'services', 'vehicles', 'partners'],
      defaultPriorities: {
        'blog-posts': 10,
        'services': 20,
        'vehicles': 15,
        'partners': 5,
      },
      searchOverrides: {
        admin: {
          group: 'Settings',
        },
      },
      beforeSync: ({ originalDoc, searchDoc }) => {
        // Extract title from different collection document structures
        return {
          ...searchDoc,
          title: originalDoc?.title || originalDoc?.name || originalDoc?.businessName || 'Untitled',
        }
      },
    }),
    // Form Builder plugin - create forms from admin UI
    formBuilderPlugin({
      formOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      redirectRelationships: ['pages'],
    }),
    // Audit Log plugin - track who changed what and when
    auditLogPlugin({
      collections: ['blog-posts', 'services', 'pages', 'vehicles', 'partners', 'products', 'gift-cards', 'orders', 'testimonials'],
    }),
    // Sentry plugin - error tracking (only if SENTRY_DSN is configured)
    ...(process.env.SENTRY_DSN ? [sentryPlugin({ enabled: true })] : []),
  ],
})

export default config
export { config }
