import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  try {
    const {
      amount,
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      message
    } = await request.json()

    // Validation
    if (!amount || amount < 10 || amount > 1000) {
      return NextResponse.json(
        { error: 'Gift card amount must be between $10 and $1,000' },
        { status: 400 }
      )
    }

    if (!purchaserName || !purchaserEmail) {
      return NextResponse.json(
        { error: 'Purchaser name and email are required' },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lake Ride Pros Gift Card',
              description: `Gift card for luxury transportation services`,
              images: ['https://www.lakeridepros.com/images/gift-card-preview.png'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gift-cards`,
      customer_email: purchaserEmail,
      metadata: {
        type: 'gift-card',
        amount: amount.toString(),
        purchaserName,
        purchaserEmail,
        recipientName: recipientName || '',
        recipientEmail: recipientEmail || '',
        message: message || '',
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error: any) {
    console.error('Gift card checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
