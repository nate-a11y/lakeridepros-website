import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Generate an image URL from a Sanity image source.
 *
 * Usage:
 *   urlFor(doc.image).width(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
