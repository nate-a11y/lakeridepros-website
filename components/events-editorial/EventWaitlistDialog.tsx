'use client'

import { useEffect, useRef } from 'react'
import EventWaitlistModal, {
  type EventWaitlistContext,
} from './EventWaitlistForm'
import styles from './EventsEditorial.module.css'

/** Keep the existing waitlist payload/submission intact, with local keyboard containment. */
export default function EventWaitlistDialog({
  waitlist,
  onClose,
}: {
  waitlist: EventWaitlistContext | null
  onClose: () => void
}) {
  const scope = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!waitlist) return
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const dialog = scope.current?.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return
    const controls = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
        ),
      ).filter((node) => node.getClientRects().length > 0)
    dialog.querySelector<HTMLInputElement>('#waitlist-name')?.focus()
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      opener?.focus()
    }
  }, [waitlist])

  return (
    <div ref={scope} className={styles.modalScope}>
      <EventWaitlistModal waitlist={waitlist} onClose={onClose} />
    </div>
  )
}
