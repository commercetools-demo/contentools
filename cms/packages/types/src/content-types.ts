import type { StateInfo } from './state-types';

export interface ContentItem {
  id: string;
  type: string;
  key: string;
  businessUnitKey: string;
  name: string;
  startDate?: string;
  endDate?: string;
  properties: Record<string, any>;
}

export interface ContentItemState {
  items: ContentItem[];
  states: Record<string, StateInfo<ContentItem>>;
  loading: boolean;
  error: string | null;
}

export interface ContentItemVersions {
  key: string; // Same as ContentItem key
  businessUnitKey: string;
  versions: any[]; // ContentItemVersionInfo[]
}

export interface ContentItemStates {
  key: string; // Same as ContentItem key
  businessUnitKey: string;
  states: StateInfo<ContentItem>;
}

export interface ContentItemReferences {
  id: string;
  typeId: string;
  obj?: ContentItem;
}
