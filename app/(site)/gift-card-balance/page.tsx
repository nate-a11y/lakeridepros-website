'use client'

import { useState } from 'react'
import { Search, CreditCard, DollarSign, Calendar, AlertCircle } from 'lucide-react'

export default function GiftCardBalancePage() {
  const [giftCardCode, setGiftCardCode] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [cardData, setCardData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBalance(null)
    setCardData(null)

    try {
      // Call Payload CMS API to get gift card data
      const response = await fetch(`/api/gift-cards/check-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: giftCardCode.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gift card not found')
      }

      setBalance(data.balance)
      setCardData(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-lrp-green py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Gift Card Balance Checker
          </h1>
          <p className="text-white/90 text-center mt-4 text-lg">
            Check your Lake Ride Pros gift card balance
          </p>
        </div>
      </section>

      {/* Balance Checker */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Info Card */}
          <div className="bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <CreditCard className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-lrp-black dark:text-white mb-2">
                  How to Check Your Balance
                </h2>
                <p className="text-lrp-black dark:text-dark-text-secondary">
                  Enter your gift card code below to check your remaining balance. Your gift card code
                  can be found on your physical card or in your email confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Balance Checker Form */}
          <div className="bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg p-8">
            <form onSubmit={checkBalance} className="space-y-6">
              <div>
                <label
                  htmlFor="giftCardCode"
                  className="block text-lg font-semibold text-lrp-black dark:text-white mb-3"
                >
                  Gift Card Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="giftCardCode"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    placeholder="Enter your gift card code (e.g., LRP-XXXX-XXXX)"
                    className="w-full px-4 py-4 pr-12 rounded-lg border-2 border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white focus:border-lrp-green focus:ring-2 focus:ring-lrp-green/20 outline-none transition-all text-lg"
                    required
                    minLength={8}
                    aria-describedby="code-help"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-lrp-text-muted dark:text-dark-text-muted" />
                </div>
                <p id="code-help" className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mt-2">
                  Gift card codes are not case-sensitive
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !giftCardCode.trim()}
                className="w-full bg-lrp-green hover:bg-lrp-green-dark disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking Balance...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check Balance
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                      Gift Card Not Found
                    </p>
                    <p className="text-red-600 dark:text-red-300 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Display */}
            {balance !== null && cardData && (
              <div className="mt-8 bg-white dark:bg-dark-bg-primary border-2 border-lrp-green rounded-lg p-6">
                <div className="text-center mb-6">
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary text-sm mb-2">
                    Current Balance
                  </p>
                  <p className="text-5xl font-bold text-lrp-green">
                    ${balance.toFixed(2)}
                  </p>
                </div>

                <div className="border-t border-neutral-200 dark:border-dark-border pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-lrp-green" />
                      <span className="text-lrp-black dark:text-dark-text-secondary">Gift Card Code</span>
                    </div>
                    <span className="font-semibold text-lrp-black dark:text-white">
                      {cardData.code}
                    </span>
                  </div>

                  {cardData.originalAmount && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-lrp-green" />
                        <span className="text-lrp-black dark:text-dark-text-secondary">Original Amount</span>
                      </div>
                      <span className="font-semibold text-lrp-black dark:text-white">
                        ${cardData.originalAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {cardData.purchasedDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lrp-green" />
                        <span className="text-lrp-black dark:text-dark-text-secondary">Purchased</span>
                      </div>
                      <span className="font-semibold text-lrp-black dark:text-white">
                        {new Date(cardData.purchasedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {cardData.expirationDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lrp-green" />
                        <span className="text-lrp-black dark:text-dark-text-secondary">Expires</span>
                      </div>
                      <span className="font-semibold text-lrp-black dark:text-white">
                        {cardData.expirationDate === 'Never'
                          ? 'Never'
                          : new Date(cardData.expirationDate).toLocaleDateString()
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-lrp-green/10 dark:bg-lrp-green/20 rounded-lg p-4">
                  <p className="text-sm text-lrp-black dark:text-dark-text-secondary text-center">
                    Ready to use your gift card? Book your luxury ride today!
                  </p>
                  <button className="w-full mt-3 bg-lrp-green hover:bg-lrp-green-dark text-white py-3 rounded-lg font-semibold transition-all">
                    Book Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-lrp-gray dark:bg-dark-bg-secondary py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 text-center">
            Gift Card FAQs
          </h2>

          <div className="space-y-4">
            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                Do Lake Ride Pros gift cards expire?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                No! Lake Ride Pros gift cards never expire. Use them whenever you're ready for luxury transportation.
              </p>
            </details>

            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                Can I use my gift card for any service?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                Yes! Gift cards can be applied to any Lake Ride Pros transportation service including limo buses,
                sprinter vans, shuttle buses, and all specialty vehicles.
              </p>
            </details>

            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                Can I use multiple gift cards for one booking?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                Yes, you can combine multiple gift cards toward a single booking. Contact us when making your
                reservation to apply multiple gift card codes.
              </p>
            </details>

            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                What if my gift card balance doesn't cover the full amount?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                No problem! You can pay the remaining balance with a credit card, debit card, or cash.
                Your gift card balance will be applied first.
              </p>
            </details>

            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                Can gift cards be refunded or exchanged for cash?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                Gift cards are non-refundable and cannot be exchanged for cash. They can only be used for
                Lake Ride Pros transportation services.
              </p>
            </details>

            <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                I lost my gift card code. Can you help?
              </summary>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-4">
                Yes! Contact us at{' '}
                <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:underline">
                  contactus@lakeridepros.com
                </a>{' '}
                or call{' '}
                <a href="tel:5732069499" className="text-lrp-green hover:underline">
                  (573) 206-9499
                </a>{' '}
                with your purchase details and we'll help you retrieve your code.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Purchase CTA */}
      <section className="py-16 bg-lrp-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need to Purchase a Gift Card?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Give the gift of luxury transportation at Lake of the Ozarks!
          </p>
          <a
            href="/gift-cards"
            className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Buy Gift Cards
          </a>
        </div>
      </section>
    </div>
  )
}
