import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ServerCamdenPortalService } from '../server/service'
import type { CamdenRequestDraft, CamdenChangeProposal } from '../types'

const { gateway } = vi.hoisted(() => ({ gateway: vi.fn() }))
vi.mock('../server/gateway', () => ({ callCamdenGateway: gateway }))
const service = new ServerCamdenPortalService('test-session')
const draft: CamdenRequestDraft = { rideTypeId: 'type-1', rideDate: '2026-11-09', requestedPickupTime: '09:00', appointmentTime: '10:00', direction: 'one_way', pickupLocationId: 'pickup-1', destinationLocationId: 'destination-1' }
const serialized = { ride_type_id: 'type-1', service_date: '2026-11-09', requested_pickup_time: '09:00', appointment_time: '10:00', direction: 'one_way', return_type: null, requested_return_time: null, pickup_location_id: 'pickup-1', destination_location_id: 'destination-1' }
const address = { address_line1: '123 Example St', city: 'Example', state: 'MO', postal_code: '65000' }
const proposal: CamdenChangeProposal = { ...draft, notes: 'Example', companionCount: 0, companionDetails: '' }

beforeEach(() => { gateway.mockReset().mockResolvedValue({ id: 'action-1', message: 'Queued' }) })
afterEach(() => vi.useRealTimers())

it.each([
  ['create_request', () => service.submitRequest(draft), { request: serialized }],
  ['update_request', () => service.updatePendingRequest('request-1', 7, { notes: 'Changed' }), { request_id: 'request-1', expected_version: 7, patch: { rider_notes: 'Changed' } }],
  ['duplicate_request', () => service.duplicateRequest('request-1', { rideDate: '2026-11-10' }), { source_request_id: 'request-1', patch: { service_date: '2026-11-10' } }],
  ['add_message', () => service.addMessage('request-1', 'Example'), { request_id: 'request-1', body: 'Example' }],
  ['request_change', () => service.createFollowup('request-1', 7, 'change', 'reason-1'), { request_id: 'request-1', expected_version: 7, reason_id: 'reason-1', explanation: null }],
  ['request_cancel', () => service.createFollowup('request-1', 7, 'cancellation', 'reason-1', 'Example'), { request_id: 'request-1', expected_version: 7, reason_id: 'reason-1', explanation: 'Example' }],
  ['request_change_proposal', () => service.createChangeProposal('request-1', 7, 'reason-1', 'Example', proposal), { request_id: 'request-1', expected_version: 7, reason_id: 'reason-1', explanation: 'Example', proposal: { ...serialized, rider_notes: 'Example', companion_count: 0, companion_details: '' } }],
  ['transition_followup', () => service.transitionFollowup('request-1', 7, 'completed'), { request_id: 'request-1', expected_version: 7, new_status: 'completed', public_explanation: null }],
  ['transition_followup', () => service.transitionFollowup('request-1', 7, 'declined', 'Example'), { request_id: 'request-1', expected_version: 7, new_status: 'declined', public_explanation: 'Example' }],
  ['transition_request', () => service.transitionRequest('request-1', 'confirmed', 7), { request_id: 'request-1', expected_version: 7, new_status: 'confirmed', public_explanation: null }],
  ['transition_request', () => service.transitionRequest('request-1', 'confirmed', 7, 'Example'), { request_id: 'request-1', expected_version: 7, new_status: 'confirmed', public_explanation: 'Example' }],
  ['create_location_request', () => service.requestLocation('Example', address), { name: 'Example', address, notes: null }],
  ['create_location_request', () => service.requestLocation('Example', address, 'Gate'), { name: 'Example', address, notes: 'Gate' }],
  ['accept_policy', () => service.acceptPolicy('policy-1'), { ip_hash: null, user_agent: null }],
  ['accept_policy', () => service.acceptPolicy('policy-1', { ipHash: 'test-hash', userAgent: 'Test' }), { ip_hash: 'test-hash', user_agent: 'Test' }],
  ['update_profile', () => service.updateProfile({}), { patch: { email: null } }],
  ['update_profile', () => service.updateProfile({ email: 'rider@example.com' }), { patch: { email: 'rider@example.com' } }],
] as const)('forwards %s with the session and exact optimistic-concurrency payload', async (operation, run, payload) => {
  expect(await run()).toEqual({ id: 'action-1', message: 'Queued' })
  expect(gateway).toHaveBeenCalledWith('test-session', operation, payload)
})

it('uses safe action defaults and propagates gateway failures', async () => {
  gateway.mockResolvedValueOnce(null)
  expect(await service.addMessage('request-1', 'Example')).toEqual({ id: '', message: 'Saved' })
  gateway.mockRejectedValueOnce(new Error('Version conflict'))
  await expect(service.updateProfile({})).rejects.toThrow('Version conflict')
})

