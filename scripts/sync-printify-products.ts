import { getPayload } from 'payload'
import config from '../src/payload.config'
import { Media } from '../payload-types'

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
  options: PrintifyOption[]
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
 */
function categorizeFromTags(tags: string[], title: string): StoreCategory[] {
  const categories = new Set<StoreCategory>()

  for (const tag of tags) {
    const category = TAG_TO_CATEGORY[tag]
    if (category) {
      categories.add(category)
    }
  }

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

  if (categories.size === 0) {
    categories.add('apparel')
  }

  return Array.from(categories)
}

// ============================================================================
// Option Value Mapping
// ============================================================================

interface OptionLookup {
  id: number
  title: string
  type: string
  optionName: string
  colorHex?: string // Hex color value from Printify (e.g., "#000000")
}

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

    if (option.type === 'size') {
      size = option.title
    } else if (option.type === 'color') {
      color = option.title
      colorHex = option.colorHex || ''
    } else if (option.type === 'surface') {
      color = option.title
      colorHex = option.colorHex || ''
    }
  }

  return { size, color, colorHex }
}

// ============================================================================
// Image handling
// ============================================================================

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LakeRidePros/1.0',
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

interface PayloadInstance {
  find: (options: Record<string, unknown>) => Promise<{ docs: Record<string, unknown>[] }>
  create: (options: Record<string, unknown>) => Promise<Record<string, unknown>>
  update: (options: Record<string, unknown>) => Promise<Record<string, unknown>>
}

async function uploadImageToPayload(
  payload: PayloadInstance,
  imageBuffer: Buffer,
  filename: string
): Promise<Media> {
  const media = await payload.create({
    collection: 'media',
    data: {
      alt: filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    },
    file: {
      data: imageBuffer,
      name: filename,
      mimetype: 'image/png',
      size: imageBuffer.length,
    },
    overrideAccess: true,
  })

  return media as unknown as Media
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100)
    .replace(/-+$/, '')
}

// ============================================================================
// Main sync function
// ============================================================================

async function syncProducts() {
  if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID environment variables')
    process.exit(1)
  }

  console.log('🚀 Starting Printify product sync...')

  const payload = await getPayload({ config })

  // Fetch all products from Printify with pagination
  console.log('📦 Fetching products from Printify...')
  let allProducts: PrintifyProduct[] = []
  let currentPage = 1
  let hasMorePages = true
  const limit = 50

  while (hasMorePages) {
    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/products.json?page=${currentPage}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_TOKEN}`,
          'User-Agent': 'LakeRidePros/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.statusText}`)
    }

    const responseData = await response.json() as { data: PrintifyProduct[]; current_page: number; last_page: number }
    const { data: products, current_page, last_page } = responseData

    allProducts = allProducts.concat(products)
    console.log(`  📄 Fetched page ${current_page} of ${last_page} (${products.length} products)`)

    hasMorePages = current_page < last_page
    currentPage++
  }

  // Filter to only visible products
  const printifyProducts = allProducts.filter(p => p.visible === true)
  console.log(`✅ Found ${allProducts.length} total products, ${printifyProducts.length} visible`)

  let created = 0
  let updated = 0
  let failed = 0

  for (const printifyProduct of printifyProducts) {
    try {
      console.log(`\n📝 Processing: ${printifyProduct.title}`)

      // Check if product already exists
      const existing = await payload.find({
        collection: 'products',
        where: {
          printifyProductId: {
            equals: printifyProduct.id,
          },
        },
      })

      const slug = slugify(printifyProduct.title)

      // Download and upload featured image
      let featuredImageId: number | null = null
      const defaultImage = printifyProduct.images.find((img) => img.is_default) || printifyProduct.images[0]

      if (defaultImage) {
        console.log('  📷 Uploading featured image...')
        const imageBuffer = await downloadImage(defaultImage.src)
        const media = await uploadImageToPayload(
          payload as unknown as PayloadInstance,
          imageBuffer,
          `${slug}-featured.png`
        )
        featuredImageId = media.id as number
      }

      // Upload additional images (deduplicated)
      const additionalImages: Array<{ image: number }> = []
      const seenUrls = new Set(defaultImage ? [defaultImage.src.split('?')[0].toLowerCase()] : [])

      const imagesToProcess = printifyProduct.images
        .filter((img) => {
          if (img.is_default) return false
          const normalizedUrl = img.src.split('?')[0].toLowerCase()
          if (seenUrls.has(normalizedUrl)) return false
          seenUrls.add(normalizedUrl)
          return true
        })
        .slice(0, 10)

      for (const [index, image] of imagesToProcess.entries()) {
        try {
          console.log(`  📷 Uploading image ${index + 1}...`)
          const imageBuffer = await downloadImage(image.src)
          const media = await uploadImageToPayload(
            payload as unknown as PayloadInstance,
            imageBuffer,
            `${slug}-${index + 1}.png`
          )
          additionalImages.push({ image: media.id as number })
        } catch (error) {
          console.error(`  ⚠️  Failed to upload image ${index + 1}:`, error)
        }
      }

      // Build option lookup and map variants
      const optionLookup = buildOptionLookup(printifyProduct.options || [])

      const variants = printifyProduct.variants
        .filter((v) => v.is_enabled && v.is_available)
        .map((variant) => {
          const { size, color, colorHex } = extractVariantOptions(variant.options, optionLookup)

          return {
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
          ? Math.min(...variants.map((v) => v.price))
          : printifyProduct.variants[0]?.price / 100 || 0

      // Determine categories from tags
      const categories = categorizeFromTags(printifyProduct.tags || [], printifyProduct.title)

      // Extract personalization
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
        description: printifyProduct.description
          ? {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: printifyProduct.description, version: 1 }],
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            }
          : {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: printifyProduct.title, version: 1 }],
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
        shortDescription: printifyProduct.description?.substring(0, 200) || printifyProduct.title,
        featuredImage: featuredImageId,
        images: additionalImages,
        price: basePrice,
        categories,
        tags: printifyProduct.tags.map((tag) => ({ tag })),
        inStock: variants.some((v) => v.inStock),
        variants,
        printifyProductId: printifyProduct.id,
        printifyBlueprintId: printifyProduct.blueprint_id.toString(),
        printifyPrintProviderId: printifyProduct.print_provider_id.toString(),
        personalization,
        status: 'active',
        metaTitle: printifyProduct.title,
        metaDescription: printifyProduct.description?.substring(0, 160) || printifyProduct.title,
      }

      if (existing.docs.length > 0) {
        console.log('  ♻️  Updating existing product...')
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id as string | number,
          data: productData,
          overrideAccess: true,
        })
        console.log(`  ✅ Updated: ${printifyProduct.title}`)
        updated++
      } else {
        console.log('  ➕ Creating new product...')
        await payload.create({
          collection: 'products',
          data: productData,
          overrideAccess: true,
        })
        console.log(`  ✅ Created: ${printifyProduct.title}`)
        created++
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${printifyProduct.title}:`, error)
      failed++
    }
  }

  console.log('\n🎉 Printify product sync complete!')
  console.log(`   Created: ${created}`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Failed: ${failed}`)
  process.exit(0)
}

syncProducts().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
