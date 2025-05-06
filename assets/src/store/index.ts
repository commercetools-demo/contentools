import { configureStore, Store } from '@reduxjs/toolkit';
import pagesReducer from './pages.slice';
import editorReducer from './editor.slice';
import contentTypeReducer from './content-type.slice';
import contentItemReducer, { ContentItemState } from './content-item.slice';
import versionReducer, { VersionState } from './version.slice';
import stateReducer, { StateManagementState } from './state.slice';
import { ContentTypeState } from '../types';
import { EditorState } from '../types';
import { PagesState } from '../types';

export const store: Store<
  {
    pages: PagesState;
    editor: EditorState;
    contentType: ContentTypeState;
    contentItem: ContentItemState;
    version: VersionState;
    state: StateManagementState;
  },
  any,
  any
> = configureStore({
  reducer: {
    pages: pagesReducer,
    editor: editorReducer,
    contentType: contentTypeReducer,
    contentItem: contentItemReducer,
    version: versionReducer,
    state: stateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
