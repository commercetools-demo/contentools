import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState } from '@commercetools-demo/cms-types';

const initialState: EditorState = {
  selectedComponentId: null,
  draggingComponentType: null,
  showSidebar: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },
    setDraggingComponentType: (state, action: PayloadAction<string | null>) => {
      state.draggingComponentType = action.payload;
    },
    toggleSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
    setSidebarVisibility: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
  },
});

export const { selectComponent, setDraggingComponentType, toggleSidebar, setSidebarVisibility } =
  editorSlice.actions;

export default editorSlice.reducer;
