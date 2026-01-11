'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import Turnstile from '@/components/Turnstile';

export default function BridalShowRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    transportation_needs: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formLoadTime = useRef<number>(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Track when the form was loaded
  useEffect(() => {
    formLoadTime.current = Date.now();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Anti-bot validation: Check if honeypot field is filled
    if (honeypot) {
      setStatus('error');
      setMessage('Invalid submission detected.');
      return;
    }

    // Anti-bot validation: Check if form was submitted too quickly (less than 2 seconds)
    const timeSinceLoad = Date.now() - formLoadTime.current;
    if (timeSinceLoad < 2000) {
      setStatus('error');
      setMessage('Please take your time to fill out the form.');
      return;
    }

    // Verify Turnstile token
    if (!turnstileToken) {
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

      const response = await fetch('/api/bridal-show-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _honeypot: honeypot,
          _timestamp: formLoadTime.current,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for registering! You have been entered to win our giveaway. Good luck!');
        setFormData({ name: '', email: '', phone: '', transportation_needs: '' });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-20" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">Bridal Show Registration</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Enter to win a special giveaway from Lake Ride Pros!
          </p>
        </div>
      </header>

      {/* Registration Content */}
      <main className="py-16 bg-neutral-50 dark:bg-dark-bg-primary transition-colors" role="main">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark-bg-secondary shadow-lg rounded-lg p-8 border border-neutral-200 dark:border-dark-border transition-colors">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Register for a Chance to Win!
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                Fill out the form below to be entered into our giveaway drawing.
                We&apos;d also love to learn about your transportation needs for your special day!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Bridal show registration form" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-lrp-black bg-white dark:bg-dark-bg-primary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-lrp-black bg-white dark:bg-dark-bg-primary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-lrp-black bg-white dark:bg-dark-bg-primary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="transportation_needs"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                >
                  Transportation Needs *
                </label>
                <textarea
                  id="transportation_needs"
                  name="transportation_needs"
                  value={formData.transportation_needs}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  rows={4}
                  placeholder="Tell us about your wedding transportation needs - wedding date, number of guests, pickup/dropoff locations, etc."
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-lrp-black bg-white dark:bg-dark-bg-primary transition-colors resize-vertical"
                />
              </div>

              {/* Honeypot field - hidden from real users but visible to bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Cloudflare Turnstile */}
              <div className="flex justify-center">
                <Turnstile
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>

              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`p-4 rounded-lg ${
                    status === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={status === 'loading' ? 'Submitting registration' : 'Submit registration'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Enter to Win!'
                )}
              </button>

              <p className="text-sm text-center text-lrp-text-secondary dark:text-dark-text-secondary">
                By submitting this form, you agree to be contacted about your transportation needs
                and to receive information about the giveaway winner.
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
