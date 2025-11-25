import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendOrderConfirmation, sendOwnerOrderNotification, sendOwnerGiftCardNotification } from '../email'

// Create mock send function that we can access in tests
const mockSend = vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null })

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      }
    },
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

      const result = await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      // Function catches error and returns false
      expect(result).toBe(false)
    })

    it('includes correct order information', async () => {
      await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'customer@example.com',
          subject: 'Order Confirmation - ORD-123456',
          from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
          replyTo: 'contactus@lakeridepros.com',
        })
      )
    })

    it('formats order items correctly in email HTML', async () => {
      await sendOrderConfirmation(
        'customer@example.com',
        'John Doe',
        'ORD-123456',
        109.97,
        mockOrderItems
      )

      const callArgs = mockSend.mock.calls[0][0]
      const html = callArgs.html as string

      expect(html).toContain('John Doe')
      expect(html).toContain('ORD-123456')
      expect(html).toContain('Test Product')
      expect(html).toContain('$109.97')
    })

    it('returns false on email send error', async () => {
      mockSend.mockResolvedValueOnce({ data: null, error: { message: 'Send failed' } })

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
      await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'owners@lakeridepros.com',
          subject: '🛍️ New Shop Order - ORD-123456',
        })
      )
    })

    it('includes shipping address in email', async () => {
      await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      const html = mockSend.mock.calls[0][0].html as string

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

    it('returns false when Resend API throws an error', async () => {
      mockSend.mockRejectedValueOnce(new Error('API error'))

      const result = await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      expect(result).toBe(false)
    })

    it('returns false on email send error', async () => {
      mockSend.mockResolvedValueOnce({ data: null, error: { message: 'Send failed' } })

      const result = await sendOwnerOrderNotification(
        'ORD-123456',
        'John Doe',
        'customer@example.com',
        109.97,
        mockOrderItems,
        mockShippingAddress
      )

      expect(result).toBe(false)
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

      const html = mockSend.mock.calls[0][0].html as string

      expect(html).toContain('GC-ABC123')
      expect(html).toContain('Digital')
      expect(html).toContain('$100.00')
      expect(html).toContain('Immediate delivery')
    })

    it('formats scheduled gift card correctly', async () => {
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

      const html = mockSend.mock.calls[0][0].html as string

      expect(html).toContain('Scheduled')
    })

    it('formats physical gift card correctly', async () => {
      await sendOwnerGiftCardNotification(
        'Pending',
        'physical',
        50.00,
        'John Doe',
        'john@example.com',
        null,
        null
      )

      const html = mockSend.mock.calls[0][0].html as string

      expect(html).toContain('Physical')
      expect(html).toContain('$50.00')
      expect(html).toContain('pending fulfillment')
    })

    it('indicates gift vs personal use', async () => {
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

      let html = mockSend.mock.calls[0][0].html as string
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

      html = mockSend.mock.calls[0][0].html as string
      expect(html).toContain('personal use')
    })

    it('includes correct subject line with amount', async () => {
      await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        75.50,
        'John Doe',
        'john@example.com',
        null,
        null
      )

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: '🎁 New Gift Card Purchase - $75.50',
        })
      )
    })

    it('returns false when Resend API throws an error', async () => {
      mockSend.mockRejectedValueOnce(new Error('API error'))

      const result = await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com'
      )

      expect(result).toBe(false)
    })

    it('returns false when RESEND_API_KEY is missing', async () => {
      delete process.env.RESEND_API_KEY

      const result = await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com'
      )

      expect(result).toBe(false)
    })

    it('returns false on email send error', async () => {
      mockSend.mockResolvedValueOnce({ data: null, error: { message: 'Send failed' } })

      const result = await sendOwnerGiftCardNotification(
        'GC-ABC123',
        'digital',
        100.00,
        'John Doe',
        'john@example.com',
        'Jane Doe',
        'jane@example.com'
      )

      expect(result).toBe(false)
    })
  })
})
