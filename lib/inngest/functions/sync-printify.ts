import { inngest } from '../client'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { revalidatePaths } from '@/lib/revalidation'
import { createHash } from 'crypto'
import crypto from 'crypto'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID

// ============================================================================
// Printify API Types (matching actual API response structure)
// ============================================================================

interface PrintifyImage {
  src: string
  position: string
  is_default: boolean
  variant_ids: number[]
}

/** Individual option value (e.g., a specific color or size) */
interface PrintifyOptionValue {
  id: number
  title: string
  colors?: string[] // Only present for color options
}

/** Product-level option definition (e.g., "Colors", "Sizes", "Phone Models") */
interface PrintifyOption {
  name: string
  type: 'color' | 'size' | 'surface' | string
  values: PrintifyOptionValue[]
  display_in_preview?: boolean
}

/** Variant - options is an array of numeric IDs referencing PrintifyOptionValue.id */
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
  options: number[] // Array of option value IDs (not objects!)
  quantity?: number
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
  options: PrintifyOption[] // Product-level options defining available sizes/colors
  variants: PrintifyVariant[]
  blueprint_id: number
  print_provider_id: number
  visible: boolean
  sales_channel_properties?: PrintifySalesChannelProperties
}

// ============================================================================
// Category Mapping - Maps Printify tags to our store categories
// ============================================================================

type StoreCategory = 'apparel' | 'accessories' | 'drinkware' | 'home'

const TAG_TO_CATEGORY: Record<string, StoreCategory> = {
  // Apparel
  "Men's Clothing": 'apparel',
  "Women's Clothing": 'apparel',
  'Hoodies': 'apparel',
  'T-shirts': 'apparel',
  'Sweatshirts': 'apparel',
  'Tank Tops': 'apparel',
  'Long Sleeves': 'apparel',
  'Tops': 'apparel',
  'Crop Hoodie': 'apparel',
  'Crop tops': 'apparel',
  'Polo': 'apparel',
  'Polo shirt': 'apparel',
  'Sportswear': 'apparel',
  'Premium Apparel': 'apparel',

  // Accessories
  'Accessories': 'accessories',
  'Phone Cases': 'accessories',
  'iPhone Cases': 'accessories',
  'Hats': 'accessories',
  'Car Accessories': 'accessories',
  'Stickers': 'accessories',
  'Magnets & Stickers': 'accessories',
  'Travel Accessories': 'accessories',
  'Shoes': 'accessories',
  'footwear': 'accessories',

  // Drinkware
  'Coffee Mugs': 'drinkware',
  'Mugs': 'drinkware',
  'Tumblers': 'drinkware',
  'Bottles & Tumblers': 'drinkware',
  'Glassware': 'drinkware',
  'Drink': 'drinkware',
  'Drinks': 'drinkware',
  'Beverage': 'drinkware',

  // Home & Living
  'Home & Living': 'home',
  'Home Decor': 'home',
  'Blankets': 'home',
  'Towels': 'home',
  'Towel': 'home',
  'Art & Wall Decor': 'home',
  'Canvas': 'home',
  'Poster': 'home',
  'Posters': 'home',
  'Decor': 'home',
  'Bedding': 'home',
  'Bed': 'home',
  'Kitchen': 'home',
  'Ornaments': 'home',
  'ornament': 'home',
  'Seasonal Decorations': 'home',
}

/**
 * Determine categories from Printify tags
 * Returns unique categories based on tag matching
 */
function categorizeFromTags(tags: string[], title: string): StoreCategory[] {
  const categories = new Set<StoreCategory>()

  // First, try to match tags
  for (const tag of tags) {
    const category = TAG_TO_CATEGORY[tag]
    if (category) {
      categories.add(category)
    }
  }

  // If no category found from tags, try title-based fallback
  if (categories.size === 0) {
    const titleLower = title.toLowerCase()

    if (titleLower.includes('shirt') || titleLower.includes('hoodie') ||
        titleLower.includes('sweatshirt') || titleLower.includes('tee') ||
        titleLower.includes('tank') || titleLower.includes('polo')) {
      categories.add('apparel')
    }
    if (titleLower.includes('mug') || titleLower.includes('cup') ||
        titleLower.includes('tumbler') || titleLower.includes('bottle') ||
        titleLower.includes('glass')) {
      categories.add('drinkware')
    }
    if (titleLower.includes('hat') || titleLower.includes('cap') ||
        titleLower.includes('bag') || titleLower.includes('phone') ||
        titleLower.includes('sticker') || titleLower.includes('case') ||
        titleLower.includes('flip flop')) {
      categories.add('accessories')
    }
    if (titleLower.includes('blanket') || titleLower.includes('towel') ||
        titleLower.includes('canvas') || titleLower.includes('poster') ||
        titleLower.includes('ornament') || titleLower.includes('decor')) {
      categories.add('home')
    }
  }

  // Default to apparel if still nothing matched
  if (categories.size === 0) {
    categories.add('apparel')
  }

  return Array.from(categories)
}

