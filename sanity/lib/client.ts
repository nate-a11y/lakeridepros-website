import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Standard read client — uses the Sanity CDN for fast, cached reads.
 * Safe to use in browser / Server Components for public data.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Authenticated write client — bypasses the CDN and includes a write token.
 * Use only in server-side code (API routes, server actions) for mutations.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

/**
 * Preview / draft client — bypasses the CDN and includes a read token
 * so it can access draft documents for live preview.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
})
