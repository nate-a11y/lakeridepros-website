import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  InsiderPlanSelector,
  type InsiderPublicPlan,
} from '../InsiderPlanSelector'

const plans = [
  {
    membershipType: 'individual',
    name: 'Individual',
    monthly: '$9.99',
    annual: '$99',
    capacity: '1 member',
    description: 'For individual riders.',
    image: '/insider-rewards/individual.webp',
  },
  {
    membershipType: 'family',
    name: 'Family',
    monthly: '$19.99',
    annual: '$199',
    capacity: 'Up to 5 approved riders',
    description: 'For approved riders.',
    image: '/insider-rewards/family.webp',
    featured: true,
  },
  {
    membershipType: 'business',
    name: 'Business',
    monthly: '$29.99',
    annual: '$299',
    capacity: 'Up to 10 approved riders',
    description: 'For business riders.',
    image: '/insider-rewards/business.webp',
  },
] satisfies InsiderPublicPlan[]

describe('InsiderPlanSelector', () => {
  it('renders the approved plan choices as custom checkout forms', () => {
    const { container } = render(<InsiderPlanSelector plans={plans} />)

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByText('Most popular')).toBeInTheDocument()

    for (const plan of plans) {
      const card = screen
        .getByRole('heading', { name: plan.name })
        .closest('article')
      expect(card).not.toBeNull()
      expect(within(card!).getByText(plan.monthly)).toBeInTheDocument()
      expect(within(card!).getByText(plan.annual)).toBeInTheDocument()
      expect(within(card!).getByText(plan.capacity)).toBeInTheDocument()

      const form = within(card!)
        .getByRole('button', {
          name: `Join ${plan.name} — ${plan.monthly} per month`,
        })
        .closest('form')
      expect(form).toHaveAttribute('action', '/api/insiders/billing/checkout')
      expect(form).toHaveAttribute('method', 'post')
      expect(form?.querySelector('input[name="membership_type"]')).toHaveValue(
        plan.membershipType,
      )
      expect(form?.querySelector('input[name="billing_interval"]')).toHaveValue(
        'month',
      )
    }

    expect(container.querySelector('#chargebee-pricing-table')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('updates every checkout form when annual billing is selected', () => {
    render(<InsiderPlanSelector plans={plans} />)

    fireEvent.click(screen.getByRole('radio', { name: 'Annual' }))

    expect(screen.getByRole('radio', { name: 'Annual' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    for (const plan of plans) {
      const button = screen.getByRole('button', {
        name: `Join ${plan.name} — ${plan.annual} per year`,
      })
      expect(
        button.closest('form')?.querySelector('input[name="billing_interval"]'),
      ).toHaveValue('year')
    }
  })

  it('shows customer-safe checkout feedback', () => {
    render(<InsiderPlanSelector plans={plans} checkoutStatus="cancelled" />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Checkout was canceled. No membership was started.',
    )
  })
})
