import { inngest } from '../client'
import { getPayload } from 'payload'
import config from '@/src/payload.config'
import { getMediaUrl } from '@/lib/api/sanity'

const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lakeridepros.com'

interface BlogPost {
  id: string | number
  title: string
  slug: string
  excerpt: string
  publishedDate: string
  published?: boolean
  socialShared?: boolean
  featuredImage?: {
    url?: string
    alt?: string
  } | number | null
}

// Type guard to ensure post has required fields
function isValidBlogPost(post: unknown): post is BlogPost {
  const p = post as Record<string, unknown>
  return !!(p.id && p.title && p.slug && p.excerpt)
}

/**
 * Post content to Facebook Page
 */
async function postToFacebook(post: BlogPost): Promise<{ id: string } | null> {
  if (!META_PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    console.log('[Social] Missing Facebook credentials, skipping')
    return null
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`
  const message = `${post.title}\n\n${post.excerpt}\n\nRead more: ${postUrl}`

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          link: postUrl,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[Social] Facebook post failed:', error)
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('[Social] Posted to Facebook:', result.id)
    return result
  } catch (error) {
    console.error('[Social] Facebook post error:', error)
    throw error
  }
}

/**
 * Post content to Instagram (requires image)
 * Instagram posting is a 2-step process:
 * 1. Create a media container
 * 2. Publish the container
 */
async function postToInstagram(post: BlogPost): Promise<{ id: string } | null> {
  if (!META_PAGE_ACCESS_TOKEN || !INSTAGRAM_ACCOUNT_ID) {
    console.log('[Social] Missing Instagram credentials, skipping')
    return null
  }

  // Instagram requires an image
  const imageObj = typeof post.featuredImage === 'object' ? post.featuredImage : null
  if (!imageObj?.url) {
    console.log('[Social] No featured image for Instagram post, skipping')
    return null
  }

  const imageUrl = getMediaUrl(imageObj.url)
  const postUrl = `${SITE_URL}/blog/${post.slug}`

  // Instagram caption (max 2200 chars, but shorter is better)
  const caption = `${post.title}\n\n${post.excerpt}\n\n${postUrl}\n\n#LakeOfTheOzarks #LakeRidePros #Transportation #LakeOzarks #Missouri`

  try {
    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    )

    if (!containerResponse.ok) {
      const error = await containerResponse.json()
      console.error('[Social] Instagram container creation failed:', error)
      throw new Error(`Instagram API error: ${JSON.stringify(error)}`)
    }

    const container = await containerResponse.json()
    console.log('[Social] Instagram container created:', container.id)

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    )

    if (!publishResponse.ok) {
      const error = await publishResponse.json()
      console.error('[Social] Instagram publish failed:', error)
      throw new Error(`Instagram publish error: ${JSON.stringify(error)}`)
    }

    const result = await publishResponse.json()
    console.log('[Social] Posted to Instagram:', result.id)
    return result
  } catch (error) {
    console.error('[Social] Instagram post error:', error)
    throw error
  }
}

/**
 * Main Inngest function - runs every 5 minutes to check for posts to share
 */
export const postBlogToSocial = inngest.createFunction(
  {
    id: 'post-blog-to-social',
    name: 'Post Blog to Social Media',
    // Retry configuration
    retries: 3,
  },
  // Run every 5 minutes
  { cron: '*/5 * * * *' },
  async ({ step }) => {
    // Step 1: Find blog posts that need to be shared
    const postsToShare = await step.run('find-posts-to-share', async () => {
      const payload = await getPayload({ config })

      const now = new Date()

      // Find posts that are:
      // - published = true
      // - publishedDate <= now (in the past or now)
      // - socialShared = false or doesn't exist
      const result = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [
            { published: { equals: true } },
            { publishedDate: { less_than_equal: now.toISOString() } },
            {
              or: [
                { socialShared: { equals: false } },
                { socialShared: { exists: false } },
              ],
            },
          ],
        },
        limit: 5, // Process up to 5 posts per run
        sort: 'publishedDate',
      })

      // Filter to only valid posts with required fields
      return result.docs.filter(isValidBlogPost)
    })

    if (postsToShare.length === 0) {
      return { message: 'No posts to share', postsProcessed: 0 }
    }

    console.log(`[Social] Found ${postsToShare.length} posts to share`)

    const results = {
      processed: 0,
      facebook: { success: 0, failed: 0 },
      instagram: { success: 0, failed: 0 },
    }

    // Step 2: Process each post
    for (const post of postsToShare) {
      await step.run(`share-post-${post.id}`, async () => {
        const payload = await getPayload({ config })

        let facebookSuccess = false
        let instagramSuccess = false

        // Post to Facebook
        try {
          const fbResult = await postToFacebook(post as BlogPost)
          if (fbResult) {
            facebookSuccess = true
            results.facebook.success++
          }
        } catch (error) {
          console.error(`[Social] Failed to post "${post.title}" to Facebook:`, error)
          results.facebook.failed++
        }

        // Post to Instagram
        try {
          const igResult = await postToInstagram(post as BlogPost)
          if (igResult) {
            instagramSuccess = true
            results.instagram.success++
          }
        } catch (error) {
          console.error(`[Social] Failed to post "${post.title}" to Instagram:`, error)
          results.instagram.failed++
        }

        // Mark as shared if at least one platform succeeded
        if (facebookSuccess || instagramSuccess) {
          await payload.update({
            collection: 'blog-posts',
            id: post.id as number,
            data: {
              socialShared: true,
            },
            overrideAccess: true,
          })
          results.processed++
          console.log(`[Social] Marked "${post.title}" as shared`)
        }

        return { facebookSuccess, instagramSuccess }
      })
    }

    return {
      message: `Processed ${results.processed} posts`,
      results,
    }
  }
)

/**
 * Event-triggered function - can be called manually or via webhook
 * Use this to immediately share a specific post
 */
export const sharePostNow = inngest.createFunction(
  {
    id: 'share-post-now',
    name: 'Share Post to Social Media Now',
    retries: 2,
  },
  { event: 'blog/share.requested' },
  async ({ event, step }) => {
    const { postId } = event.data

    const post = await step.run('fetch-post', async () => {
      const payload = await getPayload({ config })
      const result = await payload.findByID({
        collection: 'blog-posts',
        id: postId,
      })
      if (!isValidBlogPost(result)) {
        throw new Error(`Post ${postId} is missing required fields`)
      }
      return result
    })

    const results = {
      facebook: null as { id: string } | null,
      instagram: null as { id: string } | null,
    }

    // Post to Facebook
    await step.run('post-to-facebook', async () => {
      results.facebook = await postToFacebook(post as BlogPost)
    })

    // Post to Instagram
    await step.run('post-to-instagram', async () => {
      results.instagram = await postToInstagram(post as BlogPost)
    })

    // Mark as shared
    await step.run('mark-as-shared', async () => {
      const payload = await getPayload({ config })
      await payload.update({
        collection: 'blog-posts',
        id: postId as number,
        data: {
          socialShared: true,
        },
        overrideAccess: true,
      })
    })

    return {
      message: `Shared "${post.title}" to social media`,
      results,
    }
  }
)
