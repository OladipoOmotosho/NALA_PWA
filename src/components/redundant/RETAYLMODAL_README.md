# RetaylModal System Documentation

## 📚 Documentation Index

Welcome to the **RetaylModal** system - a unified, cross-platform modal component for the Retayl monorepo!

### Quick Links

1. **[Complete Guide](./RETAYLMODAL_GUIDE.md)** - Full API reference, examples, and best practices
2. **[Migration Guide](./RETAYLMODAL_MIGRATION.md)** - Step-by-step migration from legacy modals

---

## 🎯 Quick Start

### Installation

```typescript
import { RetaylModal } from '@retayl/components';
```

### Basic Example

```typescript
<RetaylModal
  variant="success"
  isVisible={true}
  onClose={handleClose}
  title="Success!"
  message="Your changes have been saved."
  primaryButton={{ text: 'Done', onPress: handleClose }}
/>
```

---

## ✨ Key Features

- ✅ **Cross-Platform** - Works on web, mobile, and desktop
- ✅ **6 Variants** - Success, error, warning, info, confirmation, custom
- ✅ **Flexible Buttons** - 1, 2, or 3+ buttons with custom styling
- ✅ **Design System** - Uses all tokens from `@retayl/utils`
- ✅ **Dark Mode** - Automatic theme support
- ✅ **Animations** - Fade, slide, scale
- ✅ **Stacking** - Support for nested modals
- ✅ **TypeScript** - Fully typed with excellent IntelliSense

---

## 🚀 Usage by Variant

### Success

```typescript
<RetaylModal variant="success" title="Success!" message="Done!" />
```

### Error

```typescript
<RetaylModal variant="error" title="Error" message="Failed!" />
```

### Warning

```typescript
<RetaylModal variant="warning" title="Warning" message="Are you sure?" />
```

### Info

```typescript
<RetaylModal variant="info" title="Info" message="New feature!" />
```

### Confirmation

```typescript
<RetaylModal
  variant="confirmation"
  title="Confirm?"
  primaryButton={{ text: 'Yes', onPress: handleYes }}
  secondaryButton={{ text: 'No', onPress: handleNo }}
/>
```

### Custom

```typescript
<RetaylModal variant="custom">
  <YourCustomContent />
</RetaylModal>
```

---

## 📖 Documentation

### For Developers

- **[RETAYLMODAL_GUIDE.md](./RETAYLMODAL_GUIDE.md)** - Complete API documentation
  - All props explained
  - Code examples
  - Best practices
  - Platform differences
  - Troubleshooting

### For Migrating Code

- **[RETAYLMODAL_MIGRATION.md](./RETAYLMODAL_MIGRATION.md)** - Migration guide
  - Before/after examples
  - Step-by-step instructions
  - Common patterns
  - New features you get

---

## 🏗️ Architecture

### Files Structure

```
packages/components/src/lib/shared/
├── RetaylModal.tsx           # Web implementation
├── RetaylModal.native.tsx    # React Native implementation
├── RetaylModal.types.ts      # Shared TypeScript types
├── RETAYLMODAL_README.md     # This file
├── RETAYLMODAL_GUIDE.md      # Complete guide
└── RETAYLMODAL_MIGRATION.md  # Migration guide
```

### How It Works

1. Import `RetaylModal` from `@retayl/components`
2. React Native auto-picks `.native.tsx` on mobile/desktop
3. Web uses `.tsx` with React Portal
4. Both share the same TypeScript types
5. API is **identical** on all platforms!

---

## 🎨 Design System Integration

RetaylModal uses **all** design system tokens:

```typescript
// Colors (dark mode support)
useTheme() → colors.primary, colors.error, etc.

// Spacing
spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl

// Typography
fontSize.xs, fontSize.sm, fontSize.md, fontSize.lg
lineHeight.tight, lineHeight.normal

// Border Radius
radius.sm, radius.md, radius.lg

// Shadows
shadows.lg

// Animations
duration.fast, duration.base, duration.moderate, duration.slow
easing.standard, easing.in, easing.out

// Z-Index
zIndex.modal (1200+)
```

**Result**: Consistent with entire design system! ✨

---

## 🔄 Migration Status

### ✅ Completed

- Core `RetaylModal` implementation (web + native)
- All legacy modals wrapped for backward compatibility
- POS modal migrated (`RequestBusinessAccessModal`)
- Full documentation created
- TypeScript types exported
- ESLint passing
- Dark mode support

### 📝 Deprecated (Still Working)

- `RetaylSuccessModal`
- `RetaylFailedModal`
- `RetaylConfirmationModal`
- `SuccessModal`
- `ConfirmationModal`
- `DeleteModal`
- POS-specific `RetaylModal`

### 🎯 Future

- Gradually migrate existing code
- Eventually remove legacy modals in major version

---

## 🧪 Testing

All implementations:

- ✅ Pass ESLint
- ✅ Pass TypeScript compilation
- ✅ Support dark mode
- ✅ Tested on web
- ✅ Tested on mobile
- ✅ Tested on desktop

---

## 💡 Examples

### Simple Success

```typescript
<RetaylModal
  variant="success"
  isVisible={showSuccess}
  onClose={() => setShowSuccess(false)}
  message="Item saved!"
/>
```

### Delete Confirmation

```typescript
<RetaylModal
  variant="warning"
  isVisible={showDelete}
  onClose={handleClose}
  title="Delete Item?"
  message="This cannot be undone."
  primaryButton={{
    text: 'Delete',
    onPress: handleDelete,
    variant: 'danger'
  }}
  secondaryButton={{
    text: 'Cancel',
    onPress: handleClose
  }}
/>
```

### Custom Form

```typescript
<RetaylModal
  variant="custom"
  isVisible={showForm}
  onClose={handleClose}
  title="Add Customer"
  size="lg"
>
  <form>
    {/* Your form fields */}
  </form>
</RetaylModal>
```

---

## 📱 Platform Support

| Platform           | Implementation           | Status    |
| ------------------ | ------------------------ | --------- |
| Web                | `RetaylModal.tsx`        | ✅ Stable |
| iOS                | `RetaylModal.native.tsx` | ✅ Stable |
| Android            | `RetaylModal.native.tsx` | ✅ Stable |
| Desktop (Electron) | `RetaylModal.native.tsx` | ✅ Stable |

---

## 🤝 Contributing

When making changes:

1. Update both `.tsx` and `.native.tsx` files
2. Keep API identical on both platforms
3. Use design system tokens only
4. Test in light and dark modes
5. Update documentation
6. Add examples

---

## 📞 Support

- **Documentation**: Start with [RETAYLMODAL_GUIDE.md](./RETAYLMODAL_GUIDE.md)
- **Migration Help**: See [RETAYLMODAL_MIGRATION.md](./RETAYLMODAL_MIGRATION.md)
- **Issues**: Check existing code for examples
- **Questions**: Contact platform team

---

## 🎉 Benefits

### For Developers

- One component to learn
- Works everywhere
- Great TypeScript support
- Excellent documentation

### For Users

- Consistent experience
- Beautiful animations
- Dark mode support
- Accessible

### For Codebase

- Less duplication
- Easier maintenance
- Design system compliant
- Future-proof

---

**Start using RetaylModal today!** 🚀

See [RETAYLMODAL_GUIDE.md](./RETAYLMODAL_GUIDE.md) for complete documentation.
