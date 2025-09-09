export interface ContentItem {
  id: string;
  type: string;
  key: string;
  businessUnitKey: string;
  name: string;
  properties: Record<string, any>;
}

export enum EStateType {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  BOTH = 'both'
}

export enum EContentType {
  CONTENT_ITEMS = 'content-items',
  PAGES = 'pages',
  PAGE_ITEMS = 'page-items'
}


export type PageVersionInfo = Page & {
  timestamp: string;
};

export type ContentItemVersionInfo = ContentItem & {
  timestamp: string;
};

export type VersionInfo = ContentItemVersionInfo | PageVersionInfo;

export interface StateInfo {
  draft?: ContentItem;
  published?: ContentItem;
}

export interface ContentItemState {
  items: ContentItem[];
  states: Record<string, StateInfo>;
  loading: boolean;
  error: string | null;
}

export interface VersionState<T> {
  versions: T[];
  loading: boolean;
  error: string | null;
}

export interface StateManagementState {
  states: {
    draft?: ContentItem | Page;
    published?: ContentItem | Page;
  };
  currentState: EStateType | null;
  loading: boolean;
  error: string | null;
}

export interface ContentItemVersions {
  key: string; // Same as ContentItem key
  businessUnitKey: string;
  versions: ContentItemVersionInfo[];
}

export interface ContentItemStates {
  key: string; // Same as ContentItem key
  businessUnitKey: string;
  states: StateInfo;
}

// Similar extensions for the Page interface
export interface PageVersions {
  key: string; // Same as Page key
  businessUnitKey: string;
  versions: PageVersionInfo[];
}

export interface PageStates {
  key: string; // Same as Page key
  businessUnitKey: string;
  states: {
    draft?: Page;
    published?: Page;
  };
}

export interface GridCell {
  id: string;
  contentItemKey: string | null;
  colSpan: number;
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

export interface Layout {
  rows: GridRow[];
}

export interface ContentItemReferences {
  id: string;
  typeId: string;
  obj?: ContentItem;
}

export interface Page {
  key: string;
  name: string;
  route: string;
  layout: Layout;
  components: ContentItem[];
}
export interface PagesState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
  unsavedChanges: boolean;
}

export interface EditorState {
  selectedComponentId: string | null;
  draggingComponentType: string | null;
  showSidebar: boolean;
}

export interface PropertySchema {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'file'
    | 'datasource';
  label: string;
  defaultValue?: any;
  required?: boolean;
  options?: { value: any; label: string }[];
  extensions?: string[];
  order?: number;
  datasourceType?: string;
}

export interface ContentTypeMetaData {
  type: string;
  name: string;
  icon?: string;
  defaultProperties: Record<string, any>;
  propertySchema: Record<string, PropertySchema>;
  isBuiltIn?: boolean;
}

export interface ContentTypeData {
  id: string;
  key: string;
  metadata: ContentTypeMetaData;
  code?: {
    componentName: string;
    transpiledCode: string;
    text: string;
  };
}

export interface ContentTypeState {
  contentTypes: ContentTypeData[];
  loading: boolean;
  error: string | null;
  availableDatasources: DatasourceInfo[];
  contentTypesRenderers: Record<string, React.FC<any>>;
}

export interface RootState {
  pages: PagesState;
  editor: EditorState;
  contentType: ContentTypeState;
  contentItem: ContentItemState;
  version: VersionState<ContentItemVersionInfo | PageVersionInfo>;
  state: StateManagementState;
}

export interface ApiResponse<T> {
  container: string;
  key: string;
  value: T;
  version: number;
}

export interface DatasourceInfo {
  name: string;
  key: string;
  params: DatasourceParam[];
  deployedUrl: string;
}

export interface DatasourceParam {
  key: string;
  type: string;
  required: boolean;
}

export interface FetchVersionsEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}

export interface SaveVersionEvent extends CustomEvent {
  detail: {
    item: any;
    previousItem: any;
    key: string;
    contentType: EContentType;
  };
}

export interface FetchStatesEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}

export interface SaveDraftEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: EContentType;
  };
}

export interface PublishEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: EContentType;
    clearDraft?: boolean;
  };
}

export interface RevertEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}

export interface MediaFile {
  url: string;
  name: string;
  description?: string;
  title?: string;
  isImage: boolean;
  createdAt?: Date;
  size?: number;
}

export interface MediaLibraryResult {
  files: MediaFile[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
