# Page Renderer Package

A React component package for rendering complete pages with layout grids and components. This package is similar to `content-item-renderer` but specifically designed for rendering pages with their grid layouts.

## Features

- ✅ Renders complete pages with grid layouts
- ✅ Supports both standalone and contextual rendering
- ✅ Error boundary implementation
- ✅ Responsive grid system
- ✅ Content item rendering within grid cells
- ✅ TypeScript support
- ✅ Proper state management integration

## Usage

```tsx
import { PageRenderer } from '@commercetools-demo/contentools-page-renderer';

// Using with page object
<PageRenderer
  page={pageObject}
  baseURL="https://api.example.com"
  businessUnitKey="my-business-unit"
  locale="en-US"
/>

// Using with pageKey
<PageRenderer
  pageKey="my-page-key"
  baseURL="https://api.example.com"
  businessUnitKey="my-business-unit"
  locale="en-US"
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `page` | `Page` | The page object to render (required if pageKey is not provided) |
| `pageKey` | `string` | The key of the page to fetch and render (required if page is not provided) |
| `query` | `string` | Query string for fetching pages (not yet implemented) |
| `isDraft` | `boolean` | Whether to render draft version (not yet implemented) |
| `baseURL` | `string` | Base URL for API calls |
| `businessUnitKey` | `string` | Business unit key for scoped API calls |
| `locale` | `string` | Locale for rendering (default: 'en-US') |
| `className` | `string` | Additional CSS class name |
| `style` | `React.CSSProperties` | Additional styles |
| `loading` | `boolean` | Show loading state |
| `error` | `string \| null` | Custom error message |
| `onError` | `(error: Error) => void` | Error callback |

## Architecture

The package follows the same pattern as `content-item-renderer`:

1. **PageRenderer** (main entry point) - Smart wrapper with error boundary
2. **ContextualRenderer** - Renders within existing StateProvider context
3. **StandaloneRenderer** - Wraps in StateProvider if context missing
4. **PageResolver** - Handles page fetching and resolution
5. **PageGridRenderer** - Renders the actual page grid layout

## Grid System

The page renderer creates a responsive CSS Grid based on the page's layout configuration:

- Each row becomes a CSS grid container
- Cells use `grid-column: span X` for responsive behavior
- Default 12-column grid system with 1rem gaps
- Content items are rendered within grid cells using ContentItemRenderer

## Dependencies

- `@commercetools-demo/contentools-types` - Type definitions
- `@commercetools-demo/contentools-state` - State management
- `@commercetools-demo/contentools-content-item-renderer` - For rendering content items
- `@commercetools-demo/contentools-ui-components` - UI components
- `@emotion/react` - Styling
- `styled-components` - Component styling

## Missing Features / Limitations

Compared to `content-item-renderer`, the following features are not yet implemented:

### 1. Published Version Support
- ❌ `fetchPublishedPage` method not available in `useStatePages` hook
- ❌ `isDraft` prop functionality limited
- **Impact**: Can only fetch draft versions of pages currently

### 2. Query Support
- ❌ `queryPage` / `queryPublishedPage` methods not available in `useStatePages` hook
- ❌ `query` prop throws warning and error
- **Impact**: Cannot fetch pages by query string

### 3. Advanced Grid Features
- ❌ Grid breakpoint customization
- ❌ Custom grid gap configuration
- ❌ Grid alignment and justification options
- **Impact**: Limited responsive design customization

### 4. Page-level Metadata Rendering
- ❌ Page title, meta description, SEO tags
- ❌ Route-based rendering
- **Impact**: SEO and metadata features not available

### 5. Layout Validation
- ❌ Grid layout validation and error handling
- ❌ Cell overlap detection
- ❌ Missing content item handling in cells
- **Impact**: Potential layout issues with invalid configurations

## Recommendations for Future Development

1. **Extend useStatePages hook** to include:
   - `fetchPublishedPage(hydratedUrl, pageKey)`
   - `queryPage(hydratedUrl, query)`
   - `queryPublishedPage(hydratedUrl, query)`

2. **Add page metadata rendering**:
   - Title and meta tag rendering
   - SEO optimization features
   - Open Graph and Twitter Card support

3. **Enhance grid system**:
   - Custom breakpoint configuration
   - Grid template customization
   - Better responsive behavior

4. **Add layout validation**:
   - Cell overlap detection
   - Grid consistency checks
   - Content item availability validation

5. **Performance optimizations**:
   - Lazy loading for off-screen content
   - Content item caching
   - Grid virtualization for large layouts

## Example Page Structure

```json
{
  "key": "homepage",
  "name": "Homepage",
  "route": "/",
  "layout": {
    "rows": [
      {
        "id": "row1",
        "cells": [
          {
            "id": "cell1",
            "contentItemKey": "hero-banner",
            "colSpan": 12
          }
        ]
      },
      {
        "id": "row2", 
        "cells": [
          {
            "id": "cell2",
            "contentItemKey": "featured-products",
            "colSpan": 8
          },
          {
            "id": "cell3",
            "contentItemKey": "sidebar-banner",
            "colSpan": 4
          }
        ]
      }
    ]
  },
  "components": [
    {
      "key": "hero-banner",
      "type": "banner",
      "properties": { ... }
    },
    {
      "key": "featured-products",
      "type": "product-grid", 
      "properties": { ... }
    }
  ]
}
```
