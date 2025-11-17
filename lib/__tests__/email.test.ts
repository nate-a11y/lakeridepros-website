import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendOrderConfirmation, sendOwnerOrderNotification, sendOwnerGiftCardNotification } from '../email'

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
      },
    })),
  }
})

describe('Email Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'test_resend_key'
  })

  describe('sendOrderConfirmation', () => {
    const mockOrderItems = [
      {
        productName: 'Test Product',
        variantName: 'Medium / Blue',
        quantity: 2,
        price: 29.99,
      },
      {
        productName: 'Another Product',
        variantName: 'Large / Red',
        quantity: 1,
        price: 49.99,
      },
    ]

    it('sends order confirmation email successfully', async () => {
      const result = await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      expect(result).toBe(true)
    })

    it('handles missing RESEND_API_KEY', async () => {
      delete process.env.RESEND_API_KEY

      await expect(
        sendOrderConfirmation(
          'customer@example.com',
          'John Doe',
          'ORD-123456',
          109.97,
          mockOrderItems
        )
      ).rejects.toThrow('RESEND_API_KEY is not set')
    })

    it('includes correct order information', async () => {
      const { Resend } = await import('resend')
      await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'customer@example.com',
          subject: 'Order Confirmation - ORD-123456',
          from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
          replyTo: 'contactus@lakeridepros.com',
        })
      )
    })

    it('formats order items correctly in email HTML', async () => {
      const { Resend } = await import('resend')
      await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      const callArgs = sendMock.mock.calls[0][0]
      const html = callArgs.html as string

      expect(html).toContain('John Doe')
      expect(html).toContain('ORD-123456')
      expect(html).toContain('Test Product')
      expect(html).toContain('$109.97')
    })

    it('returns false on email send error', async () => {
      const { Resend } = await import('resend')
      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      sendMock.mockResolvedValueOnce({ data: null, error: { message: 'Send failed' } })

      const result = await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      expect(result).toBe(false)
    })
  })

  describe('sendOwnerOrderNotification', () => {
    const mockOrderItems = [
      {
        productName: 'Test Product',
        variantName: 'Medium / Blue',
        quantity: 2,
        price: 29.99,
      },
    ]

    const mockShippingAddress = {
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'MO',
      postalCode: '65801',
      country: 'US',
    }

    it('sends owner notification email successfully', async () => {
      const result = await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      expect(result).toBe(true)
    })

    it('sends to owners email address', async () => {
      const { Resend } = await import('resend')
      await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'owners@lakeridepros.com',
          subject: '🛍️ New Shop Order - ORD-123456',
        })
      )
    })

    it('includes shipping address in email', async () => {
      const { Resend } = await import('resend')
      await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      const html = sendMock.mock.calls[0][0].html as string

      expect(html).toContain('123 Main St')
      expect(html).toContain('Apt 4B')
      expect(html).toContain('Springfield')
      expect(html).toContain('MO')
      expect(html).toContain('65801')
    })

    it('handles shipping address without line2', async () => {
      const addressWithoutLine2 = { ...mockShippingAddress, line2: undefined }

      const result = await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        addressWithoutLine2
      )

      expect(result).toBe(true)
    })
  })

  describe('sendOwnerGiftCardNotification', () => {
    it('sends gift card notification successfully', async () => {
      const result = await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com',
        'immediate',
        null
      )

      expect(result).toBe(true)
    })

    it('formats digital gift card correctly', async () => {
      const { Resend } = await import('resend')
      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com',
        'immediate',
        null
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      const html = sendMock.mock.calls[0][0].html as string

      expect(html).toContain('GC-ABC123')
      expect(html).toContain('Digital')
      expect(html).toContain('$100.00')
      expect(html).toContain('Immediate delivery')
    })

    it('formats scheduled gift card correctly', async () => {
      const { Resend } = await import('resend')
      const scheduledDate = '2024-12-25'

      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com',
        'scheduled',
        scheduledDate
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      const html = sendMock.mock.calls[0][0].html as string

      expect(html).toContain('Scheduled')
    })

    it('formats physical gift card correctly', async () => {
      const { Resend } = await import('resend')
      await sendOwnerGiftCardNotification(
        'Pending',
        'physical',
        50.00,
        'John Doe',
        'john@example.com',
        null,
        null
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      const html = sendMock.mock.calls[0][0].html as string

      expect(html).toContain('Physical')
      expect(html).toContain('$50.00')
      expect(html).toContain('pending fulfillment')
    })

    it('indicates gift vs personal use', async () => {
      const { Resend } = await import('resend')

      // Gift for someone else
      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com'
      )

      let mockResend = new Resend()
      let sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      let html = sendMock.mock.calls[0][0].html as string
      expect(html).toContain('Jane Doe')
      expect(html).toContain('jane@example.com')

      vi.clearAllMocks()

      // Personal use (same email)
      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        null,
        null
      )

      mockResend = new Resend()
      sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>
      html = sendMock.mock.calls[0][0].html as string
      expect(html).toContain('personal use')
    })

    it('includes correct subject line with amount', async () => {
      const { Resend } = await import('resend')
      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        75.50,
        'John Doe',
        'john@example.com',
        null,
        null
      )

      const mockResend = new Resend()
      const sendMock = mockResend.emails.send as ReturnType<typeof vi.fn>

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: '🎁 New Gift Card Purchase - $75.50',
        })
      )
    })
  })
})
