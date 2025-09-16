import type { Layout } from './layout-types';
import type { ContentItem } from './content-types';
import type { StateInfo } from './state-types';

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
  states: Record<string, StateInfo<Page>>;
  loading: boolean;
  error: string | null;
  unsavedChanges: boolean;
}

export interface PageVersions {
  key: string; // Same as Page key
  businessUnitKey: string;
  versions: any[]; // PageVersionInfo[]
}

export interface PageStates {
  key: string; // Same as Page key
  businessUnitKey: string;
  states: {
    draft?: Page;
    published?: Page;
  };
}
