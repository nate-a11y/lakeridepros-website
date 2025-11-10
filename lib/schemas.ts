export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lake Ride Pros",
  "image": "https://www.lakeridepros.com/og-image.jpg",
  "@id": "https://www.lakeridepros.com",
  "url": "https://www.lakeridepros.com",
  "telephone": "+15732069499",
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
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "50"
  }
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
        "text": "Lake Ride Pros provides luxury transportation throughout Missouri with a focus on Lake of the Ozarks, including Osage Beach, Camdenton, Lake Ozark, and surrounding areas."
      }
    },
    {
      "@type": "Question",
      "name": "How far in advance should I book?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For weddings and major events, we recommend booking 2-4 weeks in advance. However, we often accommodate last-minute bookings based on availability."
      }
    },
    {
      "@type": "Question",
      "name": "What types of vehicles are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer luxury limo buses (14 passengers), sprinter vans, shuttle buses (37 passengers), specialty vehicles, and standard vehicles like Suburbans."
      }
    }
  ]
}
