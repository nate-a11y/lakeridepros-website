import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const CUSTOMER_SURFACES = [
  'app/(site)/insider-membership-benefits',
  'app/(site)/insider-terms-and-conditions',
  'app/(site)/privacy-policy',
  'app/(site)/insiders',
  'app/api/insiders',
  'app/api/chargebee/webhook',
  'lib/chargebee',
  'lib/inngest/functions/dispatch-insider-notifications.ts',
  'lib/inngest/functions/sync-insider-chargebee.ts',
  'lib/insiders',
]
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md'])
const INTERNAL_ONLY_PATHS = [
  /(^|\/)__tests__(\/|$)/,
  /\.(?:test|spec)\.[cm]?[jt]sx?$/,
  /^lib\/chargebee\/insider-bootstrap\.ts$/,
  /^lib\/chargebee\/bootstrap-schema-errors\.ts$/,
]
const PROHIBITED_LANGUAGE = [
  ['most marketable', /most\s+marketable/i],
  ['partner review', /partner\s+review/i],
  ['draft mode', /draft\s+mode/i],
  ['relaunch proposal', /relaunch\s+proposal/i],
  ['CRM targeting', /\bcrm\s+targeting\b/i],
  ['source of truth', /source\s+of\s+truth/i],
  ['account normalization', /account\s+normalization/i],
  ['platform migration', /platform\s+migration/i],
  ['schema cache', /schema\s+cache/i],
  ['migration pending', /migration\s+pending/i],
  ['god mode', /god\s+mode/i],
  ['internal only', /internal[-\s]+only/i],
  ['staff only', /staff[-\s]+only/i],
  ['implementation detail', /implementation\s+detail/i],
]

function collectFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return []
  const stat = fs.statSync(targetPath)
  if (stat.isFile()) return [targetPath]

  return fs
    .readdirSync(targetPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(targetPath, entry.name)
      if (entry.isDirectory()) return collectFiles(entryPath)
      return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : []
    })
}

const findings = []
for (const surface of CUSTOMER_SURFACES) {
  for (const filePath of collectFiles(path.join(ROOT, surface))) {
    const relativePath = path.relative(ROOT, filePath)
    if (INTERNAL_ONLY_PATHS.some((pattern) => pattern.test(relativePath))) {
      continue
    }
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    lines.forEach((line, index) => {
      for (const [label, pattern] of PROHIBITED_LANGUAGE) {
        if (pattern.test(line)) {
          findings.push({
            file: relativePath,
            line: index + 1,
            label,
          })
        }
      }
    })
  }
}

if (findings.length) {
  console.error('Customer-facing Insider language audit failed:')
  findings.forEach((finding) => {
    console.error(
      `- ${finding.file}:${finding.line} contains "${finding.label}"`,
    )
  })
  process.exit(1)
}

console.log('Customer-facing Insider language audit passed.')
