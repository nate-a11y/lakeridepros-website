'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
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

    try {
      const response = await fetch('/api/contact', {
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
        setMessage('Thank you! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (_error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get in touch with our team for bookings, inquiries, or support
          </p>
        </div>
      </header>

      {/* Contact Content */}
      <main className="py-16 bg-neutral-50 dark:bg-dark-bg-primary transition-colors" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <aside className="lg:col-span-1 space-y-8" aria-label="Contact information">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Get In Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Location</p>
                      <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                        Lake of the Ozarks based but Operate Statewide
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Phone</p>
                      <a
                        href="tel:5732069499"
                        className="text-primary hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label="Call us at (573) 206-9499"
                      >
                        (573) 206-9499
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Email</p>
                      <a
                        href="mailto:contactus@lakeridepros.com"
                        className="text-primary hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label="Email us at contactus@lakeridepros.com"
                      >
                        contactus@lakeridepros.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Hours</p>
                      <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                        24/7 Service Available
                        <br />
                        Office: Mon-Fri, 8AM-6PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-dark-bg-secondary shadow-lg rounded-lg p-8 border border-neutral-200 dark:border-dark-border transition-colors">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      rows={6}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors resize-vertical"
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
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={status === 'loading' ? 'Sending message' : 'Send message'}
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
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
