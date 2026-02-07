import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import { dataset, projectId } from '../env'

const builder = imageUrlBuilder({ projectId, dataset })

/**
 * Generate an image URL from a Sanity image source.
 *
 * Usage:
 *   urlFor(doc.image).width(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
