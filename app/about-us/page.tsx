import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - Lake Ride Pros | Premier Transportation Company',
  description: 'Learn about Lake Ride Pros, Missouri\'s premier luxury transportation company. Founded in 2022 at Lake of the Ozarks by Jim Brentlinger, Nate Bulock, and Michael Brandt. Professional, licensed, insured.',
  keywords: ['about Lake Ride Pros', 'Lake Ozarks transportation company', 'Missouri luxury transportation', 'professional drivers'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/about-us',
  },
}

export default function AboutUsPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lake Ride Pros",
    "url": "https://www.lakeridepros.com",
    "logo": "https://www.lakeridepros.com/logo.png",
    "description": "Premier luxury transportation service at Lake of the Ozarks, Missouri. Specializing in limo buses, sprinter vans, and shuttle services.",
    "foundingDate": "2022",
    "founders": [
      {
        "@type": "Person",
        "name": "Jim Brentlinger"
      },
      {
        "@type": "Person",
        "name": "Nate Bulock"
      },
      {
        "@type": "Person",
        "name": "Michael Brandt"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lake of the Ozarks",
      "addressRegion": "MO",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-573-206-9499",
      "contactType": "customer service",
      "email": "contactus@lakeridepros.com"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
              About Lake Ride Pros
            </h1>
            <p className="text-white/90 text-center mt-6 text-xl max-w-3xl mx-auto">
              Your Premier Luxury Transportation Provider at Lake of the Ozarks
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Our Story
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mb-6">
                <strong>Lake Ride Pros</strong> was founded in 2022 by <strong>Jim Brentlinger</strong>,
                <strong> Nate Bulock</strong>, and <strong>Michael Brandt</strong> with a simple mission:
                to provide the Lake of the Ozarks community with safe, reliable, and luxurious transportation
                that puts customer satisfaction first.
              </p>

              <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mb-6">
                Based right here at <strong>Lake of the Ozarks</strong>, we understand the unique transportation
                needs of our community. From wedding shuttles to wine tours, bachelor parties to corporate events,
                we've built our reputation on professionalism, safety, and delivering unforgettable experiences.
              </p>

              <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">
                What started with a vision to elevate transportation standards in <strong>Missouri</strong> has
                grown into the region's premier luxury transportation service. Today, Lake Ride Pros serves the
                entire state while maintaining our commitment to personalized service and local expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-neutral-100 dark:bg-dark-bg-secondary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
              Our Mission & Values
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                  🛡️
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Safety First
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Every vehicle is regularly inspected and maintained. All drivers are professionally licensed,
                  insured, and trained. Your safety is our top priority, always.
                </p>
              </div>

              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                  ⭐
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Exceptional Service
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  We don't just transport you—we create experiences. Professional drivers, luxury vehicles,
                  and personalized attention make every ride memorable.
                </p>
              </div>

              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                  🤝
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Community Focused
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  As locals, we're invested in our Lake of the Ozarks community. We partner with local businesses
                  and give back to the area we call home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Meet Our Founders
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-48 h-48 bg-neutral-200 dark:bg-dark-bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-6xl text-primary font-bold">JB</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Jim Brentlinger
              </h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-neutral-700 dark:text-neutral-300">
                With years of experience in the transportation industry, Jim brings operational excellence
                and a commitment to customer satisfaction to Lake Ride Pros.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-neutral-200 dark:bg-dark-bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-6xl text-primary font-bold">NB</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Nate Bulock
              </h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-neutral-700 dark:text-neutral-300">
                Nate's entrepreneurial vision and dedication to quality service drive Lake Ride Pros'
                growth and innovation in luxury transportation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-neutral-200 dark:bg-dark-bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-6xl text-primary font-bold">MB</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Michael Brandt
              </h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-neutral-700 dark:text-neutral-300">
                Michael's attention to detail and passion for hospitality ensure every Lake Ride Pros
                experience exceeds expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-neutral-100 dark:bg-dark-bg-secondary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
              Why Choose Lake Ride Pros?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Fully Licensed & Insured
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Complete commercial liability insurance and all required licenses. We operate legally
                    and professionally—something not all transportation providers can claim.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Professional Drivers
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Our drivers undergo thorough background checks, extensive training, and are committed
                    to providing exceptional service and safe transportation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Luxury Fleet
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    From 14-passenger limo buses to 37-passenger shuttles, our diverse fleet is
                    impeccably maintained and features premium amenities for your comfort.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    24/7 Availability
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Whether you need transportation at 6 AM or 2 AM, Lake Ride Pros is available
                    around the clock to serve you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Local Expertise
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    We know Lake of the Ozarks inside and out—every venue, winery, and destination.
                    Our local knowledge ensures smooth, efficient transportation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Competitive Pricing
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Premium service doesn't have to mean premium prices. We offer competitive rates
                    with transparent pricing and no hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              Serving Lake of the Ozarks & All of Missouri
            </h2>

            <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-8">
              While we're proudly based at <strong>Lake of the Ozarks</strong>, Lake Ride Pros provides
              luxury transportation throughout <strong>Missouri</strong>. We specialize in serving
              <strong> Osage Beach</strong>, <strong>Camdenton</strong>, <strong>Lake Ozark</strong>,
              <strong> Eldon</strong>, and surrounding communities—but we're happy to travel anywhere in
              the state for your special event.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Osage Beach</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Camdenton</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Lake Ozark</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Eldon</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Columbia</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Jefferson City</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">Kansas City</p>
              </div>
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-4 rounded-lg">
                <p className="font-bold text-primary">St. Louis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Involvement */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Committed to Our Community
            </h2>
            <p className="text-white/90 text-lg max-w-3xl mx-auto mb-8">
              Lake Ride Pros is more than just a transportation company—we're active members of the
              Lake of the Ozarks community. We partner with local businesses, support area events,
              and are dedicated to giving back to the region that has welcomed us.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            Experience the Lake Ride Pros Difference
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
            Book your luxury transportation today and discover why Lake Ride Pros is
            Lake of the Ozarks' premier choice for professional, reliable transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Ride
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
