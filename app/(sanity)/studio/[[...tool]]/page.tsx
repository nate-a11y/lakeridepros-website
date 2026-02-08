'use client'

/**
 * Sanity Studio embedded in Next.js
 *
 * Access at: /studio
 * This replaces the Payload CMS admin panel at /admin
 */

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
