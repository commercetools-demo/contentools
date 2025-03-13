import { configureStore } from '@reduxjs/toolkit';
import pagesReducer from './pages.slice';
import editorReducer from './editor.slice';
import registryReducer from './registry.slice';

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    editor: editorReducer,
    registry: registryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;