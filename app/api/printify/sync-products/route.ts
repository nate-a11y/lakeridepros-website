import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID
const SYNC_SECRET = process.env.PRINTIFY_SYNC_SECRET || 'change-me-in-production'

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

async function uploadImageToPayload(payload: any, imageBuffer: Buffer, filename: string) {
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

    const payload = await getPayload({ config })

    // Fetch all products from Printify with pagination
    let allProducts: any[] = []
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

    const printifyProducts = allProducts

    const results = {
      total: printifyProducts.length,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const printifyProduct of printifyProducts) {
      try {
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
        const defaultImage =
          printifyProduct.images.find((img: any) => img.is_default) || printifyProduct.images[0]

        if (defaultImage) {
          const imageBuffer = await downloadImage(defaultImage.src)
          const media = await uploadImageToPayload(payload, imageBuffer, `${slug}-featured.png`)
          featuredImageId = media.id as number
        }

        // Upload additional images
        const additionalImages: Array<{ image: number }> = []
        for (const [index, image] of printifyProduct.images.slice(0, 5).entries()) {
          if (image === defaultImage) continue

          try {
            const imageBuffer = await downloadImage(image.src)
            const media = await uploadImageToPayload(payload, imageBuffer, `${slug}-${index + 1}.png`)
            additionalImages.push({ image: media.id as number })
          } catch (error) {
            // Continue if one image fails
            console.error(`Failed to upload image ${index + 1} for ${printifyProduct.title}:`, error)
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
        results.errors.push(`${printifyProduct.title}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.total} products (${results.created} created, ${results.updated} updated, ${results.failed} failed)`,
      results,
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
