export interface ContentItem {
  id: string;
  type: string;
  key: string;
  businessUnitKey: string;
  name: string;
  properties: Record<string, any>;
}

export type VersionInfo = (Page | ContentItem) & {
  timestamp: string;
};

export interface StateInfo {
  draft?: ContentItem;
  published?: ContentItem;
}

export interface ContentItemVersions {
  key: string; // Same as ContentItem key
  businessUnitKey: string;
  versions: VersionInfo[];
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
  versions: VersionInfo[];
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
  componentId: string | null;
  colSpan: number;
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

export interface Layout {
  rows: GridRow[];
}

export interface Page {
  businessUnitKey: string;
  key: string;
  name: string;
  uuid: string;
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
  businessUnitKey: string;
}

export interface EditorState {
  selectedComponentId: string | null;
  draggingComponentType: string | null;
  showSidebar: boolean;
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file' | 'datasource';
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
  metadata: ContentTypeMetaData;
  deployedUrl: string;
  code?: {
    filename: string;
    content: string;
  }[];
}

export interface ContentTypeState {
  contentTypes: ContentTypeData[];
  loading: boolean;
  error: string | null;
  availableDatasources: DatasourceInfo[];
}

export interface RootState {
  pages: PagesState;
  editor: EditorState;
  contentType: ContentTypeState;
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
    contentType: 'pages' | 'content-items';
  };
}

export interface SaveVersionEvent extends CustomEvent {
  detail: {
    item: any;
    previousItem: any;
    key: string;
    contentType: 'pages' | 'content-items';
  };
}

export interface FetchStatesEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: 'pages' | 'content-items';
  };
}

export interface SaveDraftEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: 'pages' | 'content-items';
  };
}

export interface PublishEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: 'pages' | 'content-items';
    clearDraft?: boolean;
  };
}

export interface RevertEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: 'pages' | 'content-items';
  };
}
