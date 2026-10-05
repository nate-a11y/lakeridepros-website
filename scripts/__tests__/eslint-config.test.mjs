import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'

describe('accessibility lint configuration', () => {
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
