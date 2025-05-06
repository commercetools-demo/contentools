# @commercetools-demo/cms-asset

A collection of web components for implementing CMS functionality in commercetools projects.

## Installation

```bash
npm install @commercetools-demo/cms-asset
```

or

```bash
yarn add @commercetools-demo/cms-asset
```

## React Usage

Create a wrapper component

```tsx
import React, { useRef, useEffect } from 'react';

interface Props {
  baseurl?: string;
  'business-unit-key'?: string;
  'available-locales'?: string;
  locale?: string;
}

const CMSAppWrapper: React.FC<Props> = ({ ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const element = document.createElement('cms-app');

      Object.entries(props).forEach(([key, value]) => {
        if (typeof value === 'string') {
          element.setAttribute(key, value);
        }
      });

      ref.current.innerHTML = '';
      ref.current.appendChild(element);
    }
  }, []);

  return (
    <div
      ref={ref}
      // override styles here
      style={
        {
          '--selector-button-selected-background': 'rgb(23 58 95)',
        } as React.CSSProperties
      }
    />
  );
};

export default CMSAppWrapper;
```

And use it in your application

```tsx
import '@commercetools-demo/cms-asset';
import CMSAppWrapper from '@commercetools-demo/cms-asset/assets/CMSAppWrapper';

return (
  <CMSAppWrapper
    baseurl="/service"
    'business-unit-key'="your-business-unit"
    locale="en"
    'available-locales'='["en", "de"]'
  />
)
```

## Usage

This package provides three main web components:

1. `<cms-app>` - The main CMS editor application
2. `<cms-renderer>` - Renders a CMS page by key or route
3. `<content-item-renderer>` - Renders a specific content item

### 1. CMS App Component

The main component for managing and editing CMS content.

```html
<cms-app
  baseurl="/service"
  business-unit-key="your-business-unit"
  locale="en"
  available-locales='["en", "de"]'
></cms-app>
```

#### Properties

| Property         | Attribute         | Type                        | Description                       | Required |
| ---------------- | ----------------- | --------------------------- | --------------------------------- | -------- |
| baseURL          | baseurl           | String                      | Base URL for API endpoints        | Yes      |
| businessUnitKey  | business-unit-key | String                      | The business unit key for the CMS | Yes      |
| locale           | locale            | String                      | The current locale                | No       |
| availableLocales | available-locales | Array<String> (JSON string) | Available locales as JSON string  | No       |

### 2. CMS Renderer Component

Renders a CMS page by key or route.

```html
<cms-renderer
  baseurl="/service"
  business-unit-key="your-business-unit"
  key="homepage"
  locale="en"
></cms-renderer>
```

OR

```html
<cms-renderer
  baseurl="/service"
  business-unit-key="your-business-unit"
  route="/home"
  locale="en"
></cms-renderer>
```

#### Properties

| Property         | Attribute         | Type          | Description                       | Required                     |
| ---------------- | ----------------- | ------------- | --------------------------------- | ---------------------------- |
| baseURL          | baseurl           | String        | Base URL for API endpoints        | Yes                          |
| businessUnitKey  | business-unit-key | String        | The business unit key for the CMS | Yes                          |
| key              | key               | String        | The key of the page to render     | Either key or route required |
| route            | route             | String        | The route of the page to render   | Either key or route required |
| locale           | locale            | String        | The current locale                | No                           |
| availableLocales | available-locales | Array<String> | Available locales                 | No                           |

### 3. Content Item Renderer Component

Renders a specific content item.

```html
<content-item-renderer
  baseurl="/service"
  business-unit-key="your-business-unit"
  key="product-teaser-123"
  state="published"
></content-item-renderer>
```

#### Properties

| Property        | Attribute         | Type   | Description                                             | Required                  |
| --------------- | ----------------- | ------ | ------------------------------------------------------- | ------------------------- |
| baseURL         | baseurl           | String | Base URL for API endpoints                              | Yes                       |
| businessUnitKey | business-unit-key | String | The business unit key for the CMS                       | Yes                       |
| key             | key               | String | The key of the content item to render                   | Yes                       |
| state           | state             | String | The state of the content item: "published" or "preview" | No (default: "published") |

## Required API Endpoints

The following API endpoints should be available at the specified `baseURL`:

### Page Endpoints

