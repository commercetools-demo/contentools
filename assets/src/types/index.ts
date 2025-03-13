export interface Component {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
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
  components: Component[];
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
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  label: string;
  defaultValue?: any;
  required?: boolean;
  options?: { value: any; label: string }[];
}

export interface ComponentMetadata {
  type: string;
  name: string;
  icon?: string;
  defaultProperties: Record<string, any>;
  propertySchema: Record<string, PropertySchema>;
}

export interface RegistryComponentData {
  metadata: ComponentMetadata;
  deployedUrl: string;
}

export interface RegistryState {
  components: RegistryComponentData[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  pages: PagesState;
  editor: EditorState;
  registry: RegistryState;
}

export interface ApiResponse<T> {
  container: string;
  key: string;
  value: T;
  version: number;
}