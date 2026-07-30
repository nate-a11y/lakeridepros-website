import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MagicLinkForm } from './MagicLinkForm'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'

export const metadata: Metadata = {
  title: 'Insider Sign In | Lake Ride Pros',
  description: 'Secure sign in for Lake Ride Pros Insider Rewards members.',
  robots: { index: false, follow: false },
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_link: 'That sign-in link is invalid. Request a new one below.',
  expired_link:
    'That sign-in link expired or was already used. Request a new one below.',
  membership_not_linked:
    'We could not connect this email to an active membership. Contact Lake Ride Pros for help.',
}

export default async function InsiderLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createInsiderServerClient()
  const { data } = await supabase.auth.getClaims()
  if (data?.claims) redirect('/insiders')

  const params = await searchParams
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,187,23,0.24),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(76,187,23,0.12),transparent_38%)]"
      />
      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-white/12 bg-zinc-950 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[360px] bg-black">
          <Image
            src="/insider-rewards-coming-soon.png"
            alt=""
            fill
            priority
            className="object-contain p-5 sm:p-8"
          />
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
            Member access
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Welcome back, Insider.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/65">
            Enter the email connected to your membership. We&apos;ll send a
            secure, one-time sign-in link—no password required.
          </p>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-amber-300/35 bg-amber-400/10 p-4 text-sm text-amber-100"
            >
              {errorMessage}
            </p>
          ) : null}

          <MagicLinkForm />

          <p className="mt-6 text-sm text-white/50">
            Need help?{' '}
            <Link
              href="/contact"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Contact Lake Ride Pros
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
