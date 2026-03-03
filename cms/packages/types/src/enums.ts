export enum EStateType {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  BOTH = 'both',
}

export enum EContentType {
  CONTENT_ITEMS = 'content-items',
  PAGES = 'pages',
  PAGE_ITEMS = 'page-items',
}

export enum EPropertyType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  FILE = 'file',
  DATASOURCE = 'datasource',
  RICH_TEXT = 'richText',
}

/** Tenant/business model type for header and other configuration. */
export type TenantType = 'b2c' | 'b2b';
