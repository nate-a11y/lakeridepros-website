import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'

describe('accessibility lint configuration', () => {
  it('ignores generated Vercel build output rather than linting bundled dependencies', async () => {
    const eslint = new ESLint()
    expect(await eslint.isPathIgnored('.vercel/output/static/_next/static/chunks/generated.js')).toBe(true)
    expect(await eslint.isPathIgnored('.vercel/output/functions/api.func/index.js')).toBe(true)
    expect(await eslint.isPathIgnored('components/HeaderClient.tsx')).toBe(false)
  })

  it.each(['components/a11y-config-regression.tsx', 'scripts/a11y-config-regression.mjs', 'scripts/a11y-config-regression.cjs'])(
    'registers the accessibility plugin and keeps rules as errors for %s',
    async filePath => {
      const config = await new ESLint().calculateConfigForFile(filePath)
      expect(config.plugins['jsx-a11y']).toBeDefined()
      expect(config.rules['jsx-a11y/alt-text'][0]).toBe(2)
      expect(config.rules['jsx-a11y/click-events-have-key-events'][0]).toBe(2)
    },
  )

  it('actually rejects an image without alternative text', async () => {
    const [result] = await new ESLint().lintText(
      'export default function InvalidImage() { return <img src="/test.png" /> }',
      { filePath: 'components/a11y-config-regression.tsx' },
    )
    expect(result.messages).toContainEqual(expect.objectContaining({
      ruleId: 'jsx-a11y/alt-text', severity: 2,
    }))
  })
})
