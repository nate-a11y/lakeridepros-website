import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmation, sendOwnerOrderNotification, sendOwnerGiftCardNotification } from '@/lib/email'
import { getPayload } from 'payload'
import config from '@payload-config'

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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripe, event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    console.log('Processing completed checkout:', session.id)

    // Check if this is a gift card purchase
    if (session.metadata?.type === 'gift-card') {
      await handleGiftCardPurchase(session)
      return
    }

    // Otherwise handle regular product order
    // Retrieve full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product', 'customer_details', 'shipping_details'],
    })

    const lineItems = fullSession.line_items?.data || []
    const customerEmail = fullSession.customer_details?.email
    const customerName = fullSession.customer_details?.name
    const shippingAddress = (fullSession as any).shipping_details?.address

    if (!customerEmail || !customerName || !shippingAddress) {
      console.error('Missing customer or shipping information')
      return
    }

    // Parse cart items from metadata
    let cartItems = []
    try {
      cartItems = JSON.parse(fullSession.metadata?.cartItems || '[]')
    } catch (error) {
      console.error('Failed to parse cart items:', error)
    }

    // Calculate totals
    const amountTotal = fullSession.amount_total || 0
    const amountSubtotal = fullSession.amount_subtotal || 0
    const amountShipping = (fullSession.total_details?.amount_shipping || 0)
    const amountTax = (fullSession.total_details?.amount_tax || 0)

    // Create order in Payload CMS using Local API
    const payload = await getPayload({ config })

    const orderData = {
      stripePaymentIntentId: fullSession.payment_intent as string,
      stripeCheckoutSessionId: session.id,
      customerEmail,
      customerName,
      shippingAddress: {
        line1: shippingAddress.line1 || '',
        line2: shippingAddress.line2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postal_code || '',
        country: shippingAddress.country || 'US',
      },
      items: cartItems,
      subtotal: amountSubtotal / 100,
      shipping: amountShipping / 100,
      tax: amountTax / 100,
      total: amountTotal / 100,
      status: 'processing',
    }

    // Use Local API with overrideAccess to bypass admin-only restriction
    const order = await payload.create({
      collection: 'orders',
      data: orderData,
      overrideAccess: true, // Bypass access control - safe because Stripe signature verified
    })

    console.log('Order created:', order.orderNumber)

    // Send order to Printify (next step)
    await sendToPrintify(order, cartItems, shippingAddress, customerEmail)

    // Send confirmation email to customer
    await sendOrderConfirmationEmail(order, customerEmail, customerName)

    // Send notification email to owners
    await sendOwnerOrderNotification(
      order.orderNumber,
      customerName,
      customerEmail,
      order.total,
      cartItems,
      orderData.shippingAddress
    )

  } catch (error) {
    console.error('Error handling checkout session:', error)
  }
}

async function sendToPrintify(order: any, cartItems: any[], shippingAddress: any, customerEmail: string) {
  try {
    // This will be implemented in the next prompt
    console.log('Sending order to Printify:', order.orderNumber)

    // Call Printify API endpoint (to be created)
    const response = await fetch('/api/printify/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: order.id,
        orderNumber: order.orderNumber,
        cartItems,
        shippingAddress,
        customerEmail,
      }),
    })

    if (response.ok) {
      const printifyOrder = await response.json()
      console.log('Printify order created:', printifyOrder.id)

      // Update order with Printify order ID using Local API
      const payload = await getPayload({ config })
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          printifyOrderId: printifyOrder.id,
        },
        overrideAccess: true, // Bypass access control
      })
    }

  } catch (error) {
    console.error('Error sending to Printify:', error)
  }
}

