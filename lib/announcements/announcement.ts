import { z } from 'zod'

export const ANNOUNCEMENT_ID = 'siteAnnouncement'
export const ANNOUNCEMENT_DISMISSAL_KEY = 'lrp:announcement:dismissed'

export function isSafeAnnouncementLink(value: string): boolean {
  if (/[\s\\\u0000-\u001f]/.test(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch { return false }
}

export function validateAnnouncementExpiry(value: unknown, enabled: boolean, now = Date.now()): true | string {
  const timestamp = typeof value === 'string' ? Date.parse(value) : NaN
  if (!Number.isFinite(timestamp)) return 'An expiration date and time is required.'
  if (enabled && timestamp <= now) return 'Choose a future expiration before enabling the announcement.'
  return true
}

const optionalText = (max: number) => z.string().trim().max(max).nullish().transform((value) => value || undefined)
const announcementSchema = z.object({
  _id: z.literal(ANNOUNCEMENT_ID),
  _rev: z.string().min(1),
  enabled: z.literal(true),
  mode: z.enum(['popup', 'banner']),
  title: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(500),
  expiresAt: z.string().datetime({ offset: true }),
  linkLabel: optionalText(60),
  linkUrl: optionalText(1000),
  image: z.object({
    url: z.string().url().refine((value) => {
      const url = new URL(value)
      return url.protocol === 'https:' && url.hostname === 'cdn.sanity.io' && url.pathname.startsWith('/images/')
    }),
    alt: z.string().trim().min(1).max(200),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).nullish().transform((value) => value ?? undefined),
}).refine((value) => Boolean(value.linkLabel) === Boolean(value.linkUrl) && (!value.linkUrl || isSafeAnnouncementLink(value.linkUrl)))

export type SiteAnnouncementData = z.infer<typeof announcementSchema>

/** Also validate at runtime: Studio validation cannot constrain direct API writes. */
export function parseAnnouncement(value: unknown, now = Date.now()): SiteAnnouncementData | null {
  const parsed = announcementSchema.safeParse(value)
  if (!parsed.success || Date.parse(parsed.data.expiresAt) <= now) return null
  return parsed.data
}

export function isAnnouncementPathAllowed(path: string): boolean {
  return ![
    '/checkout', '/cart', '/careers/driver-application', '/careers/general-application',
    '/careers/application-status', '/careers/application-received', '/insiders', '/insider-login',
    '/giveaways-admin', '/bridal-show-admin', '/camden-county', '/studio',
  ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}
