import { describe, expect, it } from 'vitest'
import vm from 'node:vm'
import { buildExport, GA4_ID, GTM_ID, MOOVS_EVENTS, WEBSITE_EVENTS, initializePortal, currentEventValue } from '../build-moovs-gtm-export.mjs'
const original = () => ({ containerVersion: { accountId: 'account', containerId: 'container', container: { publicId: GTM_ID }, builtInVariable: [{ type: 'EVENT', name: 'Event' }] } })
const param = (tag, key) => tag.parameter.find(p => p.key === key)
function value(key, event, dataLayer) { return vm.runInNewContext(`(${currentEventValue(key).replace('{{Event}}', JSON.stringify(event))})()`, { window: { dataLayer } }) }

describe('Lake Ride Pros native GA4 GTM import', () => {
  it('includes 21 native event tags and one portal-only configuration, never recursive Custom HTML forwarding', () => {
    const source = original(), before = JSON.stringify(source), v = buildExport(source).containerVersion
    expect(JSON.stringify(source)).toBe(before)
    expect(v.tag).toHaveLength(22); expect(v.trigger).toHaveLength(22); expect(v.variable).toHaveLength(8)
    expect(v.tag.filter(t => t.type === 'gaawe')).toHaveLength(21)
    expect(v.tag.filter(t => t.type === 'html')).toHaveLength(1)
    expect(JSON.stringify(v)).not.toMatch(/gtag\('event'/)
    expect(new Set(v.tag.map(t => t.tagId)).size).toBe(22)
    for (const tag of v.tag) for (const id of tag.firingTriggerId) expect(v.trigger.some(t => t.triggerId === id)).toBe(true)
    for (const event of [...MOOVS_EVENTS, ...WEBSITE_EVENTS]) {
      const tag = v.tag.find(t => t.name === `LRP - GA4 - ${event}`)
      expect(tag.type).toBe('gaawe')
      expect(param(tag, 'measurementIdOverride').value).toBe(GA4_ID)
      expect(param(tag, 'eventName').value).toBe(event)
      expect(param(tag, 'sendEcommerceData').value).toBe('false')
      const trigger = v.trigger.find(t => t.triggerId === tag.firingTriggerId[0])
      expect(trigger.customEventFilter[0].parameter[1].value).toBe(event)
      if (MOOVS_EVENTS.includes(event)) {
        expect(tag.setupTag[0].tagName).toBe(v.tag[0].name)
        expect(trigger.filter.map(f => f.parameter[1].value)).toEqual(['customer.moovs.app', '^/lake-ride-pros(/|$)'])
      } else expect(trigger.filter[0].parameter[1].value).toBe('^(www\\.)?lakeridepros\\.com$')
    }
  })
  it('refuses wrong containers and nonempty workspaces', () => {
    expect(() => buildExport({ containerVersion: { container: { publicId: 'wrong' } } })).toThrow('Wrong')
    const source = original(); source.containerVersion.tag = [{}]
    expect(() => buildExport(source)).toThrow('merge/review')
  })
  it('initializes GA4 only once on the correct portal with linker before config', () => {
    for (const [hostname, pathname] of [['customer.moovs.app', '/lake-ride-pros/new/info'], ['www.lakeridepros.com', '/'], ['customer.moovs.app', '/other/'], ['customer.moovs.app', '/lake-ride-pros-other/']]) {
      const calls = [], scripts = []
      const window = { location: { hostname, pathname }, gtag: (...args) => calls.push(args) }
      const document = { querySelector: () => false, createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }
      const script = initializePortal.replace(/<\/?script>/g, '')
      vm.runInNewContext(script, { window, document }); vm.runInNewContext(script, { window, document })
      if (pathname.includes('/new/')) { expect(calls.map(c => c[0])).toEqual(['set', 'js', 'config']); expect(scripts).toHaveLength(1) }
      else expect(calls).toHaveLength(0)
    }
  })
  it.each(['moovs_create_reservation', 'moovs_confirm_reservation'])('only extracts current valid numeric value for %s', event => {
    const good = [{ event, value: 123.45 }]
    expect(value('value', event, good)).toBe(123.45)
    expect(value('currency', event, good)).toBe('USD')
    for (const invalid of [undefined, -1, Infinity, '123.45']) {
      const layer = [...good, { event, value: invalid }]
      expect(value('value', event, layer)).toBeUndefined()
      expect(value('currency', event, layer)).toBeUndefined()
    }
    expect(value('value', event, [{ event: 'different', value: 100 }])).toBeUndefined()
  })
  it('does not inherit value for quotes or page views and variables cannot retrigger events', () => {
    const layer = [{ event: 'moovs_create_quote', value: 100 }]
    expect(value('value', 'moovs_create_quote', layer)).toBeUndefined()
    expect(layer).toHaveLength(1)
    expect(currentEventValue('value')).not.toContain('.push(')
  })
  it('reads only current public event fields, not stale context or arbitrary fields', () => {
    const layer = [{ event: 'view_service', service_slug: 'old' }, { event: 'view_service', service_slug: 'airport', email: 'private' }]
    expect(value('service_slug', 'view_service', layer)).toBe('airport')
    expect(value('vehicle_slug', 'view_service', layer)).toBeUndefined()
    const v = buildExport(original()).containerVersion
    expect(v.variable.every(t => t.type === 'jsm' && !t.parameter[0].value.includes('.push('))).toBe(true)
    expect(JSON.stringify(v)).not.toContain('customer_email')
  })
})
