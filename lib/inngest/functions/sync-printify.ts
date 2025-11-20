import { inngest } from '../client'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@/src/payload.config'
import { revalidatePaths } from '@/lib/revalidation'
import { createHash } from 'crypto'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID

interface PrintifyImage {
  src: string
  position: string
  is_default: boolean
  variant_ids: number[]
}

interface PrintifyVariantOption {
  size?: string
  color?: string
  [key: string]: string | undefined
}

interface PrintifyVariant {
  id: number
  sku: string
  cost: number
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  options: PrintifyVariantOption[]
}

interface PrintifyPersonalization {
  instructions: string
  buyer_response_limit?: number
}

interface PrintifySalesChannelProperties {
  personalisation?: PrintifyPersonalization[]
  [key: string]: unknown
}

interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  blueprint_id: number
  print_provider_id: number
  visible: boolean
  sales_channel_properties?: PrintifySalesChannelProperties
  [key: string]: unknown
}

// Retry helper function with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      if (response.status === 429 && attempt < maxRetries) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '5')
        console.log(`[Retry] Rate limited, waiting ${retryAfter}s before retry ${attempt + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }

      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response
      }

      if (response.status >= 500 && attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000)
        console.log(`[Retry] Server error ${response.status}, retrying in ${backoffMs}ms (${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
        continue
      }

      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000)
        console.log(`[Retry] Network error, retrying in ${backoffMs}ms (${attempt + 1}/${maxRetries}):`, lastError.message)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetchWithRetry(url, {
    headers: {
      'User-Agent': 'LakeRidePros/1.0',
    },
  }, 3)

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

function sanitizeFilename(filename: string): string {
  if (filename.endsWith('.webp')) {
    return filename
  }

  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  const hash = createHash('md5').update(nameWithoutExt).digest('hex').substring(0, 8)
  const truncated = sanitized.substring(0, 40).replace(/-+$/, '')

  return `${truncated}-${hash}.webp`
}

async function findExistingMedia(payload: Payload, filename: string) {
  const sanitizedFilename = sanitizeFilename(filename)

  try {
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: sanitizedFilename,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0]
    }

    return null
  } catch {
    return null
  }
}

async function uploadImageToPayload(payload: Payload, imageBuffer: Buffer, filename: string) {
  const sanitizedFilename = sanitizeFilename(filename)

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    },
    file: {
      data: imageBuffer,
      name: sanitizedFilename,
      mimetype: 'image/png',
      size: imageBuffer.length,
    },
    overrideAccess: true,
  })

  return media
}

async function getOrUploadImage(
  payload: Payload,
  imageUrl: string,
  filename: string
): Promise<{ media: Awaited<ReturnType<typeof uploadImageToPayload>>; reused: boolean }> {
  const sanitizedFilename = sanitizeFilename(filename)

  const existingMedia = await findExistingMedia(payload, sanitizedFilename)
  if (existingMedia) {
    return { media: existingMedia, reused: true }
  }

  const imageBuffer = await downloadImage(imageUrl)
  const media = await uploadImageToPayload(payload, imageBuffer, filename)
  return { media, reused: false }
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return slug.substring(0, 100).replace(/-+$/, '')
}

async function ensureUniqueSlug(payload: Payload, baseSlug: string, existingProductId?: string | number): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0 || (existingProductId && existing.docs[0].id === existingProductId)) {
      return slug
    }

    counter++
    slug = `${baseSlug}-${counter}`.substring(0, 100).replace(/-+$/, '')
  }
}

