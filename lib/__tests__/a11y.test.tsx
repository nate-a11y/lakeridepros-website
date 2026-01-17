/**
 * Component-Level Accessibility Tests
 *
 * Uses axe-core to run accessibility checks against rendered components.
 * This catches accessibility issues during unit testing.
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, AxeResults } from 'vitest-axe'

// Helper to check for violations
function expectNoViolations(results: AxeResults) {
  const violations = results.violations
  if (violations.length > 0) {
    const messages = violations.map(v =>
      `${v.impact}: ${v.id} - ${v.description}\n  ${v.nodes.map(n => n.html).join('\n  ')}`
    ).join('\n\n')
    throw new Error(`Accessibility violations found:\n\n${messages}`)
  }
  expect(violations).toHaveLength(0)
}

// Example: Testing a button component structure
describe('Accessibility - Component Patterns', () => {
  it('buttons with icons should have accessible names', async () => {
    const { container } = render(
      <button aria-label="Close dialog">
        <svg aria-hidden="true">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('buttons without icons should use text content', async () => {
    const { container } = render(
      <button type="submit">Submit Form</button>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('form inputs should have associated labels', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-required="true"
        />
      </form>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('images should have alt text', async () => {
    const { container } = render(
      <img src="/logo.png" alt="Lake Ride Pros Logo" width={100} height={50} />
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('decorative images can have empty alt', async () => {
    const { container } = render(
      <img src="/decorative.png" alt="" role="presentation" width={100} height={50} />
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('links should have discernible text', async () => {
    const { container } = render(
      <a href="/contact">Contact Us</a>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('dialogs should have proper ARIA attributes', async () => {
    const { container } = render(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('accordions should use proper ARIA patterns', async () => {
    const { container } = render(
      <div>
        <button
          id="accordion-header-1"
          aria-expanded="true"
          aria-controls="accordion-panel-1"
        >
          Section 1
        </button>
        <div
          id="accordion-panel-1"
          role="region"
          aria-labelledby="accordion-header-1"
        >
          <p>Content for section 1</p>
        </div>
      </div>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('navigation should use nav landmark', async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })

  it('headings should be in logical order', async () => {
    const { container } = render(
      <main>
        <h1>Page Title</h1>
        <section>
          <h2>Section Title</h2>
          <p>Content</p>
          <h3>Subsection</h3>
          <p>More content</p>
        </section>
      </main>
    )

    const results = await axe(container)
    expectNoViolations(results)
  })
})
