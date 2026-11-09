import { createRequire } from 'node:module'
import { expect, it } from 'vitest'

const require = createRequire(import.meta.url)

it.each(['@oclif/core', '@typescript-eslint/typescript-estree'])('keeps %s matching behavior after its scoped minimatch security upgrade', dependency => {
  const dependencyRequire = createRequire(require.resolve(dependency))
  const { minimatch } = dependencyRequire('minimatch')
  expect(minimatch('src/example.ts', '**/*.ts')).toBe(true)
  expect(minimatch('src/example.js', '**/*.ts')).toBe(false)
  expect(minimatch('.config/test.ts', '**/*.ts', { dot: true })).toBe(true)
  expect(minimatch('.config/test.ts', '**/*.ts')).toBe(false)
  expect(minimatch('@scope/plugin-example', '@scope/plugin-*')).toBe(true)
  expect(minimatch('other-plugin', '@scope/plugin-*')).toBe(false)
  expect(minimatch('src/example.ts', 'src/**/*.ts', { optimizationLevel: 2 })).toBe(true)
})

it('does not replace the older minimatch callable API used by ESLint plugins', () => {
  const pluginRequire = createRequire(require.resolve('eslint-plugin-react'))
  const minimatch = pluginRequire('minimatch')
  expect(typeof minimatch).toBe('function')
  expect(minimatch('src/example.tsx', '**/*.tsx')).toBe(true)
})
