'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const giftCardAmounts = [
  { value: 25, label: '$25' },
  { value: 50, label: '$50' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 0, label: 'Custom Amount' },
];

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const finalAmount = selectedAmount === 0 ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      // Validate amount
      if (finalAmount < 10 || finalAmount > 1000) {
        throw new Error('Gift card amount must be between $10 and $1,000');
      }

      // Call Stripe checkout API
      const response = await fetch('/api/stripe/create-gift-card-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          purchaserName,
          purchaserEmail,
          recipientName: recipientName || null,
          recipientEmail: recipientEmail || null,
          message: message || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Gift card checkout error:', error);
      setCheckoutError(error.message || 'Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Gift Cards</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Give the gift of luxury transportation
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Purchase Form */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Purchase a Gift Card
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {giftCardAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        type="button"
                        onClick={() => setSelectedAmount(amount.value)}
                        className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                          selectedAmount === amount.value
                            ? 'border-primary bg-primary text-white'
                            : 'border-neutral-300 text-neutral-700 hover:border-primary'
                        }`}
                      >
                        {amount.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedAmount === 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lrp-text-secondary">
                        $
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="0.00"
                        min="10"
                        max="1000"
                        step="0.01"
                        required
                        className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Min: $10, Max: $1,000</p>
                  </div>
                )}

                {/* Purchaser Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={purchaserName}
                        onChange={(e) => setPurchaserName(e.target.value)}
                        placeholder="Jane Smith"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={purchaserEmail}
                        onChange={(e) => setPurchaserEmail(e.target.value)}
                        placeholder="jane@example.com"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Receipt and gift card will be sent here</p>
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Recipient Information (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Leave blank to send the gift card to yourself, or fill in to send directly to the recipient.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Total */}
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-neutral-900">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(finalAmount)}
                    </span>
                  </div>

                  {checkoutError && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4">
                      <p className="text-red-700 text-sm">
                        {checkoutError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={checkoutLoading || finalAmount < 10 || finalAmount > 1000}
                    className="w-full bg-secondary hover:bg-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Purchase Gift Card'
                    )}
                  </button>

                  <p className="text-sm text-gray-600 text-center mt-3">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div>
              <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-lg mb-6">
                <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Choose your gift card amount</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Add recipient details and a personal message</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete your purchase securely</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Recipient receives their gift card via email</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>They can use it for any of our services</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Terms & Conditions
                </h3>
                <ul className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary space-y-2">
                  <li>• Gift cards are valid for 12 months from purchase date</li>
                  <li>• Can be used for any Lake Ride Pros service</li>
                  <li>• Non-refundable and cannot be redeemed for cash</li>
                  <li>• Can be combined with other gift cards</li>
                  <li>• Balance inquiry available online</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
