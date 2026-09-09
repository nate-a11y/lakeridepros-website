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
    [/^Availability \*/, 'Weekends, 20 hours weekly'], [/Earliest start date/, '2026-10-01'],
    [/Dispatch and customer service experience/, 'Phone scheduling'], [/Handling a delayed pickup/, 'Contact the driver and update the customer'],
  ] as const) fireEvent.change(screen.getByLabelText(label), { target: { value } })
  await user.click(screen.getByRole('button', { name: 'Verify test applicant' }))
  await user.click(screen.getByRole('button', { name: 'Submit application' }))
  expect(await screen.findByRole('heading', { name: 'Application Submitted!' })).toBeInTheDocument()
  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toBe('/api/careers/general-application')
  expect(JSON.parse(options.body)).toMatchObject({ positions: ['Dispatcher', 'Other'], otherPosition: 'Fleet support', availability: 'Weekends, 20 hours weekly', earliestStartDate: '2026-10-01', dispatchExperience: 'Phone scheduling' })
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

it('shows relevant role questions and clears answers on deselection', async () => {
  const user = userEvent.setup()
  render(<GeneralApplicationPage />)
  expect(screen.getByLabelText(/^Availability \*/)).toBeInTheDocument()
  expect(screen.getByLabelText(/Earliest start date/)).toHaveAttribute('type', 'date')
  expect(screen.queryByLabelText(/Vehicle detailing experience/)).not.toBeInTheDocument()
  await user.click(screen.getByRole('checkbox', { name: 'Part-Time Detailer' }))
  await user.click(screen.getByRole('checkbox', { name: 'Dispatcher' }))
  const fields = [/Vehicle detailing experience/, /Getting a vehicle guest-ready/, /Dispatch and customer service experience/, /Handling a delayed pickup/]
  for (const label of fields) fireEvent.change(screen.getByLabelText(label), { target: { value: 'Test answer' } })
  await user.click(screen.getByRole('checkbox', { name: 'Part-Time Detailer' }))
  expect(screen.queryByLabelText(fields[0])).not.toBeInTheDocument()
  expect(screen.getByLabelText(fields[2])).toHaveValue('Test answer')
  await user.click(screen.getByRole('checkbox', { name: 'Dispatcher' }))
  await user.click(screen.getByRole('checkbox', { name: 'Part-Time Detailer' }))
  await user.click(screen.getByRole('checkbox', { name: 'Dispatcher' }))
  for (const label of fields) expect(screen.getByLabelText(label)).toHaveValue('')
})
it('shows screening validation errors without submitting', async () => {
  const user = userEvent.setup()
  render(<GeneralApplicationPage />)
  await user.click(screen.getByRole('checkbox', { name: 'Part-Time Detailer' }))
  await user.click(screen.getByRole('button', { name: 'Submit application' }))
  expect(await screen.findByText('Please describe your availability')).toBeInTheDocument()
  expect(screen.getByText('Please enter a valid earliest start date')).toBeInTheDocument()
  expect(screen.getByLabelText(/Vehicle detailing experience/)).toHaveAttribute('aria-invalid', 'true')
  expect(fetchMock).not.toHaveBeenCalled()
})
