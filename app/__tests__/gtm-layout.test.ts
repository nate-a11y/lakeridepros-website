import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Google Tag Manager layout coverage', () => {
  it('mounts the GTM container once at the root so every page inherits it', () => {
    const rootLayout = source('app/layout.tsx')
    const siteLayout = source('app/(site)/layout.tsx')

    expect(rootLayout.match(/<GoogleTagManager\s*\/>/g)).toHaveLength(1)
    expect(siteLayout).not.toContain('<GoogleTagManager')
  })

  it('keeps the published Lake Ride Pros container ID in the shared component', () => {
    expect(source('components/GoogleTagManager.tsx')).toContain("GTM-KKNTGMB7")
  })
})
