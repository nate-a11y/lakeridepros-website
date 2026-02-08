import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID

interface CartItem {
  productId: string
  variantId: string
  quantity: number
  personalization?: string
}

export async function POST(request: NextRequest) {
  try {
    const { orderId: _orderId, orderNumber, cartItems, shippingAddress, customerEmail } = await request.json()

    if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
      console.log('Printify not configured - skipping order creation')
      return NextResponse.json({
        success: false,
        message: 'Printify not configured'
      })
    }

    // Map cart items to Printify line items
    const lineItems = await Promise.all(
      cartItems.map(async (item: CartItem) => {
        // Fetch product from Sanity by ID
        const productData = await client.fetch(
          `*[_type == "product" && _id == $id][0]`,
          { id: item.productId }
        )
        if (!productData) {
          throw new Error(`Failed to fetch product ${item.productId}`)
        }

        // Find the variant in the product
        const variant = productData.variants?.find((v: { sku: string; printifyVariantId?: string }) => v.sku === item.variantId)

        if (!variant || !variant.printifyVariantId) {
          throw new Error(`Printify variant ID not found for SKU: ${item.variantId}`)
        }

        const lineItem: {
          print_provider_id: number
          blueprint_id: number
          variant_id: number
          quantity: number
          metadata?: { personalization: string }
        } = {
          print_provider_id: parseInt(productData.printifyPrintProviderId),
          blueprint_id: parseInt(productData.printifyBlueprintId),
          variant_id: parseInt(variant.printifyVariantId),
          quantity: item.quantity,
        }

        // Add personalization if provided
        if (item.personalization) {
          lineItem.metadata = {
            personalization: item.personalization,
          }
        }

        return lineItem
      })
    )

    // Create Printify order
    const printifyOrderData = {
      external_id: orderNumber,
      label: orderNumber,
      line_items: lineItems,
      shipping_method: 1, // Standard shipping
      is_printify_express: false,
      send_shipping_notification: true,
      address_to: {
        first_name: shippingAddress.line1.split(' ')[0] || 'Customer',
        last_name: shippingAddress.line1.split(' ').slice(1).join(' ') || '',
        email: customerEmail,
        phone: '', // Add if collected
        country: shippingAddress.country,
        region: shippingAddress.state,
        address1: shippingAddress.line1,
        address2: shippingAddress.line2 || '',
        city: shippingAddress.city,
        zip: shippingAddress.postalCode,
      },
    }

    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printifyOrderData),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Printify API error:', errorData)
      throw new Error(`Printify API error: ${response.status}`)
    }

    const printifyOrder = await response.json()
    console.log('Printify order created:', printifyOrder.id)

    // Optionally: Send order to production immediately
    // (or let it stay in draft for manual approval)
    if (process.env.NODE_ENV === 'production') {
      await sendPrintifyOrderToProduction(printifyOrder.id)
    }

    return NextResponse.json({
      success: true,
      id: printifyOrder.id,
      status: printifyOrder.status,
    })

  } catch (error: unknown) {
    console.error('Printify order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create Printify order' },
      { status: 500 }
    )
  }
}

async function sendPrintifyOrderToProduction(orderId: string) {
  try {
    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/orders/${orderId}/send_to_production.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      console.log('Printify order sent to production:', orderId)
    } else {
      console.error('Failed to send order to production:', await response.text())
    }
  } catch (error) {
    console.error('Error sending order to production:', error)
  }
}
