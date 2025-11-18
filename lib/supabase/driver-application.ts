/**
 * Supabase functions for driver application form
 * Works with existing driver_applications table schema
 */

import { createClient } from '@supabase/supabase-js'

// Create Supabase client for browser
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

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
    const supabase = getSupabaseClient()

    // Ensure status is draft
    const draftData = {
      ...data,
      status: 'draft' as const,
      updated_at: new Date().toISOString()
    }

    if (applicationId) {
      // Update existing draft
      const { data: updated, error } = await supabase
        .from('driver_applications')
        .update(draftData)
        .eq('id', applicationId)
        .eq('status', 'draft') // Only update if still in draft status
        .select()
        .single()

      if (error) {
        console.error('Error updating draft:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: updated, error: null }
    } else {
      // Create new draft
      const { data: created, error } = await supabase
        .from('driver_applications')
        .insert([draftData])
        .select()
        .single()

      if (error) {
        console.error('Error creating draft:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: created, error: null }
    }
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
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('driver_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error) {
      console.error('Error fetching application:', error)
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
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
 * @param auditInfo - IP address and user agent
 * @returns The submitted application
 */
export async function submitApplication(
  applicationId: string,
  data: Partial<DriverApplicationData>,
  auditInfo: { ip: string; userAgent: string }
): Promise<{ data: DriverApplicationData | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient()

    const submissionData = {
      ...data,
      status: 'submitted' as const,
      submission_ip: auditInfo.ip,
      submission_user_agent: auditInfo.userAgent,
      certification_signature_date: new Date().toISOString(),
      date_of_application: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }

    const { data: submitted, error } = await supabase
      .from('driver_applications')
      .update(submissionData)
      .eq('id', applicationId)
      .eq('status', 'draft') // Only submit if still in draft status
      .select()
      .single()

    if (error) {
      console.error('Error submitting application:', error)
      return { data: null, error: new Error(error.message) }
    }

    return { data: submitted, error: null }
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
    const supabase = getSupabaseClient()

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.')
      }
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        url: null,
        error: new Error('File size exceeds 10MB limit.')
      }
    }

    // Create unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${applicationId}/license_${side}_${timestamp}.${extension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('driver-applications')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return { url: null, error: new Error(error.message) }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('driver-applications')
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
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
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('driver_applications')
      .delete()
      .eq('id', applicationId)
      .eq('status', 'draft') // Only delete if in draft status

    if (error) {
      console.error('Error deleting draft:', error)
      return { success: false, error: new Error(error.message) }
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
