import Link from 'next/link'
import { Bell, BellDot, Check } from 'lucide-react'
import { formatInsiderDate } from '@/lib/insiders/format'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import { DEMO_NOTIFICATIONS } from '@/lib/insiders/demo'
import { markInsiderNotificationRead } from '../actions'

interface InsiderNotification {
  id: string
  title: string
  body: string
  notification_type: string
  action_label: string | null
  action_url: string | null
  visible_from: string
  read_at: string | null
}

export default async function InsiderEventsPage() {
  const { supabase, isDemo } = await requireInsiderDashboard()
  const notifications = isDemo
    ? DEMO_NOTIFICATIONS
    : (
        await supabase.rpc('get_my_insider_notifications', {
          page_limit: 50,
        })
      ).data

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Early access
        </p>
        <h2 className="mt-1 text-3xl font-black">Events & announcements</h2>
        <p className="mt-2 max-w-2xl text-white/55">
          Insider event opportunities, priority availability, and program
          announcements live here.
        </p>
      </header>

      <section aria-label="Insider announcements" className="space-y-4">
        {notifications?.length ? (
          (notifications as InsiderNotification[]).map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border p-5 sm:p-6 ${
                notification.read_at
                  ? 'border-white/10 bg-zinc-900'
                  : 'border-primary/30 bg-primary/7'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/30 text-primary">
                  {notification.read_at ? (
                    <Bell aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <BellDot aria-hidden="true" className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                        {notification.notification_type}
                      </p>
                      <h3 className="mt-1 text-xl font-black">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white/60">
                      {formatInsiderDate(notification.visible_from)}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/60">
                    {notification.body}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {notification.action_url ? (
                      <Link
                        href={notification.action_url}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:bg-primary-dark"
                      >
                        {notification.action_label || 'Learn more'}
                      </Link>
                    ) : null}
                    {!notification.read_at && notification.id ? (
                      <form action={markInsiderNotificationRead}>
                        <input
                          type="hidden"
                          name="notificationId"
                          value={notification.id}
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white"
                        >
                          <Check aria-hidden="true" className="h-4 w-4" />
                          Mark as read
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center text-white/55">
            No announcements yet. New Insider events and access opportunities
            will appear here.
          </div>
        )}
      </section>
    </div>
  )
}
