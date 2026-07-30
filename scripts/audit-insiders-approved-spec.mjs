import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const PUBLIC_PAGE = fs.readFileSync(
  path.join(ROOT, 'app/(site)/insider-membership-benefits/page.tsx'),
  'utf8',
)
const TERMS_PAGE = fs.readFileSync(
  path.join(ROOT, 'app/(site)/insider-terms-and-conditions/page.tsx'),
  'utf8',
)
const CONSTANTS = fs.readFileSync(
  path.join(ROOT, 'lib/insiders/constants.ts'),
  'utf8',
)
const CHARGEBEE_PRICING = fs.readFileSync(
  path.join(ROOT, 'lib/chargebee/pricing-page.ts'),
  'utf8',
)

const requiredPublicCopy = [
  "monthly: '$9.99'",
  "annual: '$99'",
  "monthly: '$19.99'",
  "annual: '$199'",
  "monthly: '$29.99'",
  "annual: '$299'",
  "capacity: '1 member'",
  "capacity: 'Up to 5 approved riders'",
  "capacity: 'Up to 10 approved riders'",
  "discount: '5%'",
  "discount: '10%'",
  "discount: '15%'",
  "discount: '20%'",
  "individual: '0–20'",
  "individual: '21–60'",
  "individual: '61–100'",
  "individual: '101+'",
  "shared: '0–40'",
  "shared: '41–120'",
  "shared: '121–200'",
  "shared: '201+'",
  "'2 Flex Credits per year'",
  "'4 Flex Credits per year'",
  "'6 Flex Credits per year'",
  "'1 Guest Savings Pass per membership year'",
  "'2 Guest Savings Passes per membership year'",
  "'$10 anniversary ride credit upon renewal'",
  "'$25 anniversary ride credit upon renewal'",
  "'$50 anniversary ride credit upon renewal'",
  "'48-hour event access'",
  "'72-hour event access'",
  "'Diamond Priority Pass'",
]

const requiredTermsCopy = [
  'Bronze 5%, Silver 10%, Gold 15%,',
  'and Diamond 20%.',
  '0–20',
  '21–60',
  '61–100',
  '101+',
  '0–40',
  '41–120',
  '121–200',
  '201+',
  'at least two hours before pickup',
  '12 consecutive monthly payments',
  'expires 60 days after issuance',
]

const requiredConstants = [
  'individual: { bronze: 0, silver: 21, gold: 61, diamond: 101 }',
  'family: { bronze: 0, silver: 41, gold: 121, diamond: 201 }',
  'business: { bronze: 0, silver: 41, gold: 121, diamond: 201 }',
]

const prohibitedCustomerCopy = [
  /most\s+marketable/i,
  /free monthly ride/i,
  /unlimited cancellation forgiveness/i,
]

const approvedAssetHashes = {
  'public/insider-rewards/all-new.webp':
    'e5cdfdbdd2277fd138963843e1db1c46cba44f2e212a2687d6bd6ce8c82b4e49',
  'public/insider-rewards/business.webp':
    '70b7c8e8e65102bce01721c99d585612389cab0f831e53e643618c66e4730b71',
  'public/insider-rewards/diamond.webp':
    '0adc454bda432aac3cf8454198fe7458c3dbeb37d6cc8cb9b1535f75af0ad87c',
  'public/insider-rewards/family.webp':
    'd12d54acd59f5aab411c81abb6a332b351a1154fb96e13a620416c458fc172e4',
  'public/insider-rewards/individual.webp':
    '162c181792cb4fb468bd741c6e344ca7da877c1e4f902adffcc2dcaac3782da6',
}

const findings = []

function requireCopy(source, required, surface) {
  const normalizedSource = source.replace(/\s+/g, ' ')
  for (const text of required) {
    if (!normalizedSource.includes(text.replace(/\s+/g, ' '))) {
      findings.push(`${surface} is missing approved text: ${text}`)
    }
  }
}

requireCopy(PUBLIC_PAGE, requiredPublicCopy, 'Public membership page')
requireCopy(TERMS_PAGE, requiredTermsCopy, 'Membership terms')
requireCopy(CONSTANTS, requiredConstants, 'Portal tier constants')
requireCopy(
  CHARGEBEE_PRICING,
  ["DEFAULT_INSIDER_PRICING_TABLE_KEY = 'GPK2OxIlzp'"],
  'Chargebee Growth pricing table',
)

for (const pattern of prohibitedCustomerCopy) {
  if (pattern.test(`${PUBLIC_PAGE}\n${TERMS_PAGE}`)) {
    findings.push(`Customer pages contain removed language: ${pattern}`)
  }
}

for (const [relativePath, expectedHash] of Object.entries(
  approvedAssetHashes,
)) {
  const filePath = path.join(ROOT, relativePath)
  if (!fs.existsSync(filePath)) {
    findings.push(`Approved asset is missing: ${relativePath}`)
    continue
  }
  const actualHash = crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex')
  if (actualHash !== expectedHash) {
    findings.push(`Approved asset changed: ${relativePath}`)
  }
}

if (findings.length) {
  console.error('Approved Insider Rewards spec audit failed:')
  findings.forEach((finding) => console.error(`- ${finding}`))
  process.exit(1)
}

console.log('Approved Insider Rewards spec audit passed.')
