# RetaylModal - Universal Modal Component Guide

## Overview

**RetaylModal** is a unified, cross-platform modal component that works seamlessly on web, mobile, and desktop. It automatically detects the platform and renders the appropriate implementation.

## Key Features

✅ **Cross-Platform** - Single import works on web and React Native  
✅ **6 Built-in Variants** - Success, error, warning, info, confirmation, custom  
✅ **Design System Compliant** - Uses all tokens from `@retayl/utils`  
✅ **Dark Mode Ready** - Automatic theme support via `useTheme()`  
✅ **Flexible Buttons** - 1, 2, or 3+ buttons with custom styling  
✅ **Modal Stacking** - Support for nested modals  
✅ **Animations** - Fade, slide, scale using design system tokens  
✅ **Accessibility** - WCAG compliant with ARIA labels

---

## Installation

```typescript
import { RetaylModal } from '@retayl/components';
import type { RetaylModalProps, ButtonConfig } from '@retayl/components';
```

---

## Basic Usage

### Simple Success Modal

```typescript
import { RetaylModal } from '@retayl/components';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <RetaylModal
      variant="success"
      isVisible={showModal}
      onClose={() => setShowModal(false)}
      title="Success!"
      message="Your changes have been saved successfully."
      primaryButton={{
        text: 'Done',
        onPress: () => setShowModal(false),
      }}
    />
  );
};
```

### Error Modal

```typescript
<RetaylModal
  variant="error"
  isVisible={showError}
  onClose={handleClose}
  title="Error"
  message="Something went wrong. Please try again."
  primaryButton={{ text: 'Retry', onPress: handleRetry }}
  secondaryButton={{ text: 'Cancel', onPress: handleClose }}
/>
```

### Confirmation Modal

```typescript
<RetaylModal
  variant="confirmation"
  isVisible={showConfirm}
  onClose={handleClose}
  title="Delete Item?"
  message="This action cannot be undone. Are you sure?"
  primaryButton={{
    text: 'Delete',
    onPress: handleDelete,
    variant: 'danger', // Red button
  }}
  secondaryButton={{
    text: 'Cancel',
    onPress: handleClose,
    variant: 'secondary',
  }}
/>
```

### Warning Modal

```typescript
<RetaylModal
  variant="warning"
  isVisible={showWarning}
  onClose={handleClose}
  title="Unsaved Changes"
  message="You have unsaved changes. Do you want to continue?"
  primaryButton={{ text: 'Continue', onPress: handleContinue }}
  secondaryButton={{ text: 'Go Back', onPress: handleClose }}
/>
```

### Info Modal

```typescript
<RetaylModal
  variant="info"
  isVisible={showInfo}
  onClose={handleClose}
  title="New Feature Available"
  message="Check out our new reporting dashboard!"
  primaryButton={{ text: 'Learn More', onPress: handleLearnMore }}
/>
```

---

## Advanced Usage

### Custom Modal with Children

```typescript
<RetaylModal
  variant="custom"
  isVisible={showCustom}
  onClose={handleClose}
  title="Custom Form"
  size="lg"
  scrollable={true}
>
  <form>
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
    <textarea placeholder="Message" />
  </form>
</RetaylModal>
```

### Multiple Buttons (3+)

```typescript
<RetaylModal
  variant="custom"
  isVisible={showMultiButton}
  onClose={handleClose}
  title="Choose Action"
  message="What would you like to do?"
  buttons={[
    { text: 'Skip', variant: 'ghost', onPress: handleSkip },
    { text: 'Save Draft', variant: 'secondary', onPress: saveDraft },
    { text: 'Publish Now', variant: 'primary', onPress: handlePublish },
  ]}
  buttonLayout="row"
/>
```

### Modal with Loading State

```typescript
<RetaylModal
  variant="confirmation"
  isVisible={showSave}
  onClose={handleClose}
  title="Save Changes?"
  message="Your changes will be permanently saved."
  primaryButton={{
    text: 'Save',
    onPress: handleSave,
    loading: isSaving, // Shows spinner
    disabled: isSaving,
  }}
  secondaryButton={{
    text: 'Cancel',
    onPress: handleClose,
  }}
/>
```