it('forwards optional dashboard status and maps empty responses safely', async () => {
  gateway.mockResolvedValue({})
  expect((await service.getContext()).role).toBe('rider')
  await service.getDashboard(); expect(gateway).toHaveBeenLastCalledWith('test-session', 'dashboard', { status: null })
  await service.getDashboard('pending'); expect(gateway).toHaveBeenLastCalledWith('test-session', 'dashboard', { status: 'pending' })
  expect((await service.getCoordinatorDashboard()).summary).toEqual({ requestCount: 0, pendingCount: 0, needsAttentionCount: 0, confirmedCount: 0, monthSpend: 0, contractSpend: 0 })
})

it('calculates coordinator totals and excludes the retired draft-invoice register', async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  gateway.mockResolvedValue({ context: { role: 'coordinator' }, requests: [
    { id: 'pending', status: 'pending', service_date: '2026-11-09', trips: [{ cost: 25 }] },
    { id: 'confirmed', status: 'confirmed', service_date: '2026-10-01', trips: [{ cost: 50 }] },
    { id: 'attention', status: 'needs_information', service_date: '2026-11-10', trips: [{}] },
    { id: 'followup', status: 'confirmed', service_date: '2026-11-11', action_kind: 'change', action_status: 'requested' },
  ], invoices: [{ id: 'invoice-1', period_start: '2026-11-01', period_end: '2026-11-30', invoice_number: 'EXAMPLE', invoice_url: 'https://example.com/invoice' }, {}] })
  const result = await service.getCoordinatorDashboard()
  expect(result.summary).toEqual({ requestCount: 4, pendingCount: 1, needsAttentionCount: 2, confirmedCount: 2, monthSpend: 25, contractSpend: 75 })
  expect(result.invoices).toEqual([])
})

it.each(['rider', 'coordinator', 'lrp_operator'] as const)('maps request messages and enforces the %s cost/phone boundary', async role => {
  gateway.mockImplementation(async (_session, operation) => operation === 'current_context'
    ? { portal_identity_id: 'current', role, display_name: 'Current user' }
    : { request: { id: 'request-1', requested_location_text: 'Requested place' }, rider: { full_name: 'Example Rider', normalized_phone: '+15555550123' },
      ride_type: { name: 'Medical' }, pickup_location: { label: 'Home', ...address }, destination_location: { name: 'Court', address: '456 Example St' },
      trips: [{ id: 'trip-1', cost: 25 }], messages: [
        { id: 'self', author_portal_identity_id: 'current', body: 'Self' },
        { id: 'rider', author_role: 'rider' }, { id: 'staff', author_role: 'lrp_admin' },
        { id: 'unknown' }, { id: 'named', author_role: 'coordinator', author_name: 'Named coordinator' },
      ] })
  const detail = await service.getRequest('request-1')
  expect(detail.request).toMatchObject({ pickupName: 'Home', destinationName: 'Court' })
  expect(detail.request.trips[0].cost).toBe(role === 'rider' ? undefined : 25)
  expect(detail.riderPhone).toBe(role === 'coordinator' ? '+15555550123' : undefined)
  expect(detail.messages[0].authorName).toBe('Current user')
  expect(detail.messages[1].authorName).toBe('Example Rider')
  expect(detail.messages[2].authorName).toBe('Lake Ride Pros')
  expect(detail.messages[4].authorName).toBe('Named coordinator')
})

it('maps a legacy unwrapped request with missing optional message and rider fields', async () => {
  gateway.mockImplementation(async (_session, operation) => operation === 'current_context' ? { role: 'coordinator' } : { id: 'legacy', requested_location_text: 'Custom destination' })
  const detail = await service.getRequest('legacy')
  expect(detail.request.id).toBe('legacy'); expect(detail.messages).toEqual([]); expect(detail.riderPhone).toBeUndefined()
})

it.each(['rider', 'coordinator'] as const)('scopes %s participant snapshots to the requested dates and eligibility', async role => {
  gateway.mockImplementation(async (_session, operation) => operation === 'current_context' ? { role } : {})
  const filter = { period: 'custom' as const, startDate: '2026-11-01', endDate: '2026-11-30', transportationEligibility: 'all' as const }
  expect((await service.getParticipantSnapshots(filter)).role).toBe(role)
  expect(gateway).toHaveBeenCalledWith('test-session', 'participant_snapshots', { start_date: '2026-11-01', end_date: '2026-11-30', approved_only: false })
  await service.getParticipantSnapshots({ ...filter, transportationEligibility: 'approved' })
  expect(gateway).toHaveBeenLastCalledWith('test-session', 'participant_snapshots', { start_date: '2026-11-01', end_date: '2026-11-30', approved_only: true })
})
