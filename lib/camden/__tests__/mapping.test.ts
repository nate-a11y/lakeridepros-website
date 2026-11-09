import { expect, it } from 'vitest'
import { addressValue, mapContext, mapDashboard, mapParticipantSnapshots, mapRequest, numberValue, record, serializeCamdenRequestDraft, stringValue } from '../mapping'

it('normalizes untrusted primitive fields without treating arrays as records', () => {
  for (const value of [null, undefined, [], 'text', 42]) expect(record(value)).toEqual({})
  expect(record({ id: 'record' })).toEqual({ id: 'record' })
  expect(stringValue(42, 'fallback')).toBe('fallback')
  expect(stringValue('valid')).toBe('valid')
  expect(numberValue('25.5')).toBe(25.5); expect(numberValue('invalid', 7)).toBe(7)
  expect(addressValue({ address: 'Formatted address' })).toBe('Formatted address')
  expect(addressValue({ address_line1: '123 Example St', address_line2: 'Unit 1', city: 'Example', state: 'MO', postal_code: '65000' })).toBe('123 Example St, Unit 1, Example, MO 65000')
  expect(addressValue({ address_line1: '', state: null })).toBe('')
})

it('maps complete camelCase and legacy trip fields without losing costs or endpoints', () => {
  const request = mapRequest({ id: 'request-1', request_reference: 'CC-TEST', requestKind: 'ride', riderId: 'rider-1', riderName: 'Example Rider', rideTypeId: 'type-1', rideTypeName: 'Medical', rideDate: '2026-11-09', requestedPickupTime: '09:00', appointmentTime: '10:00', returnKind: 'scheduled', returnTime: '11:00', pickupLocationId: 'home', pickupName: 'Home', pickupAddress: '123 Example St', destinationLocationId: 'court', destinationName: 'Court', destinationAddress: '456 Example St', notes: 'Note', companion_count: '2', companion_details: 'Two companions', lateUrgent: true, createdAt: 'created', updatedAt: 'updated', assigneeName: 'Coordinator', riderVisibleExplanation: 'Confirmed', trips: [{ external_trip_id: 'trip-1', pickupAt: 'pickup', appointmentAt: 'appointment', returnAt: 'return', pickupName: 'Home', pickupAddress: '123 Example St', destinationName: 'Court', destinationAddress: '456 Example St', driverName: 'Driver', vehicleName: 'SUV', status_slug: 'completed', total_amount: '22.50' }, { pickup_date: '2026-11-09', pickup_time: '09:00', closed_status: 'closed' }, { cancelled: true }] })
  expect(request).toMatchObject({ id: 'request-1', reference: 'CC-TEST', riderId: 'rider-1', riderName: 'Example Rider', rideDate: '2026-11-09', returnKind: 'scheduled', returnTime: '11:00', companionCount: 2, companionDetails: 'Two companions', lateUrgent: true, assigneeName: 'Coordinator', riderVisibleExplanation: 'Confirmed', createdAt: 'created', updatedAt: 'updated' })
  expect(request.trips[0]).toEqual({ id: 'trip-1', externalTripId: 'trip-1', pickupAt: 'pickup', appointmentAt: 'appointment', returnAt: 'return', pickupName: 'Home', pickupAddress: '123 Example St', destinationName: 'Court', destinationAddress: '456 Example St', driverName: 'Driver', vehicleName: 'SUV', status: 'completed', cost: 22.5 })
  expect(request.trips[1]).toMatchObject({ pickupAt: '2026-11-09T09:00', status: 'closed' })
  expect(request.trips[2]).toMatchObject({ status: 'cancelled', cost: undefined })
})

it.each(['specific_time', 'call_when_ready', 'unknown'])('maps requested return type %s in active change proposals', type => {
  const result = mapRequest({ return_type: type, return_time: '13:00', rider_visible_explanation: 'Explanation', action_kind: 'change', action_status: 'requested', action_proposed_changes: { service_date: '2026-11-10', return_type: type, requested_return_time: '14:00' } })
  expect(result.returnKind).toBe(type === 'specific_time' ? 'scheduled' : type === 'call_when_ready' ? 'will_call' : undefined)
  expect(result.action?.proposedChanges?.returnKind).toBe(result.returnKind)
  expect(result.action?.proposedChanges?.returnTime).toBe('14:00')
  expect(result.returnTime).toBe('13:00'); expect(result.riderVisibleExplanation).toBe('Explanation')
})

it('does not attach change proposals to cancellations or unrecognized actions', () => {
  expect(mapRequest({ action_kind: 'cancellation', action_status: 'declined', action_proposed_changes: { service_date: '2026-11-10' } }).action).toMatchObject({ reasonLabel: 'Requested cancellation', proposedChanges: undefined })
  expect(mapRequest({ action_kind: 'other', action_status: 'requested' }).action).toBeNull()
  expect(mapRequest({ action_kind: 'change', action_status: 'other' }).action).toBeNull()
  expect(mapRequest(null).trips).toEqual([])
  expect(serializeCamdenRequestDraft({ direction: 'round_trip' })).toEqual({ direction: 'round_trip' })
})

