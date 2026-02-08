/**
 * Bi-directional sync between Sanity driverProfile and Supabase drivers table.
 * Only syncs public display fields — never touches sensitive HR data.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhwnlzborisjihhauchp.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1hcdphjr'
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN || ''
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01`

// Display fields that are synced between systems
const SYNCED_FIELDS = ['name', 'bio', 'active', 'display_on_website', 'role', 'vehicles', 'assignment_number'] as const

/**
 * Sanity → Supabase: Called when a driverProfile is created or updated in Sanity Studio.
 * Updates or inserts only the display fields in Supabase.
 */
export async function syncDriverProfileToSupabase(sanityDoc: Record<string, unknown>) {
  // Skip if this change came FROM Supabase (prevents infinite loop)
  if (sanityDoc.lastSyncSource === 'supabase') {
    console.log('[Driver Sync] Skipping Sanity→Supabase: change originated from Supabase')
    return
  }

  if (!SUPABASE_SERVICE_KEY) {
    console.error('[Driver Sync] Missing SUPABASE_SERVICE_ROLE_KEY env var')
    return
  }

  // Map Sanity field names → Supabase column names
  const displayData: Record<string, unknown> = {}
  if (sanityDoc.name !== undefined) displayData.name = sanityDoc.name
  if (sanityDoc.bio !== undefined) displayData.bio = sanityDoc.bio
  if (sanityDoc.active !== undefined) displayData.active = sanityDoc.active
  if (sanityDoc.displayOnWebsite !== undefined) displayData.display_on_website = sanityDoc.displayOnWebsite
  if (sanityDoc.role !== undefined) displayData.role = sanityDoc.role
  if (sanityDoc.vehicles !== undefined) displayData.vehicles = sanityDoc.vehicles
  if (sanityDoc.assignmentNumber !== undefined) displayData.assignment_number = sanityDoc.assignmentNumber

  const supabaseId = sanityDoc.supabaseId as string | undefined

  if (supabaseId) {
    // UPDATE existing Supabase driver
    if (Object.keys(displayData).length === 0) {
      console.log('[Driver Sync] No display fields changed, skipping')
      return
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/drivers?id=eq.${supabaseId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(displayData),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[Driver Sync] Sanity→Supabase update failed: ${res.status} ${text}`)
      return
    }

    console.log(`[Driver Sync] Sanity→Supabase: Updated driver ${supabaseId}`, Object.keys(displayData))
  } else {
    // INSERT new Supabase driver (created in Sanity first)
    if (!displayData.name) {
      console.log('[Driver Sync] Cannot create Supabase driver without a name')
      return
    }

    // Set defaults for required Supabase fields
    const insertData = {
      ...displayData,
      display_on_website: displayData.display_on_website ?? true,
      active: displayData.active ?? true,
      role: displayData.role || ['driver'],
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/drivers`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(insertData),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[Driver Sync] Sanity→Supabase insert failed: ${res.status} ${text}`)
      return
    }

    const [newDriver] = await res.json()
    const newSupabaseId = newDriver?.id

    console.log(`[Driver Sync] Sanity→Supabase: Created new driver ${newSupabaseId}`)

    // Link the Sanity profile back to the new Supabase record
    if (newSupabaseId && sanityDoc._id) {
      await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [{
            patch: {
              id: sanityDoc._id as string,
              set: {
                supabaseId: newSupabaseId,
                lastSyncSource: 'sanity',
                lastSyncedAt: new Date().toISOString(),
              },
            },
          }],
        }),
      })
      console.log(`[Driver Sync] Linked Sanity profile ${sanityDoc._id} → Supabase ${newSupabaseId}`)
      return
    }
  }

  // Update Sanity to mark sync source (prevents loop on next webhook)
  if (sanityDoc._id) {
    await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{
          patch: {
            id: sanityDoc._id as string,
            set: {
              lastSyncSource: 'sanity',
              lastSyncedAt: new Date().toISOString(),
            },
          },
        }],
      }),
    })
  }
}

/**
 * Supabase → Sanity: Called when a driver is inserted, updated, or deleted in Supabase.
 * Creates, updates, or deletes the corresponding Sanity driverProfile.
 */
export async function syncSupabaseDriverToSanity(supabaseDriver: Record<string, unknown>, eventType: 'INSERT' | 'UPDATE' | 'DELETE' = 'UPDATE') {
  const driverId = supabaseDriver.id as string
  if (!driverId) {
    console.error('[Driver Sync] Missing driver id')
    return
  }

  if (!SANITY_WRITE_TOKEN) {
    console.error('[Driver Sync] Missing SANITY_API_WRITE_TOKEN env var')
    return
  }

  // Find existing Sanity profile by supabaseId
  const query = encodeURIComponent(`*[_type=="driverProfile" && supabaseId=="${driverId}"][0]{_id, lastSyncSource}`)
  const queryRes = await fetch(`${SANITY_API_URL}/data/query/${SANITY_DATASET}?query=${query}`, {
    headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
  })
  const queryData = await queryRes.json()
  const existingProfile = queryData.result

  // Handle DELETE
  if (eventType === 'DELETE') {
    if (existingProfile) {
      await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [{ delete: { id: existingProfile._id } }],
        }),
      })
      console.log(`[Driver Sync] Supabase→Sanity: Deleted profile ${existingProfile._id} for driver ${driverId}`)
    }
    return
  }

  // Handle INSERT — create new Sanity profile
  if (eventType === 'INSERT' && !existingProfile) {
    const name = supabaseDriver.name as string
    if (!name) {
      console.log('[Driver Sync] Cannot create Sanity profile without a name')
      return
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newDoc: Record<string, unknown> = {
      _id: `driverProfile-${driverId}`,
      _type: 'driverProfile',
      name,
      slug: { _type: 'slug', current: slug },
      supabaseId: driverId,
      displayOnWebsite: supabaseDriver.display_on_website ?? true,
      active: supabaseDriver.active ?? true,
      lastSyncSource: 'supabase',
      lastSyncedAt: new Date().toISOString(),
    }
    if (supabaseDriver.bio) newDoc.bio = supabaseDriver.bio
    if (supabaseDriver.role) newDoc.role = supabaseDriver.role
    if (supabaseDriver.vehicles) newDoc.vehicles = supabaseDriver.vehicles
    if (supabaseDriver.assignment_number) newDoc.assignmentNumber = supabaseDriver.assignment_number

    const mutRes = await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: newDoc }],
      }),
    })

    if (!mutRes.ok) {
      const text = await mutRes.text()
      console.error(`[Driver Sync] Supabase→Sanity insert failed: ${mutRes.status} ${text}`)
      return
    }

    console.log(`[Driver Sync] Supabase→Sanity: Created profile driverProfile-${driverId} for "${name}"`)
    return
  }

  // Handle UPDATE
  if (!existingProfile) {
    // Profile doesn't exist yet — treat as INSERT
    return syncSupabaseDriverToSanity(supabaseDriver, 'INSERT')
  }

  // Skip if the last change came from Sanity (prevents infinite loop)
  if (existingProfile.lastSyncSource === 'sanity') {
    await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{
          patch: {
            id: existingProfile._id,
            set: { lastSyncSource: 'supabase', lastSyncedAt: new Date().toISOString() },
          },
        }],
      }),
    })
    console.log('[Driver Sync] Skipping Supabase→Sanity: change originated from Sanity')
    return
  }

  // Map Supabase column names → Sanity field names
  const sanityUpdate: Record<string, unknown> = {
    lastSyncSource: 'supabase',
    lastSyncedAt: new Date().toISOString(),
  }
  if (supabaseDriver.name !== undefined) sanityUpdate.name = supabaseDriver.name
  if (supabaseDriver.bio !== undefined) sanityUpdate.bio = supabaseDriver.bio
  if (supabaseDriver.active !== undefined) sanityUpdate.active = supabaseDriver.active
  if (supabaseDriver.display_on_website !== undefined) sanityUpdate.displayOnWebsite = supabaseDriver.display_on_website
  if (supabaseDriver.role !== undefined) sanityUpdate.role = supabaseDriver.role
  if (supabaseDriver.vehicles !== undefined) sanityUpdate.vehicles = supabaseDriver.vehicles
  if (supabaseDriver.assignment_number !== undefined) sanityUpdate.assignmentNumber = supabaseDriver.assignment_number

  // Generate slug from name if name changed
  if (sanityUpdate.name) {
    sanityUpdate.slug = {
      _type: 'slug',
      current: (sanityUpdate.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }
  }

  const mutRes = await fetch(`${SANITY_API_URL}/data/mutate/${SANITY_DATASET}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: existingProfile._id,
          set: sanityUpdate,
        },
      }],
    }),
  })

  if (!mutRes.ok) {
    const text = await mutRes.text()
    console.error(`[Driver Sync] Supabase→Sanity failed: ${mutRes.status} ${text}`)
    return
  }

  console.log(`[Driver Sync] Supabase→Sanity: Updated profile ${existingProfile._id}`, Object.keys(sanityUpdate))
}