- `GET {baseURL}/{businessUnitKey}/pages` - Get all pages
- `GET {baseURL}/{businessUnitKey}/pages/{key}` - Get a specific page by key
- `POST {baseURL}/{businessUnitKey}/pages/{key}` - Create a new page
- `PUT {baseURL}/{businessUnitKey}/pages/{key}` - Update a page
- `DELETE {baseURL}/{businessUnitKey}/pages/{key}` - Delete a page

### Content Type Endpoints

- `GET {baseURL}/content-type` - Get all content types
- `GET {baseURL}/content-type/{key}` - Get a specific content type
- `POST {baseURL}/content-type/{key}` - Create a content type
- `PUT {baseURL}/content-type/{key}` - Update a content type
- `DELETE {baseURL}/content-type/{key}` - Delete a content type

### Content Item Endpoints

- `GET {baseURL}/{businessUnitKey}/content-items` - Get all content items
- `GET {baseURL}/{businessUnitKey}/content-items/{key}` - Get a specific content item
- `GET {baseURL}/{businessUnitKey}/preview/content-items/{key}` - Get a content item in preview state
- `GET {baseURL}/{businessUnitKey}/published/content-items/{key}` - Get a content item in published state
- `POST {baseURL}/{businessUnitKey}/content-items/{key}` - Create a content item
- `PUT {baseURL}/{businessUnitKey}/content-items/{key}` - Update a content item
- `DELETE {baseURL}/{businessUnitKey}/content-items/{key}` - Delete a content item

### State Management Endpoints

- `GET {baseURL}/{businessUnitKey}/content-items/{key}/states` - Get states for a content item
- `PUT {baseURL}/{businessUnitKey}/content-items/{key}/states/draft` - Save draft state for a content item
- `PUT {baseURL}/{businessUnitKey}/content-items/{key}/states/published` - Publish a content item
- `DELETE {baseURL}/{businessUnitKey}/content-items/{key}/states/draft` - Revert draft changes for a content item

- `GET {baseURL}/{businessUnitKey}/pages/{key}/states` - Get states for a page
- `PUT {baseURL}/{businessUnitKey}/pages/{key}/states/draft` - Save draft state for a page
- `PUT {baseURL}/{businessUnitKey}/pages/{key}/states/published` - Publish a page
- `DELETE {baseURL}/{businessUnitKey}/pages/{key}/states/draft` - Revert draft changes for a page

### Version Management Endpoints

- `GET {baseURL}/{businessUnitKey}/content-items/{key}/versions` - Get versions for a content item
- `GET {baseURL}/{businessUnitKey}/content-items/{key}/versions/{versionId}` - Get a specific content item version
- `POST {baseURL}/{businessUnitKey}/content-items/{key}/versions` - Save a new content item version

- `GET {baseURL}/{businessUnitKey}/pages/{key}/versions` - Get versions for a page
- `GET {baseURL}/{businessUnitKey}/pages/{key}/versions/{versionId}` - Get a specific page version
- `POST {baseURL}/{businessUnitKey}/pages/{key}/versions` - Save a new page version

### File Management Endpoints

- `GET {baseURL}/media-library` - Get media library items
- `POST {baseURL}/upload-file` - Upload a file to the media library

### Data Source Endpoints

- `GET {baseURL}/datasource` - Get all datasources
- `GET {baseURL}/datasource/{key}` - Get a specific datasource
- `POST {baseURL}/datasource/{key}` - Create a datasource
- `PUT {baseURL}/datasource/{key}` - Update a datasource
- `DELETE {baseURL}/datasource/{key}` - Delete a datasource

### Code Compilation Endpoint

- `POST {baseURL}/compile-upload` - Compile and upload code for a content type

## Example Implementation

```html
<!DOCTYPE html>
<html>
  <head>
    <title>CMS Example</title>
    <script
      type="module"
      src="path/to/node_modules/@commercetools-demo/cms-asset/dist/index.js"
    ></script>
  </head>
  <body>
    <!-- Render a specific page by key -->
    <cms-renderer
      baseurl="/api/cms"
      business-unit-key="my-business-unit"
      key="homepage"
      locale="en"
    >
    </cms-renderer>

    <!-- Render a content item -->
    <content-item-renderer baseurl="/api/cms" business-unit-key="my-business-unit" key="banner-123">
    </content-item-renderer>
  </body>
</html>
```

## Contributing

Please refer to the project's GitHub repository for contribution guidelines.

## License

This project is part of the commercetools demo platform.
