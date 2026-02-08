import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

interface CartItem {
  productId: string | number
  variantId: string
  productName: string
  variantName: string
  image: string
  price: number
  quantity: number
  size?: string
  color?: string
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  })
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()

  try {
    const ip = getClientIp(request)
    const { success } = rateLimit(`stripe-checkout:${ip}`, { limit: 10, windowMs: 60000 })
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      )
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
          description: item.variantName,
          images: [item.image],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
            size: item.size || '',
            color: item.color || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Calculate if free shipping applies (over $50)
    const subtotal = items.reduce((sum: number, item: CartItem) =>
      sum + (item.price * item.quantity), 0
    )

    const shippingCost = subtotal >= 50 ? 0 : 5.99

    // Add shipping as line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping (7-14 business days)',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US'], // Add more countries as needed
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      customer_email: undefined, // Let customer enter email
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true, // Stripe calculates tax automatically
      },
      metadata: {
        cartItems: JSON.stringify(items.map((item: CartItem) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }))),
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
