import { beforeEach, expect, it, vi } from 'vitest'
import { GET } from '../route'
const fetchAnnouncement = vi.hoisted(() => vi.fn())
vi.mock('@/sanity/lib/client', () => ({ client: { withConfig: () => ({ fetch: fetchAnnouncement }) } }))
beforeEach(() => vi.clearAllMocks())
it('returns null for expired CMS content and prevents HTTP caching', async () => {
  fetchAnnouncement.mockResolvedValue({ _id: 'siteAnnouncement', _rev: 'r1', enabled: true, mode: 'banner', title: 'Old notice', message: 'Old message', expiresAt: '2000-01-01T00:00:00Z' })
  const response = await GET()
  expect(await response.json()).toEqual({ announcement: null })
  expect(response.headers.get('Cache-Control')).toContain('no-store')
})
it('returns a single valid published announcement', async () => {
  fetchAnnouncement.mockResolvedValue({ _id: 'siteAnnouncement', _rev: 'r1', enabled: true, mode: 'banner', title: 'Lake notice', message: 'Book early.', expiresAt: '2099-01-01T00:00:00Z' })
  const response = await GET()
  expect((await response.json()).announcement.title).toBe('Lake notice')
  expect(fetchAnnouncement).toHaveBeenCalledWith(expect.stringContaining('_id == $id'), { id: 'siteAnnouncement' }, expect.objectContaining({ cache: 'no-store' }))
})
it('fails closed when the CMS is unavailable', async () => {
  fetchAnnouncement.mockRejectedValue(new Error('Unavailable'))
  const response = await GET()
  expect(await response.json()).toEqual({ announcement: null })
})
