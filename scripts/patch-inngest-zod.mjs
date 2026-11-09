import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Remove when Inngest no longer uses vulnerable Zod v3. See docs/dependency-security-2026-11-09.md.
const files = [
  ['v3/types.js', '9763a2938f0e7f983363ef4bf6530e7583e3f2d54f8a4a6684efad58febc6e8e', '8b3fc2d3a49de5c64ad899c8f39c1285142691e537f39766807c163fff02f583'],
  ['v3/types.cjs', '06487cc05ed45c5dd29789bf0aa75734d1ce06592a7f2665ba4ca90a68e8a3e1', 'c712d3f4905f9f6ccb4b0ccf4d3849e305f7be856d9ddadfdca9f4366d09a75c'],
  ['src/v3/types.ts', '70309a0877c35d036842e291fe7c8a4439d5db49411d233f8a22bf8a59c41419', '470bc76cf14c8d52a5efd69b8c83bc8e3ac1d95ac3a9eea028ce9741c062d9a4'],
]
const sha256 = text => createHash('sha256').update(text).digest('hex')

function patchSource(source, file) {
  const ns = file.endsWith('.cjs') ? 'parseUtil_js_1.' : ''
  const indent = file.endsWith('.ts') ? '  ' : '    '
  for (const bound of ['exactLength', 'maxLength', 'maxSize']) {
    const pattern = new RegExp(`(message: def\\.${bound}\\.message,\\n( +)\\}\\);\\n)\\2status\\.dirty\\(\\);`, 'g')
    let matches = 0
    source = source.replace(pattern, (_, prefix, space) => {
      matches++
      return `${prefix}${space}${bound === 'exactLength' ? `status.dirty();\n${space}if (tooBig) ` : ''}return ${ns}INVALID;`
    })
    if (matches !== 1) throw new Error(`Unexpected ${bound} implementation in ${file}`)
  }

  const start = source.indexOf(`${indent.repeat(2)}if (ctx.common.async)`, source.indexOf('class ZodArray'))
  const endMarker = `${indent.repeat(2)}return ${ns}ParseStatus.mergeArray(status, result);`
  const end = source.lastIndexOf(endMarker, source.indexOf(`${indent}get element()`, start)) + endMarker.length
  if (start < 0 || end < start) throw new Error(`Unexpected array implementation in ${file}`)
  const body = [
    '// Stop invalid arrays before issue objects accumulate; keep the original input snapshot.',
    'const items = [...ctx.data];',
    'if (ctx.common.async) {',
    `${indent}return (async () => {`,
    `${indent.repeat(2)}const result = [];`,
    `${indent.repeat(2)}for (let i = 0; i < items.length; i++) {`,
    `${indent.repeat(3)}const parsed = await def.type._parseAsync(new ParseInputLazyPath(ctx, items[i], ctx.path, i));`,
    `${indent.repeat(3)}if (parsed.status !== "valid") return ${ns}INVALID;`,
    `${indent.repeat(3)}result.push(parsed);`,
    `${indent.repeat(2)}}`,
    `${indent.repeat(2)}return ${ns}ParseStatus.mergeArray(status, result);`,
    `${indent}})();`,
    '}',
    'const result = [];',
    'for (let i = 0; i < items.length; i++) {',
    `${indent}const parsed = def.type._parseSync(new ParseInputLazyPath(ctx, items[i], ctx.path, i));`,
    `${indent}if (parsed.status !== "valid") return ${ns}INVALID;`,
    `${indent}result.push(parsed);`,
    '}',
    `return ${ns}ParseStatus.mergeArray(status, result);`,
  ].map(line => `${indent.repeat(2)}${line}`).join('\n')
  return source.slice(0, start) + body + source.slice(end)
}

export function applyInngestZodPatch(projectRoot = process.cwd()) {
  const require = createRequire(join(resolve(projectRoot), 'package.json'))
  const sdkEntry = require.resolve('inngest')
  const sdkRoot = dirname(sdkEntry)
  const zodRoot = dirname(createRequire(sdkEntry).resolve('zod/package.json'))
  if (JSON.parse(readFileSync(join(sdkRoot, 'package.json'))).version !== '4.26.2'
      || JSON.parse(readFileSync(join(zodRoot, 'package.json'))).version !== '3.25.76'
      || zodRoot !== join(sdkRoot, 'node_modules/zod')) {
    throw new Error('Inngest/Zod layout or version changed; review the security patch before building')
  }

  // Validate every file before writing any; unknown or partially modified code must fail closed.
  const updates = files.flatMap(([file, pristine, patched]) => {
    const path = join(zodRoot, file)
    const source = readFileSync(path, 'utf8')
    const hash = sha256(source)
    if (hash === patched) return []
    if (hash !== pristine) throw new Error(`Unexpected Inngest Zod bytes: ${file}`)
    const result = patchSource(source, file)
    if (sha256(result) !== patched) throw new Error(`Inngest Zod patch output mismatch: ${file}`)
    return [{ path, result }]
  })
  for (const { path, result } of updates) writeFileSync(path, result)
  return updates.length
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Inngest private Zod security patch: ${applyInngestZodPatch()} files updated`)
}
