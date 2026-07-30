'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import type {
  InsiderBillingInterval,
  InsiderMembershipType,
} from '@/lib/chargebee/checkout'

export interface InsiderPublicPlan {
  membershipType: InsiderMembershipType
  name: string
  monthly: string
  annual: string
  capacity: string
  description: string
  image: string
  featured?: boolean
}

export type InsiderCheckoutStatus =
  'success' | 'cancelled' | 'unavailable' | 'error'

interface InsiderPlanSelectorProps {
  plans: InsiderPublicPlan[]
  checkoutStatus?: InsiderCheckoutStatus
}

const planIcons = {
  individual: UserRound,
  family: UsersRound,
  business: BriefcaseBusiness,
} satisfies Record<InsiderMembershipType, typeof UserRound>

const checkoutMessages: Record<InsiderCheckoutStatus, string> = {
  success:
    'Checkout returned successfully. Your membership will be ready after payment confirmation.',
  cancelled: 'Checkout was canceled. No membership was started.',
  unavailable:
    'Online enrollment is temporarily unavailable. Please try again soon.',
  error: "We couldn't open secure checkout. Please try again.",
}

export function InsiderPlanSelector({
  plans,
  checkoutStatus,
}: InsiderPlanSelectorProps) {
  const [billingInterval, setBillingInterval] =
    useState<InsiderBillingInterval>('month')

  return (
    <>
      {checkoutStatus ? (
        <div
          role="status"
          className="mx-auto mt-8 max-w-2xl rounded-2xl border border-primary/35 bg-primary/10 px-5 py-4 text-center font-semibold text-white"
        >
          {checkoutMessages[checkoutStatus]}
        </div>
      ) : null}

      <div className="mt-9 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing frequency"
          className="inline-grid grid-cols-2 rounded-2xl border border-white/15 bg-zinc-900 p-1.5 shadow-lg shadow-black/30"
        >
          {(
            [
              ['month', 'Monthly'],
              ['year', 'Annual'],
            ] as const
          ).map(([value, label]) => {
            const selected = billingInterval === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setBillingInterval(value)}
                className={`min-w-32 rounded-xl px-5 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected
                    ? 'bg-primary text-black shadow-md shadow-primary/20'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = planIcons[plan.membershipType]
          const selectedPrice =
            billingInterval === 'month' ? plan.monthly : plan.annual
          const selectedCadence =
            billingInterval === 'month' ? 'per month' : 'per year'

          return (
            <article
              key={plan.membershipType}
              className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-zinc-900 transition duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? 'border-primary/65 shadow-2xl shadow-primary/10'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <Image
                src={plan.image}
                alt={`${plan.name} Insider Rewards membership`}
                width={1672}
                height={941}
                className="aspect-video h-auto w-full border-b border-white/10 object-cover"
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex min-h-8 items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  {plan.featured ? (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 text-3xl font-black">{plan.name}</h3>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-2xl border p-4 transition ${
                      billingInterval === 'month'
                        ? 'border-primary/55 bg-primary/10'
                        : 'border-white/10 bg-black/20'
                    }`}
                  >
                    <p
                      className={`text-2xl font-black ${
                        billingInterval === 'month'
                          ? 'text-primary'
                          : 'text-white'
                      }`}
                    >
                      {plan.monthly}
                    </p>
                    <p className="mt-1 text-xs text-white/55">per month</p>
                  </div>
                  <div
                    className={`rounded-2xl border p-4 transition ${
                      billingInterval === 'year'
                        ? 'border-primary/55 bg-primary/10'
                        : 'border-white/10 bg-black/20'
                    }`}
                  >
                    <p
                      className={`text-2xl font-black ${
                        billingInterval === 'year'
                          ? 'text-primary'
                          : 'text-white'
                      }`}
                    >
                      {plan.annual}
                    </p>
                    <p className="mt-1 text-xs text-white/55">per year</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  />
                  <div>
                    <p className="font-bold">{plan.capacity}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <form
                  method="post"
                  action="/api/insiders/billing/checkout"
                  className="mt-auto pt-7"
                >
                  <input
                    type="hidden"
                    name="membership_type"
                    value={plan.membershipType}
                  />
                  <input
                    type="hidden"
                    name="billing_interval"
                    value={billingInterval}
                  />
                  <button
                    type="submit"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                      plan.featured
                        ? 'bg-primary text-black hover:bg-primary-dark'
                        : 'border border-white/20 bg-white/5 text-white hover:border-primary hover:text-primary'
                    }`}
                  >
                    Join {plan.name} — {selectedPrice} {selectedCadence}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-7 flex items-center justify-center gap-2 text-center text-sm text-white/50">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
        Secure checkout and recurring billing are managed by Chargebee.
      </p>
    </>
  )
}
