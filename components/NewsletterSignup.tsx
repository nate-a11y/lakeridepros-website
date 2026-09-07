'use client';

import { trackWebsiteEvent } from '@/lib/website-tracking'

import { useState, FormEvent } from 'react';
import Turnstile from '@/components/Turnstile';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Verify Turnstile token
    if (!turnstileToken) {
      setShowChallenge(true);
      setStatus('error');
      setMessage('Please complete the security check.');
      return;
    }

    try {
      // Verify Turnstile token first
      const verifyResponse = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });

      if (!verifyResponse.ok) {
        setStatus('error');
        setMessage('Security verification failed. Please try again.');
        setTurnstileToken(null);
        return;
      }

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        trackWebsiteEvent('newsletter_signup', { form_id: 'newsletter' });
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
        setTurnstileToken(null);
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
    <section aria-labelledby="newsletter-heading" className="bg-primary py-14 text-lrp-black sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 lg:px-8">
        <div>
          <p className="font-boardson text-3xl leading-none">The local short list</p>
          <h2 id="newsletter-heading" className="mt-4 max-w-xl text-balance font-celebri text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
            Know what&apos;s moving before the weekend does.
          </h2>
          <p id="newsletter-description" className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            Lake events, planning notes, fleet updates, and occasional offers—sent when there is something worth sharing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          onFocusCapture={() => setShowChallenge(true)}
          className="border-t border-lrp-black/35 pt-6"
          aria-describedby="newsletter-description"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={status === 'loading'}
              autoComplete="email"
              aria-label="Email address for newsletter signup"
              className="min-h-14 flex-1 border border-lrp-black bg-white px-4 py-3 text-lrp-black placeholder:text-lrp-black/55 focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-lrp-black disabled:opacity-55"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-14 bg-lrp-black px-8 py-3 font-black text-white hover:bg-white hover:text-lrp-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lrp-black disabled:cursor-not-allowed disabled:opacity-55"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {/* Cloudflare Turnstile */}
          {showChallenge && (
            <div className="mt-4 flex justify-start">
              <Turnstile
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>
          )}

          {message && (
            <p
              role={status === 'success' ? 'status' : 'alert'}
              aria-live="polite"
              aria-atomic="true"
              className="mt-3 text-sm font-bold"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
