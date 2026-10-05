import { describe, expect, it } from 'vitest'
import { Schema } from '@sanity/schema'
import { validateDocument } from '@sanity/validation'
import driverProfile from '../driverProfile'

// Driver Portal src/constants/directory.js VEHICLE_TYPES contract.
// Preserve exact stored values: the directory sync does not normalize them.
const portalVehicles = ['Flex', 'Elite', 'LRP Black', 'suburban', 'limo_bus', 'rescue_squad', 'sprinter', 'shuttle', 'pink_patrol']
const vehicleField = driverProfile.fields.find(field => field.name === 'vehicles')!
const member = (vehicleField as { of: Array<{ options: { list: Array<{ title: string; value: string }> } }> }).of[0]
// Compile the actual changed field in isolation: slug/image built-ins require
// the full Studio workspace and are unrelated to vehicle-choice validation.
const schema = Schema.compile({ name: 'driver-profile-regression', types: [{
  name: 'driverProfileVehicles', type: 'document', fields: [vehicleField],
}] })

async function validateVehicle(vehicle: string, compiledSchema = schema) {
  return validateDocument({
    schema: compiledSchema,
    document: {
      _id: 'driver-profile-schema-test', _type: 'driverProfileVehicles', _rev: 'test',
      _createdAt: '2026-10-04T00:00:00Z', _updatedAt: '2026-10-04T00:00:00Z',
      vehicles: [vehicle],
    },
  })
}

describe('Driver Profile vehicle choices', () => {
  it('supports all portal assignments and retains the legacy shuttle choice', () => {
    const values = member.options.list.map(option => option.value)
    expect(values).toEqual(expect.arrayContaining([...portalVehicles, 'shuttle_bus']))
    expect(new Set(values).size).toBe(values.length)
    expect(vehicleField.readOnly).toBeTypeOf('function')
  })

  it.each([...portalVehicles, 'shuttle_bus'])('validates the unchanged synced assignment %s', async vehicle => {
    const result = await validateVehicle(vehicle)
    expect(result.status).toBe('passed')
    expect(result.markers).toEqual([])
  })

  it('still rejects assignments outside the supported choices', async () => {
    const result = await validateVehicle('unsupported-vehicle')
    expect(result.status).toBe('failed')
    expect(result.markers.some(marker => marker.path[0] === 'vehicles')).toBe(true)
  })

  it.each(['Flex', 'Elite'])('reproduces the old missing-choice error for %s', async vehicle => {
    const previousSchema = Schema.compile({ name: 'previous-driver-profile', types: [{
      name: 'driverProfileVehicles', type: 'document', fields: [{
        ...vehicleField,
        of: [{ ...member, options: { list: member.options.list.filter(option => !['Flex', 'Elite'].includes(option.value)) } }],
      }],
    }] })
    expect((await validateVehicle(vehicle, previousSchema)).status).toBe('failed')
  })
})
