'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

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
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  const finalAmount = selectedAmount === 0 ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would integrate with payment processing
    alert('Gift card purchase would be processed here with payment integration.');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Gift Cards</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
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
                        step="0.01"
                        required
                        className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Recipient Details */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                    required
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
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
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
                  <button
                    type="submit"
                    disabled={finalAmount < 10}
                    className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Purchase Gift Card
                  </button>
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
