import { getPayload } from 'payload'
import config from '../src/payload.config'
import { Media } from '../payload-types'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID

interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  images: Array<{
    src: string
    position: string
    is_default: boolean
    variant_ids: number[]
  }>
  variants: Array<{
    id: number
    sku: string
    cost: number
    price: number
    title: string
    grams: number
    is_enabled: boolean
    is_default: boolean
    is_available: boolean
    options: Array<{ [key: string]: string }>
  }>
  options: Array<{
    name: string
    type: string
    values: Array<{ id: number; title: string }>
  }>
  blueprint_id: number
  print_provider_id: number
  print_areas: any[]
  sales_channel_properties: any[]
}

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

async function uploadImageToPayload(
  payload: any,
  imageBuffer: Buffer,
  filename: string
): Promise<Media> {
  // Create a File-like object for Payload
  const blob = new Blob([imageBuffer])
  const file = new File([blob], filename, { type: 'image/png' })

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

  return media
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function syncProducts() {
  if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID environment variables')
    process.exit(1)
  }

  console.log('🚀 Starting Printify product sync...')

  // Initialize Payload
  const payload = await getPayload({ config })

  // Fetch all products from Printify with pagination
  console.log('📦 Fetching products from Printify...')
  let allProducts: PrintifyProduct[] = []
  let currentPage = 1
  let hasMorePages = true
  const limit = 50 // Max allowed by Printify API

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

    // Check if there are more pages to fetch
    hasMorePages = current_page < last_page
    currentPage++
  }

  const printifyProducts = allProducts
  console.log(`✅ Found ${printifyProducts.length} total products in Printify`)

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
          payload,
          imageBuffer,
          `${slug}-featured.png`
        )
        featuredImageId = media.id as number
      }

      // Upload additional images
      const additionalImages: Array<{ image: number }> = []
      for (const [index, image] of printifyProduct.images.slice(0, 5).entries()) {
        if (image === defaultImage) continue

        try {
          console.log(`  📷 Uploading image ${index + 1}...`)
          const imageBuffer = await downloadImage(image.src)
          const media = await uploadImageToPayload(
            payload,
            imageBuffer,
            `${slug}-${index + 1}.png`
          )
          additionalImages.push({ image: media.id as number })
        } catch (error) {
          console.error(`  ⚠️  Failed to upload image ${index + 1}:`, error)
        }
      }

      // Map variants
      const variants = printifyProduct.variants
        .filter((v) => v.is_enabled && v.is_available)
        .map((variant) => {
          // Extract size and color from options
          const size = variant.options.find((opt) => opt.size)?.size || ''
          const color = variant.options.find((opt) => opt.color)?.color || ''

          return {
            name: variant.title,
            sku: variant.sku,
            price: variant.price / 100, // Convert cents to dollars
            inStock: variant.is_available,
            size,
            color,
            printifyVariantId: variant.id.toString(),
          }
        })

      // Determine base price (use cheapest variant)
      const basePrice =
        variants.length > 0
          ? Math.min(...variants.map((v) => v.price))
          : printifyProduct.variants[0]?.price / 100 || 0

      // Determine category based on tags or title
      const categories: string[] = []
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
        categories.push('apparel') // Default
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
                    children: [{ type: 'text', text: printifyProduct.description }],
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
                    children: [{ type: 'text', text: printifyProduct.title }],
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
        status: 'active',
        metaTitle: printifyProduct.title,
        metaDescription: printifyProduct.description?.substring(0, 160) || printifyProduct.title,
      }

      if (existing.docs.length > 0) {
        // Update existing product
        console.log('  ♻️  Updating existing product...')
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          data: productData,
          overrideAccess: true,
        })
        console.log(`  ✅ Updated: ${printifyProduct.title}`)
      } else {
        // Create new product
        console.log('  ➕ Creating new product...')
        await payload.create({
          collection: 'products',
          data: productData,
          overrideAccess: true,
        })
        console.log(`  ✅ Created: ${printifyProduct.title}`)
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${printifyProduct.title}:`, error)
    }
  }

  console.log('\n🎉 Printify product sync complete!')
  process.exit(0)
}

syncProducts().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
