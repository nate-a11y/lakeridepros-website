import { NextRequest, NextResponse } from 'next/server'
import { syncSupabaseDriverToSanity } from '@/lib/sync/driver-sync'

/**
 * Supabase → Sanity Driver Profile Sync
 *
 * Called by a Supabase database webhook when display fields on the `drivers` table change.
 * Pushes updated display fields to the corresponding Sanity driverProfile document.
 *
 * Supabase webhook config:
 *   URL: https://yourdomain.com/api/sync-driver-profile
 *   Method: POST
 *   Headers: { "x-sync-secret": "<DRIVER_SYNC_SECRET>" }
 *   Events: UPDATE
 *   Table: drivers
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the sync secret
    const syncSecret = request.headers.get('x-sync-secret')
    const expectedSecret = process.env.DRIVER_SYNC_SECRET

    if (!expectedSecret || syncSecret !== expectedSecret) {
      console.error('[Sync Driver] Invalid or missing sync secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()

    // Supabase webhooks send: { type, table, record, old_record, schema }
    const { type, table, record } = payload

    if (table !== 'drivers') {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    if (type !== 'UPDATE') {
      return NextResponse.json({ message: 'Ignored non-UPDATE event' }, { status: 200 })
    }

    if (!record) {
      return NextResponse.json({ error: 'Missing record' }, { status: 400 })
    }

    // Only sync if display-relevant fields changed
    const oldRecord = payload.old_record || {}
    const displayFields = ['name', 'bio', 'active', 'display_on_website', 'role', 'vehicles', 'assignment_number']
    const hasDisplayFieldChange = displayFields.some(
      field => JSON.stringify(record[field]) !== JSON.stringify(oldRecord[field])
    )

    if (!hasDisplayFieldChange) {
      return NextResponse.json({ message: 'No display field changes, skipping sync' }, { status: 200 })
    }

    await syncSupabaseDriverToSanity(record)

    return NextResponse.json({
      success: true,
      message: `Synced driver ${record.id} to Sanity`,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Sync Driver] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: String(err) },
      { status: 500 }
    )
  }
}
