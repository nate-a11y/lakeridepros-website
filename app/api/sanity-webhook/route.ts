import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity Webhook Handler
 *
 * Replaces the Payload CMS afterChange hooks + /api/revalidate pattern.
 * Configure in Sanity: Settings → API → Webhooks
 *   URL: https://www.lakeridepros.com/api/sanity-webhook
 *   Secret: SANITY_WEBHOOK_SECRET env var
 *   Trigger on: Create, Update, Delete
 *   Filter: All document types (or specific ones)
 *   Projection: {_type, "slug": slug.current}
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: string
    }>(request, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      console.error('[Sanity Webhook] Invalid signature')
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      console.error('[Sanity Webhook] Missing document type')
      return NextResponse.json({ message: 'Missing document type' }, { status: 400 })
    }

    const { _type, slug } = body
    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    // Map Sanity document types to paths and tags
    switch (_type) {
      case 'service':
        revalidateTag('services')
        revalidatedTags.push('services')
        revalidatePath('/services')
        revalidatePath('/')
        revalidatedPaths.push('/services', '/')
        if (slug) {
          revalidatePath(`/services/${slug}`)
          revalidatedPaths.push(`/services/${slug}`)
        }
        break

      case 'product':
        revalidateTag('products')
        revalidatedTags.push('products')
        revalidatePath('/shop')
        revalidatePath('/')
        revalidatedPaths.push('/shop', '/')
        if (slug) {
          revalidatePath(`/shop/products/${slug}`)
          revalidatedPaths.push(`/shop/products/${slug}`)
        }
        break

      case 'vehicle':
        revalidateTag('vehicles')
        revalidatedTags.push('vehicles')
        revalidatePath('/fleet')
        revalidatePath('/')
        revalidatedPaths.push('/fleet', '/')
        if (slug) {
          revalidatePath(`/fleet/${slug}`)
          revalidatedPaths.push(`/fleet/${slug}`)
        }
        break

      case 'blogPost':
        revalidateTag('blog')
        revalidatedTags.push('blog')
        revalidatePath('/blog')
        revalidatePath('/')
        revalidatedPaths.push('/blog', '/')
        if (slug) {
          revalidatePath(`/blog/${slug}`)
          revalidatedPaths.push(`/blog/${slug}`)
        }
        break

      case 'partner':
        revalidateTag('partners')
        revalidatedTags.push('partners')
        revalidatePath('/trusted-referral-partners')
        revalidatePath('/local-premier-partners')
        revalidatePath('/wedding-partners')
        revalidatePath('/')
        revalidatedPaths.push('/trusted-referral-partners', '/local-premier-partners', '/wedding-partners', '/')
        break

      case 'testimonial':
        revalidateTag('testimonials')
        revalidatedTags.push('testimonials')
        revalidatePath('/')
        revalidatePath('/services')
        revalidatePath('/fleet')
        revalidatedPaths.push('/', '/services', '/fleet')
        break

      case 'event':
        revalidateTag('events')
        revalidatedTags.push('events')
        revalidatePath('/events')
        revalidatedPaths.push('/events')
        if (slug) {
          revalidatePath(`/events/${slug}`)
          revalidatedPaths.push(`/events/${slug}`)
        }
        break

      case 'venue':
        revalidateTag('venues')
        revalidatedTags.push('venues')
        revalidatePath('/events')
        revalidatedPaths.push('/events')
        if (slug) {
          revalidatePath(`/events/venues/${slug}`)
          revalidatedPaths.push(`/events/venues/${slug}`)
        }
        break

      case 'page':
        revalidateTag('pages')
        revalidatedTags.push('pages')
        if (slug) {
          revalidatePath(`/${slug}`)
          revalidatedPaths.push(`/${slug}`)
        }
        break

      case 'giftCard':
        revalidateTag('gift-cards')
        revalidatedTags.push('gift-cards')
        revalidatePath('/gift-cards')
        revalidatedPaths.push('/gift-cards')
        break

      case 'order':
        revalidateTag('orders')
        revalidatedTags.push('orders')
        break

      default:
        // Revalidate homepage for any unknown type
        revalidatePath('/')
        revalidatedPaths.push('/')
    }

    // Always revalidate sitemap for content-bearing types
    if (['service', 'product', 'vehicle', 'blogPost', 'event', 'page'].includes(_type)) {
      revalidatePath('/sitemap.xml')
      revalidatedPaths.push('/sitemap.xml')
    }

    const duration = Date.now() - startTime

    console.log(
      `[Sanity Webhook] Revalidated ${_type}${slug ? `/${slug}` : ''}:`,
      `Paths: ${revalidatedPaths.length}, Tags: ${revalidatedTags.length},`,
      `Duration: ${duration}ms`
    )

    return NextResponse.json({
      success: true,
      revalidated: { paths: revalidatedPaths, tags: revalidatedTags },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Sanity Webhook] Error:', err)
    return NextResponse.json(
      { success: false, message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