// ============================================================================
// Option Value Mapping - Extract size/color from variant option IDs
// ============================================================================

interface OptionLookup {
  id: number
  title: string
  type: 'color' | 'size' | 'surface' | string
  optionName: string
  colorHex?: string // Hex color value from Printify (e.g., "#000000")
}

/**
 * Build a lookup map from option value ID to its details
 * This allows us to convert variant option IDs to actual size/color values
 */
function buildOptionLookup(options: PrintifyOption[]): Map<number, OptionLookup> {
  const lookup = new Map<number, OptionLookup>()

  for (const option of options) {
    for (const value of option.values) {
      lookup.set(value.id, {
        id: value.id,
        title: value.title,
        type: option.type,
        optionName: option.name,
        // Extract hex color from Printify's colors array (first value)
        colorHex: value.colors?.[0] || undefined,
      })
    }
  }

  return lookup
}

/**
 * Extract size, color, and hex color values from a variant's option IDs
 */
function extractVariantOptions(
  variantOptionIds: number[],
  optionLookup: Map<number, OptionLookup>
): { size: string; color: string; colorHex: string } {
  let size = ''
  let color = ''
  let colorHex = ''

  for (const optionId of variantOptionIds) {
    const option = optionLookup.get(optionId)
    if (!option) continue

    // Use the type field to determine if this is a size or color
    if (option.type === 'size') {
      size = option.title
    } else if (option.type === 'color') {
      color = option.title
      colorHex = option.colorHex || ''
    } else if (option.type === 'surface') {
      // Surface types (like "Transparent" or "White" for stickers)
      // can be treated as color/material
      color = option.title
      colorHex = option.colorHex || ''
    }
  }

  return { size, color, colorHex }
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

async function findExistingMedia(filename: string) {
  const sanitizedFilename = sanitizeFilename(filename)

  try {
    const existing = await writeClient.fetch(
      groq`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`,
      { filename: sanitizedFilename }
    )

    if (existing) {
      return existing
    }

    return null
  } catch {
    return null
  }
}

async function uploadImageToSanity(imageBuffer: Buffer, filename: string) {
  const sanitizedFilename = sanitizeFilename(filename)

  const asset = await writeClient.assets.upload('image', imageBuffer, {
    filename: sanitizedFilename,
    contentType: 'image/png',
  })

  return asset
}

async function getOrUploadImage(
  imageUrl: string,
  filename: string
): Promise<{ asset: Awaited<ReturnType<typeof uploadImageToSanity>>; reused: boolean }> {
  const sanitizedFilename = sanitizeFilename(filename)

  const existingAsset = await findExistingMedia(sanitizedFilename)
  if (existingAsset) {
    return { asset: existingAsset, reused: true }
  }

  const imageBuffer = await downloadImage(imageUrl)
  const asset = await uploadImageToSanity(imageBuffer, filename)
  return { asset, reused: false }
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

async function ensureUniqueSlug(baseSlug: string, existingProductId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await writeClient.fetch(
      groq`*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug }
    )

    if (!existing || (existingProductId && existing._id === existingProductId)) {
      return slug
    }

    counter++
    slug = `${baseSlug}-${counter}`.substring(0, 100).replace(/-+$/, '')
  }
}

// Process a single product
async function processProduct(
  printifyProduct: PrintifyProduct
): Promise<{ created: boolean; updated: boolean; imagesReused: number; imagesUploaded: number }> {
  const result = { created: false, updated: false, imagesReused: 0, imagesUploaded: 0 }

  // Check if product already exists
  const existing = await writeClient.fetch(
    groq`*[_type == "product" && printifyProductId == $id][0]`,
    { id: printifyProduct.id }
  )

  const baseSlug = slugify(printifyProduct.title)
  const existingProductId = existing ? existing._id : undefined
  const slug = await ensureUniqueSlug(baseSlug, existingProductId)

  // Process images - in Sanity, images are stored as asset references
  let featuredImage: { _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null = null
  const additionalImages: Array<{ _type: 'image'; _key: string; asset: { _type: 'reference'; _ref: string } }> = []

  const defaultImage =
    printifyProduct.images.find((img: PrintifyImage) => img.is_default) || printifyProduct.images[0]

  if (defaultImage) {
    const { asset, reused } = await getOrUploadImage(defaultImage.src, `${slug}-featured.webp`)
    featuredImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    }
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
    .slice(0, 10)

  for (let i = 0; i < imagesToProcess.length; i++) {
    const image = imagesToProcess[i]
    try {
      const { asset, reused } = await getOrUploadImage(image.src, `${slug}-${i + 1}.webp`)
      additionalImages.push({
        _type: 'image',
        _key: crypto.randomUUID().slice(0, 8),
        asset: { _type: 'reference', _ref: asset._id },
      })
      if (reused) {
        result.imagesReused++
      } else {
        result.imagesUploaded++
      }
    } catch (error) {
      console.error(`[Inngest Sync] Failed to upload image ${i + 1} for ${printifyProduct.title}:`, error)
    }
  }

  // Build option lookup from product-level options
  const optionLookup = buildOptionLookup(printifyProduct.options || [])

  // Map variants with proper size/color/hex extraction
  const variants = printifyProduct.variants
    .filter((v: PrintifyVariant) => v.is_enabled && v.is_available)
    .map((variant: PrintifyVariant) => {
      const { size, color, colorHex } = extractVariantOptions(variant.options, optionLookup)

      return {
        _key: crypto.randomUUID().slice(0, 8),
        name: variant.title,
        sku: variant.sku,
        price: variant.price / 100,
        inStock: variant.is_available,
        size,
        color,
        colorHex,
        printifyVariantId: variant.id.toString(),
      }
    })

  const basePrice =
    variants.length > 0
      ? Math.min(...variants.map((v: { price: number }) => v.price))
      : printifyProduct.variants[0]?.price / 100 || 0

  // Determine categories from tags (with title fallback)
  const categories = categorizeFromTags(printifyProduct.tags || [], printifyProduct.title)

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
    slug: { _type: 'slug', current: slug },
    description: [
      {
        _type: 'block',
        _key: crypto.randomUUID().slice(0, 8),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: crypto.randomUUID().slice(0, 8),
            text: printifyProduct.description || printifyProduct.title,
          },
        ],
      },
    ],
    shortDescription: printifyProduct.description?.substring(0, 200) || printifyProduct.title,
    featuredImage,
    images: additionalImages,
    price: basePrice,
    categories,
    tags: printifyProduct.tags.map((tag: string) => ({
      tag,
      _key: crypto.randomUUID().slice(0, 8),
    })),
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

  if (existing) {
    await writeClient.patch(existing._id).set(productData).commit()
    result.updated = true
  } else {
    await writeClient.create({ _type: 'product', ...productData })
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

            const productResult = await processProduct(product)

            if (productResult.created) batchResults.created++
            if (productResult.updated) batchResults.updated++
            batchResults.imagesReused += productResult.imagesReused
            batchResults.imagesUploaded += productResult.imagesUploaded
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
      // Get all products from Sanity that have a printifyProductId
      const sanityProducts = await writeClient.fetch(
        groq`*[_type == "product" && defined(printifyProductId)]{ _id, printifyProductId, name }`
      )

      const visiblePrintifyIds = new Set(allProducts.map(p => p.id))
      let deactivated = 0

      for (const product of sanityProducts) {
        // If product is not in the visible Printify products list, mark as draft
        if (!visiblePrintifyIds.has(product.printifyProductId as string)) {
          await writeClient.patch(product._id).set({ status: 'draft' }).commit()
          deactivated++
          console.log(`[Inngest Sync] Deactivated product "${product.name}" (not visible in Printify)`)
        }
      }

      return { deactivated, total: sanityProducts.length }
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
