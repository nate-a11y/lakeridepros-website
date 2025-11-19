# Accessibility Violations - Fix Guide with Code Examples

## Overview
This document provides exact code fixes for all identified accessibility violations.

---

## CRITICAL FIX #1: Header Dropdown Keyboard Navigation

**File**: `/home/user/lakeridepros-website/components/HeaderClient.tsx`  
**Lines**: 122-215  
**WCAG**: 2.1.1 Keyboard

### Problem
Dropdowns only open on mouse hover. Keyboard users cannot access Services, Partners, or Insiders menus.

### Current Code (BROKEN)
```jsx
<div
  onMouseEnter={() => {
    if (item.dropdownType === 'services') setServicesDropdownOpen(true);
  }}
  onMouseLeave={() => {
    if (item.dropdownType === 'services') setServicesDropdownOpen(false);
  }}
>
  <button className="text-lrp-black ...">
    {item.name}
    <ChevronDown className="w-4 h-4" />
  </button>

  {item.dropdownType === 'services' && servicesDropdownOpen && (
    <div className="absolute top-full left-0 ... z-50">
      {/* Dropdown menu */}
    </div>
  )}
</div>
```

### Fixed Code
```jsx
<div
  onMouseEnter={() => {
    if (item.dropdownType === 'services') setServicesDropdownOpen(true);
  }}
  onMouseLeave={() => {
    if (item.dropdownType === 'services') setServicesDropdownOpen(false);
  }}
>
  <button
    className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-semibold flex items-center gap-1"
    onFocus={() => {
      if (item.dropdownType === 'services') setServicesDropdownOpen(true);
      if (item.dropdownType === 'partners') setPartnersDropdownOpen(true);
      if (item.dropdownType === 'insiders') setInsidersDropdownOpen(true);
    }}
    onBlur={() => {
      // Delay to allow clicking items in dropdown
      setTimeout(() => {
        if (item.dropdownType === 'services') setServicesDropdownOpen(false);
        if (item.dropdownType === 'partners') setPartnersDropdownOpen(false);
        if (item.dropdownType === 'insiders') setInsidersDropdownOpen(false);
      }, 200);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (item.dropdownType === 'services') setServicesDropdownOpen(!servicesDropdownOpen);
        if (item.dropdownType === 'partners') setPartnersDropdownOpen(!partnersDropdownOpen);
        if (item.dropdownType === 'insiders') setInsidersDropdownOpen(!insidersDropdownOpen);
      }
      if (e.key === 'Escape') {
        if (item.dropdownType === 'services') setServicesDropdownOpen(false);
        if (item.dropdownType === 'partners') setPartnersDropdownOpen(false);
        if (item.dropdownType === 'insiders') setInsidersDropdownOpen(false);
        e.currentTarget.blur();
      }
    }}
  >
    {item.name}
    <ChevronDown className="w-4 h-4" />
  </button>

  {item.dropdownType === 'services' && servicesDropdownOpen && (
    <div 
      className="absolute top-full left-0 pt-0 w-[600px] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border p-6 z-50"
      role="menu"
    >
      {/* Dropdown menu */}
    </div>
  )}
</div>
```

---

## CRITICAL FIX #2: Newsletter Input Missing Label

**File**: `/home/user/lakeridepros-website/components/NewsletterSignup.tsx`  
**Lines**: 50-68  
**WCAG**: 1.3.1 Info and Relationships

### Problem
Email input has placeholder text but no associated `<label>` element. Screen readers announce it as "edit text" with no context.

### Current Code (BROKEN)
```jsx
<form onSubmit={handleSubmit} className="max-w-md mx-auto">
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      required
      disabled={status === 'loading'}
      className="flex-1 px-4 py-3 rounded-lg border-0 bg-white dark:bg-dark-bg-secondary dark:text-white dark:placeholder-neutral-400 focus:ring-2 focus:ring-secondary dark:focus:ring-primary focus:outline-none disabled:opacity-50 transition-colors"
    />
    <button type="submit" ...>
      {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
    </button>
  </div>
</form>
```

### Fixed Code
```jsx
<form onSubmit={handleSubmit} className="max-w-md mx-auto">
  <div className="flex flex-col sm:flex-row gap-3">
    <label htmlFor="newsletter-email" className="sr-only">
      Email address for newsletter subscription
    </label>
    <input
      id="newsletter-email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      required
      disabled={status === 'loading'}
      aria-label="Email address for newsletter subscription"
      aria-required="true"
      className="flex-1 px-4 py-3 rounded-lg border-0 bg-white dark:bg-dark-bg-secondary dark:text-white dark:placeholder-neutral-400 focus:ring-2 focus:ring-secondary dark:focus:ring-primary focus:outline-none disabled:opacity-50 transition-colors"
    />
    <button type="submit" ...>
      {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
    </button>
  </div>
</form>
```

### What Changed
1. Added `<label htmlFor="newsletter-email">` with sr-only class (hidden visually)
2. Added `id="newsletter-email"` to input to link label
3. Added `aria-label` as backup
4. Added `aria-required="true"` to emphasize required field

---

## CRITICAL FIX #3: Partner Filters Search Input Missing Label

**File**: `/home/user/lakeridepros-website/components/PartnerFilters.tsx`  
**Lines**: 24-45  
**WCAG**: 1.3.1 Info and Relationships

