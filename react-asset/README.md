# CMS React Asset

This is the React version of the CMS web components application. It provides the same functionality as the original web components but uses React and Redux for state management.

## Installation

```bash
yarn install
```

## Development

```bash
yarn dev:build
```

## Building

```bash
yarn build
```

## Usage

```typescript
import { CMSApp } from '@commercetools-demo/cms-react-asset';

// Use in your React application
<CMSApp
  baseURL="https://your-api-endpoint.com"
  businessUnitKey="your-business-unit"
  locale="en"
  availableLocales={['en', 'de', 'fr']}
  pagesAppEnabled={true}
  contentTypeAppEnabled={true}
  contentItemAppEnabled={true}
  headerEnabled={true}
/>
```

## Components

- `CMSApp` - Main CMS application wrapper
- `CmsRenderer` - Renders CMS pages
- `ContentItemRenderer` - Renders individual content items

## Features

All features from the original web components version have been ported to React:

- Page management
- Content type management  
- Content item management
- Version control
- State management (draft/published)
- Media library
- Component registry
- Grid-based layout system

## Architecture

- **React 18** for UI components
- **Redux Toolkit** for state management
- **Styled Components** for styling
- **TypeScript** for type safety
- **Preconstruct** for library building 