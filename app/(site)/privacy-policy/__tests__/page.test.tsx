import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrivacyPolicyPage from '../page'

describe('privacy policy SMS disclosures', () => {
  it('prohibits third-party mobile marketing sharing while preserving opted-in service delivery', () => {
    render(<PrivacyPolicyPage />)

    expect(screen.getByText('No mobile information will be sold or shared with third parties for promotional or marketing purposes.')).toBeVisible()
    expect(screen.getByText(/Twilio:/).closest('li')).toHaveTextContent('Optional text messages when you have expressly opted in')
    expect(screen.getByText(/reply STOP to opt out of text messages/)).toBeVisible()
  })
})
