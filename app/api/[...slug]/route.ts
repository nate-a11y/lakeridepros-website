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

import { GET, POST, DELETE, PATCH, PUT } from '@payloadcms/next/routes'

export { DELETE, GET, PATCH, POST, PUT }
