/**
 * API Route: Driver Application Email & SMS Notifications
 * Sends notification to nate@lakeridepros.com and confirmation to applicant
 * Uses new notification helper functions with logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendApplicationConfirmation } from '@/lib/notifications/send-application-confirmation'
import { sendAdminNotification } from '@/lib/notifications/send-admin-notification'
import { createClient } from '@supabase/supabase-js'

const SMS_FUNCTION_URL = 'https://dhwnlzborisjihhauchp.supabase.co/functions/v1/send-sms'

export async function POST(request: NextRequest) {
  try {
    const { applicationId, applicantName, applicantEmail, applicantPhone } = await request.json()

    if (!applicationId || !applicantName || !applicantEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get full application data from Supabase for notifications
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: application, error: fetchError } = await supabase
      .from('driver_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (fetchError || !application) {
      console.error('Error fetching application:', fetchError)
      // Continue with basic data if fetch fails
    }

    // Parse applicant name
    const [firstName, ...lastNameParts] = applicantName.split(' ')
    const lastName = lastNameParts.join(' ')

    // Calculate years of experience
    let yearsExperience = 0
    if (application?.driving_experience && Array.isArray(application.driving_experience)) {
      const totalMonths = application.driving_experience.reduce((sum: number, exp: any) => {
        const start = new Date(exp.date_from)
        const end = exp.date_to ? new Date(exp.date_to) : new Date()
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
        return sum + months
      }, 0)
      yearsExperience = Math.floor(totalMonths / 12)
    }

    // Check for CDL
    const hasCDL = application?.current_license_class?.includes('CDL') ||
                   application?.current_license_class?.includes('A') ||
                   application?.current_license_class?.includes('B')

    // Send confirmation to applicant
    const applicantConfirmationResult = await sendApplicationConfirmation({
      applicationId,
      firstName: firstName,
      lastName: lastName,
      email: applicantEmail,
      submittedAt: new Date().toISOString()
    })

    // Send notification to admin
    const adminNotificationResult = await sendAdminNotification({
      applicationId,
      firstName: firstName,
      lastName: lastName,
      email: applicantEmail,
      phone: applicantPhone,
      submittedAt: new Date().toISOString(),
      currentLicenseState: application?.current_license_state,
      currentLicenseNumber: application?.current_license_number,
      yearsExperience,
      hasCDL
    })

    // Send SMS confirmation to applicant (if phone provided)
    let smsResult = null
    if (applicantPhone) {
      try {
        const smsResponse = await fetch(SMS_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            to: applicantPhone,
            message: `Lake Ride Pros: Your driver application has been received! Application ID: ${applicationId.slice(0, 8)}... We'll review your application within 3-5 business days. Questions? Call (573) 552-2628`
          })
        })

        if (smsResponse.ok) {
          const smsData = await smsResponse.json()
          smsResult = { success: true, data: smsData }
          console.log('SMS sent successfully:', smsData)
        } else {
          const errorText = await smsResponse.text()
          console.error('SMS send failed:', errorText)
          smsResult = { success: false, error: errorText }
        }
      } catch (smsError) {
        console.error('Error sending SMS:', smsError)
        smsResult = { success: false, error: smsError instanceof Error ? smsError.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      success: true,
      applicantEmail: applicantConfirmationResult,
      adminEmail: adminNotificationResult,
      sms: smsResult
    })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send email notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
