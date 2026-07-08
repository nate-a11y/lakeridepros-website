import { NextRequest, NextResponse } from 'next/server'
import { createPrintifyOrder } from '@/lib/printify/orders'

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, cartItems, shippingAddress, customerEmail, customerName, customerPhone } = await request.json()
    const printifyOrder = await createPrintifyOrder({
      orderNumber,
      cartItems,
      shippingAddress,
      customerEmail,
      customerName,
      customerPhone,
    })

    console.log('Printify order created:', printifyOrder.id)

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
