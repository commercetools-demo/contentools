import { configureStore } from '@reduxjs/toolkit';
import pagesReducer from './pages.slice';
import editorReducer from './editor.slice';

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    editor: editorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;