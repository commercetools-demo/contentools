import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Contentools wrapper (us-store)',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: 'gcp-us',
  env: {
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  additionalEnv: {
    CMS_API_URL: '${env:CMS_API_URL}',
    BUSINESS_UNIT_KEY: '${env:BUSINESS_UNIT_KEY}',
  },
  headers: {
    csp: {
      'connect-src': [
        "'self'",
        '*.commercetools.app',
        '*.commercetools.com',
        "'unsafe-eval'",
        'localhost',
      ],
      'script-src': [
        "'self'",
        '*.commercetools.app',
        '*.commercetools.com',
        'cdn.jsdelivr.net',
        'blob:',
        "'unsafe-eval'",
      ],
      'style-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
      'font-src': ["'self'", 'cdn.jsdelivr.net'],
    },
  },
  oAuthScopes: {
    view: ['view_products', 'view_key_value_documents'],
    manage: ['manage_products', 'manage_key_value_documents'],
  },
  icon: '${path:@tabler/icons/outline/bulb.svg}',
  mainMenuLink: {
    defaultLabel: 'Contentools',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'pages',
      defaultLabel: 'Content Pages',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'items',
      defaultLabel: 'Content Items',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'types',
      defaultLabel: 'Content Types',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
