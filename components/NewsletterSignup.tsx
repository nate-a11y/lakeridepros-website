'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (_error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="bg-primary dark:bg-dark-bg-tertiary py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Stay Updated
          </h2>
          <p className="text-white/90 dark:text-neutral-300">
            Subscribe to our newsletter for exclusive offers and updates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              aria-label="Email address for newsletter signup"
              className="flex-1 px-4 py-3 rounded-lg border-0 bg-white dark:bg-dark-bg-secondary dark:text-lrp-black dark:placeholder-neutral-400 focus:ring-2 focus:ring-secondary dark:focus:ring-primary focus:outline-none disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-secondary-dark dark:bg-primary-dark hover:bg-secondary dark:hover:bg-primary text-lrp-black font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <p
              role={status === 'success' ? 'status' : 'alert'}
              aria-live="polite"
              aria-atomic="true"
              className={`mt-3 text-center text-sm ${
                status === 'success' ? 'text-green-200 dark:text-primary-light' : 'text-red-200 dark:text-red-300'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
