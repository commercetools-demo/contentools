import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePages } from './hooks/usePages';
import { useEditor } from './hooks/useEditor';
import { useContentType } from './hooks/useContentType';
import { useContentItem } from './hooks/useContentItem';
import { useVersion } from './hooks/useVersion';
import { useStateManagement } from './hooks/useStateManagement';
import { useMediaLibrary } from './hooks/useMediaLibrary';
import { useDatasource } from './hooks/useDatasource';
import { VersionInfo } from '@commercetools-demo/contentools-types';

export interface StateContextValue<T extends VersionInfo> {
  // Pages
  pages?: ReturnType<typeof usePages>;

  // Editor
  editor?: ReturnType<typeof useEditor>;

  // Content Types
  contentType: ReturnType<typeof useContentType>;

  // Content Items
  contentItem: ReturnType<typeof useContentItem>;

  // Versions
  version?: ReturnType<typeof useVersion<T>>;

  // State Management (draft/published)
  stateManagement?: ReturnType<typeof useStateManagement>;

  // Media Library
  mediaLibrary?: ReturnType<typeof useMediaLibrary>;

  // Datasource
  datasource?: ReturnType<typeof useDatasource>;

  // Base URL
  baseURL: string;
}

const StateContext = createContext<StateContextValue<VersionInfo> | null>(null);

export interface StateProviderProps {
  children: ReactNode;
  baseURL: string;

  // Minimal
  minimal?: boolean;
}

export const StateProvider = <T extends VersionInfo>({
  children,
  baseURL,
  minimal = false,
}: StateProviderProps) => {
  // Initialize all hooks
  const contentType = useContentType(baseURL);
  const contentItem = useContentItem();
  // Initialize Full 
  const pages = !minimal ? usePages(baseURL) : undefined;
  const editor = !minimal ? useEditor() : undefined;
  const version = !minimal ? useVersion<T>(baseURL) : undefined;
  const stateManagement = !minimal ? useStateManagement(baseURL) : undefined;
  const mediaLibrary = !minimal ? useMediaLibrary() : undefined;
  const datasource = !minimal ? useDatasource(baseURL) : undefined;

  const contextValue: StateContextValue<T> = {
    pages,
    editor,
    contentType,
    contentItem,
    version,
    stateManagement,
    mediaLibrary,
    datasource,
    baseURL,
  };

  useEffect(() => {
    if (!minimal) {
      contentType?.fetchContentTypes();
      datasource?.fetchDatasources();
    }
  }, [baseURL]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = <
  T extends VersionInfo
>(): StateContextValue<T> => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context as StateContextValue<T>;
};

// Individual hook exports for convenience
export const useStatePages = () => useStateContext().pages;
export const useStateEditor = () => useStateContext().editor;
export const useStateContentType = () => useStateContext().contentType;
export const useStateContentItem = () => useStateContext().contentItem;
export const useStateVersion = <T extends VersionInfo>() =>
  useStateContext<T>().version;
export const useStateStateManagement = () => useStateContext().stateManagement;
export const useStateMediaLibrary = () => useStateContext().mediaLibrary;
export const useStateDatasource = () => useStateContext().datasource;
