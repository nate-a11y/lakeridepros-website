import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { Inngest } from 'inngest'

const require = createRequire(import.meta.url)
const sdkRoot = dirname(require.resolve('inngest'))
const sdkRequire = createRequire(require.resolve('inngest'))
const zodRoot = dirname(sdkRequire.resolve('zod/package.json'))

async function legacyZod(format: 'CommonJS' | 'ESM') {
  return format === 'CommonJS' ? sdkRequire('zod/v3').z : (await import(pathToFileURL(join(zodRoot, 'v3/index.js')).href)).z
}

describe.each(['CommonJS', 'ESM'] as const)('Inngest private Zod patch (%s)', format => {
  it.each(['max', 'length'] as const)('rejects an oversized array before child or outer refinements: %s', async bound => {
    const z = await legacyZod(format)
    const child = vi.fn(() => true), outer = vi.fn(() => true)
    const result = z.object({ items: z.array(z.string().refine(child))[bound](2, 'too many').refine(outer) }).safeParse({ items: Array(100).fill('valid') })
    expect(result.success).toBe(false)
    expect(result.error.issues).toEqual([expect.objectContaining({ code: 'too_big', maximum: 2, path: ['items'], message: 'too many' })])
    expect(child).not.toHaveBeenCalled(); expect(outer).not.toHaveBeenCalled()
  })

  it('honors a zero upper bound and set size bounds before walking elements', async () => {
    const z = await legacyZod(format), child = vi.fn(() => true)
    expect(z.array(z.string().refine(child)).max(0).safeParse(['value']).success).toBe(false)
    expect(z.set(z.string().refine(child)).max(2).safeParse(new Set(['a', 'b', 'c'])).success).toBe(false)
    expect(z.set(z.string().refine(child)).size(2).safeParse(new Set(['a', 'b', 'c'])).success).toBe(false)
    expect(child).not.toHaveBeenCalled()
    expect(z.set(z.string()).max(2).parse(new Set(['a', 'b']))).toEqual(new Set(['a', 'b']))
  })

  it('stops unbounded invalid arrays at the first hard or refinement error', async () => {
    const z = await legacyZod(format)
    const invalid = z.array(z.string()).safeParse(Array(1000).fill(0))
    expect(invalid.success).toBe(false); expect(invalid.error.issues).toHaveLength(1)
    expect(invalid.error.issues[0].path).toEqual([0])
    const refinement = vi.fn(() => false)
    const dirty = z.array(z.string().refine(refinement)).safeParse(Array(1000).fill('invalid'))
    expect(dirty.success).toBe(false); expect(dirty.error.issues).toHaveLength(1)
    expect(refinement).toHaveBeenCalledTimes(1)
  })

  it('preserves valid transformations, lower-bound errors, sparse arrays, and input snapshots', async () => {
    const z = await legacyZod(format)
    expect(z.array(z.string().transform((value: string) => value.toUpperCase())).parse(['a', 'b'])).toEqual(['A', 'B'])
    expect(z.array(z.string()).min(2).safeParse(['a']).error.issues[0].code).toBe('too_small')
    expect(z.array(z.string()).length(2).safeParse(['a']).error.issues[0].code).toBe('too_small')
    expect(z.array(z.string().optional()).parse(Array(2))).toEqual([undefined, undefined])
    expect(z.array(z.number()).parse(Array.from({ length: 5000 }, (_, i) => i))).toHaveLength(5000)
    const original = ['a', 'b']
    const schema = z.array(z.string().transform((value: string) => { if (value === 'a') { original[1] = 'changed'; original.push('c') }; return value }))
    expect(schema.parse(original)).toEqual(['a', 'b'])
  })

  it('caps async invalid work while preserving successful async output', async () => {
    const z = await legacyZod(format), refinement = vi.fn(async () => false)
    const bounded = await z.array(z.string().refine(refinement)).max(2).safeParseAsync(Array(100).fill('value'))
    expect(bounded.success).toBe(false); expect(refinement).not.toHaveBeenCalled()
    const unbounded = await z.array(z.string().refine(refinement)).safeParseAsync(Array(100).fill('value'))
    expect(unbounded.success).toBe(false); expect(unbounded.error.issues).toHaveLength(1)
    expect(refinement).toHaveBeenCalledTimes(1)
    expect(await z.array(z.string().transform(async (value: string) => value.toUpperCase())).parseAsync(['a', 'b'])).toEqual(['A', 'B'])
  })

  it('preserves Inngest execution payloads and bounds malformed event-array errors in the real SDK', async () => {
    const helpers = format === 'CommonJS' ? sdkRequire(join(sdkRoot, 'helpers/functions.cjs')) : await import(pathToFileURL(join(sdkRoot, 'helpers/functions.js')).href)
    const payload = { event: { name: 'patch/test', data: { example: true } }, events: [{ name: 'patch/test', data: {} }], steps: {}, ctx: { run_id: 'test-run', stack: { stack: ['step-a'], current: 0 } } }
    const logger = { error: vi.fn() }
    expect(helpers.parseFnData(payload, 1, logger)).toMatchObject({ version: 1, event: payload.event, events: payload.events, ctx: { run_id: 'test-run' } })
    let failure: Error | undefined
    try { helpers.parseFnData({ ...payload, events: Array(1000).fill(null) }, 1, logger) } catch (error) { failure = error as Error }
    expect(failure?.message).toContain('events')
    expect(failure!.message.length).toBeLessThan(3000)
  })
})

it('keeps the real SDK event-send contract working through a mocked transport only', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: 200, ids: ['event-1'] }))
  const client = new Inngest({ id: 'local-security-patch-test', eventKey: 'test-only', isDev: true, fetch: fetcher })
  expect(await client.send({ name: 'patch/test', data: { example: true } })).toEqual({ ids: ['event-1'] })
  expect(fetcher).toHaveBeenCalledOnce()
})