### Custom Icon

```typescript
import { CustomIcon } from '@retayl/icons';

<RetaylModal
  variant="custom"
  isVisible={showModal}
  onClose={handleClose}
  title="Custom Modal"
  icon={<CustomIcon />} // Override default variant icon
  message="This modal has a custom icon."
/>
```

### Different Sizes

```typescript
// Small (420px) - Quick messages
<RetaylModal size="sm" {...props} />

// Medium (500px) - Default, forms
<RetaylModal size="md" {...props} />

// Large (700px) - Complex forms
<RetaylModal size="lg" {...props} />

// Extra Large (900px) - Tables, multi-step
<RetaylModal size="xl" {...props} />

// Full (90vw) - Mobile-friendly fullscreen
<RetaylModal size="full" {...props} />

// Auto - Fits content
<RetaylModal size="auto" {...props} />
```

### Animation Types

```typescript
// Fade (default)
<RetaylModal animationType="fade" {...props} />

// Slide from bottom
<RetaylModal animationType="slide" {...props} />

// Scale/zoom
<RetaylModal animationType="scale" {...props} />

// No animation (accessibility)
<RetaylModal animationType="none" {...props} />
```

### Stacked Modals

```typescript
// First modal
<RetaylModal stackLevel={0} {...props} />

// Modal on top of first modal
<RetaylModal stackLevel={1} {...props} />

// Third level (rarely needed)
<RetaylModal stackLevel={2} {...props} />
```

---

## Complete Props Reference

### Core Props

| Prop        | Type                                                                        | Default      | Description                            |
| ----------- | --------------------------------------------------------------------------- | ------------ | -------------------------------------- |
| `isVisible` | `boolean`                                                                   | **required** | Controls modal visibility              |
| `onClose`   | `() => void`                                                                | **required** | Called when modal closes               |
| `variant`   | `'success' \| 'error' \| 'warning' \| 'info' \| 'confirmation' \| 'custom'` | `'custom'`   | Modal type with auto-styling           |
| `title`     | `string \| ReactNode`                                                       | -            | Modal title/heading                    |
| `subtitle`  | `string`                                                                    | -            | Secondary text below title             |
| `message`   | `string \| ReactNode`                                                       | -            | Main message content                   |
| `icon`      | `ReactNode \| string`                                                       | Auto         | Custom icon (auto-selected by variant) |
| `children`  | `ReactNode`                                                                 | -            | Custom content                         |

### Button Props

| Prop              | Type                           | Default | Description             |
| ----------------- | ------------------------------ | ------- | ----------------------- |
| `primaryButton`   | `ButtonConfig`                 | -       | Main action button      |
| `secondaryButton` | `ButtonConfig`                 | -       | Cancel/secondary button |
| `buttons`         | `ButtonConfig[]`               | -       | Array for 3+ buttons    |
| `buttonLayout`    | `'row' \| 'column' \| 'split'` | `'row'` | Button arrangement      |

**ButtonConfig Interface:**

```typescript
interface ButtonConfig {
  text: string; // Button label
  onPress: () => void; // Click handler
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean; // Show spinner
  disabled?: boolean; // Disable interaction
  width?: DimensionValue; // Custom width
  icon?: ReactNode; // Button icon
  testID?: string; // Test identifier
}
```

### Sizing Props

