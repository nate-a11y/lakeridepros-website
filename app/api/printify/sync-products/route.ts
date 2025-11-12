import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID
const SYNC_SECRET = process.env.PRINTIFY_SYNC_SECRET || 'change-me-in-production'

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

      // If rate limited (429), wait and retry
      if (response.status === 429 && attempt < maxRetries) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '5')
        console.log(`[Retry] Rate limited, waiting ${retryAfter}s before retry ${attempt + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }

      // If successful or client error (not worth retrying), return response
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response
      }

      // Server error (5xx) - retry with backoff
      if (response.status >= 500 && attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000) // Max 10s
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
  // Remove extension first
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Remove all non-alphanumeric characters except hyphens and underscores
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Limit to 50 characters to leave room for timestamps and extension
  const truncated = sanitized.substring(0, 50).replace(/-+$/, '')

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now()

  return `${truncated}-${timestamp}.png`
}

async function uploadImageToPayload(payload: any, imageBuffer: Buffer, filename: string) {
  const sanitizedFilename = sanitizeFilename(filename)

  try {
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
  } catch (error) {
    console.error(`[Upload Error] Failed to upload ${sanitizedFilename}:`, error)
    throw error
  }
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  // Limit slug length to 100 characters to avoid database issues
  return slug.substring(0, 100).replace(/-+$/, '')
}

async function ensureUniqueSlug(payload: any, baseSlug: string, existingProductId?: string | number): Promise<string> {
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

    // If no conflict, or the conflict is with the same product we're updating, use this slug
    if (existing.docs.length === 0 || (existingProductId && existing.docs[0].id === existingProductId)) {
      return slug
    }

    // Generate new slug with counter
    counter++
    slug = `${baseSlug}-${counter}`.substring(0, 100).replace(/-+$/, '')
  }
}

async function syncProducts(request: Request) {
  try {
    // Verify secret for security
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
      return NextResponse.json(
        { error: 'Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID' },
        { status: 500 }
      )
    }

    // Optional: limit number of products to process per invocation
    // Reduced to 15 for faster processing and better reliability
    const batchSize = searchParams.get('batch')
      ? parseInt(searchParams.get('batch')!)
      : 15 // Process 15 products at a time by default

    // Optional: offset for pagination (e.g., ?offset=15 for second batch)
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Auto-chain flag - if true, will automatically trigger next batch
    const autoChain = searchParams.get('autoChain') !== 'false' // Default to true

    const payload = await getPayload({ config })

    console.log('[Printify Sync] Starting product sync from Printify...')

    // Fetch all products from Printify with pagination
    let allProducts: any[] = []
    let currentPage = 1
    let hasMorePages = true
    const limit = 50 // Max allowed by Printify API

    while (hasMorePages) {
      console.log(`[Printify Sync] Fetching page ${currentPage}...`)
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
        console.error('Printify API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/products.json?page=${currentPage}&limit=${limit}`,
        })
        return NextResponse.json(
          { error: `Printify API error: ${response.statusText}`, details: errorText },
          { status: response.status }
        )
      }

      const responseData = await response.json()
      const { data: products, current_page, last_page } = responseData

      allProducts = allProducts.concat(products)

      // Check if there are more pages to fetch
      hasMorePages = current_page < last_page
      currentPage++
    }

    // Apply batch limit and offset for pagination
    let printifyProducts = allProducts
    const endIndex = offset + batchSize
    const hasMore = endIndex < allProducts.length

    console.log(`[Printify Sync] Processing products ${offset + 1}-${Math.min(endIndex, allProducts.length)} of ${allProducts.length} total`)
    printifyProducts = allProducts.slice(offset, endIndex)

    const results = {
      total: printifyProducts.length,
      created: 0,
      updated: 0,
      failed: 0,
      imagesReused: 0,
      imagesUploaded: 0,
      errors: [] as string[],
    }

    const startTime = Date.now()
    for (const [index, printifyProduct] of printifyProducts.entries()) {
      try {
        console.log(`[Printify Sync] Processing product ${index + 1}/${printifyProducts.length}: ${printifyProduct.title}`)

        // Add delay between products to avoid rate limiting (500ms)
        // Skip delay for first product
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

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
        const existingProduct = existing.docs.length > 0 ? existing.docs[0] : null
        const slug = await ensureUniqueSlug(payload, baseSlug, existingProductId)

        // Determine if we need to re-upload images
        const totalPrintifyImages = printifyProduct.images.length
        const hasExistingImages = existingProduct?.featuredImage && existingProduct?.images?.length > 0
        const shouldReuseImages = hasExistingImages && (
          // Reuse if total image count matches (1 featured + n additional)
          (existingProduct.images.length + 1) === totalPrintifyImages
        )

        let featuredImageId: number | null = null
        let additionalImages: Array<{ image: number }> = []

        if (shouldReuseImages) {
          // Reuse existing images to avoid re-uploading
          console.log(`[Printify Sync] Reusing existing images for ${printifyProduct.title}`)
          featuredImageId = typeof existingProduct.featuredImage === 'object'
            ? existingProduct.featuredImage.id
            : existingProduct.featuredImage
          additionalImages = existingProduct.images.map((img: any) => ({
            image: typeof img.image === 'object' ? img.image.id : img.image
          }))
          results.imagesReused += (1 + additionalImages.length)
        } else {
          // Upload new images
          console.log(`[Printify Sync] Uploading ${existingProduct ? 'updated' : 'new'} images for ${printifyProduct.title}`)

          // Download and upload featured image
          const defaultImage =
            printifyProduct.images.find((img: any) => img.is_default) || printifyProduct.images[0]

          if (defaultImage) {
            const imageBuffer = await downloadImage(defaultImage.src)
            const media = await uploadImageToPayload(payload, imageBuffer, `${slug}-featured.png`)
            featuredImageId = media.id as number
            results.imagesUploaded++
          }

          // Deduplicate images by URL to avoid filename conflicts
          const seenUrls = new Set([defaultImage?.src])
          const imagesToProcess = printifyProduct.images
            .filter((img: any) => {
              if (seenUrls.has(img.src)) {
                return false
              }
              seenUrls.add(img.src)
              return true
            })
            .slice(0, 5)

          // Upload images sequentially with error handling
          for (let i = 0; i < imagesToProcess.length; i++) {
            const image = imagesToProcess[i]
            try {
              const imageBuffer = await downloadImage(image.src)
              const media = await uploadImageToPayload(payload, imageBuffer, `${slug}-${i + 1}.png`)
              additionalImages.push({ image: media.id as number })
              results.imagesUploaded++

              // Small delay to avoid overwhelming the database
              if (i < imagesToProcess.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100))
              }
            } catch (error) {
              console.error(`[Printify Sync] Failed to upload image ${i + 1} for ${printifyProduct.title}:`, error)
              // Continue with remaining images even if one fails
            }
          }
        }

        // Map variants
        const variants = printifyProduct.variants
          .filter((v: any) => v.is_enabled && v.is_available)
          .map((variant: any) => {
            const size = variant.options.find((opt: any) => opt.size)?.size || ''
            const color = variant.options.find((opt: any) => opt.color)?.color || ''

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
            ? Math.min(...variants.map((v: any) => v.price))
            : printifyProduct.variants[0]?.price / 100 || 0

        // Determine category
        const categories: string[] = []
        const titleLower = printifyProduct.title.toLowerCase()
        if (
          titleLower.includes('shirt') ||
          titleLower.includes('hoodie') ||
          titleLower.includes('apparel')
        ) {
          categories.push('apparel')
        }
        if (
          titleLower.includes('mug') ||
          titleLower.includes('cup') ||
          titleLower.includes('bottle')
        ) {
          categories.push('drinkware')
        }
        if (
          titleLower.includes('hat') ||
          titleLower.includes('cap') ||
          titleLower.includes('bag')
        ) {
          categories.push('accessories')
        }
        if (categories.length === 0) {
          categories.push('apparel')
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
                    { type: 'text', text: printifyProduct.description || printifyProduct.title },
                  ],
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          shortDescription:
            printifyProduct.description?.substring(0, 200) || printifyProduct.title,
          featuredImage: featuredImageId,
          images: additionalImages,
          price: basePrice,
          categories,
          tags: printifyProduct.tags.map((tag: string) => ({ tag })),
          inStock: variants.some((v: any) => v.inStock),
          variants,
          printifyProductId: printifyProduct.id,
          printifyBlueprintId: printifyProduct.blueprint_id.toString(),
          printifyPrintProviderId: printifyProduct.print_provider_id.toString(),
          status: 'active',
          metaTitle: printifyProduct.title,
          metaDescription:
            printifyProduct.description?.substring(0, 160) || printifyProduct.title,
        }

        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'products',
            id: existing.docs[0].id,
            data: productData,
            overrideAccess: true,
          })
          results.updated++
        } else {
          await payload.create({
            collection: 'products',
            data: productData,
            overrideAccess: true,
          })
          results.created++
        }
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`${printifyProduct.title}: ${errorMessage}`)
        console.error(`[Printify Sync] Failed to sync product "${printifyProduct.title}":`, errorMessage)
        if (error instanceof Error && error.stack) {
          console.error(`[Printify Sync] Stack trace:`, error.stack)
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`[Printify Sync] Completed in ${duration}s - ${results.created} created, ${results.updated} updated, ${results.failed} failed, ${results.imagesUploaded} images uploaded, ${results.imagesReused} images reused`)

    // Log all errors for debugging
    if (results.errors.length > 0) {
      console.error(`[Printify Sync] Errors encountered:`)
      results.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`))
    }

    // Auto-chain to next batch if there are more products and autoChain is enabled
    if (hasMore && autoChain) {
      const nextUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || request.url.split('/api/')[0]}/api/printify/sync-products?secret=${SYNC_SECRET}&offset=${endIndex}&batch=${batchSize}&autoChain=true`

      console.log(`[Printify Sync] Auto-chaining to next batch (${allProducts.length - endIndex} products remaining)...`)

      // Trigger next batch asynchronously (don't await to avoid timeout)
      fetch(nextUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LakeRidePros-AutoChain/1.0',
        },
      }).catch((error) => {
        console.error(`[Printify Sync] Failed to trigger next batch:`, error)
      })
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.total} products (${results.created} created, ${results.updated} updated, ${results.failed} failed, ${results.imagesUploaded} images uploaded, ${results.imagesReused} images reused) in ${duration}s${hasMore ? ` - Auto-chaining to process ${allProducts.length - endIndex} remaining products` : ' - All products processed!'}`,
      results: {
        ...results,
        durationSeconds: parseFloat(duration),
      },
      pagination: {
        totalProducts: allProducts.length,
        processedStart: offset + 1,
        processedEnd: Math.min(endIndex, allProducts.length),
        hasMore,
        nextOffset: hasMore ? endIndex : null,
        autoChaining: hasMore && autoChain,
      },
    })
  } catch (error) {
    console.error('Printify sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Export both GET and POST handlers for convenience
export async function GET(request: Request) {
  return syncProducts(request)
}

export async function POST(request: Request) {
  return syncProducts(request)
}
