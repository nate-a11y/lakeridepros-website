/**
 * Payload CMS API catch-all route handler
 *
 * This file handles ALL Payload API endpoints including:
 * - /api/users/me (authentication)
 * - /api/media (file uploads)
 * - /api/pages (CMS content)
 * - /api/blog-posts (blog content)
 * - /api/graphql (GraphQL endpoint)
 *
 * CRITICAL: This file MUST exist for Payload admin panel to work.
 * The catch-all [...slug] pattern matches all /api/* routes that
 * aren't explicitly defined elsewhere.
 */

import config from '@/src/payload.config'
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
