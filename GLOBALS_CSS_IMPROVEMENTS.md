# Recommended Improvements to globals.css

This document outlines the specific changes needed to improve the global stylesheet for better brand compliance, consistency, and maintainability.

---

## 1. Color Variable Fixes

### Fix: `--lrp-gray` Value (Line 33)

**Current:**
```css
--lrp-gray: #e8e8e8;
```

**Correct (per brand spec):**
```css
--lrp-gray: #e6e6e6;
```

---

## 2. Missing CSS Variables to Add

Add these variables in the `:root` section after line 59:

```css
/* Additional Background Colors (for ShopClient and dark UI) */
--lrp-bg-secondary: #0f0f0f;
--lrp-bg-tertiary: #1a1a1a;

/* Border Colors */
--lrp-border-subtle: #1a1a1a;
--lrp-border-muted: #333333;

/* Spacing Scale (for design system consistency) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Border Radius Scale */
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-3xl: 1.5rem;   /* 24px */
--radius-full: 9999px;

/* Box Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-green-sm: 0 4px 16px rgba(76, 187, 23, 0.2);
--shadow-green-md: 0 8px 24px rgba(76, 187, 23, 0.3);
--shadow-green-lg: 0 12px 32px rgba(76, 187, 23, 0.4);

/* Z-Index Scale */
--z-dropdown: 50;
--z-sticky: 100;
--z-modal: 1000;
--z-tooltip: 1500;
```

---

## 3. Add to @theme inline (After Line 110)

```css
/* Additional Theme Colors */
--color-lrp-bg-secondary: var(--lrp-bg-secondary);
--color-lrp-bg-tertiary: var(--lrp-bg-tertiary);
--color-lrp-border-subtle: var(--lrp-border-subtle);
```

---

## 4. CelebriSans Bold Font (When Available)

When the CelebriSans Bold font file is obtained, add after line 11:

```css
/* CelebriSans Bold - Brand slogan and emphasis font */
@font-face {
  font-family: 'CelebriSans';
  src: url('/CelebriSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

And add to @theme inline after line 105:

```css
--font-celebri: 'CelebriSans', 'Montserrat', ui-sans-serif, system-ui, sans-serif;
```

---

## 5. New Utility Classes to Add

Add in `@layer utilities` section:

```css
/* CelebriSans Bold utility class */
.font-celebri {
  font-family: var(--font-celebri);
  font-weight: 700;
}

/* Additional background utilities for ShopClient */
.bg-lrp-secondary {
  background-color: var(--lrp-bg-secondary);
}

.bg-lrp-tertiary {
  background-color: var(--lrp-bg-tertiary);
}

/* Green shadow utilities */
.shadow-green-sm {
  box-shadow: var(--shadow-green-sm);
}

.shadow-green-md {
  box-shadow: var(--shadow-green-md);
}

.shadow-green-lg {
  box-shadow: var(--shadow-green-lg);
}
```

---

## 6. Files to Update After These Changes

Once these CSS variables are added, update the following files to use them:

### app/(site)/shop/ShopClient.tsx

Replace:
- `bg-[#060606]` → `bg-lrp-black`
- `bg-[#0f0f0f]` → `bg-lrp-secondary`
- `border-[#1a1a1a]` → `border-lrp-border-subtle`
- `shadow-[0_4px_16px_rgba(76,187,23,0.4)]` → `shadow-green-sm`
- `shadow-[0_8px_24px_rgba(76,187,23,0.3)]` → `shadow-green-md`

### components/HeroSection.tsx

Replace:
```tsx
// From:
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold ...">

// To:
<h1 className="font-boardson text-4xl sm:text-5xl lg:text-6xl ...">
```

---

## 7. Complete Updated :root Section

Here's what the complete `:root` section should look like:

```css
:root {
  --background: #ffffff;
  --foreground: #060606;

  /* Lake Ride Pros Brand Colors - Energetic Green (same in both modes) */
  --primary: #4cbb17;
  --primary-dark: #3a8e11;
  --primary-light: #60e421;
  --secondary: #4cbb17;
  --secondary-dark: #3a8e11;
  --secondary-light: #60e421;

  /* Brand color aliases for consistency */
  --lrp-green: #4cbb17;
  --lrp-green-light: #5cd91f;
  --lrp-green-dark: #3a8e11;
  --lrp-black: #060606;
  --lrp-gray: #e6e6e6;  /* FIXED: was #e8e8e8 */

  /* Additional Background Colors */
  --lrp-bg-secondary: #0f0f0f;
  --lrp-bg-tertiary: #1a1a1a;

  /* Border Colors */
  --lrp-border-subtle: #1a1a1a;
  --lrp-border-muted: #333333;

  /* WCAG AA Compliant Text Colors for Light Mode */
  --lrp-text-secondary: #666666;  /* 7:1 contrast on white */
  --lrp-text-muted: #737373;      /* 4.5:1 contrast on white */

  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e6e6e6;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;

  /* Dark Mode specific colors */
  --dark-bg-primary: #0a0a0a;
  --dark-bg-secondary: #1a1a1a;
  --dark-bg-tertiary: #2a2a2a;
  --dark-border: #333333;

  /* WCAG AA Compliant Text Colors for Dark Mode */
  --dark-text-primary: #ffffff;
  --dark-text-secondary: #d1d1d1;  /* 10:1 contrast on dark */
  --dark-text-muted: #b8b8b8;      /* 7:1 contrast on dark */

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border Radius Scale */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Box Shadow Scale */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-green-sm: 0 4px 16px rgba(76, 187, 23, 0.2);
  --shadow-green-md: 0 8px 24px rgba(76, 187, 23, 0.3);
  --shadow-green-lg: 0 12px 32px rgba(76, 187, 23, 0.4);

  /* Z-Index Scale */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal: 1000;
  --z-tooltip: 1500;
}
```

---

## Implementation Notes

1. **Priority:** Fix the `--lrp-gray` value first as it's a direct brand violation
2. **Testing:** After adding variables, search for hardcoded hex values and replace systematically
3. **Backwards Compatibility:** These additions won't break existing styles
4. **Documentation:** Update any style guides to reference these new variables
