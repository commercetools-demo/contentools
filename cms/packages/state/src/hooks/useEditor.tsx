import { useState, useCallback } from 'react';
import { EditorState } from '@commercetools-demo/cms-types';

const initialState: EditorState = {
  selectedComponentId: null,
  draggingComponentType: null,
  showSidebar: false,
};

export const useEditor = () => {
  const [state, setState] = useState<EditorState>(initialState);

  // Actions
  const selectComponent = useCallback((componentId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedComponentId: componentId,
    }));
  }, []);

  const setDraggingComponentType = useCallback(
    (componentType: string | null) => {
      setState((prev) => ({
        ...prev,
        draggingComponentType: componentType,
      }));
    },
    []
  );

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showSidebar: !prev.showSidebar,
    }));
  }, []);

  const setSidebarVisibility = useCallback((visible: boolean) => {
    setState((prev) => ({
      ...prev,
      showSidebar: visible,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedComponentId: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    selectedComponentId: state.selectedComponentId,
    draggingComponentType: state.draggingComponentType,
    showSidebar: state.showSidebar,

    // Actions
    selectComponent,
    setDraggingComponentType,
    toggleSidebar,
    setSidebarVisibility,
    clearSelection,
    reset,
  };
};
