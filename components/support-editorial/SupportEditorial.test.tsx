import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import expected from './content-invariants.json'

// Baselines captured before the editorial changes. Presentation can evolve;
// policy copy, destinations, metadata, schemas and form handlers must not.
function evidence(source: string) {
  const ast = ts.createSourceFile('page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const text: string[] = [], links: string[] = [], metadata: string[] = [], logic: string[] = []
  function walk(node: ts.Node) {
    if (ts.isJsxText(node) && node.text.trim()) text.push(node.text.replace(/\s+/g, ' ').trim())
    if (ts.isJsxAttribute(node) && ['href', 'target', 'rel', 'action', 'type', 'name'].includes(node.name.getText(ast))) links.push(node.getText(ast))
    if (ts.isVariableDeclaration(node) && ['metadata', 'datasetSchema', 'articleSchema', 'faqSchema', 'statusLookupSchema', 'STATUS_INFO'].includes(node.name.getText(ast))) metadata.push(node.getText(ast))
    if (ts.isVariableDeclaration(node) && ['onSubmit', 'copyApplicationId', 'handleFileChange'].includes(node.name.getText(ast))) logic.push(node.getText(ast))
    ts.forEachChild(node, walk)
  }
  walk(ast)
  const hash = (value: string[]) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
  return { text: hash(text), links: hash(links), metadata: hash(metadata), logic: hash(logic) }
}

describe('Public support editorial content contract', () => {
  it.each(Object.entries(expected))('preserves %s copy, links, metadata and form logic', (route, baseline) => {
    expect(evidence(readFileSync(`app/(site)/${route}/page.tsx`, 'utf8'))).toEqual(baseline)
  })
})