// Process a single product
async function processProduct(
  payload: Payload,
  printifyProduct: PrintifyProduct
): Promise<{ created: boolean; updated: boolean; imagesReused: number; imagesUploaded: number }> {
  const result = { created: false, updated: false, imagesReused: 0, imagesUploaded: 0 }

  // Check if product already exists
  const existing = await payload.find({
    collection: 'products',
    where: {
      printifyProductId: {
        equals: printifyProduct.id,
      },
    },
  })

  const baseSlug = slugify(printifyProduct.title)
  const existingProductId = existing.docs.length > 0 ? existing.docs[0].id : undefined
  const slug = await ensureUniqueSlug(payload, baseSlug, existingProductId)

  // Process images
  let featuredImageId: number | null = null
  const additionalImages: Array<{ image: number }> = []

  const defaultImage =
    printifyProduct.images.find((img: PrintifyImage) => img.is_default) || printifyProduct.images[0]

  if (defaultImage) {
    const { media, reused } = await getOrUploadImage(payload, defaultImage.src, `${slug}-featured.webp`)
    featuredImageId = media.id as number
    if (reused) {
      result.imagesReused++
    } else {
      result.imagesUploaded++
    }
  }

  // Deduplicate images
  const normalizeUrl = (url: string) => url.split('?')[0].toLowerCase()
  const seenUrls = new Set(defaultImage ? [normalizeUrl(defaultImage.src)] : [])

  const imagesToProcess = printifyProduct.images
    .filter((img: PrintifyImage) => {
      if (img.is_default) return false
      const normalizedUrl = normalizeUrl(img.src)
      if (seenUrls.has(normalizedUrl)) return false
      seenUrls.add(normalizedUrl)
      return true
    })
    .slice(0, 5)

  for (let i = 0; i < imagesToProcess.length; i++) {
    const image = imagesToProcess[i]
    try {
      const { media, reused } = await getOrUploadImage(payload, image.src, `${slug}-${i + 1}.webp`)
      additionalImages.push({ image: media.id as number })
      if (reused) {
        result.imagesReused++
      } else {
        result.imagesUploaded++
      }
    } catch (error) {
      console.error(`[Inngest Sync] Failed to upload image ${i + 1} for ${printifyProduct.title}:`, error)
    }
  }

  // Map variants
  const variants = printifyProduct.variants
    .filter((v: PrintifyVariant) => v.is_enabled && v.is_available)
    .map((variant: PrintifyVariant) => {
      const size = variant.options.find((opt: PrintifyVariantOption) => opt.size)?.size || ''
      const color = variant.options.find((opt: PrintifyVariantOption) => opt.color)?.color || ''

      return {
        name: variant.title,
        sku: variant.sku,
        price: variant.price / 100,
        inStock: variant.is_available,
        size,
        color,
        printifyVariantId: variant.id.toString(),
      }
    })

  const basePrice =
    variants.length > 0
      ? Math.min(...variants.map((v: { price: number }) => v.price))
      : printifyProduct.variants[0]?.price / 100 || 0

  // Determine category
  const categories: ("apparel" | "accessories" | "drinkware" | "home")[] = []
  const titleLower = printifyProduct.title.toLowerCase()
  if (titleLower.includes('shirt') || titleLower.includes('hoodie') || titleLower.includes('apparel')) {
    categories.push('apparel')
  }
  if (titleLower.includes('mug') || titleLower.includes('cup') || titleLower.includes('bottle')) {
    categories.push('drinkware')
  }
  if (titleLower.includes('hat') || titleLower.includes('cap') || titleLower.includes('bag')) {
    categories.push('accessories')
  }
  if (categories.length === 0) {
    categories.push('apparel')
  }

  // Extract personalization settings from sales_channel_properties
  const personalization = {
    enabled: false,
    instructions: '',
    maxLength: 0,
  }

  if (printifyProduct.sales_channel_properties?.personalisation &&
      printifyProduct.sales_channel_properties.personalisation.length > 0) {
    const firstPersonalization = printifyProduct.sales_channel_properties.personalisation[0]
    personalization.enabled = true
    personalization.instructions = firstPersonalization.instructions || ''
    personalization.maxLength = firstPersonalization.buyer_response_limit || 100
  }

  const productData = {
    name: printifyProduct.title,
    slug,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: printifyProduct.description || printifyProduct.title, version: 1 },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: printifyProduct.description?.substring(0, 200) || printifyProduct.title,
    featuredImage: featuredImageId,
    images: additionalImages,
    price: basePrice,
    categories,
    tags: printifyProduct.tags.map((tag: string) => ({ tag })),
    inStock: variants.some((v: { inStock: boolean }) => v.inStock),
    variants,
    printifyProductId: printifyProduct.id,
    printifyBlueprintId: printifyProduct.blueprint_id.toString(),
    printifyPrintProviderId: printifyProduct.print_provider_id.toString(),
    personalization,
    status: 'active' as const,
    metaTitle: printifyProduct.title,
    metaDescription: printifyProduct.description?.substring(0, 160) || printifyProduct.title,
  }

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'products',
      id: existing.docs[0].id,
      data: productData,
      overrideAccess: true,
      context: {
        skipRevalidation: true,
      },
    })
    result.updated = true
  } else {
    await payload.create({
      collection: 'products',
      data: productData,
      overrideAccess: true,
      context: {
        skipRevalidation: true,
      },
    })
    result.created = true
  }

  return result
}

