'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Pause, Play, X } from 'lucide-react'
import {
  ANNOUNCEMENT_DISMISSAL_KEY, isAnnouncementPathAllowed, parseAnnouncement,
  type SiteAnnouncementData,
} from '@/lib/announcements/announcement'
import styles from './SiteAnnouncement.module.css'

function storedDismissal(): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem(ANNOUNCEMENT_DISMISSAL_KEY) || 'null')
    return typeof stored?.revision === 'string' && stored.expiresAt > Date.now() ? stored.revision : null
  } catch { return null }
}

function AnnouncementImage({ announcement, compact = false }: { announcement: SiteAnnouncementData; compact?: boolean }) {
  if (!announcement.image) return null
  return <Image
    src={announcement.image.url} alt={announcement.image.alt}
    width={announcement.image.width} height={announcement.image.height}
    sizes={compact ? '64px' : '(max-width: 640px) 90vw, 560px'}
    className={compact ? styles.thumbnail : styles.image}
  />
}

function AnnouncementPopup({ announcement, dismiss }: { announcement: SiteAnnouncementData; dismiss: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const messageId = useId()
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open && typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
      if (returnFocus?.isConnected) returnFocus.focus()
    }
  }, [])

  return createPortal(
    <dialog ref={dialogRef} aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId}
      className={styles.dialog} onCancel={(event) => { event.preventDefault(); dismiss() }}>
      <div className={styles.popupHeader}>
        <p className={styles.eyebrow}>Lake Ride Pros · Announcement</p>
        <button ref={closeRef} type="button" onClick={dismiss} className={styles.control} aria-label="Dismiss announcement"><X aria-hidden="true" size={22} /></button>
      </div>
      <AnnouncementImage announcement={announcement} />
      <div className={styles.popupBody}>
        <h2 id={titleId}>{announcement.title}</h2>
        <p id={messageId} className={styles.message}>{announcement.message}</p>
        {announcement.linkUrl && <a href={announcement.linkUrl} className={styles.popupLink} onClick={dismiss}>{announcement.linkLabel}</a>}
      </div>
    </dialog>, document.body,
  )
}

export default function SiteAnnouncement() {
  const pathname = usePathname()
  const allowed = isAnnouncementPathAllowed(pathname)
  const [announcement, setAnnouncement] = useState<SiteAnnouncementData | null>(null)
  const [paused, setPaused] = useState(false)
  const dismissedRevision = useRef<string | null>(null)

  useEffect(() => {
    if (!allowed) { setAnnouncement(null); return }
    let disposed = false
    let controller: AbortController | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    async function refresh() {
      controller?.abort()
      clearTimeout(timeout)
      const currentController = new AbortController()
      controller = currentController
      timeout = setTimeout(() => currentController.abort(), 8000)
      try {
        const response = await fetch('/api/announcement', { cache: 'no-store', signal: currentController.signal })
        const payload = response.ok ? await response.json() : null
        if (disposed || currentController.signal.aborted) return
        const next = parseAnnouncement(payload?.announcement)
        setAnnouncement(next && next._rev !== dismissedRevision.current && next._rev !== storedDismissal() ? next : null)
      } catch {
        if (!disposed && controller === currentController) setAnnouncement(null)
      } finally {
        if (controller === currentController) clearTimeout(timeout)
      }
    }
    function onVisible() { if (document.visibilityState !== 'hidden') void refresh() }
    function onStorage(event: StorageEvent) {
      if (event.key === ANNOUNCEMENT_DISMISSAL_KEY) setAnnouncement((current) => current?._rev === storedDismissal() ? null : current)
    }
    void refresh()
    const interval = setInterval(onVisible, 60_000)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    window.addEventListener('storage', onStorage)
    return () => {
      disposed = true
      controller?.abort()
      clearTimeout(timeout)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      window.removeEventListener('storage', onStorage)
    }
  }, [allowed, pathname])

  // Chunk long timeouts to avoid the browser's ~24.8-day timer overflow.
  useEffect(() => {
    if (!announcement) return
    let timeout: ReturnType<typeof setTimeout>
    const expiresAt = Date.parse(announcement.expiresAt)
    function checkExpiration() {
      const remaining = expiresAt - Date.now()
      if (remaining <= 0) setAnnouncement(null)
      else timeout = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647))
    }
    checkExpiration()
    return () => clearTimeout(timeout)
  }, [announcement])

  function dismiss() {
    if (!announcement) return
    dismissedRevision.current = announcement._rev
    try {
      localStorage.setItem(ANNOUNCEMENT_DISMISSAL_KEY, JSON.stringify({ revision: announcement._rev, expiresAt: Date.parse(announcement.expiresAt) }))
    } catch { /* Dismiss still works when storage is unavailable. */ }
    setAnnouncement(null)
  }

  if (!allowed || !announcement || Date.parse(announcement.expiresAt) <= Date.now()) return null
  if (announcement.mode === 'popup') return <AnnouncementPopup key={announcement._rev} announcement={announcement} dismiss={dismiss} />

  return <section aria-label="Site announcement" className={styles.banner} data-paused={paused}>
    <AnnouncementImage announcement={announcement} compact />
    <div className={styles.viewport}>
      <div className={styles.track}>
        <span><strong>{announcement.title}</strong> — {announcement.message}</span>
        <span aria-hidden="true"><strong>{announcement.title}</strong> — {announcement.message}</span>
      </div>
    </div>
    {announcement.linkUrl && <a href={announcement.linkUrl} className={styles.bannerLink} onClick={dismiss}>{announcement.linkLabel}</a>}
    <div className={styles.controls}>
      <button type="button" className={`${styles.control} ${styles.motionControl}`} aria-label={paused ? 'Resume announcement scrolling' : 'Pause announcement scrolling'} onClick={() => setPaused((current) => !current)}>
        {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
      </button>
      <button type="button" className={styles.control} aria-label="Dismiss announcement" onClick={dismiss}><X size={22} aria-hidden="true" /></button>
    </div>
  </section>
}
