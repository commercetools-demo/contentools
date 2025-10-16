***NOTE***: This is NOT an official commercetools code and NOT production ready. Use it at your own risk



<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://unpkg.com/@commercetools-frontend/assets/logos/commercetools_primary-logo_horizontal_RGB.png">
  </a></br>
  <b>Web Component-based CMS with Layout Builder</b>
</p>



# Web Component-based CMS

A web component-based Content Management System (CMS) that allows users to create and manage pages with a drag-and-drop interface for component placement in a grid layout. Built with Lit and bundled with Vite, using Redux for state management.

## TL;DR (Merchant Center custom application)

1. Create a new commercetools [custom application](https://docs.commercetools.com/merchant-center/managing-custom-applications) and take a note of the application id and use an arbitrary url for the application url.
1. Create a new commercetools [connector](https://docs.commercetools.com/merchant-center/connect) using this repo
1. Deploy the connector to your commercetools organization and provide the variables and application id from the custom application. After deployment is complete, you should be able to get the application deployed URL from MC-app
1. Go to your commercetools custom application again and update the application url with the deployed url.
1. Activate the application in the custom application and you should be able to see the application in the merchant center.

## TL;DR (Standalone web component)
1. Create a new commercetools [connector](https://docs.commercetools.com/merchant-center/connect) using this repo
1. Deploy the connector to your commercetools organization and provide the variables and use arbitrary values for the application id and url.
1. After deployment is complete, you should be able to get the service deployed URL from service
1. Go to your application (react)
    ```
    yarn add @commercetools-demo/cms-asset
    ```
1. Create a wrapper component looking at the [README](./assets/README.md) and replace baseurl with the service deployed URL
1. Use the wrapper component in your application


## Features

- Page CRUD operations
- Layout builder with a 12-column grid system and dynamic rows
- Drag and drop component placement
- Component resizing within the grid
- Component property editing in a sidebar panel
- Two sample components: heroBanner and productSlider
- API integration with backend service
- Session storage for page data persistence
- Merchant Center integration via Custom Application


## Technologies Used

- **Web Components Framework**: Lit
- **Bundler**: Vite
- **State Management**: Redux Toolkit
- **Drag and Drop**: SortableJS
- **API Integration**: RESTful endpoints for custom objects
- **Merchant Center Integration**: Custom Application SDK

## Project Structure

- `assets/`: Frontend application
  - `src/`: Source code
    - `components/`: Web components for the CMS
    - `store/`: Redux store and slices
    - `types/`: TypeScript interfaces and types
    - `utils/`: Utility functions
    - `styles/`: CSS styles
- `service/`: Backend service
  - `src/`: Source code
    - `controllers/`: API controllers
    - `routes/`: API routes
- `mc-app/`: Merchant Center Custom Application
  - `src/`: Source code
    - `components/`: React components for the MC app
    - `hooks/`: Custom React hooks
    - `routes/`: Application routes

## Getting Started

### Prerequisites

- Node.js (v14+)
- Yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
cd assets
yarn install

# Install backend dependencies
cd ../service
yarn install

# Install MC app dependencies
cd ../mc-app
yarn install
```

### Running the Application

1. Start the backend service:

```bash
cd service
yarn start:dev
```

2. Start the frontend application:

```bash
cd assets
yarn dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Running the MC Application

1. Configure your `.env` file in the `mc-app` directory:

```
APPLICATION_ID=your-application-id
APPLICATION_URL=http://localhost:3001
CLOUD_IDENTIFIER=your-cloud-identifier
INITIAL_PROJECT_KEY=your-project-key
PORT=3001
```

2. Start the MC application:

```bash
cd mc-app
yarn start
```

3. Navigate to your Merchant Center and access the custom application

## Usage

### Frontend Components (For Managing Content)

The CMS provides several React components that can be imported and used in your applications:

#### ContentItem

Manages content items (CRUD operations) - allows creation, editing, and management of individual content items.

```javascript
import ContentItem from '@commercetools-demo/contentools-content-items';

<ContentItem
  baseURL="https://deployed-service-url"
  businessUnitKey="default"
  locale="en-US"
  parentUrl=""
  backButton={{
    label: 'Back',
    onClick: () => console.log('Back'),
    icon: <BackIcon />,
  }}
/>
```

**Props:**
- `baseURL` (string): Base URL for API calls
- `businessUnitKey` (string, required): Business unit identifier
- `locale` (string, optional): Locale for content (default: "en-US")
- `parentUrl` (string): Parent URL for navigation
- `backButton` (object, optional): Back button configuration with label, onClick handler, and icon

#### ContentType

Manages content types and schemas - allows creation and editing of content type definitions.

```javascript
import ContentType from '@commercetools-demo/contentools-content-types';

<ContentType
  baseURL="https://deployed-service-url"
  businessUnitKey="default"
  locale="en-US"
  parentUrl=""
/>
```

**Props:**
- `baseURL` (string): Base URL for API calls
- `businessUnitKey` (string, required): Business unit identifier
- `locale` (string): Locale for content
- `parentUrl` (string): Parent URL for navigation

### Frontend Components (For Rendering Content)

#### ContentItemRenderer

Renders individual content items as React components based on their type and data.

```javascript
import ContentItemRenderer from '@commercetools-demo/contentools-content-item-renderer';

<ContentItemRenderer
  baseURL="https://deployed-service-url"
  businessUnitKey="default"
  locale="en-US"
  parentUrl="content-items"
  itemKey="item-55a40674-6d1a-43e0-8edb-710cc78bd3a9"
  query='properties(slot="header")'
/>
```

**Props:**
- `baseURL` (string, optional): Base URL for API calls
- `businessUnitKey` (string, required): Business unit identifier
- `locale` (string, optional): Locale for rendering (default: "en-US")
- `parentUrl` (string, optional): Parent URL for navigation
- `itemKey` (string, optional): Key of content item to render (required if component/query not provided)
- `query` (string, optional): Query to fetch content item (required if component/itemKey not provided)
- `component` (ContentItem, optional): Content item object to render directly
- `isDraft` (boolean, optional): Whether to render draft version
- `className` (string, optional): Additional CSS class
- `onError` (function, optional): Error callback

#### ContentPages

Manages pages with layout grids - provides page creation, editing, and layout management capabilities.

```javascript
import ContentPages from '@commercetools-demo/contentools-content-pages';

<ContentPages
  baseURL="https://deployed-service-url"
  businessUnitKey="default"
  locale="en-US"
  parentUrl="content-pages"
  backButton={{
    label: 'Back',
    onClick: () => console.log('Back'),
    icon: <BackIcon />,
  }}
/>
```

**Props:**
- `baseURL` (string): Base URL for API calls
- `businessUnitKey` (string, required): Business unit identifier
- `locale` (string, optional): Locale for content (default: "en-US")
- `parentUrl` (string): Parent URL for navigation
- `backButton` (object, optional): Back button configuration with label, onClick handler, and icon

#### PageRenderer

Renders complete pages with their layout grids and embedded components.

```javascript
import PageRenderer from '@commercetools-demo/contentools-page-renderer';

<PageRenderer
  baseURL="https://deployed-service-url"
  businessUnitKey="default"
  locale="en-US"
  parentUrl="content-pages"
  query='route="/blogs/1"'
  style={{
    '--page-grid-gap': '0.5rem',
    '--page-grid-row-margin': '0.5rem',
  }}
/>
```

**Props:**
- `baseURL` (string, optional): Base URL for API calls
- `businessUnitKey` (string, required): Business unit identifier
- `locale` (string, optional): Locale for rendering (default: "en-US")
- `parentUrl` (string, optional): Parent URL for navigation
- `pageKey` (string, optional): Key of page to render (required if page/query not provided)
- `query` (string, optional): Query to fetch page (required if page/pageKey not provided)
- `page` (Page, optional): Page object to render directly
- `isDraft` (boolean, optional): Whether to render draft version
- `className` (string, optional): Additional CSS class
- `onError` (function, optional): Error callback

### Installation

Add the required packages to your project:

```bash
yarn add @commercetools-demo/contentools-content-items
yarn add @commercetools-demo/contentools-content-types
yarn add @commercetools-demo/contentools-content-item-renderer
yarn add @commercetools-demo/contentools-content-pages
yarn add @commercetools-demo/contentools-page-renderer
```

### CMS Application Usage

#### Creating a Page

1. Click "Create Page" button on the Pages list
2. Enter a name and route for the page
3. Click "Create Page"

#### Adding Components to a Page

1. Select a page from the list
2. Drag components from the Component Library to the layout grid
3. Edit component properties in the sidebar panel
4. Add rows to the layout if needed

#### Editing Component Properties

1. Click on a component in the layout grid
2. Edit the component properties in the sidebar panel
3. Click "Save Changes" when done

#### Saving Changes

Click "Save Changes" in the bottom bar when you're done editing a page.

## Merchant Center Application

The MC application allows you to manage your CMS content directly within the commercetools Merchant Center.

### Features

- Seamless integration with Merchant Center
- Access to all CMS functionality within the MC interface
- Business unit selection based on current project
- Customizable permissions based on MC user roles
- Unified login via MC authentication

### Integration

1. Register your custom application in the Merchant Center
2. Configure the application URL to point to your deployed MC app
3. Set up necessary permissions for your application
4. Add the application to the navigation menu

## Customization

### Adding New Component Types

1. Add a new component type to the `ComponentType` enum in `registry.ts`
2. Create a new component template in `components/templates/`
3. Update the component registry in `registry.ts`
4. Update the `renderComponent` and `renderComponentPreview` functions in `templates/index.ts`

## Connect Deployment

This CMS can be deployed as a commercetools Connect application for easy integration with your commercetools projects.

### Connect Configuration

The application is configured in `connect.yaml` with two deployable components:

1. **Merchant Center Custom Application**:
   ```yaml
   - name: mc-app
     applicationType: merchant-center-custom-application
     configuration:
       standardConfiguration:
         - key: CUSTOM_APPLICATION_ID
           description: The ID of the custom application.
         - key: APPLICATION_URL
           description: The URL of the custom application.
         - key: CLOUD_IDENTIFIER
           description: The cloud identifier.
         - key: ENTRY_POINT_URI_PATH
           description: The entry point URI path.
         - key: ASSETS_URL
           description: The assets URL.
   ```

2. **Backend Service**:
   ```yaml
   - name: service
     applicationType: service
     scripts:
       postDeploy: node build/connector/post-deploy.js
     endpoint: /service
     configuration:
       standardConfiguration:
         - key: CORS_ALLOWED_ORIGINS
           description: Comma separated list of allowed origins
         - key: MAIN_CONTAINER
           description: The container to use for the service
           default: cms_container
         - key: CONTENT_TYPE_CONTAINER
           description: The container to use for the content type
           default: content-type
         # ... additional configuration options
   ```

Both components inherit common commercetools configuration:
```yaml
inheritAs:
  configuration:
    standardConfiguration:
      - key: CTP_REGION
        description: commercetools Composable Commerce API region
        default: us-central1.gcp
      - key: CTP_PROJECT_KEY
        description: commercetools Composable Commerce project key
      # ... additional inherited configuration
```

### Deploying via Connect

To deploy this application using commercetools Connect:

1. **Create a ConnectorStaged**:
   ```bash
   POST https://connect.{region}.commercetools.com/connectors/drafts
   
   {
     "key": "cms-web-component",
     "name": "Web Component CMS",
     "description": "A web component-based CMS with layout builder",
     "repository": {
       "url": "https://github.com/your-org/cms.git",
       "tag": "1.0.0"
     },
     "supportedRegions": ["europe-west1.gcp", "us-central1.gcp"]
   }
   ```

2. **Request Preview Status**:
   ```bash
   POST https://connect.{region}.commercetools.com/connectors/drafts/key=cms-web-component
   
   {
     "version": 1,
     "actions": [
       {
         "action": "updatePreviewable"
       }
     ]
   }
   ```

3. **Deploy to Your Project**:
   ```bash
   POST https://connect.{region}.commercetools.com/{projectKey}/deployments
   
   {
     "key": "cms-deployment",
     "connector": {
       "key": "cms-web-component",
       "version": 1,
       "staged": false
     },
     "region": "{your-region}",
     "configurations": [
       {
         "applicationName": "service",
         "standardConfiguration": [
           {
             "key": "CTP_PROJECT_KEY",
             "value": "{projectKey}"
           },
           {
             "key": "CTP_REGION",
             "value": "{your-region}"
           },
           {
             "key": "STORAGE_TYPE",
             "value": "gcp"
           }
         ],
         "securedConfiguration": [
           {
             "key": "CTP_CLIENT_ID",
             "value": "{client-id}"
           },
           {
             "key": "CTP_CLIENT_SECRET",
             "value": "{client-secret}"
           },
           {
             "key": "CTP_SCOPE",
             "value": "manage_project:{projectKey}"
           }
         ]
       },
       {
         "applicationName": "mc-app",
         "standardConfiguration": [
           {
             "key": "CUSTOM_APPLICATION_ID",
             "value": "cms-app"
           },
           {
             "key": "APPLICATION_URL",
             "value": "https://{your-app-url}"
           },
           {
             "key": "CLOUD_IDENTIFIER",
             "value": "{your-cloud-identifier}"
           }
         ]
       }
     ]
   }
   ```

4. **Monitor Deployment**:
   Track the progress of your deployment by checking its status. When the status changes to `Deployed`, your CMS is ready to use within your commercetools project.

### Storage Configuration

The CMS supports multiple storage options for media files, which can be configured during deployment:

- **AWS S3**: Set `STORAGE_TYPE=aws` and provide AWS credentials
- **Google Cloud Storage**: Set `STORAGE_TYPE=gcp` and provide GCP credentials
- **Cloudinary**: Set `STORAGE_TYPE=cloudinary` and provide Cloudinary credentials

Refer to the `connect.yaml` file for all available configuration options.

## CSS Customization

The CMS components provide CSS custom properties (CSS variables) that allow you to customize their appearance and behavior. These variables can be set at the root level or on specific component containers.

### Available CSS Variables

| Component | Variable | Description | Default Value |
|-----------|----------|-------------|---------------|
| **Modal** | `--modal-overlay-top` | Top position for modal overlay | `0` |
| **Modal** | `--modal-container-top` | Top position for modal container | `0` |
| **Modal** | `--modal-header-border-bottom` | Border bottom style for modal header | `1px solid #e0e0e0` |
| **Modal** | `--modal-header-background-color` | Background color for modal header | `transparent` |
| **ConfirmationModal** | `--confirmation-modal-overlay-top` | Top position for confirmation modal overlay | `0` |
| **PageRenderer** | `--page-grid-gap` | Gap between grid cells | `1rem` |
| **PageRenderer** | `--page-grid-row-margin` | Margin between grid rows | `1rem` |

### Setting CSS Variables

You can customize these variables by setting them in your CSS or inline styles [example](cms/mc-application-test/src/routes.tsx)

#### Using :root (Global)
```css
:root {
  /* Modal positioning - useful when rendering in fixed containers */
  --modal-overlay-top: 60px;
  --modal-container-top: 60px;
  --confirmation-modal-overlay-top: 60px;
  
  /* Page layout spacing */
  --page-grid-gap: 0.5rem;
  --page-grid-row-margin: 0.75rem;
}
```

## Original Connect Application Information

This project is built using the `starter-typescript` template for developing [connect applications](https://marketplace.commercetools.com/) in TypeScript.

### Documentation

- [Service API Documentation](./service/README.md) - Documentation for the REST API endpoints including custom objects management
- [CMS Component API](./assets/README.md) - Documentation for the CMS web components
