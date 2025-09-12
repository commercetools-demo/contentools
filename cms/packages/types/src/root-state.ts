import type { PagesState } from './page-types';
import type { EditorState } from './editor-types';
import type { ContentTypeState } from './content-type-schema';
import type { ContentItemState } from './content-types';
import type { VersionState, StateManagementState } from './state-types';
import type { VersionInfo } from './version-types';

export interface RootState {
  pages: PagesState;
  editor: EditorState;
  contentType: ContentTypeState;
  contentItem: ContentItemState;
  version: VersionState<VersionInfo>;
  state: StateManagementState;
}
