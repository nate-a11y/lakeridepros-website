'use client';

import { useState, useEffect, useRef, FormEvent, use } from 'react';
import Link from 'next/link';
import { Giveaway } from '@/lib/supabase/giveaways';

type GiveawayStatus = 'upcoming' | 'open' | 'closed' | 'inactive';

interface FormState {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  has_used_service: '' | 'yes' | 'no';
  has_app: '' | 'yes' | 'no';
  knows_apple_music: boolean;
  knows_spotify: boolean;
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip: '',
  has_used_service: '',
  has_app: '',
  knows_apple_music: false,
  knows_spotify: false,
};

export default function GiveawayEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [status, setStatus] = useState<GiveawayStatus | null>(null);
  const [loadingGiveaway, setLoadingGiveaway] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [honeypot, setHoneypot] = useState('');
  const formLoadTime = useRef<number>(0);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    formLoadTime.current = Date.now();

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/giveaways/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setLoadError(json.error || 'Giveaway not found.');
        } else {
          setGiveaway(json.giveaway);
          setStatus(json.status);
        }
      } catch {
        if (!cancelled) setLoadError('Failed to load giveaway.');
      } finally {
        if (!cancelled) setLoadingGiveaway(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');

    if (form.has_used_service === '') {
      setSubmitState('error');
      setSubmitMessage('Please tell us if you have used our service before.');
      return;
    }
    if (form.has_used_service === 'yes' && form.has_app === '') {
      setSubmitState('error');
      setSubmitMessage('Please tell us if you have downloaded our app.');
      return;
    }

    if (honeypot) {
      setSubmitState('error');
      setSubmitMessage('Invalid submission detected.');
      return;
    }
    if (Date.now() - formLoadTime.current < 2000) {
      setSubmitState('error');
      setSubmitMessage('Please take your time to fill out the form.');
      return;
    }

    setSubmitState('loading');

    try {
      const res = await fetch(`/api/giveaways/${encodeURIComponent(slug)}/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address_line1: form.address_line1,
          address_line2: form.address_line2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          has_used_service: form.has_used_service === 'yes',
          has_app: form.has_used_service === 'yes' ? form.has_app === 'yes' : null,
          knows_apple_music: form.knows_apple_music,
          knows_spotify: form.knows_spotify,
          _honeypot: honeypot,
          _timestamp: formLoadTime.current,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setSubmitState('success');
        setSubmitMessage("You're entered. Good luck!");
        setForm(initialForm);
      } else {
        setSubmitState('error');
        setSubmitMessage(json.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitState('error');
      setSubmitMessage('Network error. Please try again later.');
    }
  };

  if (loadingGiveaway) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <div className="text-center text-lrp-text-secondary dark:text-dark-text-secondary">
          Loading giveaway...
        </div>
      </main>
    );
  }

  if (loadError || !giveaway) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 border border-neutral-200 dark:border-dark-border">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Giveaway Not Found
          </h1>
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
            {loadError || "We couldn't find this giveaway."}
          </p>
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const isOpen = status === 'open';

  return (
    <>
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-16" role="banner">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-widest text-sm font-semibold text-white/80 mb-2">
            Lake Ride Pros Giveaway
          </p>
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">
            {giveaway.title}
          </h1>
          {giveaway.prize_description && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {giveaway.prize_description}
            </p>
          )}
          <p className="mt-4 text-sm text-white/80">
            {formatDate(giveaway.start_date)} &mdash; {formatDate(giveaway.end_date)}
          </p>
        </div>
      </header>

      <main className="py-12 bg-neutral-50 dark:bg-dark-bg-primary transition-colors" role="main">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {giveaway.description && (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 mb-6 border border-neutral-200 dark:border-dark-border">
              <p className="text-neutral-700 dark:text-dark-text-primary whitespace-pre-line">
                {giveaway.description}
              </p>
            </div>
          )}

          {giveaway.social_post_url && (
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                  Don&apos;t forget to like the post!
                </p>
                <a
                  href={giveaway.social_post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline break-all"
                >
                  {giveaway.social_post_url}
                </a>
              </div>
            </div>
          )}

          {status === 'upcoming' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Coming soon
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Entries open {formatDate(giveaway.start_date)}.
              </p>
            </div>
          )}

          {(status === 'closed' || status === 'inactive') && (
            <div className="bg-neutral-100 dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Entries closed
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                This giveaway is no longer accepting entries. A winner will be picked at random.
              </p>
            </div>
          )}

          {isOpen && submitState === 'success' ? (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 border border-neutral-200 dark:border-dark-border text-center">
              <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                You&apos;re entered!
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                {submitMessage} We&apos;ll reach out to the winner once entries close.
              </p>
            </div>
          ) : isOpen ? (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 sm:p-8 border border-neutral-200 dark:border-dark-border">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                Enter to Win
              </h2>
              <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
                Fill out the form below. One entry per email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field label="Name *" htmlFor="name">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Email *" htmlFor="email">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Phone *" htmlFor="phone">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </Field>

                <Field label="Street Address *" htmlFor="address_line1">
                  <input
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    required
                    autoComplete="address-line1"
                    className={inputClass}
                  />
                </Field>

                <Field label="Apt / Suite (optional)" htmlFor="address_line2">
                  <input
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    autoComplete="address-line2"
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="City *" htmlFor="city">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="State *" htmlFor="state">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      maxLength={50}
                      autoComplete="address-level1"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="ZIP *" htmlFor="zip">
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      required
                      autoComplete="postal-code"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Have you ever used our service? *" htmlFor="has_used_service">
                  <select
                    id="has_used_service"
                    name="has_used_service"
                    value={form.has_used_service}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select an answer</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>

                {form.has_used_service === 'yes' && (
                  <Field label="Have you downloaded our app? *" htmlFor="has_app">
                    <select
                      id="has_app"
                      name="has_app"
                      value={form.has_app}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select an answer</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                )}

                <fieldset className="border border-neutral-200 dark:border-dark-border rounded-lg p-4">
                  <legend className="px-2 text-sm font-semibold text-neutral-900 dark:text-white">
                    Did you know we have music on...
                  </legend>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-neutral-700 dark:text-dark-text-primary">
                      <input
                        type="checkbox"
                        name="knows_apple_music"
                        checked={form.knows_apple_music}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      Apple Music
                    </label>
                    <label className="flex items-center gap-3 text-neutral-700 dark:text-dark-text-primary">
                      <input
                        type="checkbox"
                        name="knows_spotify"
                        checked={form.knows_spotify}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      Spotify
                    </label>
                  </div>
                </fieldset>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
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

                {submitMessage && submitState !== 'success' && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 text-sm"
                  >
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="w-full bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {submitState === 'loading' ? 'Submitting...' : 'Enter to Win!'}
                </button>

                <p className="text-xs text-center text-lrp-text-secondary dark:text-dark-text-secondary">
                  By submitting, you agree to be contacted about this giveaway and your transportation needs.
                </p>
              </form>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

const inputClass =
  'w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary transition-colors';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
