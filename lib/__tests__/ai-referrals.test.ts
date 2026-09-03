import { afterEach, describe, expect, it } from 'vitest'
import {
  detectAIReferral,
  getStoredAIReferralSource,
  storeAIReferralSource,
} from '../ai-referrals'

describe('AI referral attribution', () => {
  afterEach(() => {
    window.sessionStorage.clear()
  })

  it('recognizes the UTM source used by ChatGPT search', () => {
    expect(detectAIReferral('?utm_source=chatgpt.com', '')).toBe('chatgpt')
  })

  it('recognizes supported AI referrer hosts', () => {
    expect(detectAIReferral('', 'https://www.perplexity.ai/search/example')).toBe('perplexity')
    expect(detectAIReferral('', 'https://claude.ai/new')).toBe('claude')
    expect(detectAIReferral('', 'https://gemini.google.com/app/example')).toBe('gemini')
    expect(detectAIReferral('', 'https://copilot.microsoft.com/')).toBe('copilot')
  })

  it('does not classify unrelated referrers', () => {
    expect(detectAIReferral('', 'https://www.google.com/search?q=lake+rides')).toBeNull()
    expect(detectAIReferral('', 'not-a-url')).toBeNull()
  })

  it('persists attribution for later conversion events in the session', () => {
    storeAIReferralSource('chatgpt')
    expect(getStoredAIReferralSource()).toBe('chatgpt')
  })
})
