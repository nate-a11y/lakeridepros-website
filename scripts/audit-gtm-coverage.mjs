const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const productionOrigin = 'https://www.lakeridepros.com'
const containerId = 'GTM-KKNTGMB7'

const additionalRoutes = [
  '/camden-county',
  '/share-photos',
  '/cart',
  '/checkout/cancel',
  '/checkout/success',
  '/gift-card-balance',
  '/gift-cards/success',
  '/careers/general-application',
  '/careers/application-received',
  '/careers/application-status',
  '/events/waitlist',
  '/insider-login',
  '/insiders',
  '/insiders/login',
  '/bridal-show-registration',
]

async function fetchHtml(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: 'follow' })
  const contentType = response.headers.get('content-type') || ''
  return {
    pathname,
    status: response.status,
    finalUrl: response.url,
    html: contentType.includes('text/html') ? await response.text() : '',
  }
}

async function inBatches(items, size, worker) {
  const results = []
  for (let index = 0; index < items.length; index += size) {
    results.push(...await Promise.all(items.slice(index, index + size).map(worker)))
  }
  return results
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`)
if (!sitemapResponse.ok) {
  throw new Error(`Unable to read sitemap: ${sitemapResponse.status}`)
}

const sitemapXml = await sitemapResponse.text()
const sitemapRoutes = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map(match => match[1].replace(productionOrigin, '') || '/')
const routes = [...new Set([...sitemapRoutes, ...additionalRoutes])]
const results = await inBatches(routes, 8, fetchHtml)

const failures = results.filter(result => {
  if (result.status >= 400 || !result.html) return true
  // next/script with `afterInteractive` is represented in the server response's
  // Flight payload, then materialized as a script during hydration. This audit
  // proves every route serializes exactly one GTM component; browser E2E covers
  // the hydrated bootstrap/loader/start-event exactly-once behavior.
  const serializedComponentCount = (result.html.match(/\\"id\\":\\"google-tag-manager\\"/g) || []).length
  const containerReferences = (result.html.match(new RegExp(containerId, 'g')) || []).length
  return serializedComponentCount !== 1 || containerReferences === 0
})

const report = {
  baseUrl,
  checked: results.length,
  passed: results.length - failures.length,
  failures: failures.map(result => ({
    path: result.pathname,
    status: result.status,
    finalUrl: result.finalUrl,
    serializedComponentCount: (result.html.match(/\\"id\\":\\"google-tag-manager\\"/g) || []).length,
    containerReferences: (result.html.match(new RegExp(containerId, 'g')) || []).length,
  })),
}

console.log(JSON.stringify(report, null, 2))
if (failures.length > 0) process.exitCode = 1
