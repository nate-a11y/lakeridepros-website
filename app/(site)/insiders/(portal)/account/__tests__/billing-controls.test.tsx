import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/insiders/server', () => ({
  requireInsiderDashboard: vi.fn(),
}))

vi.mock('../RemoveRiderControl', () => ({
  RemoveRiderControl: () => null,
}))

vi.mock('../InsiderNotificationSettings', () => ({
  InsiderNotificationSettings: () => null,
}))

vi.mock('../../actions', () => ({
  acceptInsiderTerms: vi.fn(),
  addInsiderRider: vi.fn(),
  cancelInsiderRequest: vi.fn(),
  createInsiderRequest: vi.fn(),
}))

import {
  InsiderBillingControls,
  InsiderRiderList,
} from '../AccountMemberControls'

const riders = [
  {
    id: 'owner-1',
    name: 'Account Owner',
    role: 'Account owner',
    email: 'owner@example.com',
    phone: '555-0100',
    isAccountOwner: true,
  },
  {
    id: 'rider-1',
    name: 'Current Rider',
    role: 'Family',
    email: 'rider@example.com',
    phone: '555-0101',
    isAccountOwner: false,
  },
  {
    id: 'rider-2',
    name: 'Other Rider',
    role: 'Family',
    email: 'other@example.com',
    phone: '555-0102',
    isAccountOwner: false,
  },
]

describe('Insider billing controls', () => {
  it('hides every live Chargebee management handoff when management is off', () => {
    render(<InsiderBillingControls isOwner={true} managementEnabled={false} />)

    expect(
      screen.getByText(/online billing changes are temporarily unavailable/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Change plan' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Manage billing' }),
    ).not.toBeInTheDocument()
  })

  it('shows both management handoffs only when explicitly enabled', () => {
    render(<InsiderBillingControls isOwner={true} managementEnabled={true} />)

    const changePlanButton = screen.getByRole('button', {
      name: 'Change plan',
    })
    expect(changePlanButton.closest('form')).toHaveAttribute(
      'action',
      '/api/insiders/billing/pricing-page',
    )
    expect(
      screen.getByRole('link', { name: 'Manage billing' }),
    ).toHaveAttribute('href', expect.stringContaining('chargebeeportal.com'))
  })

  it('keeps billing controls owner-only when management is enabled', () => {
    render(<InsiderBillingControls isOwner={false} managementEnabled={true} />)

    expect(
      screen.getByText(/billing changes are available to the account owner/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Change plan' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Manage billing' }),
    ).not.toBeInTheDocument()
  })

  it('shows an approved rider only their own matched profile', () => {
    render(
      <InsiderRiderList
        riders={riders}
        accessRole="rider"
        currentUserEmail=" RIDER@example.com "
      />,
    )

    expect(screen.getByText('Current Rider')).toBeInTheDocument()
    expect(screen.getByText('rider@example.com')).toBeInTheDocument()
    expect(screen.queryByText('Account Owner')).not.toBeInTheDocument()
    expect(screen.queryByText('owner@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('Other Rider')).not.toBeInTheDocument()
    expect(screen.queryByText('other@example.com')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument()
  })

  it('fails closed instead of showing another rider when identity does not match', () => {
    render(
      <InsiderRiderList
        riders={riders}
        accessRole="rider"
        currentUserEmail="unknown@example.com"
      />,
    )

    expect(
      screen.getByText(/your rider profile is still syncing/i),
    ).toBeInTheDocument()
    expect(screen.queryByText('owner@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('rider@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('other@example.com')).not.toBeInTheDocument()
  })

  it('keeps the full rider directory available to the account owner', () => {
    render(
      <InsiderRiderList
        riders={riders}
        accessRole="owner"
        currentUserEmail="owner@example.com"
      />,
    )

    expect(screen.getByText('owner@example.com')).toBeInTheDocument()
    expect(screen.getByText('rider@example.com')).toBeInTheDocument()
    expect(screen.getByText('other@example.com')).toBeInTheDocument()
  })
})