it('maps identity aliases, nested contact data, policy versions and support settings', () => {
  expect(mapContext({ userId: 'user', displayName: 'Member', riderId: 'rider', supportPhone: '555', companionFieldsEnabled: true })).toMatchObject({ userId: 'user', displayName: 'Member', riderId: 'rider', supportPhone: '555', companionFieldsEnabled: true })
  const context = mapContext({ user_id: 'user', role: 'coordinator', rider: { id: 'rider', full_name: 'Nested name', normalized_phone: '555', email: 'rider@example.com' }, settings: { support_phone: 'support', companion_enabled: true }, current_policy: { id: 'policy', version: 2, title: 'Policy', body: 'Body', effective_at: '2026-11-09', accepted: true } })
  expect(context).toMatchObject({ displayName: 'Nested name', phone: '555', email: 'rider@example.com', policyAccepted: true, supportPhone: 'support', companionFieldsEnabled: true, currentPolicy: { version: '2', effectiveAt: '2026-11-09' } })
  expect(mapContext({ role: 'coordinator' }).displayName).toBe('Coordinator')
  expect(mapContext({ normalized_phone: '555', email: 'flat@example.com', support_phone: 'support', companion_fields_enabled: true, current_policy: { effectiveAt: 'today' } })).toMatchObject({ phone: '555', email: 'flat@example.com', currentPolicy: { version: '', effectiveAt: 'today' } })
})

it('maps dashboard options, notice periods and eligible change reasons with rider cost isolation', () => {
  const result = mapDashboard({ context: { role: 'rider' },
    pickup_locations: [{ id: 'home', name: 'Home', rider_id: 'rider', address: '123 Example St', is_default: true }, {}],
    categories: [{ id: 'medical', name: 'Medical' }], locations: [{ id: 'clinic', category_id: 'medical' }, {}],
    ride_types: [0, 60, 120, 1440, 2880].map((minimum_notice_minutes, id) => ({ id: String(id), name: 'Ride', minimum_notice_minutes, description: 'Details', same_day_allowed: true })),
    change_reasons: [{ id: 'change', kind: 'change', label: 'Time changed', requires_explanation: true }, { id: 'cancel', kind: 'cancellation' }, { kind: 'change' }, { id: 'invalid', kind: 'other' }],
    riders: [{ id: 'rider', full_name: 'Rider', normalized_phone: '555', email: 'rider@example.com' }, {}],
    requests: [{ id: 'request', pickup_label: 'Home', trips: [{ cost: 50 }] }],
  })
  expect(result.rideTypes.map(type => type.noticeSummary)).toEqual(['Submit as early as possible.', 'Please request at least 1 hour ahead.', 'Please request at least 2 hours ahead.', 'Please request at least 1 day ahead.', 'Please request at least 2 days ahead.'])
  expect(result.pickupLocations[0]).toMatchObject({ riderId: 'rider', name: 'Home', address: '123 Example St', isDefault: true })
  expect(result.pickupLocations[1].name).toBe('Pickup location')
  expect(result.destinations[0].category).toBe('Medical'); expect(result.destinations[1].category).toBeUndefined()
  expect(result.changeReasons.map(reason => reason.id)).toEqual(['change', 'cancel'])
  expect(result.riders[0]).toMatchObject({ phone: '555', email: 'rider@example.com' })
  expect(result.requests[0].trips[0].cost).toBeUndefined()
})

it('keeps roster and cost details coordinator-only and normalizes malformed snapshot fields', () => {
  const raw = { participants: [{ rider_id: 'rider', full_name: 'Example', phone: '555', email: 'rider@example.com', status: 'active', phase: 'phase_5', metrics: { total_cost: '75' }, home_locations: [{ id: 'home', name: 'Home', address_line1: '123 Example St', city: 'Example', is_primary: true }, {}], treatment_locations: [{ address: 'Clinic' }], drug_testing_sites: null, roster: { court_program: 'unrecognized', next_phase: 'invalid', phase_progress_status: 'invalid', transportation_eligibility: 'invalid', program_started_on: '2026-11-01', program_start_needs_review: true, treatment_provider: 'Provider', curfew: '20:00', source_home_address: 'Address' } }, {}] }
  const filter = { period: 'program_to_date' as const }
  const coordinator = mapParticipantSnapshots(raw, 'coordinator', filter)
  expect(coordinator.window.label).toBe('Program to date')
  expect(coordinator.participants[0]).toMatchObject({ roster: { courtProgram: undefined, nextPhase: undefined, phaseProgressStatus: 'active', transportationEligibility: 'pending', phaseStartedOn: '2026-11-01', phaseStartNeedsReview: true, treatmentProvider: 'Provider' }, metrics: { totalCost: 75 } })
  expect(coordinator.participants[1].profile.phase).toBe('Not assigned')
  const rider = mapParticipantSnapshots(raw, 'rider', filter)
  expect(rider.participants[0]).not.toHaveProperty('roster')
  expect(rider.participants[0].metrics).not.toHaveProperty('totalCost')
  expect(rider.participants[0].profile.homeLocations[0].address).toBe('123 Example St, Example')
})
