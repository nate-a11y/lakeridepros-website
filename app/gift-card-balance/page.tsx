'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

export default function GiftCardBalancePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBalance(null);

    try {
      const response = await fetch('/api/gift-cards/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
      } else {
        setError(data.error || 'Unable to check balance. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Check Gift Card Balance
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Enter your gift card code to check your remaining balance
          </p>
        </div>
      </section>

      {/* Balance Check Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  Gift Card Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter your gift card code"
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg tracking-wider"
                />
                <p className="mt-2 text-sm text-neutral-500">
                  Enter the code from your gift card email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !code}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check Balance'}
              </button>
            </form>

            {/* Results */}
            {balance !== null && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    Your Balance
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {formatPrice(balance)}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-neutral-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              Need Help?
            </h3>
            <p className="text-neutral-600 mb-4">
              If you're having trouble checking your balance or have questions about
              your gift card, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                <a
                  href="mailto:support@lakeridepros.com"
                  className="text-primary hover:text-primary-dark"
                >
                  support@lakeridepros.com
                </a>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{' '}
                <a
                  href="tel:+15555551234"
                  className="text-primary hover:text-primary-dark"
                >
                  (555) 555-1234
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
