import { act, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ContactCenterWidget from '@/components/ContactCenterWidget'

vi.mock('next/script', () => ({ default: () => null }))

describe('LRP chat launcher contrast', () => {
  it('patches a late-mounted widget exactly once without touching other controls', async () => {
    const { unmount } = render(<ContactCenterWidget />)
    const host = document.createElement('div')
    host.id = 'moovs-website-assistant'
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<button aria-label="Open transportation assistant">Chat with us</button>'
    await act(async () => { document.body.appendChild(host) })
    await waitFor(() => expect(shadow.querySelector('[data-lrp-contrast]')).not.toBeNull())
    expect(shadow.querySelector('style')!.textContent).toContain('color: #000')
    unmount()
    render(<ContactCenterWidget />)
    expect(shadow.querySelectorAll('[data-lrp-contrast]')).toHaveLength(1)
    host.remove()
  })
})
