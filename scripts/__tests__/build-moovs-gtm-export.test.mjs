import { describe, expect, it } from 'vitest'
import vm from 'node:vm'
import { buildExport, GA4_ID, GTM_ID, MOOVS_EVENTS, WEBSITE_EVENTS, initializePortal, forwardMoovsEvent, forwardWebsiteEvent } from '../build-moovs-gtm-export.mjs'

const original = () => ({ containerVersion: { accountId: 'account', containerId: 'container', container: { publicId: GTM_ID }, builtInVariable: [{ type: 'EVENT', name: 'Event' }] } })
function run(html, { hostname = 'customer.moovs.app', pathname = '/lake-ride-pros/new/info', event, dataLayer = [] } = {}) {
  const calls = [], scripts = []
  const window = { location: { hostname, pathname }, dataLayer, gtag: (...args) => calls.push(args) }
  const document = { querySelector: () => false, createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }
  const context = { window, document }
  const execute = () => vm.runInNewContext(html.replace(/<\/?script>/g, '').replace('{{Event}}', JSON.stringify(event)), context)
  execute()
  return { calls, scripts, execute }
}

describe('Lake Ride Pros GTM import', () => {
  it('contains nine individually named Moovs tags plus config and website events, with valid references', () => {
    const source = original(), before = JSON.stringify(source)
    const { containerVersion: v } = buildExport(source)
    expect(JSON.stringify(source)).toBe(before)
    expect(v.tag).toHaveLength(22)
    expect(v.trigger).toHaveLength(22)
    expect(new Set(v.tag.map(t => t.tagId)).size).toBe(22)
    for (const tag of v.tag) for (const id of tag.firingTriggerId) expect(v.trigger.some(t => t.triggerId === id)).toBe(true)
    for (const event of MOOVS_EVENTS) {
      const tag = v.tag.find(t => t.name === `LRP - GA4 - ${event}`)
      expect(tag).toBeDefined()
      expect(tag.setupTag[0].tagName).toBe(v.tag[0].name)
      const trigger = v.trigger.find(t => t.triggerId === tag.firingTriggerId[0])
      expect(trigger.customEventFilter[0].parameter[1].value).toBe(event)
      expect(trigger.filter.map(f => f.parameter[1].value)).toEqual(['customer.moovs.app', '^/lake-ride-pros(/|$)'])
    }
  })
  it.each(WEBSITE_EVENTS)('forwards website event %s', event => {
    expect(run(forwardWebsiteEvent, { hostname: 'www.lakeridepros.com', event }).calls[0].slice(0, 2)).toEqual(['event', event])
  })
  it('refuses wrong containers and nonempty workspaces', () => {
    expect(() => buildExport({ containerVersion: { container: { publicId: 'wrong' } } })).toThrow('Wrong')
    const source = original(); source.containerVersion.tag = [{}]
    expect(() => buildExport(source)).toThrow('merge/review')
  })
  it('initializes GA4 once on the portal, with linker before config', () => {
    const result = run(initializePortal)
    result.execute()
    expect(result.calls.map(c => c[0])).toEqual(['set', 'js', 'config'])
    expect(result.calls[0][2].accept_incoming).toBe(true)
    expect(result.calls[2][1]).toBe(GA4_ID)
    expect(result.scripts).toHaveLength(1)
  })
  it('does not configure GA4 on the website, other operators, or lookalike paths', () => {
    for (const options of [{ hostname: 'www.lakeridepros.com' }, { pathname: '/another-operator/' }, { pathname: '/lake-ride-pros-other/' }]) expect(run(initializePortal, options).calls).toHaveLength(0)
  })
  it.each(MOOVS_EVENTS)('forwards exactly %s without inventing purchase or PII', event => {
    const result = run(forwardMoovsEvent, { event, dataLayer: [{ event, email: 'private', token: 'private' }] })
    expect(result.calls).toEqual([['event', event, { send_to: GA4_ID, event_category: 'Moovs_Tracking', booking_platform: 'moovs' }]])
  })
  it('only uses a valid numeric total from the matching reservation event', () => {
    for (const event of ['moovs_create_reservation', 'moovs_confirm_reservation']) {
      const params = run(forwardMoovsEvent, { event, dataLayer: [{ event, value: 123.45 }] }).calls[0][2]
      expect(params).toMatchObject({ value: 123.45, currency: 'USD' })
      for (const value of [undefined, -1, Infinity, '123.45']) expect(run(forwardMoovsEvent, { event, dataLayer: [{ event, value: 900 }, { event, value }] }).calls[0][2]).not.toHaveProperty('value')
    }
    expect(run(forwardMoovsEvent, { event: 'moovs_create_quote', dataLayer: [{ event: 'moovs_create_quote', value: 100 }] }).calls[0][2]).not.toHaveProperty('value')
  })
  it('ignores unknown events and other operators', () => {
    expect(run(forwardMoovsEvent, { event: 'purchase' }).calls).toHaveLength(0)
    expect(run(forwardMoovsEvent, { event: MOOVS_EVENTS[0], pathname: '/other/' }).calls).toHaveLength(0)
  })
  it('forwards sanitized website click context on only the website', () => {
    const dataLayer = [{ event: 'booking_portal_click', booking_location: 'header', service_slug: 'airport', email: 'private' }]
    const params = run(forwardWebsiteEvent, { hostname: 'www.lakeridepros.com', dataLayer, event: 'booking_portal_click' }).calls[0][2]
    expect(params).toEqual({ send_to: GA4_ID, booking_destination: 'https://customer.moovs.app/lake-ride-pros/', booking_location: 'header', service_slug: 'airport' })
    expect(run(forwardWebsiteEvent, { dataLayer }).calls).toHaveLength(0)
  })
})
