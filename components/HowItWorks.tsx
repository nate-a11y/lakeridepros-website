const steps = [
  ['Tell us the plan', 'Book online in about a minute, or call (573) 206-9499 for a custom itinerary.'],
  ['We build the ride', 'Your reservation is confirmed, the right vehicle is prepared, and a driver is assigned.'],
  ['We arrive ready', 'Clear updates, an early arrival, and a professional local driver—without the guessing.'],
  ['You enjoy the trip', 'We manage the roads, timing, parking, and pickup while your group stays present.'],
]

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="bg-white py-20 text-black dark:bg-[#111] dark:text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-7 border-t border-black/25 pt-6 dark:border-white/25 lg:grid-cols-12 lg:items-end">
          <h2
            id="how-it-works-heading"
            className="font-celebri text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:col-span-8 lg:text-6xl"
          >
            Four steps. No mystery.
          </h2>
          <p className="max-w-md leading-relaxed text-black/65 dark:text-white/65 lg:col-span-4">
            Fast enough for a simple ride, structured enough for a multi-vehicle wedding weekend.
          </p>
        </div>

        <ol className="mt-14 grid border-y border-black/30 dark:border-white/25 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, description], index) => (
            <li
              key={title}
              className={`py-8 md:px-7 ${index > 0 ? 'border-t border-black/30 dark:border-white/25 md:border-t-0' : ''} ${index % 2 === 1 ? 'md:border-l md:border-black/30 md:dark:border-white/25' : ''} ${index > 1 ? 'md:border-t md:border-black/30 md:dark:border-white/25 lg:border-t-0' : ''} ${index > 0 ? 'lg:border-l lg:border-black/30 lg:dark:border-white/25' : ''}`}
            >
              <p className="text-sm font-bold text-[#2f730e] dark:text-[#7bea45]">0{index + 1}</p>
              <h3 className="mt-8 text-2xl font-black tracking-[-0.025em]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/65 dark:text-white/65 sm:text-base">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