| Prop     | Type                                               | Default | Description          |
| -------- | -------------------------------------------------- | ------- | -------------------- |
| `size`   | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| 'auto'` | `'md'`  | Size preset          |
| `width`  | `DimensionValue`                                   | -       | Override size preset |
| `height` | `DimensionValue`                                   | -       | Custom height        |

### Behavior Props

| Prop                  | Type      | Default | Description                 |
| --------------------- | --------- | ------- | --------------------------- |
| `closeOnOverlayClick` | `boolean` | `true`  | Close on backdrop click     |
| `closeOnEscape`       | `boolean` | `true`  | Close with ESC key (web)    |
| `showCloseButton`     | `boolean` | `true`  | Show X button               |
| `scrollable`          | `boolean` | `true`  | Enable scrolling            |
| `keyboardAware`       | `boolean` | `true`  | Keyboard avoidance (native) |

### Animation Props

| Prop                | Type                                       | Default  | Description       |
| ------------------- | ------------------------------------------ | -------- | ----------------- |
| `animationType`     | `'fade' \| 'slide' \| 'scale' \| 'none'`   | `'fade'` | Animation type    |
| `animationDuration` | `'fast' \| 'base' \| 'moderate' \| 'slow'` | `'slow'` | Animation speed   |
| `stackLevel`        | `number`                                   | `0`      | For nested modals |

### Style Props

| Prop             | Type        | Default | Description            |
| ---------------- | ----------- | ------- | ---------------------- |
| `containerStyle` | `ViewStyle` | -       | Modal container styles |
| `contentStyle`   | `ViewStyle` | -       | Content area styles    |
| `overlayStyle`   | `ViewStyle` | -       | Backdrop styles        |

### Testing Props

| Prop     | Type     | Default | Description     |
| -------- | -------- | ------- | --------------- |
| `testID` | `string` | -       | Test identifier |

---

## Variants Overview

Each variant has auto-selected icons and semantic meaning:

| Variant        | Icon        | Use Case                      | Example                 |
| -------------- | ----------- | ----------------------------- | ----------------------- |
| `success`      | ✓ Checkmark | Successful operations         | "Saved successfully"    |
| `error`        | ✗ Error     | Failures, errors              | "Operation failed"      |
| `warning`      | ⚠️ Warning  | Cautions, destructive actions | "Delete permanently?"   |
| `info`         | ℹ️ Info     | Information, tips             | "New feature available" |
| `confirmation` | ℹ️ Info     | Confirmations, questions      | "Are you sure?"         |
| `custom`       | None        | Custom content                | Forms, tables, etc.     |

---

## Button Variants

| Variant     | Style                     | Use Case            |
| ----------- | ------------------------- | ------------------- |
| `primary`   | Primary color, white text | Main action         |
| `secondary` | Gray background           | Cancel, back        |
| `danger`    | Red background            | Destructive actions |
| `ghost`     | Transparent               | Tertiary actions    |

---

## Migration from Legacy Modals

### Old RetaylSuccessModal → New RetaylModal

```typescript
// ❌ OLD (still works, but deprecated)
import { RetaylSuccessModal } from '@retayl/components';

<RetaylSuccessModal
  isVisible={true}
  setIsVisible={setIsVisible}
  message="Success!"
/>

// ✅ NEW (recommended)
import { RetaylModal } from '@retayl/components';

<RetaylModal
  variant="success"
  isVisible={true}
  onClose={() => setIsVisible(false)}
  message="Success!"
  primaryButton={{ text: 'Done', onPress: () => setIsVisible(false) }}
/>
```

### Old POS RetaylModal → New RetaylModal

```typescript
// ❌ OLD (POS-specific)
import { RetaylModal } from '@retayl/pos-components';

<RetaylModal
  isVisible={true}
  onClose={handleClose}
  title="Title"
  subtitle="Subtitle"
  icon="🎉"
>
  {children}
</RetaylModal>

// ✅ NEW (cross-platform)
import { RetaylModal } from '@retayl/components';

<RetaylModal
  variant="custom"
  isVisible={true}
  onClose={handleClose}
  title="Title"
  subtitle="Subtitle"
  icon="🎉"
>
  {children}
</RetaylModal>
```

---

## Design System Compliance

RetaylModal uses **all** design tokens from `@retayl/utils`:

```typescript
// Colors
useTheme() // All colors are theme-aware (dark mode support)

// Spacing
spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl

// Typography
fontSize.xs, fontSize.sm, fontSize.md, fontSize.lg, fontSize['2xl']
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

---

## Accessibility

RetaylModal follows accessibility best practices:

- ✅ **ARIA labels**: `role="dialog"`, `aria-modal="true"`
- ✅ **Keyboard navigation**: ESC to close, Tab navigation
- ✅ **Screen reader support**: Proper heading hierarchy
- ✅ **Focus management**: Traps focus within modal
- ✅ **Reduced motion**: Respects `prefers-reduced-motion`
- ✅ **Color contrast**: WCAG AA compliant

