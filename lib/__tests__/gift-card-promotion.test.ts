import { afterEach, expect, it, vi } from 'vitest'
import { calculateBonusAmount, calculateTotalGiftCardValue, getPromotionDetails, isPromotionalPeriod } from '../gift-card-promotion'

afterEach(() => vi.useRealTimers())
it('uses Central Time at promotion-day boundaries', () => {
  expect(isPromotionalPeriod(new Date('2025-11-28T05:59:59Z'))).toBe(false)
  expect(isPromotionalPeriod(new Date('2025-11-28T06:00:00Z'))).toBe(true)
  expect(isPromotionalPeriod(new Date('2025-12-02T05:59:59Z'))).toBe(true)
  expect(isPromotionalPeriod(new Date('2025-12-02T06:00:00Z'))).toBe(false)
})
it.each([[25, 0], [99, 0], [100, 25], [199, 25], [200, 50], [1000, 250]])('calculates the bonus for $%i as $%i without changing the amount paid', (amount, bonus) => {
  expect(calculateBonusAmount(amount)).toBe(bonus)
  expect(calculateTotalGiftCardValue(amount)).toBe(amount)
  expect(calculateTotalGiftCardValue(amount, true)).toBe(amount + bonus)
})
it('reports promotion details both in and outside its date window', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2025-11-28T12:00:00Z'))
  expect(getPromotionDetails(100)).toMatchObject({ isPromotionalPeriod: true, bonusAmount: 25, totalValue: 125, qualifiesForBonus: true })
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  expect(getPromotionDetails(50)).toMatchObject({ isPromotionalPeriod: false, bonusAmount: 0, totalValue: 50, qualifiesForBonus: false })
})
