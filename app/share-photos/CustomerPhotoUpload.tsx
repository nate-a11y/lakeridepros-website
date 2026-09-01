'use client'

import Image from 'next/image'
import { useCallback, useMemo, useRef, useState } from 'react'
import Turnstile from '@/components/Turnstile'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const MAX_FILES = 10
const MAX_FILE_SIZE = 20 * 1024 * 1024

type PreparedUpload = { path: string; uploadToken: string; mimeType: string }

function fileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1)} MB`
}

export default function CustomerPhotoUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [customerName, setCustomerName] = useState('')
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [consent, setConsent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [uploadedCount, setUploadedCount] = useState(0)

  const totalSize = useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files],
  )

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null)
    setTurnstileKey((current) => current + 1)
  }, [])

  const handleFiles = useCallback((selected: FileList | null) => {
    setError('')
    const next = Array.from(selected || []).slice(0, MAX_FILES)
    const oversized = next.find((file) => file.size > MAX_FILE_SIZE)
    if (oversized) {
      setError(`${oversized.name} is larger than 20 MB.`)
      return
    }
    setFiles(next)
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }, [])

  const upload = useCallback(async () => {
    setError('')
    if (!customerName.trim()) return setError('Please enter your name.')
    if (files.length === 0) return setError('Choose at least one photo.')
    if (!consent) return setError('Please confirm you have permission to share these photos.')
    if (!turnstileToken) return setError('Please complete the security check.')

    setBusy(true)
    setProgress('Preparing secure upload…')
    try {
      const prepareResponse = await fetch('/api/customer-photo-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'prepare',
          customerName,
          caption,
          consent,
          turnstileToken,
          files: files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
          })),
        }),
      })
      const prepared = await prepareResponse.json() as {
        error?: string
        sessionToken?: string
        uploads?: PreparedUpload[]
      }
      if (!prepareResponse.ok || !prepared.sessionToken || !prepared.uploads) {
        throw new Error(prepared.error || 'Could not prepare the upload.')
      }

      const supabase = getSupabaseBrowserClient()
      for (let index = 0; index < prepared.uploads.length; index += 1) {
        const uploadTarget = prepared.uploads[index]
        const file = files[index]
        setProgress(`Uploading photo ${index + 1} of ${files.length}…`)
        const { error: uploadError } = await supabase.storage
          .from('photo-board')
          .uploadToSignedUrl(uploadTarget.path, uploadTarget.uploadToken, file, {
            contentType: uploadTarget.mimeType,
            cacheControl: '3600',
          })
        if (uploadError) throw uploadError
      }

      setProgress('Adding photos to the Lake Ride Pros gallery…')
      const finalizeResponse = await fetch('/api/customer-photo-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finalize', sessionToken: prepared.sessionToken }),
      })
      const finalized = await finalizeResponse.json() as { error?: string; count?: number }
      if (!finalizeResponse.ok) {
        throw new Error(finalized.error || 'Could not finish the upload.')
      }

      setUploadedCount(finalized.count || files.length)
      setFiles([])
      setCaption('')
      setConsent(false)
      resetTurnstile()
      if (inputRef.current) inputRef.current.value = ''
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Photo upload failed.')
      resetTurnstile()
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [caption, consent, customerName, files, resetTurnstile, turnstileToken])

  if (uploadedCount > 0) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-lime-500/30 bg-neutral-950 p-7 text-center shadow-[0_24px_80px_rgba(76,187,23,0.16)] sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime-500 text-3xl font-black text-black">✓</div>
          <h1 className="mt-6 text-3xl font-extrabold">Photos shared!</h1>
          <p className="mt-3 text-neutral-300">
            {uploadedCount} photo{uploadedCount === 1 ? '' : 's'} went directly to the private Lake Ride Pros Photo Board.
          </p>
          <button
            type="button"
            onClick={() => setUploadedCount(0)}
            className="mt-7 min-h-12 rounded-xl bg-lime-500 px-6 font-bold text-black transition hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400"
          >
            Share more photos
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,var(--primary-alpha-20),transparent_34%),#000] px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <Image
            src="/Color logo - no background.png"
            alt="Lake Ride Pros"
            width={180}
            height={90}
            priority
            className="mx-auto h-auto w-40"
          />
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-lime-400">Customer photo share</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Share the good times.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-300 sm:text-base">
            Send your ride, event, and group photos directly to the private Lake Ride Pros Photo Board for our team.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950/95 p-5 shadow-2xl backdrop-blur sm:p-7">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Your name</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                disabled={busy}
                maxLength={80}
                autoComplete="name"
                autoCapitalize="words"
                className="min-h-12 w-full rounded-xl border border-white/20 bg-[#151515] px-4 text-base text-white outline-none transition placeholder:text-[#8f8f8f] focus:border-lime-500 focus:ring-2 focus:ring-lime-500/25"
                placeholder="Who should we thank?"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Ride or event details <span className="font-normal text-neutral-500">(optional)</span></span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                disabled={busy}
                maxLength={1000}
                rows={3}
                autoCorrect="on"
                autoCapitalize="sentences"
                spellCheck
                className="w-full rounded-xl border border-white/20 bg-[#151515] px-4 py-3 text-base text-white outline-none transition placeholder:text-[#8f8f8f] focus:border-lime-500 focus:ring-2 focus:ring-lime-500/25"
                placeholder="Wedding, birthday, driver shout-out, or anything else…"
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-bold">Photos</span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="min-h-28 w-full rounded-2xl border-2 border-dashed border-lime-500/40 bg-lime-500/5 px-5 font-bold text-lime-400 transition hover:border-lime-400 hover:bg-lime-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:opacity-50"
              >
                Choose up to 10 photos
                <span className="mt-1 block text-xs font-normal text-neutral-400">JPEG, PNG, HEIC, WebP, GIF, or AVIF · 20 MB each</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/heic,image/heif,.heic,.heif"
                multiple
                hidden
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>

            {files.length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#151515] p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                  <span>{files.length} selected</span>
                  <span>{fileSize(totalSize)} total</span>
                </div>
                <ul className="max-h-52 space-y-2 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl bg-black/40 px-3 py-2">
                      <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                      <span className="text-xs text-neutral-500">{fileSize(file.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={busy}
                        aria-label={`Remove ${file.name}`}
                        className="grid h-9 w-9 place-items-center rounded-lg text-neutral-400 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-[#151515] p-3 text-sm leading-5 text-[#d4d4d4]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={busy}
                className="mt-1 h-5 w-5 shrink-0 accent-lime-500"
              />
              <span>I have permission to share these photos with Lake Ride Pros.</span>
            </label>

            <div className="flex justify-center">
              <Turnstile
                key={turnstileKey}
                onSuccess={setTurnstileToken}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>

            {error ? (
              <div role="alert" className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={upload}
              disabled={busy || files.length === 0 || !turnstileToken}
              className="min-h-14 w-full rounded-xl bg-lime-500 px-5 text-base font-extrabold text-black transition hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:bg-[#292929] disabled:text-[#a8a8a8]"
            >
              {busy ? progress || 'Uploading…' : `Share ${files.length || ''} photo${files.length === 1 ? '' : 's'}`}
            </button>

            <p className="text-center text-xs leading-5 text-neutral-500">
              This unlisted link uploads to a private team gallery. It does not publish your photos on the Lake Ride Pros website.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
