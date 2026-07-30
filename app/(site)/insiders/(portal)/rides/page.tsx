import { CarFront, MapPin } from 'lucide-react'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import {
  formatInsiderCurrency,
  formatInsiderDate,
  titleCaseInsiderValue,
} from '@/lib/insiders/format'
import type { InsiderTrip } from '@/lib/insiders/types'
import { DEMO_INSIDER_TRIPS } from '@/lib/insiders/demo'

export default async function InsiderRidesPage() {
  const { supabase, isDemo } = await requireInsiderDashboard()
  const result = isDemo
    ? { data: DEMO_INSIDER_TRIPS, error: null }
    : await supabase.rpc('get_my_insider_trips', {
        page_limit: 100,
        page_offset: 0,
      })
  const trips = (Array.isArray(result.data) ? result.data : []) as InsiderTrip[]

  const completed = trips.filter(
    (trip) => !trip.cancelled && trip.status_slug?.toLowerCase() === 'done',
  ).length
  const upcoming = trips.filter((trip) => {
    if (trip.cancelled) return false
    return new Date(`${trip.pickup_date}T23:59:59`) >= new Date()
  }).length

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Moovs trip history
        </p>
        <h2 className="mt-1 text-3xl font-black">My rides</h2>
        <p className="mt-2 max-w-2xl text-white/55">
          Rides booked for you or an approved rider are matched automatically.
          Completed eligible rides build your rolling Insider status.
        </p>
      </header>

      <section aria-label="Ride summary" className="grid gap-4 sm:grid-cols-3">
        {[
          ['Matched rides', trips.length],
          ['Completed', completed],
          ['Upcoming', upcoming],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
          >
            <p className="text-3xl font-black text-primary">{value}</p>
            <p className="mt-1 text-sm text-white/55">{label}</p>
          </div>
        ))}
      </section>

      {result.error ? (
        <p className="rounded-2xl border border-red-400/25 bg-red-950/30 p-5 text-red-100">
          We could not load your rides right now. Your rewards data is safe;
          please try again shortly.
        </p>
      ) : null}

      <section aria-label="Matched rides" className="space-y-4">
        {trips.length ? (
          trips.map((trip) => (
            <article
              key={trip.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <CarFront aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">
                      {formatInsiderDate(trip.pickup_date)}
                      {trip.pickup_time
                        ? ` at ${trip.pickup_time.slice(0, 5)}`
                        : ''}
                    </h3>
                    <p className="mt-1 text-sm text-white/55">
                      {trip.vehicle_name ||
                        trip.trip_type ||
                        'Lake Ride Pros ride'}
                      {trip.trip_conf ? ` · Trip ${trip.trip_conf}` : ''}
                    </p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/70">
                  {trip.cancelled
                    ? 'Cancelled'
                    : titleCaseInsiderValue(trip.status_slug || 'scheduled')}
                </span>
              </div>

              {(trip.pickup_address || trip.dropoff_address) && (
                <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm text-white/60 sm:grid-cols-2">
                  <p className="flex gap-2">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    />
                    <span>
                      {trip.pickup_address || 'Pickup location on file'}
                    </span>
                  </p>
                  {trip.dropoff_address ? (
                    <p className="flex gap-2">
                      <MapPin
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-white/60"
                      />
                      <span>{trip.dropoff_address}</span>
                    </p>
                  ) : null}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm">
                <span className="text-white/50">
                  Total{' '}
                  <strong className="text-white">
                    {formatInsiderCurrency(trip.total_amount)}
                  </strong>
                </span>
                {trip.discount_amount ? (
                  <span className="text-white/50">
                    Savings{' '}
                    <strong className="text-primary">
                      {formatInsiderCurrency(trip.discount_amount)}
                    </strong>
                  </span>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center text-white/55">
            No matching Moovs rides yet. Contact support if a ride is missing.
          </div>
        )}
      </section>
    </div>
  )
}
