# Payload CMS Styling Fix - Quick Reference

## 🎯 Root Cause
**Payload's default focus state uses success color:**
```scss
// packages/ui/src/scss/vars.scss line 52
$focus-box-shadow: 0 0 0 $style-stroke-width-m var(--theme-success-500);
```

If your theme made success = green, everything focused is now green = confusion.

## 🔧 The Fix
Create `custom.scss` in project root:

```scss
@import '~@payloadcms/ui/scss';

@layer payload {
  // 1. Fix focus - make it blue, not success green
  :root {
    --focus-color: #3b82f6;
  }
  
  input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 0 2px var(--focus-color);
    border-color: var(--focus-color);
  }
  
  // 2. Error fields = red
  .field--error input,
  .field--error textarea {
    border-color: var(--color-error-500);
    background-color: var(--color-error-50);
    
    &:focus {
      box-shadow: 0 0 0 2px var(--color-error-500);
    }
  }
  
  // 3. Danger buttons = red
  .btn--style-danger,
  .popup__button-group .btn--style-primary:last-child {
    background-color: var(--color-error-500);
    color: white;
  }
  
  // 4. Cancel = neutral
  .popup__button-group .btn--style-secondary {
    background-color: transparent;
    border: 1px solid var(--theme-elevation-400);
  }
  
  // 5. Subtle toasts
  .Toastify__toast--success {
    background-color: var(--theme-elevation-50);
    border: 1px solid var(--theme-elevation-200);
    border-left: 4px solid var(--color-success-500);
  }
}
```

## 📊 Color System

| State | Color | Variable |
|-------|-------|----------|
| **Focus** | Blue (#3b82f6) | `--focus-color` |
| **Error** | Red | `--color-error-500` |
| **Success** | Blue/teal | `--color-success-500` |
| **Warning** | Orange | `--color-warning-500` |
| **Neutral** | Gray | `--theme-elevation-*` |

## ✅ Test Checklist

1. **Validation:** Invalid fields = red, valid = neutral
2. **Focus:** Tab through inputs = blue focus ring
3. **Modals:** Delete button = red, Cancel = gray
4. **Toasts:** Success = subtle, Error = prominent red
5. **Dark mode:** Still works (Payload handles automatically)

## 🐛 Troubleshooting

**Styles not applying?**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check SCSS compilation
npm ls sass  # Should be installed
```

**Still seeing green?**
- Inspect element in DevTools
- Find actual class name Payload is using
- Add more specific selector to custom.scss

**Import error?**
```scss
// If @import fails, remove it and use direct variables
@layer payload {
  /* your styles */
}
```

## 📚 References
- [Payload SCSS Source](https://github.com/payloadcms/payload/tree/73a18dc088d829e5da729adf5be6d5010fe20ae7/packages/ui/src/scss)
- [Payload CSS Customization Docs](https://payloadcms.com/docs/admin/customizing-css)
- Full prompt: `payload-styling-fix-prompt.md`
