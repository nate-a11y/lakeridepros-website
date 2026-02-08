import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const CRON_SECRET = process.env.GIFT_CARD_CRON_SECRET || 'change-me-in-production'

export async function POST(request: NextRequest) {
  try {
    // Verify secret for security
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find all scheduled gift cards that are ready to be sent
    const now = new Date()
    const giftCards = await writeClient.fetch(
      groq`*[_type == "giftCard" && type == "digital" && deliveryMethod == "scheduled" && deliveryStatus == "pending" && scheduledDeliveryDate <= $now][0...100]`,
      { now: now.toISOString() }
    )

    const results = {
      total: giftCards.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const giftCard of giftCards) {
      try {
        // Send the gift card email
        const sendToEmail = giftCard.recipientEmail || giftCard.purchaserEmail
        const sendToName = giftCard.recipientName || giftCard.purchaserName

        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/email/send-gift-card`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            giftCard,
            recipientName: sendToName,
            recipientEmail: sendToEmail,
            purchaserName: giftCard.purchaserName,
            message: giftCard.message,
          }),
        })

        // Update gift card status to sent
        await writeClient.patch(giftCard._id).set({
          deliveryStatus: 'sent',
          sentDate: new Date().toISOString(),
        }).commit()

        results.sent++
        console.log(`Sent scheduled gift card: ${giftCard.code}`)
      } catch (error) {
        results.failed++
        results.errors.push(`${giftCard.code}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        console.error(`Failed to send gift card ${giftCard.code}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} scheduled gift cards (${results.sent} sent, ${results.failed} failed)`,
      results,
    })
  } catch (error) {
    console.error('Scheduled gift card delivery error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
