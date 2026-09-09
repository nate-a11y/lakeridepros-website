import { client } from '@/sanity/lib/client'
import { ANNOUNCEMENT_ID, parseAnnouncement } from '@/lib/announcements/announcement'

export const dynamic = 'force-dynamic'

const announcementClient = client.withConfig({ useCdn: false, perspective: 'published' })
const query = `*[_type == "siteAnnouncement" && _id == $id && enabled == true][0]{
  _id, _rev, enabled, mode, title, message, expiresAt, linkLabel, linkUrl,
  "image": select(defined(image.asset) => image{alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}, null)
}`

export async function GET() {
  let announcement = null
  try {
    const document = await announcementClient.fetch(query, { id: ANNOUNCEMENT_ID }, {
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    })
    announcement = parseAnnouncement(document)
  } catch {
    // Optional content must never prevent navigation or expose CMS errors.
  }
  return Response.json({ announcement }, { headers: { 'Cache-Control': 'no-store' } })
}
