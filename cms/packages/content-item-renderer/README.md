# Content Item Renderer

A React component for dynamically rendering content items based on their content types in the CMS system. Supports both direct content item rendering and fetching content items by key.

## Installation

```bash
npm install @commercetools-demo/contentools-content-item-renderer
```

## Prerequisites

**⚠️ Important**: This component can work with or without a `StateProvider`. If no StateProvider is present and a `baseURL` is provided, it will automatically wrap itself in a StateProvider.

```tsx
import { StateProvider } from '@commercetools-demo/contentools-state';
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';

// Option 1: With StateProvider (recommended for multiple components)
function App() {
  return (
    <StateProvider baseURL="https://your-cms-api.com">
      <ContentItemRenderer component={contentItem} />
    </StateProvider>
  );
}

// Option 2: Standalone usage (automatically creates StateProvider)
function App() {
  return (
    <ContentItemRenderer 
      itemKey="hero-banner-key" 
      baseURL="https://your-cms-api.com" 
    />
  );
}
```

## Usage

### Basic Usage with Content Item Object

```tsx
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';
import { StateProvider } from '@commercetools-demo/contentools-state';

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
      <ContentItemRenderer 
        component={contentItem}
        locale="en-US"
        className="my-custom-class"
      />
    </StateProvider>
  );
};
```

### Usage with Item Key (Fetch from CMS)

```tsx
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';

const MyApp = () => {
  return (
    <ContentItemRenderer 
      itemKey="hero-banner-homepage"
      baseURL="https://your-cms-api.com"
      businessUnitKey="my-business-unit"
      locale="en-US"
      className="my-custom-class"
    />
  );
};
```

### Usage with Draft Content

```tsx
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';

const MyApp = () => {
  return (
    <ContentItemRenderer 
      itemKey="hero-banner-homepage"
      isDraft={true}
      baseURL="https://your-cms-api.com"
      businessUnitKey="my-business-unit"
    />
  );
};
```

### With Error Handling

```tsx
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';
import { StateProvider } from '@commercetools-demo/contentools-state';

const MyApp = () => {
  const handleError = (error: Error) => {
    console.error('Content item rendering failed:', error);
    // Handle error (e.g., send to error reporting service)
  };

  return (
    <StateProvider baseURL="https://your-cms-api.com">
      <ContentItemRenderer 
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
| `component` | `ContentItem` | ⚠️ | - | The content item to render (required if `itemKey` not provided) |
| `itemKey` | `string` | ⚠️ | - | The key of the content item to fetch and render (required if `component` not provided) |
| `isDraft` | `boolean` | ❌ | `false` | Whether to fetch the draft version of the content item (only applies when using `itemKey`) |
| `baseURL` | `string` | ❌ | `''` | Base URL for API calls (required if no StateProvider) |
| `businessUnitKey` | `string` | ❌ | - | The business unit key for fetching content items (only applies when using `itemKey`) |
| `locale` | `string` | ❌ | `'en-US'` | Locale for rendering |
| `className` | `string` | ❌ | - | Additional CSS class name |
| `style` | `React.CSSProperties` | ❌ | - | Additional inline styles |
| `loading` | `boolean` | ❌ | `false` | Show loading state |
| `error` | `string \| null` | ❌ | `null` | Custom error message |
| `onError` | `(error: Error) => void` | ❌ | - | Callback when component fails to render |

**⚠️ Note**: Either `component` OR `itemKey` must be provided, but not both.

## ContentItem Type

```tsx
interface ContentItem {
  id: string;
  type: string; // Content type identifier
  properties: Record<string, any>; // Properties passed to the rendered component
}
```

## How It Works

### Direct Component Rendering
1. **Content Type Resolution**: The renderer fetches the content type definition using the `type` field from the content item
2. **Dynamic Loading**: It dynamically loads and transpiles the React component code associated with the content type
3. **Component Rendering**: The loaded component is rendered with the `properties` from the content item passed as props

### Content Item Fetching (itemKey)
1. **Content Item Fetching**: The renderer fetches the content item from the CMS using the provided `itemKey`
2. **Draft/Published Selection**: Based on the `isDraft` prop, fetches either draft or published version
3. **Content Type Resolution**: Once the content item is fetched, proceeds with the same steps as direct rendering
4. **Component Rendering**: The loaded component is rendered with the fetched content item properties

### Error Handling
- **Loading States**: Shows loading indicators while fetching content items or component code
- **Content Item Not Found**: Displays appropriate error when `itemKey` doesn't exist
- **Component Not Found**: Shows error when content type component cannot be loaded
- **Runtime Errors**: Handles React component errors during rendering
- **Error Boundary**: Catches and displays errors with helpful debugging information

## Error States

The component handles various error scenarios:

- **Validation Errors**: Shows error when neither `component` nor `itemKey` is provided
- **Content Item Fetch Errors**: Displays detailed error when content item cannot be fetched by `itemKey`
- **Loading States**: Shows loading indicators while fetching content items or component code
- **Component Not Found**: Displays error when content type component cannot be loaded
- **Runtime Errors**: Shows detailed error messages with component/item information
- **Error Boundary**: Catches and handles React component errors during rendering

## StateProvider Integration

The `ContentItemRenderer` automatically handles StateProvider requirements:

```tsx
import { StateProvider } from '@commercetools-demo/contentools-state';
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';

// ✅ Option 1: With existing StateProvider (recommended for multiple CMS components)
<StateProvider baseURL="https://your-cms-api.com">
  <ContentItemRenderer component={contentItem} />
  <ContentItemRenderer itemKey="another-item" />
</StateProvider>

// ✅ Option 2: Standalone usage (automatically creates StateProvider)
<ContentItemRenderer 
  itemKey="hero-banner" 
  baseURL="https://your-cms-api.com" 
/>

// ✅ Option 3: Mixed usage (inherits existing StateProvider or creates new one)
<StateProvider baseURL="https://your-cms-api.com">
  <ContentItemRenderer component={contentItem} />
  <ContentItemRenderer 
    itemKey="different-item" 
    baseURL="https://different-api.com" 
  />
</StateProvider>
```

## API Endpoints Used

When using `itemKey`, the component makes API calls to:

- **Published Content Items**: `GET {baseURL}/{businessUnitKey}/published/content-items/{itemKey}`
- **Draft Content Items**: `GET {baseURL}/{businessUnitKey}/content-items/{itemKey}` (when `isDraft=true`)
- **Content Types**: `GET {baseURL}/content-types/{contentTypeKey}`

## Dependencies

- `@commercetools-demo/contentools-state` - For state management and API calls
- `@commercetools-demo/contentools-types` - For TypeScript type definitions
- `react` - React library (peer dependency)

## Browser Compatibility

This component uses modern JavaScript features and requires:
- ES2018+ support
- React 19.0.0 or higher
- Modern bundler with dynamic import support

## Migration from ComponentRenderer

If you're migrating from the previous `ComponentRenderer`:

```tsx
// Old usage
import { ComponentRenderer } from '@commercetools-demo/contentools-content-item-renderer';

<ComponentRenderer component={contentItem} />

// New usage (backward compatible)
import { ContentItemRenderer } from '@commercetools-demo/contentools-content-item-renderer';

<ContentItemRenderer component={contentItem} />

// Or use the new itemKey functionality
<ContentItemRenderer itemKey="my-content-key" baseURL="..." />
```

The `ContentItemRenderer` is fully backward compatible with `ComponentRenderer` usage patterns.
