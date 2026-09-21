import { fireEvent, render, screen } from '@testing-library/react'
import { createElement, type ImgHTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import FourthwallProductArtwork from '../FourthwallProductArtwork'

vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => createElement('img', props),
}))

describe('FourthwallProductArtwork', () => {
  it('renders an intentional branded fallback when no image is available', () => {
    render(<FourthwallProductArtwork src="" alt="Lake Ride Pros tee" />)

    expect(screen.getByRole('img', { name: 'Lake Ride Pros tee product preview coming soon' })).toBeVisible()
    expect(screen.getByText('Product photography is on the way.')).toBeVisible()
  })

  it('replaces a broken remote image with the branded fallback', () => {
    render(<FourthwallProductArtwork src="https://imgproxy.fourthwall.dev/missing.png" alt="Lake Ride Pros hat" />)

    fireEvent.error(screen.getByAltText('Lake Ride Pros hat'))

    expect(screen.getByRole('img', { name: 'Lake Ride Pros hat product preview coming soon' })).toBeVisible()
  })
})
