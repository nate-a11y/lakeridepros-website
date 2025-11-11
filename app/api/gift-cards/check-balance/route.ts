import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Gift card code is required' },
        { status: 400 }
      )
    }

    // Normalize the code (uppercase, trim)
    const normalizedCode = code.trim().toUpperCase()

    // Call Payload CMS API to get gift card data
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001'

    const response = await fetch(`${payloadUrl}/api/gift-cards?where[code][equals]=${normalizedCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch gift card data')
    }

    const data = await response.json()

    // Check if gift card exists
    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json(
        { error: 'Gift card not found. Please check your code and try again.' },
        { status: 404 }
      )
    }

    const giftCard = data.docs[0]

    // Check if gift card is active
    if (giftCard.status !== 'active') {
      return NextResponse.json(
        { error: 'This gift card is no longer active.' },
        { status: 400 }
      )
    }

    // Return gift card data
    return NextResponse.json({
      code: giftCard.code,
      balance: giftCard.currentBalance || 0,
      originalAmount: giftCard.initialAmount || giftCard.currentBalance,
      purchasedDate: giftCard.createdAt,
      expirationDate: 'Never', // Gift cards never expire
      status: giftCard.status,
    })

  } catch (error: any) {
    console.error('Gift card balance check error:', error)
    return NextResponse.json(
      { error: 'An error occurred while checking the gift card balance. Please try again.' },
      { status: 500 }
    )
  }
}
