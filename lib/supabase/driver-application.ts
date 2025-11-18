/**
 * Supabase functions for driver application form
 * Uses server-side API routes to bypass RLS policies
 */

export interface DriverApplicationData {
  id?: string
  created_at?: string
  updated_at?: string
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

  // Personal Information
  first_name?: string
  middle_name?: string
  last_name?: string
  email?: string
  phone?: string
  date_of_birth?: string
  ssn_encrypted?: string
  address_street?: string
  address_city?: string
  address_state?: string
  address_zip?: string
  date_of_application?: string
  position_applied?: string
  date_available?: string
  legal_right_to_work?: boolean

  // Residence History
  residences?: Array<{
    street: string
    city: string
    state: string
    zip: string
    years_at_address?: number
    from_date?: string
    to_date?: string
    is_current: boolean
  }>

  // License Verification
  current_license_state?: string
  current_license_number?: string
  current_license_class?: string
  current_license_expiration?: string
  license_revoked_past_3_years?: boolean
  accidents_past_3_years?: boolean
  accidents_explanation?: string
  authorize_license_record_check?: boolean
  license_verification_signature?: string
  license_verification_signature_date?: string

  // All Licenses
  licenses?: Array<{
    state: string
    number: string
    type_class: string
    endorsements?: string
    expiration_date: string
    is_current: boolean
  }>
  certify_one_license?: boolean

  // Driving Experience
  driving_experience?: Array<{
    class_of_equipment: string
    type: string
    date_from: string
    date_to?: string
    miles?: number
  }>

  // Accidents
  accidents?: Array<{
    date: string
    nature: string
    fatalities: number
    injuries: number
    chemical_spills: boolean
  }>

  // Traffic Convictions
  traffic_convictions?: Array<{
    date: string
    violation: string
    state: string
    penalty: string
  }>

  // License Denials/Suspensions
  license_denied?: boolean
  license_denied_explanation?: string
  license_suspended?: boolean
  license_suspended_explanation?: string

  // Employment History
  employment_history?: Array<{
    name: string
    phone: string
    address: string
    position: string
    from_date: string
    to_date?: string
    reason_leaving?: string
    salary?: string
    subject_to_fmcsr: boolean
    subject_to_dot_testing: boolean
    gap_explanation?: string
  }>

  // Education
  education?: Array<{
    school_name: string
    location: string
    course_of_study?: string
    years_completed?: number
    graduated: boolean
    details?: string
  }>

  // Other Qualifications
  other_qualifications?: string

  // Document Uploads
  license_front_url?: string
  license_back_url?: string

  // Final Certification
  certification_signature?: string
  certification_signature_date?: string
  certification_name_printed?: string

  // Audit
  submission_ip?: string
  submission_user_agent?: string
}

/**
 * Save or update a draft application
 * @param data - Application data to save
 * @param applicationId - Optional ID for updating existing draft
 * @returns The saved application with ID
 */
export async function saveDraft(
  data: Partial<DriverApplicationData>,
  applicationId?: string
): Promise<{ data: DriverApplicationData | null; error: Error | null }> {
  try {
    // Use server-side API route to bypass RLS
    const response = await fetch('/api/driver-application/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId,
        data
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error saving draft:', result.error)
      return { data: null, error: new Error(result.error || 'Failed to save draft') }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Unexpected error in saveDraft:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Get an application by ID
 * @param applicationId - The application ID
 * @returns The application data
 */
export async function getApplicationById(
  applicationId: string
): Promise<{ data: DriverApplicationData | null; error: Error | null }> {
  try {
    // Use server-side API route to bypass RLS
    const response = await fetch(`/api/driver-application/draft?id=${applicationId}`)
    const result = await response.json()

    if (!response.ok) {
      console.error('Error fetching application:', result.error)
      return { data: null, error: new Error(result.error || 'Failed to fetch application') }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Unexpected error in getApplicationById:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Submit an application (change status from draft to submitted)
 * @param applicationId - The application ID
 * @param data - Final application data
 * @param auditInfo - IP address and user agent (optional, will be determined server-side)
 * @returns The submitted application
 */
export async function submitApplication(
  applicationId: string,
  data: Partial<DriverApplicationData>,
  auditInfo?: { ip: string; userAgent: string }
): Promise<{ data: DriverApplicationData | null; error: Error | null }> {
  try {
    // Use server-side API route to bypass RLS and capture IP/user agent
    const response = await fetch('/api/driver-application/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId,
        data
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error submitting application:', result.error)
      return { data: null, error: new Error(result.error || 'Failed to submit application') }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Unexpected error in submitApplication:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Upload a license image to Supabase Storage
 * @param applicationId - The application ID (used for folder organization)
 * @param file - The file to upload
 * @param side - 'front' or 'back'
 * @returns The public URL of the uploaded file
 */
export async function uploadLicenseImage(
  applicationId: string,
  file: File,
  side: 'front' | 'back'
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Use server-side API route to bypass storage RLS
    const formData = new FormData()
    formData.append('file', file)
    formData.append('applicationId', applicationId)
    formData.append('side', side)

    const response = await fetch('/api/driver-application/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error uploading file:', result.error)
      return { url: null, error: new Error(result.error || 'Failed to upload file') }
    }

    return { url: result.url, error: null }
  } catch (error) {
    console.error('Unexpected error in uploadLicenseImage:', error)
    return {
      url: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Delete a draft application
 * @param applicationId - The application ID to delete
 */
export async function deleteDraft(
  applicationId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Use server-side API route to bypass RLS
    const response = await fetch(`/api/driver-application/draft?id=${applicationId}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error deleting draft:', result.error)
      return { success: false, error: new Error(result.error || 'Failed to delete draft') }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in deleteDraft:', error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Get client IP address (to be used with server-side API)
 */
export function getClientInfo() {
  return {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    // IP will be determined server-side
    timestamp: new Date().toISOString()
  }
}
