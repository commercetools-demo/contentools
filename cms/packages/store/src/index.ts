import { RootState } from '@commercetools-demo/cms-types';
import { configureStore, Store } from '@reduxjs/toolkit';
import contentItemReducer, * as contentItemSlice from './content-item.slice';
import contentTypeReducer, * as contentTypeSlice from './content-type.slice';
import editorReducer, * as editorSlice from './editor.slice';
import pagesReducer, * as pagesSlice from './pages.slice';
import stateReducer, * as stateSlice from './state.slice';
import { getAllContentTypesMetaData } from './utils/content-type-utility';
import versionReducer, * as versionSlice from './version.slice';

export const store: Store<
  RootState,
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

export { contentItemSlice, contentTypeSlice, editorSlice, getAllContentTypesMetaData, pagesSlice, stateSlice, versionSlice };
export type AppDispatch = typeof store.dispatch;