async function sendOrderConfirmationEmail(order: any, customerEmail: string, customerName: string) {
  try {
    await sendOrderConfirmation(
      customerEmail,
      customerName,
      order.orderNumber,
      order.total,
      order.items
    )
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
}

async function handleGiftCardPurchase(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing gift card purchase:', session.id)

    const cardType = session.metadata?.cardType || 'digital'
    const amount = parseFloat(session.metadata?.amount || '0')
    const purchaserName = session.metadata?.purchaserName || ''
    const purchaserEmail = session.metadata?.purchaserEmail || ''
    const recipientName = session.metadata?.recipientName || null
    const recipientEmail = session.metadata?.recipientEmail || null
    const message = session.metadata?.message || null
    const deliveryMethod = session.metadata?.deliveryMethod || 'immediate'
    const scheduledDeliveryDate = session.metadata?.scheduledDeliveryDate || null

    // Create gift card in Payload CMS using Local API
    const payload = await getPayload({ config })

    const giftCardData: any = {
      type: cardType,
      initialAmount: amount,
      currentBalance: amount,
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      message,
      status: 'active',
      stripePaymentIntentId: session.payment_intent as string,
      stripeCheckoutSessionId: session.id,
    }

    // Add delivery info for digital cards
    if (cardType === 'digital') {
      giftCardData.deliveryMethod = deliveryMethod
      giftCardData.deliveryStatus = deliveryMethod === 'scheduled' ? 'pending' : 'pending'
      if (scheduledDeliveryDate) {
        giftCardData.scheduledDeliveryDate = scheduledDeliveryDate
      }
    }

    // Add shipping address for physical cards
    if (cardType === 'physical') {
      giftCardData.shippingAddress = {
        name: session.metadata?.shippingName || '',
        street1: session.metadata?.shippingStreet1 || '',
        street2: session.metadata?.shippingStreet2 || '',
        city: session.metadata?.shippingCity || '',
        state: session.metadata?.shippingState || '',
        zipCode: session.metadata?.shippingZipCode || '',
        country: session.metadata?.shippingCountry || 'United States',
      }
      giftCardData.fulfillmentStatus = 'pending'
    }

    // Use Local API with overrideAccess to bypass admin-only restriction
    const giftCard = await payload.create({
      collection: 'gift-cards',
      data: giftCardData,
      overrideAccess: true, // Bypass access control - safe because Stripe signature verified
    })

    console.log('Gift card created:', cardType === 'digital' ? giftCard.code : 'pending fulfillment')

    // Send emails based on card type and delivery method
    if (cardType === 'digital') {
      if (deliveryMethod === 'immediate') {
        // Send gift card email immediately
        await sendGiftCardEmail(
          giftCard,
          purchaserName,
          purchaserEmail,
          recipientName,
          recipientEmail,
          message
        )
      } else {
        // Send purchase confirmation for scheduled cards
        await sendScheduledGiftCardConfirmation(
          purchaserName,
          purchaserEmail,
          amount,
          scheduledDeliveryDate,
          recipientName,
          recipientEmail,
          message
        )
      }
    } else {
      // Send order confirmation for physical cards
      await sendPhysicalGiftCardConfirmation(
        purchaserName,
        purchaserEmail,
        amount,
        giftCardData.shippingAddress
      )
    }

    // Send notification email to owners
    await sendOwnerGiftCardNotification(
      giftCard.code || 'Pending',
      cardType,
      amount,
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      deliveryMethod,
      scheduledDeliveryDate
    )

  } catch (error) {
    console.error('Error handling gift card purchase:', error)
  }
}

async function sendGiftCardEmail(
  giftCard: any,
  purchaserName: string,
  purchaserEmail: string,
  recipientName: string | null,
  recipientEmail: string | null,
  message: string | null
) {
  try {
    console.log('Sending gift card email')

    // If recipient email provided, send to recipient
    // Otherwise send to purchaser
    const sendToEmail = recipientEmail || purchaserEmail
    const sendToName = recipientName || purchaserName

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Call email API (create this next)
    await fetch(`${siteUrl}/api/email/send-gift-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giftCard,
        recipientName: sendToName,
        recipientEmail: sendToEmail,
        purchaserName,
        message,
      }),
    })

  } catch (error) {
    console.error('Error sending gift card email:', error)
  }
}

async function sendPhysicalGiftCardConfirmation(
  purchaserName: string,
  purchaserEmail: string,
  amount: number,
  shippingAddress: any
) {
  try {
    console.log('Sending physical gift card order confirmation')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Send order confirmation email (you can implement a separate email template)
    const response = await fetch(`${siteUrl}/api/email/send-physical-gift-card-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchaserName,
        purchaserEmail,
        amount,
        shippingAddress,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send physical gift card confirmation email')
    }

  } catch (error) {
    console.error('Error sending physical gift card confirmation:', error)
  }
}

async function sendScheduledGiftCardConfirmation(
  purchaserName: string,
  purchaserEmail: string,
  amount: number,
  scheduledDate: string | null,
  recipientName: string | null,
  recipientEmail: string | null,
  message: string | null
) {
  try {
    console.log('Sending scheduled gift card purchase confirmation')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Send purchase confirmation email for scheduled delivery
    const response = await fetch(`${siteUrl}/api/email/send-scheduled-gift-card-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchaserName,
        purchaserEmail,
        amount,
        scheduledDate,
        recipientName,
        recipientEmail,
        message,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send scheduled gift card confirmation email')
    }

  } catch (error) {
    console.error('Error sending scheduled gift card confirmation:', error)
  }
}