### Problem
Search input has placeholder but no associated label. Screen readers have no way to announce the field's purpose.

### Current Code (BROKEN)
```jsx
<div className="mb-8 space-y-4">
  <div className="relative max-w-2xl">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary" />
    </div>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search partners by name or description..."
      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white placeholder-lrp-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-lrp-green focus:border-transparent"
    />
```

### Fixed Code
```jsx
<div className="mb-8 space-y-4">
  <div className="relative max-w-2xl">
    <label htmlFor="partner-search" className="sr-only">
      Search partners by name or description
    </label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search 
        className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary" 
        aria-hidden="true"
      />
    </div>
    <input
      id="partner-search"
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search partners by name or description..."
      aria-label="Search partners by name or description"
      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white placeholder-lrp-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-lrp-green focus:border-transparent"
    />
```

### What Changed
1. Added `<label htmlFor="partner-search">` with sr-only class
2. Added `id="partner-search"` to input
3. Added `aria-label` as backup
4. Added `aria-hidden="true"` to Search icon since label covers it

---

## MEDIUM FIX #1: External Links - New Tab Indicator

**File**: `/home/user/lakeridepros-website/app/(site)/accessibility/page.tsx`  
**Lines**: 36-43, 182-188  
**WCAG**: 3.2.2 On Input

### Problem
Links with `target="_blank"` don't indicate they open in new tabs. Users are surprised.

### Current Code (BROKEN)
```jsx
<a
  href="https://www.w3.org/WAI/WCAG21/quickref/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary hover:text-primary-dark underline"
>
  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
</a>
```

### Fixed Code
```jsx
<a
  href="https://www.w3.org/WAI/WCAG21/quickref/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary hover:text-primary-dark underline"
  aria-label="Web Content Accessibility Guidelines (WCAG) 2.1 Level AA (opens in new tab)"
>
  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
  <span aria-hidden="true"> (opens in new tab)</span>
</a>
```

### What Changed
1. Added `aria-label` that includes "(opens in new tab)"
2. Added visible text in `<span>` for sighted users
3. Added `aria-hidden="true"` to visual indicator so screen readers don't read it twice

---

## MEDIUM FIX #2: CartDrawer Backdrop - Keyboard Support

**File**: `/home/user/lakeridepros-website/components/CartDrawer.tsx`  
**Lines**: 15-21  
**WCAG**: 2.1.1 Keyboard

### Problem
Backdrop div has onClick handler but is not keyboard accessible. Not all users can click with a mouse.

### Current Code (BROKEN)
```jsx
<>
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    onClick={closeCart}
  />

  {/* Drawer */}
  <div className="fixed right-0 top-0 ...">
```

### Fixed Code (Option 1: Hide from interaction)
```jsx
<>
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    role="presentation"
    aria-hidden="true"
    onClick={closeCart}
  />

  {/* Drawer */}
  <div className="fixed right-0 top-0 ...">
```

### Fixed Code (Option 2: Make keyboard accessible)
```jsx
<>
  {/* Backdrop */}
  <button
    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    onClick={closeCart}
    onKeyDown={(e) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    }}
    aria-label="Close shopping cart"
    type="button"
  />

  {/* Drawer */}
  <div className="fixed right-0 top-0 ...">
```

**Recommendation**: Use Option 1 (hide) since Escape key and close button handle closing.

---

## LOW FIX #1: VehicleCard SVG - Add aria-hidden

**File**: `/home/user/lakeridepros-website/components/VehicleCard.tsx`  
**Lines**: 44-54  
**WCAG**: 1.1.1 Text Alternatives

### Problem
Decorative SVG (people icon) doesn't have `aria-hidden="true"`. Screen readers might announce it redundantly.

### Current Code (BROKEN)
```jsx
<div className="flex items-center justify-between">
  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
    <svg
      className="h-5 w-5 mr-1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857..." />
    </svg>
    <span>Capacity: {vehicle.capacity}</span>
  </div>
```

### Fixed Code
```jsx
<div className="flex items-center justify-between">
  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
    <svg
      className="h-5 w-5 mr-1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857..." />
    </svg>
    <span>Capacity: {vehicle.capacity}</span>
  </div>
```

---

## Testing Your Fixes

### Manual Testing
1. **Keyboard Navigation**: Use Tab key only (no mouse)
   - Can you access all dropdown menus?
   - Can you close all modals with Escape?

2. **Screen Reader Testing**: Install NVDA (Windows, free)
   - Does it read all form labels?
   - Does it indicate new tab links?

3. **Browser DevTools**:
   - Open DevTools > Accessibility > Check for violations

### Automated Testing
```bash
# Install axe testing
npm install -D @axe-core/react

# Run in your React components
import { axe, toHaveNoViolations } from 'jest-axe';
expect(await axe(container)).toHaveNoViolations();
```

---

## Priority Implementation Order

1. **Day 1**: Fix header dropdown keyboard navigation
2. **Day 1**: Add labels to newsletter and partner filters
3. **Day 2**: Add external link indicators
4. **Day 2**: Fix CartDrawer backdrop
5. **Day 3**: Add aria-hidden to VehicleCard SVG

---

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/)

