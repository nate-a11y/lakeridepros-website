import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  isPromotionalPeriod,
  calculateBonusAmount,
  calculateTotalGiftCardValue,
} from '@/lib/gift-card-promotion'

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
    const {
      type,
      amount,
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      message,
      deliveryMethod,
      scheduledDeliveryDate,
      shippingAddress
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

    // Validate shipping address for physical cards
    if (type === 'physical') {
      if (!shippingAddress || !shippingAddress.name || !shippingAddress.street1 ||
          !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
        return NextResponse.json(
          { error: 'Complete shipping address is required for physical gift cards' },
          { status: 400 }
        )
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    // Check for promotional period and calculate bonus
    const isPromo = isPromotionalPeriod()
    const bonusAmount = isPromo ? calculateBonusAmount(amount) : 0
    const giftCardValue = calculateTotalGiftCardValue(amount, isPromo)

    // Build product description with promo info
    let productDescription = type === 'physical'
      ? 'Physical gift card shipped via USPS'
      : 'Digital gift card delivered via email'

    if (isPromo && bonusAmount > 0) {
      productDescription += ` - BONUS: $${giftCardValue} value for $${amount}!`
    }

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: isPromo && bonusAmount > 0
              ? `Lake Ride Pros ${type === 'physical' ? 'Physical' : 'Digital'} Gift Card - Holiday Bonus!`
              : `Lake Ride Pros ${type === 'physical' ? 'Physical' : 'Digital'} Gift Card`,
            description: productDescription,
            images: ['https://www.lakeridepros.com/images/gift-card-preview.png'],
          },
          unit_amount: Math.round(amount * 100), // Convert to cents (customer pays the purchase amount)
        },
        quantity: 1,
      },
    ]

    // Add shipping line item for physical cards
    if (type === 'physical') {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'USPS Shipping',
            description: 'Standard shipping for physical gift card',
          },
          unit_amount: 500, // $5.00 shipping
        },
        quantity: 1,
      })
    }

    // Build metadata
    const metadata: Record<string, string> = {
      type: 'gift-card',
      cardType: type || 'digital',
      amount: amount.toString(),
      purchaserName,
      purchaserEmail,
      recipientName: recipientName || '',
      recipientEmail: recipientEmail || '',
      message: message || '',
      deliveryMethod: deliveryMethod || 'immediate',
      scheduledDeliveryDate: scheduledDeliveryDate || '',
      // Promotion fields
      isPromotion: isPromo ? 'true' : 'false',
      bonusAmount: bonusAmount.toString(),
      giftCardValue: giftCardValue.toString(),
    }

    // Add shipping address to metadata for physical cards
    if (type === 'physical' && shippingAddress) {
      metadata.shippingName = shippingAddress.name
      metadata.shippingStreet1 = shippingAddress.street1
      metadata.shippingStreet2 = shippingAddress.street2 || ''
      metadata.shippingCity = shippingAddress.city
      metadata.shippingState = shippingAddress.state
      metadata.shippingZipCode = shippingAddress.zipCode
      metadata.shippingCountry = shippingAddress.country || 'United States'
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gift-cards`,
      customer_email: purchaserEmail,
      metadata,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error: unknown) {
    console.error('Gift card checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
