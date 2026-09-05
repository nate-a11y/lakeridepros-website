import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ContactPage from '../page'
vi.mock('@/components/Turnstile', () => ({ default: ({ onSuccess }: { onSuccess: (token: string) => void }) => <button type="button" onClick={() => onSuccess('test-only')}>Verify test</button> }))
vi.mock('@/components/PhoneLink', () => ({ PhoneLink: () => <span>Call</span> }))
beforeEach(() => { vi.restoreAllMocks(); window.history.replaceState({}, '', '/contact'); window.dataLayer = [] })
function setup() {
  let now = 1000
  vi.spyOn(Date, 'now').mockImplementation(() => now)
  const view = render(<ContactPage />)
  now = 4000
  fireEvent.change(view.container.querySelector('[name="name"]')!, { target: { value: 'Private person' } })
  fireEvent.change(view.container.querySelector('[name="email"]')!, { target: { value: 'private@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: 'Verify test' }))
  return () => fireEvent.submit(screen.getByRole('form', { name: 'Contact form' }))
}
describe('contact milestone tracking', () => {
  it('tracks first edit once and submission only after backend acceptance', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }))
    const submit = setup()
    expect(window.dataLayer).toEqual([{ event: 'contact_form_start', form_id: 'contact' }])
    submit()
    await waitFor(() => expect(window.dataLayer).toContainEqual({ event: 'contact_form_submit', form_id: 'contact' }))
    expect(JSON.stringify(window.dataLayer)).not.toContain('private')
    vi.unstubAllGlobals()
  })
  it('does not count server rejection as a successful inquiry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Server rejection' }) }))
    setup()()
    await waitFor(() => expect(window.dataLayer).toContainEqual({ event: 'contact_form_error', form_id: 'contact', error_type: 'server' }))
    expect(window.dataLayer).not.toContainEqual({ event: 'contact_form_submit', form_id: 'contact' })
    vi.unstubAllGlobals()
  })
})
