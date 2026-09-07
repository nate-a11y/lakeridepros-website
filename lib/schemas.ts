import { homeFaqs } from '@/lib/homeFaqs'

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lake Ride Pros",
  "image": "https://www.lakeridepros.com/og-image.jpg",
  "logo": "https://www.lakeridepros.com/logo.png",
  "@id": "https://www.lakeridepros.com",
  "url": "https://www.lakeridepros.com",
  "telephone": "+1-573-206-9499",
  "email": "contactus@lakeridepros.com",
  "priceRange": "$$-$$$",
  "description": "Professional transportation based at Lake of the Ozarks and serving trips throughout Missouri, including private rides, airport transfers, weddings, resorts, events, and group travel.",
  "slogan": "One local fleet for every way the Lake moves",
  "foundingDate": "2020",
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
    { "@type": "City", "name": "Sunrise Beach" },
    { "@type": "City", "name": "Laurie" },
    { "@type": "State", "name": "Missouri" }
  ],
  "sameAs": [
    "https://facebook.com/lakeridepros",
    "https://instagram.com/lakeridepros",
    "https://x.com/LakeRidePros",
    "https://youtube.com/@lakeridepros",
    "https://www.tiktok.com/@lakeridepros"
  ],
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Venmo"],
  "currenciesAccepted": "USD",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "322",
    "bestRating": "5",
    "worstRating": "1"
  },
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.lakeridepros.com/book",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    "result": {
      "@type": "Reservation",
      "name": "Transportation Reservation"
    }
  }
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lake Ride Pros",
  "url": "https://www.lakeridepros.com",
  "logo": "https://www.lakeridepros.com/logo.png",
  "description": "Professional transportation based at Lake of the Ozarks and serving private and group trips throughout Missouri",
  "foundingDate": "2020",
  "founder": [
    { "@type": "Person", "name": "Jim Brentlinger" },
    { "@type": "Person", "name": "Nate Bullock" },
    { "@type": "Person", "name": "Michael Brandt" }
  ],
  "sameAs": [
    "https://facebook.com/lakeridepros",
    "https://instagram.com/lakeridepros",
    "https://x.com/LakeRidePros",
    "https://youtube.com/@lakeridepros",
    "https://www.tiktok.com/@lakeridepros"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-573-206-9499",
    "contactType": "customer service",
    "email": "contactus@lakeridepros.com",
    "availableLanguage": "English",
    "areaServed": "Missouri"
  }
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": homeFaqs.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer,
    },
  })),
}
