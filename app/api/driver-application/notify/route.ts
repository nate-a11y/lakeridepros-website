/**
 * API Route: Driver Application Email & SMS Notifications
 * Sends notification to owners@lakeridepros.com and confirmation to applicant
 * Uses existing Resend integration for email and Supabase Edge Function for SMS
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
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

    // Send notification to owners
    const ownerNotification = await resend.emails.send({
      from: 'Lake Ride Pros <noreply@lakeridepros.com>',
      to: 'owners@lakeridepros.com',
      subject: `New Driver Application: ${applicantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">New Driver Application Received</h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Applicant Name:</strong> ${applicantName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${applicantEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Application ID:</strong> ${applicationId}</p>
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>A new driver employment application has been submitted and is ready for review.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This application complies with 49 CFR 391.21 federal regulations.
              Please review the application in your admin dashboard.
            </p>
          </div>
        </div>
      `
    })

    // Send confirmation to applicant
    const applicantConfirmation = await resend.emails.send({
      from: 'Lake Ride Pros <noreply@lakeridepros.com>',
      to: applicantEmail,
      subject: 'Driver Application Received - Lake Ride Pros',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Application Received!</h2>

          <p>Dear ${applicantName},</p>

          <p>Thank you for submitting your driver employment application with Lake Ride Pros. We have successfully received your application and will review it shortly.</p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Your Application ID:</strong></p>
            <p style="font-family: monospace; font-size: 18px; color: #1e40af; margin: 0;">${applicationId}</p>
          </div>

          <p><strong>What happens next?</strong></p>
          <ol style="line-height: 1.8;">
            <li>Our hiring team will review your application within 2-3 business days</li>
            <li>We'll verify your driving record and conduct necessary background checks</li>
            <li>If your application meets our requirements, we'll contact you to schedule an interview</li>
          </ol>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Questions?</p>
            <p style="margin: 0;">Email: <a href="mailto:owners@lakeridepros.com" style="color: #2563eb;">owners@lakeridepros.com</a></p>
            <p style="margin: 5px 0 0 0;">Phone: <a href="tel:+15735522628" style="color: #2563eb;">(573) 552-2628</a></p>
          </div>

          <p>We appreciate your interest in joining the Lake Ride Pros team!</p>

          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Lake Ride Pros Hiring Team</strong>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Lake Ride Pros is an equal opportunity employer committed to diversity and inclusion.
              All employment decisions are made without regard to race, color, religion, sex, national origin,
              age, disability, veteran status, or any other legally protected status.
            </p>
          </div>
        </div>
      `
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
            message: `Lake Ride Pros: Your driver application has been received! Application ID: ${applicationId.slice(0, 8)}... We'll review your application within 2-3 business days. Questions? Call (573) 552-2628`
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
      ownerEmailId: ownerNotification.data?.id,
      applicantEmailId: applicantConfirmation.data?.id,
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
