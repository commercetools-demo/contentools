import type { ContentItem } from './content-types';
import type { Page } from './page-types';

export type PageVersionInfo = Page & {
  timestamp: string;
};

export type ContentItemVersionInfo = ContentItem & {
  timestamp: string;
};

export type VersionInfo = ContentItemVersionInfo | PageVersionInfo;
