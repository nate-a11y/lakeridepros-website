import { NextRequest, NextResponse } from 'next/server'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderNumber, cartItems, shippingAddress, customerEmail } = await request.json()

    if (!PRINTIFY_TOKEN || !PRINTIFY_SHOP_ID) {
      console.log('Printify not configured - skipping order creation')
      return NextResponse.json({
        success: false,
        message: 'Printify not configured'
      })
    }

    // Map cart items to Printify line items
    const lineItems = await Promise.all(
      cartItems.map(async (item: any) => {
        // Fetch product from Payload to get Printify IDs
        const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001'
        const productResponse = await fetch(`${payloadUrl}/api/products/${item.productId}`)

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product ${item.productId}`)
        }

        const productData = await productResponse.json()

        // Find the variant in the product
        const variant = productData.doc.variants?.find((v: any) => v.sku === item.variantId)

        if (!variant || !variant.printifyVariantId) {
          throw new Error(`Printify variant ID not found for SKU: ${item.variantId}`)
        }

        return {
          print_provider_id: parseInt(productData.doc.printifyPrintProviderId),
          blueprint_id: parseInt(productData.doc.printifyBlueprintId),
          variant_id: parseInt(variant.printifyVariantId),
          quantity: item.quantity,
        }
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

  } catch (error: any) {
    console.error('Printify order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create Printify order' },
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
