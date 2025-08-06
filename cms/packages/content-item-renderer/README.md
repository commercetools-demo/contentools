# Content Item Renderer

A React component for dynamically rendering content items based on their content types in the CMS system.

## Installation

```bash
npm install @commercetools-demo/cms-content-item-renderer
```

## Prerequisites

**⚠️ Important**: This component requires a `StateProvider` to be present in the component tree with a `baseURL` prop configured.

```tsx
import { StateProvider } from '@commercetools-demo/cms-state';
import { ComponentRenderer } from '@commercetools-demo/cms-content-item-renderer';

function App() {
  return (
    <StateProvider baseURL="https://your-cms-api.com">
      {/* Your components that use ComponentRenderer */}
      <ComponentRenderer component={contentItem} />
    </StateProvider>
  );
}
```

## Usage

### Basic Usage

```tsx
import { ComponentRenderer } from '@commercetools-demo/cms-content-item-renderer';
import { StateProvider } from '@commercetools-demo/cms-state';

const MyApp = () => {
  const contentItem = {
    id: 'content-item-id',
    type: 'hero-banner',
    properties: {
      title: 'Welcome to our site',
      subtitle: 'Discover amazing products'
    }
  };

  return (
    <StateProvider baseURL="https://your-cms-api.com">
      <ComponentRenderer 
        component={contentItem}
        locale="en-US"
        className="my-custom-class"
      />
    </StateProvider>
  );
};
```

### With Error Handling

```tsx
import { ComponentRenderer } from '@commercetools-demo/cms-content-item-renderer';
import { StateProvider } from '@commercetools-demo/cms-state';

const MyApp = () => {
  const handleError = (error: Error) => {
    console.error('Component rendering failed:', error);
    // Handle error (e.g., send to error reporting service)
  };

  return (
    <StateProvider baseURL="https://your-cms-api.com">
      <ComponentRenderer 
        component={contentItem}
        onError={handleError}
        style={{ marginBottom: '20px' }}
      />
    </StateProvider>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `component` | `ContentItem` | ✅ | - | The content item to render |
| `baseURL` | `string` | ❌ | `''` | Base URL for API calls (optional, can be inherited from StateProvider) |
| `locale` | `string` | ❌ | `'en-US'` | Locale for rendering |
| `className` | `string` | ❌ | - | Additional CSS class name |
| `style` | `React.CSSProperties` | ❌ | - | Additional inline styles |
| `loading` | `boolean` | ❌ | `false` | Show loading state |
| `error` | `string \| null` | ❌ | `null` | Custom error message |
| `onError` | `(error: Error) => void` | ❌ | - | Callback when component fails to render |

## ContentItem Type

```tsx
interface ContentItem {
  id: string;
  type: string; // Content type identifier
  properties: Record<string, any>; // Properties passed to the rendered component
}
```

## How It Works

1. **Content Type Resolution**: The renderer fetches the content type definition using the `type` field from the content item
2. **Dynamic Loading**: It dynamically loads and transpiles the React component code associated with the content type
3. **Component Rendering**: The loaded component is rendered with the `properties` from the content item passed as props
4. **Error Handling**: If loading or rendering fails, appropriate error states are displayed

## Error States

The component handles various error scenarios:

- **Loading State**: Shows a loading indicator while fetching content type and component code
- **Component Not Found**: Displays a "Component not found" message
- **Runtime Errors**: Shows a detailed error message with component ID and error details
- **Error Boundary**: Catches and handles React component errors during rendering

## StateProvider Requirement

The `ComponentRenderer` uses the `useStateContentType` hook internally, which requires access to the state context. Make sure to wrap your application or the part of your component tree that uses `ComponentRenderer` with the `StateProvider`:

```tsx
import { StateProvider } from '@commercetools-demo/cms-state';

// ✅ Correct usage
<StateProvider baseURL="https://your-cms-api.com">
  <ComponentRenderer component={contentItem} />
</StateProvider>

// ❌ Will throw error: "useStateContext must be used within a StateProvider"
<ComponentRenderer component={contentItem} />
```

## Dependencies

- `@commercetools-demo/cms-state` - For state management and API calls
- `@commercetools-demo/cms-types` - For TypeScript type definitions
- `react` - React library (peer dependency)

## Browser Compatibility

This component uses modern JavaScript features and requires:
- ES2018+ support
- React 19.0.0 or higher
- Modern bundler with dynamic import support
