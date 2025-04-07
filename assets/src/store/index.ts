import { configureStore } from '@reduxjs/toolkit';
import pagesReducer from './pages.slice';
import editorReducer from './editor.slice';
import contentTypeReducer from './content-type.slice';
import contentItemReducer from './content-item.slice';

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    editor: editorReducer,
    contentType: contentTypeReducer,
    contentItem: contentItemReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
