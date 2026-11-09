// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { applyInngestZodPatch } from '../patch-inngest-zod.mjs'

const require = createRequire(import.meta.url)
const installedZod = dirname(createRequire(require.resolve('inngest')).resolve('zod/package.json'))
const files = ['v3/types.js', 'v3/types.cjs', 'src/v3/types.ts']
let root, sdk, zod
const json = (path, data) => writeFileSync(path, JSON.stringify(data))

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'lrp-zod-installer-'))
  sdk = join(root, 'node_modules/inngest')
  zod = join(sdk, 'node_modules/zod')
  mkdirSync(zod, { recursive: true })
  json(join(root, 'package.json'), {})
  json(join(sdk, 'package.json'), { name: 'inngest', version: '4.26.2', main: 'index.cjs' })
  writeFileSync(join(sdk, 'index.cjs'), '')
  json(join(zod, 'package.json'), { name: 'zod', version: '3.25.76' })
  for (const file of files) {
    mkdirSync(dirname(join(zod, file)), { recursive: true })
    cpSync(join(installedZod, file), join(zod, file))
  }
})
afterEach(() => rmSync(root, { recursive: true, force: true }))

describe('version-locked Inngest Zod patch installer', () => {
  it('accepts already-patched files idempotently without touching the shared root Zod', () => {
    const shared = join(root, 'node_modules/zod')
    mkdirSync(shared)
    writeFileSync(join(shared, 'sentinel'), 'root Zod must stay untouched')
    expect(applyInngestZodPatch(root)).toBe(0)
    expect(applyInngestZodPatch(root)).toBe(0)
    for (const file of files) expect(readFileSync(join(zod, file))).toEqual(readFileSync(join(installedZod, file)))
    expect(readFileSync(join(shared, 'sentinel'), 'utf8')).toBe('root Zod must stay untouched')
  })

  it.each(['sdk', 'zod'])('fails closed if the %s version changes', target => {
    json(join(target === 'sdk' ? sdk : zod, 'package.json'), { version: '99.0.0', main: 'index.cjs' })
    expect(() => applyInngestZodPatch(root)).toThrow('layout or version changed')
  })

  it('rejects a hoisted Zod instead of patching another consumer', () => {
    cpSync(zod, join(root, 'node_modules/zod'), { recursive: true })
    rmSync(zod, { recursive: true })
    expect(() => applyInngestZodPatch(root)).toThrow('layout or version changed')
  })

  it.each(files)('rejects unexpected bytes in %s without changing any file', file => {
    writeFileSync(join(zod, file), readFileSync(join(zod, file), 'utf8') + '\n// unexpected drift\n')
    const before = files.map(path => readFileSync(join(zod, path)))
    expect(() => applyInngestZodPatch(root)).toThrow(`Unexpected Inngest Zod bytes: ${file}`)
    expect(files.map(path => readFileSync(join(zod, path)))).toEqual(before)
  })

  it('makes the install/build CLI exit unsuccessfully on drift', () => {
    const script = resolve('scripts/patch-inngest-zod.mjs')
    const ok = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' })
    expect(ok.status).toBe(0)
    expect(ok.stdout).toContain('0 files updated')
    writeFileSync(join(zod, files[0]), 'unexpected')
    const failure = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' })
    expect(failure.status).not.toBe(0)
    expect(failure.stderr).toContain('Unexpected Inngest Zod bytes')
  })

  it('protects the actual @zod/source export as well as compiled runtimes', () => {
    const result = spawnSync(process.execPath, ['--import', 'tsx', '--conditions=@zod/source', '--input-type=module', '--eval', `
      import assert from 'node:assert/strict';
      import {createRequire} from 'node:module';
      import {pathToFileURL} from 'node:url';
      const require = createRequire(${JSON.stringify(join(process.cwd(), 'package.json'))});
      const sdkRequire = createRequire(require.resolve('inngest'));
      const entry = sdkRequire.resolve('zod/v3');
      assert.ok(entry.endsWith('/src/v3/index.ts'));
      const {z} = await import(pathToFileURL(entry).href);
      let visits = 0;
      const bounded = z.array(z.string().refine(() => {visits++; return true})).max(2).safeParse(Array(100).fill('valid'));
      assert.equal(bounded.success, false);
      assert.equal(visits, 0);
      const invalid = z.array(z.string()).safeParse(Array(1000).fill(0));
      assert.equal(invalid.success, false);
      assert.equal(invalid.error.issues.length, 1);
      assert.deepEqual(await z.array(z.string().transform(async s => s.toUpperCase())).parseAsync(['a', 'b']), ['A', 'B']);
    `], { cwd: process.cwd(), encoding: 'utf8' })
    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)
  })
})
