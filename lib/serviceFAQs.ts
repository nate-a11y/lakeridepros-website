import { servedAirportsAnswer } from '@/lib/airport-copy'
import { cancellationPolicyAnswer } from '@/lib/homeFaqs';
import { pricingFeesAnswer, transportationCostAnswer } from '@/lib/pricing-copy';

/**
 * Service-specific FAQs for enhanced SEO with FAQ Schema
 * Each service should have 8-10 common questions
 */

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceFAQs {
  [serviceSlug: string]: FAQ[];
}

export const serviceFAQs: ServiceFAQs = {
  // Airport Transportation
  'airport-shuttle': [
    {
      question: 'How far in advance should I book airport transportation?',
      answer: 'We recommend booking at least 24-48 hours in advance to ensure availability. However, we do accommodate last-minute bookings when possible. For peak travel seasons and holidays, booking 1-2 weeks ahead is ideal.',
    },
    {
      question: 'Which airports do you service from Lake of the Ozarks?',
      answer: servedAirportsAnswer,
    },
    {
      question: 'Do you track flight delays and arrivals?',
      answer: 'We monitor flight arrivals and coordinate pickup timing when flights change. Additional waiting or changes to your reserved service may affect the final quote.',
    },
    {
      question: 'How much does airport shuttle service cost?',
      answer: transportationCostAnswer,
    },
    {
      question: 'Can you accommodate large groups or luggage?',
      answer: 'Absolutely! Our fleet includes SUVs, a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. Passenger capacity does not guarantee luggage space, so tell us how many bags you are bringing when you request a quote.',
    },
    {
      question: 'Is gratuity included in the airport transfer rate?',
      answer: 'Gratuity is not included but is always appreciated for exceptional service. Most clients tip 15-20% for airport transportation. You can add gratuity when booking or provide it directly to your driver.',
    },
    {
      question: 'What happens if I miss my ride?',
      answer: 'If you miss your scheduled pickup, please contact us immediately. We will do our best to reschedule or accommodate you as quickly as possible. Cancellation policies apply to no-shows without advance notice.',
    },
    {
      question: 'Do you provide car seats for children?',
      answer: 'Tell us if you need child seats or booster seats when requesting a quote. We will confirm suitable equipment, availability, and any applicable charges before you book.',
    },
    {
      question: 'Are your airport shuttles private or shared?',
      answer: 'Airport transfers are prearranged for your reservation. Share your passenger count, luggage, pickup address, and destination when requesting a quote so we can confirm the right vehicle and service.',
    },
    {
      question: 'What is your cancellation policy for airport transfers?',
      answer: cancellationPolicyAnswer,
    },
  ],

  // Wedding Transportation
  'wedding-transportation': [
    {
      question: 'When should I book wedding transportation?',
      answer: 'We recommend booking your wedding transportation 3-6 months in advance, especially for peak wedding season (May-October). This ensures you get your preferred vehicles and timeframes. Last-minute bookings may be available but are subject to fleet availability.',
    },
    {
      question: 'What types of vehicles are available for weddings?',
      answer: 'Our wedding fleet includes luxury Sprinter vans, elegant limo buses, spacious shuttle buses, and sophisticated Suburbans. Each vehicle is meticulously maintained and can be customized with decorations to match your wedding theme.',
    },
    {
      question: 'Can you transport both the wedding party and guests?',
      answer: 'Yes! We can coordinate transportation for your entire wedding party, family members, and guests. We offer packages that include multiple vehicles to ensure everyone arrives on time and safely throughout your special day.',
    },
    {
      question: 'Do you offer hourly packages or point-to-point service?',
      answer: 'We offer both! Hourly packages provide flexibility for multiple stops (ceremony, photos, reception). Point-to-point service works well for guest shuttles between hotels and venues. We will help you choose the best option for your needs.',
    },
    {
      question: 'How far in advance will the driver arrive?',
      answer: 'Our professional drivers arrive 15-30 minutes early to ensure everything is ready. For weddings, punctuality is critical, and we build in buffer time to account for photos, delays, or last-minute changes to your schedule.',
    },
    {
      question: 'Can you help coordinate shuttle schedules for guests?',
      answer: 'Absolutely! We work closely with couples to create efficient shuttle schedules for guest transportation between hotels and venues. We can run continuous loops or scheduled departure times based on your event timeline.',
    },
    {
      question: 'What happens if the wedding runs over the scheduled time?',
      answer: 'We understand weddings rarely end exactly on time! If you need extra time, your driver can extend the service at the standard hourly rate. We always try to accommodate schedule changes and will work with you to adjust as needed.',
    },
    {
      question: 'Do you decorate vehicles for weddings?',
      answer: 'We can accommodate simple decorations like "Just Married" signs and ribbons. For more elaborate decorations, please discuss your vision with us in advance. We want to ensure decorations are safe and do not damage our vehicles.',
    },
    {
      question: 'Are beverages allowed in wedding transportation?',
      answer: 'Yes! Non-alcoholic beverages are always welcome. Alcoholic beverages are permitted for passengers 21+ in our limo buses and larger vehicles only. We provide coolers and ice upon request. Please drink responsibly.',
    },
    {
      question: 'What is your cancellation policy for weddings?',
      answer: cancellationPolicyAnswer,
    },
  ],

  // Corporate Transportation
  'corporate-transportation': [
    {
      question: 'Do you offer corporate accounts or billing?',
      answer: 'Yes, we provide corporate accounts with monthly billing for businesses with regular transportation needs. Set up an account to streamline booking, manage employee travel, and receive detailed invoicing for expense tracking.',
    },
    {
      question: 'Can you accommodate last-minute business travel?',
      answer: 'We understand business needs can change quickly. While advance booking is preferred, we do our best to accommodate last-minute requests based on fleet availability. Our dispatch team is available to assist with urgent travel needs.',
    },
    {
      question: 'What vehicles are best for corporate clients?',
      answer: 'Our Suburbans and Sprinter vans are popular for corporate transportation, offering professional appearance, WiFi connectivity, comfortable seating, and space for luggage and presentation materials. All vehicles are impeccably maintained.',
    },
    {
      question: 'Do your vehicles have WiFi and charging ports?',
      answer: 'Yes! Our corporate fleet is equipped with WiFi and multiple USB charging ports so you can stay connected and productive during your ride. Perfect for conference calls, email, and last-minute presentation prep.',
    },
    {
      question: 'Can you provide transportation for corporate events or conferences?',
      answer: 'Absolutely! We specialize in corporate event transportation including conferences, seminars, team building events, and executive retreats. We can coordinate multiple vehicles and complex schedules to keep your event running smoothly.',
    },
    {
      question: 'How do you ensure punctuality for business travelers?',
      answer: 'Our drivers are trained in time management and use real-time traffic monitoring. We build buffer time into schedules and track flight arrivals for airport pickups. Your reputation matters - we ensure you arrive on time, every time.',
    },
    {
      question: 'Can you provide regular scheduled transportation for executives?',
      answer: 'Yes, we offer recurring transportation services for executives who need regular airport transfers, office commutes, or client meeting transportation. Set up a schedule and we will ensure seamless, reliable service.',
    },
    {
      question: 'Are your drivers background checked and professionally trained?',
      answer: 'All Lake Ride Pros drivers undergo comprehensive background checks, drug testing, and professional training. They are licensed, insured, and trained in corporate etiquette, discretion, and professional service standards.',
    },
    {
      question: 'Do you offer transportation for client entertainment or golf outings?',
      answer: 'Yes! We frequently provide transportation for corporate entertainment including golf outings, dinners, lake activities, and client entertainment. Our professional service ensures your clients are impressed from arrival to departure.',
    },
    {
      question: 'How do I get a quote for corporate transportation services?',
      answer: 'Contact us by phone or email with your transportation needs including dates, times, pickup/dropoff locations, and number of passengers. We will provide a detailed quote and can set up a corporate account for your convenience.',
    },
  ],

  // Party Bus / Limo Service
  'party-bus': [
    {
      question: 'What is the minimum rental time for a party bus?',
      answer: 'Minimum rental times and hourly tiers depend on the vehicle and day of the week. See the current pricing guide for each vehicle’s minimums, rates, booking fees, and surcharges; your final quote confirms the charges for your itinerary.',
    },
    {
      question: 'How many people can fit in your party buses?',
      answer: 'Our group fleet includes a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. We can coordinate multiple vehicles for larger parties. Contact us so we can match the current vehicle and layout to your group.',
    },
    {
      question: 'What amenities are included in party bus rentals?',
      answer: 'Our party buses feature premium sound systems, LED lighting, comfortable leather seating, climate control, and entertainment systems. Some vehicles include bars, dance floors, and premium features. Amenities vary by vehicle.',
    },
    {
      question: 'Can we bring alcohol on the party bus?',
      answer: 'Yes, passengers 21 and older may bring alcoholic beverages. We provide coolers and ice. All passengers must comply with open container laws - alcohol may only be consumed inside the vehicle, not at stops or public areas.',
    },
    {
      question: 'What occasions are party buses good for?',
      answer: 'Party buses are perfect for birthdays, bachelor/bachelorette parties, anniversaries, prom, homecoming, concerts, sporting events, wine tours, and any celebration! They provide safe, fun transportation while keeping your group together.',
    },
    {
      question: 'Can we make multiple stops during our rental?',
      answer: 'Multiple stops can be planned in an hourly reservation. Share your full itinerary at booking; timing, vehicle positioning, and requested changes can affect the final quote.',
    },
    {
      question: 'Is there a deposit required to book a party bus?',
      answer: 'Payment is required at booking under our published terms. Your quote and booking confirmation explain the payment requirements for your reservation. Credit card payments incur a 3% processing fee.',
    },
    {
      question: 'What is your party bus cancellation policy?',
      answer: cancellationPolicyAnswer,
    },
    {
      question: 'Can we decorate the party bus?',
      answer: 'Light decorations like banners and balloons are welcome! Please avoid confetti, glitter, or anything that could damage the interior. Discuss your decoration plans with us in advance to ensure they are safe and appropriate.',
    },
    {
      question: 'Do you provide champagne or beverages?',
      answer: 'We provide coolers and ice but guests must bring their own beverages. Some packages may include champagne or other amenities - ask about special packages when booking. We partner with local vendors for additional services.',
    },
  ],

  // Wine Tours / Brewery Tours
  'wine-tour': [
    {
      question: 'How long are your wine tour packages?',
      answer: 'Our wine tours typically range from 4-6 hours, allowing time to visit 3-4 wineries comfortably. We can customize tour length and itinerary based on your preferences and the wineries you want to visit.',
    },
    {
      question: 'Do you provide the wine tour itinerary or can we choose?',
      answer: 'Both! We can create a suggested itinerary based on your preferences (wine types, distance, ambiance) or you can provide your own list of wineries. We will coordinate timing and logistics for a seamless experience.',
    },
    {
      question: 'How many people can participate in a wine tour?',
      answer: 'We can serve wine-tour groups in SUVs, a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, or a 37-passenger Executive Shuttle. Larger groups can use multiple vehicles. We will recommend a vehicle based on passenger count, pickup plan, and the experience you want.',
    },
    {
      question: 'Are wine tastings included in the price?',
      answer: 'Wine tastings, meals, and purchases are separate from transportation and paid to the wineries. Confirm each winery’s current fees and reservation requirements directly. Transportation fees and surcharges are disclosed in your quote.',
    },
    {
      question: 'Can we bring our own food and drinks?',
      answer: 'Yes! Many guests bring snacks, water, and lunch to enjoy between wineries. Our vehicles have coolers available. Please no outside alcohol on the tour - you will have plenty at the wineries!',
    },
    {
      question: 'What should we wear on a wine tour?',
      answer: 'Casual comfortable clothing is perfect for Lake of the Ozarks wine tours. Many wineries have outdoor seating, so consider weather. Comfortable walking shoes are recommended as some wineries have hills or gravel paths.',
    },
    {
      question: 'Do you offer private or shared wine tours?',
      answer: 'We specialize in private wine tours for your group only. This provides flexibility with timing, winery selection, and itinerary. You control the pace and experience without coordinating with strangers.',
    },
    {
      question: 'What wineries do you recommend visiting?',
      answer: 'The Lake of the Ozarks area has many excellent wineries! Popular choices include Seven Springs, Stone Hill, Shawnee Bluff, and Baltimore Bend. We are happy to provide recommendations based on your wine preferences and group size.',
    },
    {
      question: 'Can we add brewery stops to a wine tour?',
      answer: 'Absolutely! Many guests create custom tours combining wineries and breweries. The Lake area has several excellent craft breweries. We will create a custom itinerary mixing wine and beer stops based on your preferences.',
    },
    {
      question: 'What happens if someone in our group drinks too much?',
      answer: 'Your safety is our priority. Our drivers are trained to assess situations and may refuse service to overly intoxicated passengers. We encourage responsible drinking - pace yourself, eat food, and drink water throughout the tour.',
    },
  ],

  // Special Events
  'special-events': [
    {
      question: 'What types of special events do you provide transportation for?',
      answer: 'We provide transportation for all types of special events including birthdays, anniversaries, proms, homecomings, concerts, sporting events, casino trips, holiday parties, and any celebration requiring group transportation.',
    },
    {
      question: 'Can you accommodate large groups for special events?',
      answer: 'Yes! We can coordinate multiple vehicles to transport large groups of any size. Our fleet includes vehicles ranging from 4-20 passengers, and we frequently coordinate transportation for events with 50+ attendees.',
    },
    {
      question: 'Do you provide round-trip service for events?',
      answer: 'Yes, we offer round-trip transportation ensuring your group gets to and from your event safely. We can either wait during shorter events or return at a predetermined time for longer events.',
    },
    {
      question: 'How far in advance should I book for special events?',
      answer: 'For major events (prom, concerts, holidays), book 1-3 months in advance to ensure availability. For other special events, 2-4 weeks is usually sufficient. Last-minute availability depends on our schedule.',
    },
    {
      question: 'Can you coordinate transportation for overnight events or multi-day trips?',
      answer: 'Yes! We provide multi-day transportation services for extended events, conferences, weddings, and celebrations. We will create a comprehensive transportation plan for your entire event schedule.',
    },
    {
      question: 'Do you decorate vehicles for special occasions?',
      answer: 'We can accommodate simple, non-damaging decorations for special occasions. Discuss your decoration ideas with us in advance. We want your celebration to be special while protecting our vehicles.',
    },
    {
      question: 'What is included in special event transportation pricing?',
      answer: pricingFeesAnswer,
    },
    {
      question: 'Can you provide transportation for surprise parties?',
      answer: 'Absolutely! We love being part of surprise celebrations. We will work with you to coordinate timing and logistics while maintaining secrecy. Our drivers are discreet and professional.',
    },
    {
      question: 'Are there age restrictions for special event transportation?',
      answer: 'Minors must have adult supervision for most services. Prom and homecoming transportation for teens is allowed with parental consent and deposit. All passengers consuming alcohol must be 21+.',
    },
    {
      question: 'What happens if our event runs longer than expected?',
      answer: 'If your event runs long, contact your driver or our dispatch. We can extend service based on driver availability at the hourly rate. We build some flexibility into schedules to accommodate minor timing changes.',
    },
  ],

  // Add generic FAQs for services without specific FAQs
  'default': [
    {
      question: 'How do I book this service?',
      answer: 'You can book online through our website, call us at (573) 206-9499, or email contactus@lakeridepros.com. We will confirm your reservation and send booking details including driver information and pickup instructions.',
    },
    {
      question: 'What is included in the service price?',
      answer: pricingFeesAnswer,
    },
    {
      question: 'What is your cancellation policy?',
      answer: cancellationPolicyAnswer,
    },
    {
      question: 'Are your drivers licensed and insured?',
      answer: 'Yes! All Lake Ride Pros drivers are fully licensed, insured, and undergo comprehensive background checks. Our drivers are trained professionals committed to providing safe, reliable, and courteous transportation service.',
    },
    {
      question: 'Do you provide transportation outside the Lake of the Ozarks area?',
      answer: 'Yes, we provide transportation throughout Missouri and to surrounding states. Long-distance trips may require advance notice and have minimum charges. Contact us with your specific destination for a quote.',
    },
    {
      question: 'What forms of payment do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, cash, and business checks for corporate accounts. Payment is typically due at time of booking or before service.',
    },
    {
      question: 'Can I make changes to my reservation?',
      answer: 'Yes, we understand plans change. Contact us as soon as possible to modify your reservation. Changes are subject to vehicle and driver availability. Significant changes may affect pricing.',
    },
    {
      question: 'Do you accommodate special needs or accessibility requirements?',
      answer: 'We strive to accommodate all passengers. Please inform us of any special needs, accessibility requirements, or medical considerations when booking so we can ensure appropriate vehicle and assistance.',
    },
    {
      question: 'What happens if there is bad weather?',
      answer: 'Safety is our priority. In severe weather, we may need to cancel or delay service. Weather cancellations typically receive full refunds. We monitor conditions closely and communicate any weather-related changes promptly.',
    },
    {
      question: 'How do I contact my driver on the day of service?',
      answer: 'We provide driver contact information 24 hours before your service. You can also contact our dispatch team at any time at (573) 206-9499 for real-time updates or to reach your driver.',
    },
  ],
};

/**
 * Get FAQs for a specific service
 * Returns service-specific FAQs or default FAQs if service not found
 */
export function getFAQsForService(serviceSlug: string): FAQ[] {
  const aliases: Record<string, string> = {
    'airport-transfers': 'airport-shuttle',
    'private-aviation-transfers': 'airport-shuttle',
    'party-bus-nightlife': 'party-bus',
    'corporate-executive-travel': 'corporate-transportation',
    'wine-tour-shuttle': 'wine-tour',
    'special-events-transportation': 'special-events',
  };
  return serviceFAQs[aliases[serviceSlug] || serviceSlug] || serviceFAQs['default'];
}

/**
 * Generate FAQ Schema for a service
 */
export function generateFAQSchema(serviceSlug: string, serviceTitle: string) {
  const faqs = getFAQsForService(serviceSlug);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${serviceTitle} - Frequently Asked Questions`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
