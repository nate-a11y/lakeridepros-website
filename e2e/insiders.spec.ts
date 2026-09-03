import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const forbiddenCustomerLanguage =
  /\b(most marketable|internal language|draft copy|implementation note|partner review|work in progress)\b/i

async function expectNoDocumentOverflow(page: import('@playwright/test').Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

async function expectNoSeriousAccessibilityViolations(
  page: import('@playwright/test').Page,
) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const violations = results.violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact || ''),
  )

  expect(
    violations,
    violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.nodes
            .map((node) => node.failureSummary)
            .join('; ')}`,
      )
      .join('\n'),
  ).toEqual([])
}

test.describe('Insider Rewards internal release candidate', () => {
  test.describe.configure({ mode: 'serial' })

  test('public offer uses the approved plans and customer-safe wording', async ({
    page,
  }) => {
    const response = await page.goto('/insider-membership-benefits')

    expect(response?.status()).toBe(200)
    await expect(
      page.getByRole('heading', { name: 'Choose how you ride.' }),
    ).toBeVisible()

    const approvedPlans = [
      {
        name: 'Individual',
        monthly: '$9.99',
        annual: '$99',
        capacity: '1 member',
      },
      {
        name: 'Family',
        monthly: '$19.99',
        annual: '$199',
        capacity: 'Up to 5 approved riders',
      },
      {
        name: 'Business',
        monthly: '$29.99',
        annual: '$299',
        capacity: 'Up to 10 approved riders',
      },
    ]

    for (const plan of approvedPlans) {
      const card = page.locator('article').filter({
        has: page.getByRole('heading', { name: plan.name, exact: true }),
      })

      await expect(card).toContainText(plan.monthly)
      await expect(card).toContainText(plan.annual)
      await expect(card).toContainText(plan.capacity)
      await expect(card.locator('img')).toBeVisible()
      await expect(
        card.getByRole('button', {
          name: `Join ${plan.name} — ${plan.monthly} per month`,
        }),
      ).toBeVisible()
      await expect(card.locator('input[name="billing_interval"]')).toHaveValue(
        'month',
      )
    }

    const familyCard = page.locator('article').filter({
      has: page.getByRole('heading', { name: 'Family', exact: true }),
    })
    await expect(familyCard.getByText('Most popular')).toBeVisible()
    expect(
      await familyCard.evaluate((element) => {
        const image = element.querySelector('img')
        const label = Array.from(element.querySelectorAll('span')).find(
          (span) => span.textContent?.trim() === 'Most popular',
        )
        return Boolean(
          image &&
          label &&
          image.compareDocumentPosition(label) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        )
      }),
    ).toBe(true)

    await page.getByRole('radio', { name: 'Annual' }).click()
    await expect(page.getByRole('radio', { name: 'Annual' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    for (const plan of approvedPlans) {
      const card = page.locator('article').filter({
        has: page.getByRole('heading', { name: plan.name, exact: true }),
      })
      await expect(
        card.getByRole('button', {
          name: `Join ${plan.name} — ${plan.annual} per year`,
        }),
      ).toBeVisible()
      await expect(card.locator('input[name="billing_interval"]')).toHaveValue(
        'year',
      )
    }

    await expect(page.locator('#chargebee-pricing-table')).toHaveCount(0)
    await expect(page.locator('script[src*="js.chargebee.com"]')).toHaveCount(0)
    await expect(page.locator('iframe')).toHaveCount(0)
    expect(await page.locator('body').innerText()).not.toMatch(
      forbiddenCustomerLanguage,
    )
    await expectNoDocumentOverflow(page)
  })

  for (const preview of [
    { tier: 'bronze', discount: '5%' },
    { tier: 'silver', discount: '10%' },
    { tier: 'gold', discount: '15%' },
    { tier: 'diamond', discount: '20%' },
  ]) {
    test(`${preview.tier} preview shows the approved discount`, async ({
      page,
    }) => {
      const response = await page.goto(`/insiders?tier=${preview.tier}`)

      expect(response?.status()).toBe(200)
      await expect(
        page.getByText('Current status', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', {
          name: new RegExp(`^${preview.tier}$`, 'i'),
        }),
      ).toBeVisible()
      await expect(
        page.getByText(preview.discount, { exact: true }).first(),
      ).toBeVisible()
      await expect(
        page.getByText('Ride savings', { exact: true }),
      ).toBeVisible()
    })
  }

  test('complimentary founding-member preview is locked to Diamond for life', async ({
    page,
  }) => {
    const response = await page.goto(
      '/insiders?tier=diamond&lifetime=true',
    )

    expect(response?.status()).toBe(200)
    await expect(page.getByText('Diamond for life')).toBeVisible()
    await expect(
      page.getByText(/Complimentary lifetime membership/),
    ).toBeVisible()
    await expect(page.getByText('Top-tier status achieved')).toBeVisible()
    await expectNoDocumentOverflow(page)
  })

  test('member dashboard exposes Moovs activity and benefit expirations', async ({
    page,
  }) => {
    const response = await page.goto('/insiders?tier=gold')

    expect(response?.status()).toBe(200)
    await expect(page.getByText('Moovs activity')).toBeVisible()
    await expect(page.getByText('TRIP-8460')).toBeVisible()
    await expect(page.getByText(/Next expiration Jun 1, 2027/)).toBeVisible()
    await expect(page.getByText(/Next expiration Jul 1, 2027/)).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Insider portal' }),
    ).toBeVisible()
    await expectNoDocumentOverflow(page)
  })

  test('rewards and perk redemption history are transparent', async ({
    page,
  }) => {
    await page.goto('/insiders/rewards')
    await expect(
      page.getByRole('heading', { name: 'Rewards ledger' }),
    ).toBeVisible()
    await expect(page.getByText('Status point history')).toBeVisible()
    await expect(page.getByText('Limo Bus hourly ride')).toBeVisible()
    await expect(page.getByText('Annual member anniversary')).toBeVisible()
    await expect(page.getByText('Tier history')).toBeVisible()

    await page.goto('/insiders/perks')
    await expect(
      page.getByRole('heading', { name: 'Redemption history' }),
    ).toBeVisible()
    await expect(page.getByText('Complimentary appetizer').last()).toBeVisible()
    await expect(page.getByText('Redeemed', { exact: true })).toBeVisible()
    expect(await page.locator('body').innerText()).not.toMatch(
      forbiddenCustomerLanguage,
    )
  })

  test('account owner can open the safe Chargebee plan-change handoff', async ({
    page,
  }) => {
    await page.goto('/insiders/account')

    await expect(
      page.getByRole('button', { name: 'Change plan' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Manage billing' }),
    ).toBeVisible()

    const changePlanButton = page.getByRole('button', { name: 'Change plan' })
    const changePlanForm = changePlanButton.locator('xpath=ancestor::form')
    await expect(changePlanForm).toHaveAttribute(
      'action',
      '/api/insiders/billing/pricing-page',
    )
    await expect(changePlanForm).toHaveAttribute('method', 'post')

    // Exercise the POST directly: Playwright's bundled WebKit can stall on
    // native empty-form navigation even after the server returns its 303.
    const response = await page.request.post(
      '/api/insiders/billing/pricing-page',
      { maxRedirects: 0 },
    )
    expect(response.status()).toBe(303)
    const redirectUrl = response.headers().location
    expect(redirectUrl).toMatch(/\/insiders\/account\?billing=preview/)

    const redirectPage = await page.request.get(redirectUrl)
    expect(redirectPage.status()).toBe(200)
    expect(await redirectPage.text()).toContain(
      'Plan changes open securely in Chargebee for the account owner.',
    )
  })

  test('portal remains responsive and accessible on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const route of ['/insiders?tier=diamond', '/insiders/perks']) {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expectNoDocumentOverflow(page)
    }

    await expectNoSeriousAccessibilityViolations(page)
  })

  test('public offer and dashboard have no serious accessibility violations', async ({
    page,
  }) => {
    for (const route of [
      '/insider-membership-benefits',
      '/insiders?tier=gold',
    ]) {
      await page.goto(route)
      await expectNoSeriousAccessibilityViolations(page)
    }
  })
})
