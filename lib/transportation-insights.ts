export const transportationInsights = {
  publishedDate: '2026-09-03',
  periodStart: '2024-01-19',
  periodEnd: '2026-09-02',
  completedTripLegs: 14_183,
  distinctReservations: 7_282,
  recordsWithPassengerCounts: 11_866,
  recordsWithDistance: 10_526,
  medianDistanceMiles: 13.8,
  fullYearSample: {
    periodStart: '2024-01-19',
    periodEnd: '2025-12-31',
    completedTripLegs: 11_344,
    mayThroughAugustPercent: 60.8,
    fridayAndSaturdayPercent: 44.7,
  },
  observedGroupSizes: [
    { vehicle: 'SUV', records: 7_749, medianPassengers: 1, seventyFifthPercentile: 5 },
    { vehicle: 'Party bus', records: 959, medianPassengers: 12, seventyFifthPercentile: 14 },
    { vehicle: 'Executive Sprinter', records: 329, medianPassengers: 10, seventyFifthPercentile: 13 },
    { vehicle: 'Mini coach', records: 133, medianPassengers: 25, seventyFifthPercentile: 35 },
  ],
  bookingLeadTimes: [
    { tripType: 'Nightlife', records: 317, medianDays: 2 },
    { tripType: 'Airport', records: 159, medianDays: 6 },
    { tripType: 'Bachelor / bachelorette', records: 149, medianDays: 25 },
    { tripType: 'Wedding', records: 26, medianDays: 89 },
  ],
  airportTripLegs: [
    { airport: 'Springfield-Branson National (SGF)', completedTripLegs: 292 },
    { airport: 'Lee C. Fine Memorial (AIZ)', completedTripLegs: 284 },
    { airport: 'Columbia Regional (COU)', completedTripLegs: 208 },
    { airport: 'St. Louis Lambert International (STL)', completedTripLegs: 99 },
    { airport: 'Kansas City International (MCI)', completedTripLegs: 39 },
    { airport: 'Grand Glaize-Osage Beach (K15)', completedTripLegs: 15 },
  ],
} as const

export function formatInsightNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
