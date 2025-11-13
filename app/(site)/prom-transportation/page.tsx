import type { Metadata } from 'next'
import { Sparkles, Shield, Heart, Camera, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prom Transportation Lake of the Ozarks | Safe High School Prom Rides',
  description: 'Safe, reliable prom transportation at Lake of the Ozarks. Professional drivers ensure students arrive safely. Luxury vehicles for your special night. Starting at $100/hour.',
  keywords: ['prom transportation Lake Ozarks', 'high school prom limo', 'safe prom rides Missouri', 'Lake Ozarks prom service', 'prom party bus'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/prom-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Prom Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Prom Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Safe and reliable prom transportation service for high school students with professional drivers and luxury vehicles',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '100',
      unitText: 'HOUR',
    },
  },
}

export default function PromTransportationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Prom Transportation Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Make prom night unforgettable with safe, stylish transportation. Professional drivers parents trust, luxury vehicles students love.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $100/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Prom Transportation
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Parents & Students Choose Lake Ride Pros
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Safety First
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Professional, background-checked drivers. GPS tracking. Parent peace of mind knowing students are in safe hands.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Heart className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Memorable Experience
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Luxury vehicles with LED lighting, sound systems, and red carpet treatment. Make prom night truly special.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Camera className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Photo Opportunities
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Beautiful vehicles perfect for prom photos. Drivers happy to help with pictures before the big night.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Prom Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Door-to-Door Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Pickup from home, deliver to prom venue, safe return at night's end
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Group Transportation</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Accommodate small groups or entire prom parties together
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Photo Stop Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Time for photos at scenic Lake Ozarks locations before prom
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Post-Prom Rides</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Safe transportation to after-prom events or home
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks High Schools We Serve
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Camdenton High School</li>
                  <li>• School of the Osage</li>
                  <li>• Eldon High School</li>
                  <li>• Versailles High School</li>
                  <li>• All Lake of the Ozarks area high schools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Early</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve your prom transportation early for best vehicle selection
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Plan Details</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Share itinerary, photo stops, and group size with us
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Enjoy Prom Night</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Professional driver ensures safe, fun transportation all night
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return Home</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Everyone delivered safely home at the end of the night
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Prom Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How early should we book prom transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Book 4-6 weeks before prom for the best vehicle selection. Prom season fills up quickly at Lake of the Ozarks! We accept reservations up to 6 months in advance.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are your drivers background-checked?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! All our drivers undergo thorough background checks and are professionally licensed. We understand parents are trusting us with their children's safety, and we take that responsibility seriously.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's included in the prom package?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Packages include door-to-door service, red carpet rollout, complimentary water and soft drinks, Bluetooth music connectivity, and time for photos. Minimum rental is typically 5 hours.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How many students can fit in your vehicles?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We have vehicles ranging from luxury sedans (4-6 passengers) to SUVs (6-8 passengers) to party buses (20-30 passengers). We can accommodate groups of any size.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can parents track the vehicle during prom night?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide parent contact information and can arrange check-ins throughout the evening. Our drivers also communicate directly with the designated parent contact for peace of mind.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's your policy on behavior in the vehicle?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We maintain strict no-alcohol, no-smoking policies for prom transportation. Students must be respectful and follow driver instructions. We work with parents to ensure everyone has a safe, fun prom night.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Parents & Students Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "As a parent, I was nervous about prom night. Lake Ride Pros put my mind at ease completely. The driver was professional, kept me updated, and my daughter said the limo was beautiful. She felt like a celebrity! Thank you for making prom special and safe."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Linda M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Parent, Camdenton
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best prom experience ever! Our group of 8 had the coolest SUV limo with amazing lights and sound. The driver even took us to the dam for pictures before prom. My parents loved that they could track us all night. 10/10 recommend! 💙✨"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Ashley T.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Senior, School of the Osage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Prom Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Safe, stylish transportation for an unforgettable prom night
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $100/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Prom Service
              </a>
              <a
                href="tel:5732069499"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                (573) 206-9499
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
