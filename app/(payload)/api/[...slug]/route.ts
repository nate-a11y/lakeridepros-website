/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import config from '../../../../src/payload.config'
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

// Increase body size limit for API routes to handle large blog posts with rich content
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max execution time
export const dynamic = 'force-dynamic' // Disable caching for fresh data

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
