const AI_SOURCE_STORAGE_KEY = 'lrp_ai_referral_source'

const sourceMatchers: Array<{ source: string; pattern: RegExp }> = [
  { source: 'chatgpt', pattern: /(^|[.])chatgpt\.com$/i },
  { source: 'perplexity', pattern: /(^|[.])perplexity\.ai$/i },
  { source: 'claude', pattern: /(^|[.])claude\.ai$/i },
  { source: 'gemini', pattern: /(^|[.])gemini\.google\.com$/i },
  { source: 'copilot', pattern: /(^|[.])copilot\.microsoft\.com$/i },
]

const utmAliases: Record<string, string> = {
  'chatgpt.com': 'chatgpt',
  chatgpt: 'chatgpt',
  perplexity: 'perplexity',
  'perplexity.ai': 'perplexity',
  claude: 'claude',
  'claude.ai': 'claude',
  gemini: 'gemini',
  'gemini.google.com': 'gemini',
  copilot: 'copilot',
  'copilot.microsoft.com': 'copilot',
}

export function detectAIReferral(search: string, referrer: string): string | null {
  const utmSource = new URLSearchParams(search).get('utm_source')?.trim().toLowerCase()
  if (utmSource && utmAliases[utmSource]) return utmAliases[utmSource]

  if (!referrer) return null

  try {
    const hostname = new URL(referrer).hostname
    return sourceMatchers.find(({ pattern }) => pattern.test(hostname))?.source ?? null
  } catch {
    return null
  }
}

export function storeAIReferralSource(source: string) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AI_SOURCE_STORAGE_KEY, source)
}

export function getStoredAIReferralSource(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(AI_SOURCE_STORAGE_KEY)
}
