import Image from 'next/image'
import Link from 'next/link'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

interface FinalBookingCloseProps {
  imageUrl?: string
  imageAlt?: string
}

export default function FinalBookingClose({ imageUrl, imageAlt = '' }: FinalBookingCloseProps) {
  return (
    <section aria-labelledby="final-booking-heading" className="bg-lrp-gray py-10 text-lrp-black sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden bg-lrp-black text-white lg:grid-cols-[1.15fr_0.85fr]">
          {imageUrl && (
            <div className="relative min-h-60 bg-lrp-black sm:min-h-72 lg:min-h-96">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                quality={75}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className={`flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 ${imageUrl ? '' : 'lg:col-span-2'}`}>
            <p className="font-boardson text-3xl leading-none text-primary-light">Your ride. Properly matched.</p>
            <h2 id="final-booking-heading" className="mt-5 max-w-xl text-balance font-celebri text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
              Tell us who&apos;s riding. We&apos;ll handle what moves them.
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MoovsBookingLink location="homepage_close" className="inline-flex min-h-14 items-center justify-center bg-primary px-6 py-4 font-bold text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black">
                Quote or book a ride
              </MoovsBookingLink>
              <a href="tel:+15732069499" className="inline-flex min-h-14 items-center justify-center border border-white/45 px-6 py-4 font-bold text-white hover:border-white hover:bg-white hover:text-lrp-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light">
                Call (573) 206-9499
              </a>
            </div>
            <a
              href="https://customer.moovs.app/lake-ride-pros/user/profile"
              className="mt-5 self-start text-sm font-bold text-white underline decoration-primary decoration-2 underline-offset-4 hover:text-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
            >
              Manage your profile or an existing reservation
            </a>
            <Link href="/contact" className="mt-3 self-start text-sm text-white/65 hover:text-white">
              Or ask our local team a question
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
