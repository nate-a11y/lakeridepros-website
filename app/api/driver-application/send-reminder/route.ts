/**
 * API Route: Send Draft Reminder
 * Sends a reminder email to applicants with incomplete draft applications
 * Includes secure link to resume their application
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateResumeUrl } from '@/lib/resume-link'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { applicationId, email, firstName, lastName } = await request.json()

    if (!applicationId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate resume link
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lakeridepros.com'
    const resumeUrl = generateResumeUrl(applicationId, email, baseUrl)

    const applicantName = firstName && lastName ? `${firstName} ${lastName}` : 'there'

    // Send reminder email
    const emailResult = await resend.emails.send({
      from: 'Lake Ride Pros <noreply@lakeridepros.com>',
      to: email,
      subject: 'Complete Your Driver Application - Lake Ride Pros',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Complete Your Driver Application</h2>

          <p>Hi ${applicantName},</p>

          <p>We noticed you started a driver employment application with Lake Ride Pros but haven't finished it yet.</p>

          <p>Good news! Your progress has been saved, and you can continue right where you left off.</p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">
              Click the button below to resume your application:
            </p>
            <a
              href="${resumeUrl}"
              style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;"
            >
              Resume Application
            </a>
            <p style="margin: 15px 0 0 0; font-size: 11px; color: #64748b;">
              This link will expire in 3 days
            </p>
          </div>

          <p><strong>Your Application ID:</strong> <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${applicationId}</code></p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            We're excited about the possibility of you joining our team! If you have any questions or need assistance,
            please don't hesitate to contact us.
          </p>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Questions?</p>
            <p style="margin: 0;">Email: <a href="mailto:owners@lakeridepros.com" style="color: #2563eb;">owners@lakeridepros.com</a></p>
            <p style="margin: 5px 0 0 0;">Phone: <a href="tel:+15735522628" style="color: #2563eb;">(573) 552-2628</a></p>
          </div>

          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Lake Ride Pros Hiring Team</strong>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If you didn't start this application or no longer wish to proceed, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      emailId: emailResult.data?.id,
      resumeUrl
    })
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
