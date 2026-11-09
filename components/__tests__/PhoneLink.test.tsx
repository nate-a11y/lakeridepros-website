import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { PhoneLink } from '@/components/PhoneLink'
import { usePhoneModal } from '@/lib/store/phoneModal'

afterEach(() => usePhoneModal.getState().closeModal())

it.each(['(573) 206-9499', 'Call/Text for Quote', 'Call (573) 206-9499'])(
  'keeps the visible label "%s" as its accessible name and opens phone options', (label) => {
    render(<PhoneLink><span>{label}</span></PhoneLink>)
    const button = screen.getByRole('button', { name: label })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    fireEvent.click(button)
    expect(usePhoneModal.getState().isOpen).toBe(true)
  },
)
