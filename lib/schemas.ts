export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lake Ride Pros",
  "image": "https://www.lakeridepros.com/og-image.jpg",
  "@id": "https://www.lakeridepros.com",
  "url": "https://www.lakeridepros.com",
  "telephone": "+1-573-206-9499",
  "email": "contactus@lakeridepros.com",
  "priceRange": "$$-$$$",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "MO",
    "addressLocality": "Lake of the Ozarks",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.1567,
    "longitude": -92.6368
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "areaServed": [
    { "@type": "City", "name": "Osage Beach" },
    { "@type": "City", "name": "Camdenton" },
    { "@type": "City", "name": "Lake Ozark" },
    { "@type": "State", "name": "Missouri" }
  ]
  // Note: aggregateRating removed until real reviews are collected
  // Add back when you have actual customer reviews
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lake Ride Pros",
  "url": "https://www.lakeridepros.com",
  "logo": "https://www.lakeridepros.com/logo.png",
  "description": "Premier luxury transportation service at Lake of the Ozarks, Missouri",
  "foundingDate": "2022",
  "founders": [
    { "@type": "Person", "name": "Jim Brentlinger" },
    { "@type": "Person", "name": "Nate Bulock" },
    { "@type": "Person", "name": "Michael Brandt" }
  ]
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What areas does Lake Ride Pros serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lake Ride Pros provides luxury transportation throughout Missouri with a focus on Lake of the Ozarks, including Osage Beach, Camdenton, Lake Ozark, and surrounding areas. We also service Columbia, Jefferson City, Kansas City, St. Louis, and provide airport shuttles to MCI, STL, and SGF airports."
      }
    },
    {
      "@type": "Question",
      "name": "How far in advance should I book transportation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For weddings and major events, we recommend booking 2-4 weeks in advance to ensure vehicle availability. For airport shuttles and regular transportation, 24-48 hours notice is typically sufficient. We also accommodate last-minute bookings based on fleet availability."
      }
    },
    {
      "@type": "Question",
      "name": "What types of vehicles are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our fleet includes luxury limo buses (14 passengers), Mercedes Sprinter vans (6-14 passengers), shuttle buses (37 passengers), SUVs, and specialty vehicles. All vehicles feature premium amenities, professional sound systems, comfortable seating, and are meticulously maintained."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide transportation for weddings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Wedding transportation is one of our specialties. We provide guest shuttles between venues, hotels, ceremony and reception locations. We serve all major Lake of the Ozarks wedding venues including Tan-Tar-A Resort, Old Kinderhook, Lodge of Four Seasons, and Margaritaville Lake Resort."
      }
    },
    {
      "@type": "Question",
      "name": "How much does transportation cost at Lake of the Ozarks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rates vary based on vehicle type, distance, and duration. Airport shuttles start around $180 one-way. Hourly rentals start at $120/hour for Sprinter vans. Wedding packages start at $600. Contact us at (573) 206-9499 for a custom quote tailored to your needs."
      }
    },
    {
      "@type": "Question",
      "name": "Are your drivers licensed and insured?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. All Lake Ride Pros drivers are professionally trained, fully licensed, DOT compliant, and background-checked. We maintain full commercial liability insurance and all required permits and licenses for transportation services in Missouri. Your safety is our top priority."
      }
    },
    {
      "@type": "Question",
      "name": "What airports do you service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide airport shuttle service to/from Kansas City International Airport (MCI), St. Louis Lambert Airport (STL), Springfield-Branson Airport (SGF), and Columbia Regional Airport (COU). We track flights in real-time and adjust pickup times for delays."
      }
    },
    {
      "@type": "Question",
      "name": "Can you accommodate large groups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We specialize in large group transportation. Our fleet can accommodate groups from 2 to 200+ passengers by coordinating multiple vehicles. Perfect for weddings, corporate events, conferences, and special occasions."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer nightlife and bar hopping transportation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! We're the go-to choice for Bagnell Dam Strip bar hopping and Lake of the Ozarks nightlife. Our party buses keep your group together and ensure everyone gets home safely. Perfect for bachelor/bachelorette parties, birthdays, and nights out."
      }
    },
    {
      "@type": "Question",
      "name": "What is your cancellation policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cancellations made 48+ hours in advance receive a full refund (minus processing fee). Cancellations made 24-48 hours in advance receive a 50% refund. Cancellations less than 24 hours before service are non-refundable. Weather-related cancellations are evaluated case-by-case."
      }
    }
  ]
}
