# Toast Container Documentation

The `ToastContainer` provides a global toast notification system for displaying success, error, warning, and info messages across all Retayl applications.

## Features

- **Automatic API Error Handling**: All API errors are automatically displayed as error toasts
- **Automatic API Success Handling**: Mutation responses (POST, PUT, PATCH, DELETE) with success messages are automatically displayed as success toasts
- **Manual Toast Control**: Dispatch custom toasts programmatically
- **Multiple Toast Types**: Support for error, success, warning, and info toasts
- **Auto-dismiss**: Toasts automatically disappear after a set duration
- **Click to Dismiss**: Users can click on toasts to dismiss them manually
- **Consistent Styling**: Unified design across all applications

## Setup

### 1. Add ToastContainer to Your App

The `ToastContainer` should be added to your app's root component (usually `_app.tsx`):

```tsx
import { ToastContainer } from '@retayl/components';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}
```

### 2. Ensure Redux Store Includes Toast Reducer

The toast reducer should already be included in `@retayl/redux`, but verify your store includes it:

```tsx
import { store } from '@retayl/redux'; // Toast reducer is already included
```

## Automatic Behavior

### API Error Handling

All API errors (except 401 authentication errors) are automatically displayed as error toasts:

```tsx
// This API call will automatically show an error toast if it fails
const { data, error } = useGetProductsQuery();
// No manual error handling needed!
```

### API Success Handling

Mutation responses (HTTP `POST`, `PUT`, `PATCH`, or `DELETE`) that include a `message` field are automatically displayed as success toasts. `GET` requests are excluded to avoid noise from passive background fetches.

```tsx
// If the mutation returns { data: {...}, message: "Product created successfully" }
// A success toast will automatically appear
const [createProduct] = useCreateProductMutation();
await createProduct(productData);
```

## Manual Toast Usage

### Basic Usage

```tsx
import { useDispatch } from 'react-redux';
import { addToast } from '@retayl/redux';

const MyComponent = () => {
  const dispatch = useDispatch();

  const showSuccessToast = () => {
    dispatch(
      addToast({
        message: 'Operation completed successfully!',
        type: 'success',
        duration: 3000, // Optional: defaults to 5000ms for errors, 3000ms for success
      }),
    );
  };

  const showErrorToast = () => {
    dispatch(
      addToast({
        message: 'Something went wrong!',
        type: 'error',
      }),
    );
  };

  const showWarningToast = () => {
    dispatch(
      addToast({
        message: 'Please check your input',
        type: 'warning',
      }),
    );
  };

  const showInfoToast = () => {
    dispatch(
      addToast({
        message: 'Here is some information',
        type: 'info',
      }),
    );
  };

  return (
    <div>
      <button onClick={showSuccessToast}>Show Success</button>
      <button onClick={showErrorToast}>Show Error</button>
      <button onClick={showWarningToast}>Show Warning</button>
      <button onClick={showInfoToast}>Show Info</button>
    </div>
  );
};
```

### Custom Hook for Convenience

You can create a custom hook for easier toast usage:

```tsx
import { useDispatch } from 'react-redux';
import { addToast } from '@retayl/redux';

export const useToast = () => {
  const dispatch = useDispatch();

  return {
    showSuccess: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'success', duration }));
    },
    showError: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'error', duration }));
    },
    showWarning: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'warning', duration }));
    },
    showInfo: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'info', duration }));
    },
  };
};

// Usage
const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.showSuccess('Data saved successfully!');
  };

  return <button onClick={handleSuccess}>Save Data</button>;
};
```

## Toast Types and Styling

### Toast Types

- **error**: Red background, used for error messages (default duration: 5000ms)
- **success**: Green background, used for success messages (default duration: 3000ms)
- **warning**: Yellow background, used for warnings (default duration: 5000ms)
- **info**: Blue background, used for informational messages (default duration: 5000ms)

### Positioning

Toasts appear in the top-right corner of the screen with a high z-index to ensure they appear above all other content.

## Advanced Usage

### Managing Multiple Toasts

```tsx
import { useDispatch } from 'react-redux';
import { addToast, removeToast, clearAllToasts } from '@retayl/redux';

const MyComponent = () => {
  const dispatch = useDispatch();

  // Remove a specific toast by ID
  const removeSpecificToast = (toastId: string) => {
    dispatch(removeToast(toastId));
  };

  // Clear all toasts
  const clearAll = () => {
    dispatch(clearAllToasts());
  };

  return (
    <div>
      <button onClick={clearAll}>Clear All Toasts</button>
    </div>
  );
};
```

### Accessing Current Toasts

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '@retayl/redux';

const MyComponent = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  return (
    <div>
      <p>Current toasts: {toasts.length}</p>
    </div>
  );
};
```

## Migration from Other Toast Libraries

If you're migrating from `react-hot-toast` or other toast libraries:

### Before (react-hot-toast)

```tsx
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
```

### After (ToastContainer)

```tsx
import { useDispatch } from 'react-redux';
import { addToast } from '@retayl/redux';

const dispatch = useDispatch();

dispatch(addToast({ message: 'Success message', type: 'success' }));
dispatch(addToast({ message: 'Error message', type: 'error' }));
```

## Best Practices

1. **Let API errors handle themselves**: Don't manually handle API errors unless you need custom behavior
2. **Use appropriate toast types**: Match the toast type to the message context
3. **Keep messages concise**: Toast messages should be brief and actionable
4. **Don't overuse toasts**: Only show toasts for important user feedback
5. **Test toast behavior**: Ensure toasts don't interfere with user workflows

## Troubleshooting

### Toasts Not Appearing

1. Ensure `ToastContainer` is added to your app root
2. Verify the Redux store includes the toast reducer
3. Check that you're dispatching the correct action

### Styling Issues

1. Ensure the toast container has sufficient z-index
2. Check for CSS conflicts with your app's styles
3. Verify the toast positioning doesn't conflict with your layout

### Performance Concerns

1. The toast system is optimized for performance
2. Old toasts are automatically cleaned up
3. Multiple toasts are handled efficiently