// Main Inngest function for syncing Printify products
export const syncPrintifyProducts = inngest.createFunction(
  {
    id: 'sync-printify-products',
    name: 'Sync Printify Products',
    // Run twice daily at 6 AM and 6 PM UTC
    // You can also trigger this manually from the Inngest dashboard
  },
  { cron: '0 6,18 * * *' },
  async ({ step }) => {
    // Step 1: Fetch all products from Printify
    const allProducts = await step.run('fetch-printify-products', async () => {
      if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
        throw new Error('Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID')
      }

      const products: PrintifyProduct[] = []
      let currentPage = 1
      let hasMorePages = true
      const limit = 50

      while (hasMorePages) {
        console.log(`[Inngest Sync] Fetching page ${currentPage}...`)
        const response = await fetchWithRetry(
          `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/products.json?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${PRINTIFY_TOKEN}`,
              'User-Agent': 'LakeRidePros/1.0',
            },
          },
          3
        )

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Printify API error: ${response.status} - ${errorText}`)
        }

        const responseData = await response.json()
        const { data, current_page, last_page } = responseData

        console.log(`[Inngest Sync] Page ${current_page}/${last_page}: ${data.length} products`)
        products.push(...data)
        hasMorePages = current_page < last_page
        currentPage++
      }

      console.log(`[Inngest Sync] Fetched ${products.length} total products from Printify`)

      // Log visibility breakdown
      const visibleCount = products.filter(p => p.visible === true).length
      const hiddenCount = products.length - visibleCount
      console.log(`[Inngest Sync] Visibility breakdown: ${visibleCount} visible, ${hiddenCount} hidden`)

      // Filter to only include visible/published products
      const visibleProducts = products.filter(p => p.visible === true)
      console.log(`[Inngest Sync] Will sync ${visibleProducts.length} visible products`)

      return visibleProducts
    })

    // Step 2: Process products in batches
    // Each batch is a separate step, so we get checkpointing and no timeout issues
    const BATCH_SIZE = 5
    const batches = []
    for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
      batches.push(allProducts.slice(i, i + BATCH_SIZE))
    }

    const results = {
      total: allProducts.length,
      created: 0,
      updated: 0,
      failed: 0,
      imagesReused: 0,
      imagesUploaded: 0,
      errors: [] as string[],
    }

    // Process each batch as a separate step
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      const batchStart = batchIndex * BATCH_SIZE + 1
      const batchEnd = Math.min((batchIndex + 1) * BATCH_SIZE, allProducts.length)

      const batchResult = await step.run(`process-batch-${batchIndex + 1}`, async () => {
        const payload = await getPayload({ config })
        const batchResults = {
          created: 0,
          updated: 0,
          failed: 0,
          imagesReused: 0,
          imagesUploaded: 0,
          errors: [] as string[],
        }

        console.log(`[Inngest Sync] Processing batch ${batchIndex + 1}/${batches.length} (products ${batchStart}-${batchEnd})`)

        for (const product of batch) {
          try {
            // Add delay between products to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500))

            const result = await processProduct(payload, product)

            if (result.created) batchResults.created++
            if (result.updated) batchResults.updated++
            batchResults.imagesReused += result.imagesReused
            batchResults.imagesUploaded += result.imagesUploaded
          } catch (error) {
            batchResults.failed++
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            batchResults.errors.push(`${product.title}: ${errorMessage}`)
            console.error(`[Inngest Sync] Failed to sync "${product.title}":`, errorMessage)
          }
        }

        return batchResults
      })

      // Aggregate batch results
      results.created += batchResult.created
      results.updated += batchResult.updated
      results.failed += batchResult.failed
      results.imagesReused += batchResult.imagesReused
      results.imagesUploaded += batchResult.imagesUploaded
      results.errors.push(...batchResult.errors)
    }

    // Step 3: Clean up products that are no longer visible in Printify
    const cleanupResult = await step.run('cleanup-hidden-products', async () => {
      const payload = await getPayload({ config })

      // Get all products from Payload that have a printifyProductId
      const payloadProducts = await payload.find({
        collection: 'products',
        where: {
          printifyProductId: {
            exists: true,
          },
        },
        limit: 1000, // Adjust if you have more products
      })

      const visiblePrintifyIds = new Set(allProducts.map(p => p.id))
      let deactivated = 0

      for (const product of payloadProducts.docs) {
        // If product is not in the visible Printify products list, mark as draft
        if (!visiblePrintifyIds.has(product.printifyProductId as string)) {
          await payload.update({
            collection: 'products',
            id: product.id,
            data: {
              status: 'draft',
            },
            overrideAccess: true,
          })
          deactivated++
          console.log(`[Inngest Sync] Deactivated product "${product.name}" (not visible in Printify)`)
        }
      }

      return { deactivated, total: payloadProducts.docs.length }
    })

    // Step 4: Revalidate paths after all changes
    await step.run('revalidate-paths', async () => {
      if (results.created > 0 || results.updated > 0 || cleanupResult.deactivated > 0) {
        console.log('[Inngest Sync] Triggering revalidation for /shop and /')
        await revalidatePaths(['/shop', '/'])
      }
    })

    console.log(`[Inngest Sync] Completed - ${results.created} created, ${results.updated} updated, ${results.failed} failed, ${cleanupResult.deactivated} deactivated`)

    return {
      success: true,
      message: `Synced ${results.total} products (${results.created} created, ${results.updated} updated, ${results.failed} failed, ${cleanupResult.deactivated} deactivated)`,
      results: {
        ...results,
        deactivated: cleanupResult.deactivated,
      },
    }
  }
)
