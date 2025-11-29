/**
 * Gift Card Promotion Utilities
 *
 * Black Friday / Cyber Monday 2025 Promotion:
 * - Dates: November 28-30, 2025 and December 1, 2025
 * - Bonus: 25% extra value on gift cards in $100 increments
 * - Example: Buy $100, get $125. Buy $200, get $250.
 */

// Promotional dates (in Central Time)
export const PROMO_DATES = ['2025-11-28', '2025-11-29', '2025-11-30', '2025-12-01'] as const

// Bonus percentage (25% extra)
export const BONUS_PERCENTAGE = 0.25

// Minimum amount for promotion ($100 increments)
export const PROMO_MIN_AMOUNT = 100

/**
 * Check if a given date is during the promotional period
 * Uses Central Time (America/Chicago) for date comparison
 */
export function isPromotionalPeriod(date: Date = new Date()): boolean {
  // Convert to Central Time date string
  const centralTimeDate = date.toLocaleDateString('en-CA', {
    timeZone: 'America/Chicago',
  })

  return PROMO_DATES.includes(centralTimeDate as (typeof PROMO_DATES)[number])
}

/**
 * Calculate the bonus amount for a gift card purchase
 * Bonus applies in $100 increments only
 *
 * @param purchaseAmount - The amount paid by the customer
 * @returns The bonus amount (additional value)
 */
export function calculateBonusAmount(purchaseAmount: number): number {
  if (purchaseAmount < PROMO_MIN_AMOUNT) {
    return 0
  }

  // Calculate how many $100 increments
  const increments = Math.floor(purchaseAmount / PROMO_MIN_AMOUNT)

  // Each $100 increment gets $25 bonus
  const bonusPerIncrement = PROMO_MIN_AMOUNT * BONUS_PERCENTAGE
  return increments * bonusPerIncrement
}

/**
 * Calculate the total gift card value (purchase amount + bonus)
 *
 * @param purchaseAmount - The amount paid by the customer
 * @param isPromo - Whether the promotion is active
 * @returns The total gift card value
 */
export function calculateTotalGiftCardValue(
  purchaseAmount: number,
  isPromo: boolean = false
): number {
  if (!isPromo) {
    return purchaseAmount
  }
  return purchaseAmount + calculateBonusAmount(purchaseAmount)
}

/**
 * Get promotion details for display purposes
 */
export function getPromotionDetails(purchaseAmount: number) {
  const isPromo = isPromotionalPeriod()
  const bonusAmount = isPromo ? calculateBonusAmount(purchaseAmount) : 0
  const totalValue = purchaseAmount + bonusAmount
  const qualifiesForBonus = purchaseAmount >= PROMO_MIN_AMOUNT

  return {
    isPromotionalPeriod: isPromo,
    purchaseAmount,
    bonusAmount,
    totalValue,
    qualifiesForBonus,
    promoDates: PROMO_DATES,
    bonusPercentage: BONUS_PERCENTAGE * 100,
    minAmount: PROMO_MIN_AMOUNT,
  }
}
