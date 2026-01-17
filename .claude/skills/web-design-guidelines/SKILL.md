---
description: Review UI code for Vercel Web Interface Guidelines compliance
argument-hint: <file-or-pattern>
---

# Web Design Guidelines

Review files for compliance with web interface best practices.

## When to Use

Apply these guidelines when:
- Creating new UI components
- Reviewing code for accessibility issues
- Auditing design and UX compliance
- Implementing forms, modals, or interactive elements

## How to Use

Read the specified files and check against the rules in `AGENTS.md`. Output findings in `file:line` format.

## Quick Reference

### Accessibility (Critical for this project)

- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers
- `<button>` for actions, `<a>`/`<Link>` for navigation
- Images need `alt` (or `alt=""` if decorative)
- Use semantic HTML before ARIA

### Focus States

- Interactive elements need visible focus: `focus-visible:ring-*`
- Never `outline-none` without focus replacement
- Use `:focus-visible` over `:focus`

### Forms

- Inputs need `autocomplete` and meaningful `name`
- Use correct `type` and `inputmode`
- Labels clickable via `htmlFor` or wrapping
- Errors inline next to fields

### Animation

- Honor `prefers-reduced-motion`
- Animate `transform`/`opacity` only
- Never `transition: all`

### Performance

- Large lists (>50 items): virtualize
- No layout reads in render
- `<img>` needs explicit `width` and `height`

## Output Format

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain

## src/Card.tsx

pass
```

State issue + location. Skip explanation unless fix non-obvious.
