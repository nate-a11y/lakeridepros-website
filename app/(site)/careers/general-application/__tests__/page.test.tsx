import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import GeneralApplicationPage from '../page'

vi.mock('@/components/Turnstile', () => ({ default: ({ onSuccess }: { onSuccess: (token: string) => void }) => <button type="button" onClick={() => onSuccess('test-token')}>Verify test applicant</button> }))
const fetchMock = vi.fn()
beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response(JSON.stringify({ message: 'Application submitted successfully.' })))
  vi.stubGlobal('fetch', fetchMock)
})

it('offers general staff roles without adding driver to the non-driver application', () => {
  render(<GeneralApplicationPage />)
  expect(screen.getByRole('heading', { name: 'General Application' })).toBeInTheDocument()
  for (const name of ['Sales', 'Brand Ambassador', 'Part-Time Detailer', 'Dispatcher', 'Other']) {
    expect(screen.getByRole('checkbox', { name })).toBeInTheDocument()
  }
  expect(screen.queryByRole('checkbox', { name: /driver/i })).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /driver application/i })).toHaveAttribute('href', '/careers/driver-application')
})

it('submits multiple staff roles and the specified Other interest', async () => {
  const user = userEvent.setup()
  render(<GeneralApplicationPage />)
  await user.click(screen.getByRole('checkbox', { name: 'Dispatcher' }))
  await user.click(screen.getByRole('checkbox', { name: 'Other' }))
  for (const [label, value] of [
    [/other position/i, 'Fleet support'], [/Full Name/, 'Test Applicant'], [/^Email/, 'applicant@example.com'],
    [/^Phone/, '5735550101'], [/^City, State/, 'Camdenton, MO'], [/Tell us about yourself/, 'I enjoy helping customers.'],
    [/Previous Work Experience/, 'Customer service experience.'],
  ] as const) fireEvent.change(screen.getByLabelText(label), { target: { value } })
  await user.click(screen.getByRole('button', { name: 'Verify test applicant' }))
  await user.click(screen.getByRole('button', { name: 'Submit application' }))
  expect(await screen.findByRole('heading', { name: 'Application Submitted!' })).toBeInTheDocument()
  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toBe('/api/careers/general-application')
  expect(JSON.parse(options.body)).toMatchObject({ positions: ['Dispatcher', 'Other'], otherPosition: 'Fleet support' })
})

it('requires an Other description and clears it when Other is deselected', async () => {
  const user = userEvent.setup()
  render(<GeneralApplicationPage />)
  await user.click(screen.getByRole('checkbox', { name: 'Other' }))
  await user.click(screen.getByRole('button', { name: 'Submit application' }))
  expect(await screen.findByText('Please specify the other position you are interested in')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/other position/i), { target: { value: 'Fleet support' } })
  await user.click(screen.getByRole('checkbox', { name: 'Other' }))
  await user.click(screen.getByRole('checkbox', { name: 'Other' }))
  expect(screen.getByLabelText(/other position/i)).toHaveValue('')
  expect(fetchMock).not.toHaveBeenCalled()
})
