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
}

export interface EditorState {
  selectedComponentId: string | null;
  draggingComponentType: string | null;
  showSidebar: boolean;
}

export interface RootState {
  pages: PagesState;
  editor: EditorState;
}

export interface ApiResponse<T> {
  container: string;
  key: string;
  value: T;
  version: number;
}