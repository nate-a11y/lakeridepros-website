import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email';

// ContactFormData type - not generated from Payload
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  _honeypot?: string;
  _timestamp?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Anti-bot validation: Check honeypot field
    if (body._honeypot) {
      console.log('Bot detected: honeypot field filled');
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Anti-bot validation: Check submission timing (must be at least 2 seconds)
    if (body._timestamp) {
      const timeSinceLoad = Date.now() - body._timestamp;
      if (timeSinceLoad < 2000) {
        console.log('Bot detected: form submitted too quickly');
        return NextResponse.json(
          { error: 'Please take your time to fill out the form' },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send notification email to contactus@lakeridepros.com with reply-to set to user's email
    const notificationSent = await sendContactNotification(
      body.name,
      body.email,
      body.message,
      body.phone,
      body.subject
    );

    // Send confirmation email to the user
    const confirmationSent = await sendContactConfirmation(
      body.name,
      body.email
    );

    // Log if emails failed to send, but still return success to user
    if (!notificationSent) {
      console.error('Failed to send contact notification email');
    }
    if (!confirmationSent) {
      console.error('Failed to send contact confirmation email');
    }

    // Return success even if email fails (we don't want to expose email issues to users)
    return NextResponse.json(
      { message: 'Thank you for your message! We\'ll get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