---

## Best Practices

### DO ✅

- Use semantic variants (`success`, `error`, etc.) for common cases
- Keep messages concise and actionable
- Use primary buttons for main actions
- Provide clear button labels ("Save Changes" not "OK")
- Test in both light and dark modes
- Test on all platforms (web, mobile, desktop)

### DON'T ❌

- Don't nest too many modals (max 2-3 levels)
- Don't use modals for long forms (use full pages)
- Don't hardcode colors (use `useTheme()`)
- Don't block critical user flows with modals
- Don't use vague button text ("Yes"/"No")

---

## Examples by Use Case

### Deleting an Item

```typescript
<RetaylModal
  variant="warning"
  isVisible={showDelete}
  onClose={() => setShowDelete(false)}
  title="Delete Product?"
  message="This will permanently delete this product. This action cannot be undone."
  primaryButton={{
    text: 'Delete Product',
    onPress: handleDelete,
    variant: 'danger',
  }}
  secondaryButton={{
    text: 'Cancel',
    onPress: () => setShowDelete(false),
  }}
/>
```

### Saving Progress

```typescript
<RetaylModal
  variant="info"
  isVisible={showSave}
  onClose={() => setShowSave(false)}
  title="Save Your Progress"
  message="Would you like to save your changes before leaving?"
  buttons={[
    { text: "Don't Save", variant: 'ghost', onPress: handleDiscard },
    { text: 'Cancel', variant: 'secondary', onPress: () => setShowSave(false) },
    { text: 'Save', variant: 'primary', onPress: handleSave },
  ]}
  buttonLayout="row"
/>
```

### Loading Operation

```typescript
<RetaylModal
  variant="custom"
  isVisible={isProcessing}
  onClose={() => {}} // Can't close while processing
  title="Processing Payment"
  message="Please wait while we process your payment..."
  showCloseButton={false}
  closeOnOverlayClick={false}
  primaryButton={{
    text: 'Processing...',
    onPress: () => {},
    loading: true,
    disabled: true,
  }}
/>
```

### Form Modal

```typescript
<RetaylModal
  variant="custom"
  isVisible={showForm}
  onClose={handleClose}
  title="Add New Customer"
  size="lg"
  scrollable={true}
>
  <View style={{ gap: spacing.md }}>
    <RetaylTextInput
      fieldLabel="Full Name"
      value={name}
      onChange={setName}
      required
    />
    <RetaylTextInput
      fieldLabel="Email"
      value={email}
      onChange={setEmail}
      inputMode="email"
      required
    />
    <RetaylTextInput
      fieldLabel="Phone"
      value={phone}
      onChange={setPhone}
      inputMode="tel"
    />

    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
      <RetaylButton
        buttonText="Cancel"
        onClick={handleClose}
        variant="secondary"
      />
      <RetaylButton
        buttonText="Add Customer"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={!name || !email}
      />
    </View>
  </View>
</RetaylModal>
```

---

## Platform Differences

### Web (`RetaylModal.tsx`)

- Uses React Portal for rendering
- CSS animations with design system tokens
- ESC key support
- Prevents body scroll

### React Native (`RetaylModal.native.tsx`)

- Uses React Native `<Modal>` component
- Native animations (fade, slide)
- KeyboardAvoidingView support
- Platform-specific optimizations

**API is identical on both platforms!** ✨

---

## Troubleshooting

### Modal doesn't appear

- Check `isVisible` prop is `true`
- Ensure modal is rendered in component tree
- Check z-index conflicts

### Buttons not working

- Verify `onPress` handlers are defined
- Check if button is `disabled`
- Ensure modal isn't closing too quickly

### Dark mode issues

- Ensure you're using `useTheme()` for custom colors
- Don't hardcode color values
- Test in both light and dark modes

### TypeScript errors

- Import types: `import type { RetaylModalProps } from '@retayl/components'`
- Ensure button configs match `ButtonConfig` interface
- Check variant values are valid

---

## Support

For questions or issues:

- Check existing modals in the codebase for examples
- Refer to design system documentation: `DESIGN_SYSTEM.md`
- Contact the platform team

---

**Happy modal building! 🎉**
