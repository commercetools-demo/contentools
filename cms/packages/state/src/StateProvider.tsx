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

interface ScopedStateContext<T extends VersionInfo> {
  contexts: Map<string, StateContextValue<T>>;
  currentScope: string;
}

export interface StateContextValue<T extends VersionInfo> {
  // Pages
  pages: ReturnType<typeof usePages>;

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

  scope?: string;
}

const StateContext = createContext<StateContextValue<VersionInfo> | null>(null);
const StateStackContext = createContext<ScopedStateContext<VersionInfo> | null>(
  null
);

export interface StateProviderProps {
  children: ReactNode;
  baseURL: string;
  scope?: string;

  // Minimal
  minimal?: boolean;
}

export const StateProvider = <T extends VersionInfo>({
  children,
  baseURL,
  scope = 'default',
  minimal = false,
}: StateProviderProps) => {
  const parentStack = useContext(StateStackContext);

  // Initialize all hooks
  const contentType = useContentType(baseURL);
  const contentItem = useContentItem();
  const pages = usePages();
  // Initialize Full
  const editor = !minimal ? useEditor() : undefined;
  const version = !minimal ? useVersion<T>() : undefined;
  const stateManagement = !minimal ? useStateManagement() : undefined;
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
    scope,
  };

  const newStack: ScopedStateContext<T> = {
    contexts: new Map(parentStack?.contexts || []) as Map<
      string,
      StateContextValue<T>
    >,
    currentScope: scope,
  };
  newStack.contexts.set(scope, contextValue);

  useEffect(() => {
    if (!minimal) {
      contentType?.fetchContentTypes();
      datasource?.fetchDatasources();
    }
  }, [baseURL]);

  return (
    <StateStackContext.Provider value={newStack}>
      <StateContext.Provider value={contextValue}>
        {children}
      </StateContext.Provider>
    </StateStackContext.Provider>
  );
};

export const useStateContext = <T extends VersionInfo>(
  targetScope = 'default'
): StateContextValue<T> => {
  const stack = useContext(StateStackContext);
  const currentContext = useContext(StateContext);

  if (!currentContext) {
    throw new Error('useStateContext must be used within a StateProvider');
  }

  if (!targetScope) {
    return currentContext as StateContextValue<T>;
  }

  if (stack && stack.contexts.has(targetScope)) {
    return stack.contexts.get(targetScope) as StateContextValue<T>;
  }

  throw new Error(`StateProvider with scope "${targetScope}" not found`);
};

// Individual hook exports for convenience
export const useStatePages = (scope?: string) => useStateContext(scope).pages;
export const useStateEditor = (scope?: string) => useStateContext(scope).editor;
export const useStateContentType = (scope?: string) =>
  useStateContext(scope).contentType;
export const useStateContentItem = (scope?: string) =>
  useStateContext(scope).contentItem;
export const useStateVersion = <T extends VersionInfo>(scope?: string) =>
  useStateContext<T>(scope).version;
export const useStateStateManagement = (scope?: string) =>
  useStateContext(scope).stateManagement;
export const useStateMediaLibrary = (scope?: string) =>
  useStateContext(scope).mediaLibrary;
export const useStateDatasource = (scope?: string) =>
  useStateContext(scope).datasource;
