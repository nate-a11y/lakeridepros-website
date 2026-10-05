import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import HeaderClient from '../HeaderClient'

vi.mock('@/lib/store/cart', () => ({ useCart: () => 0 }))
vi.mock('@/lib/analytics', () => ({ trackServiceEvent: vi.fn().mockResolvedValue(undefined) }))

describe('desktop dropdown focus handling', () => {
  it('keeps a link mounted through WebKit null-target blur until its click runs', () => {
    render(<HeaderClient services={[]} />)
    const trigger = screen.getByRole('button', { name: 'Explore' })
    fireEvent.click(trigger)
    const pricing = screen.getByRole('link', { name: 'Pricing' })
    fireEvent.blur(trigger, { relatedTarget: null })
    expect(pricing).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(pricing)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('still closes when keyboard focus leaves the dropdown', () => {
    render(<HeaderClient services={[]} />)
    const trigger = screen.getByRole('button', { name: 'Explore' })
    fireEvent.click(trigger)
    fireEvent.blur(trigger, { relatedTarget: screen.getByRole('link', { name: 'Contact' }) })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps internal focus and restores the trigger on Escape', () => {
    render(<HeaderClient services={[]} />)
    const trigger = screen.getByRole('button', { name: 'Explore' })
    fireEvent.click(trigger)
    const pricing = screen.getByRole('link', { name: 'Pricing' })
    fireEvent.blur(trigger, { relatedTarget: pricing })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(pricing, { key: 'Escape' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
