import {
  ContentItem,
  Page,
  PagesState,
} from '@commercetools-demo/contentools-types';
import { useCallback, useState } from 'react';
import {
  addComponentToPageApi,
  addRowToPageApi,
  createPageEndpoint,
  deletePageEndpoint,
  fetchPageEndpoint,
  fetchPagesEndpoint,
  removeRowFromPageApi,
  updateCellSpanInPageApi,
  updatePageEndpoint,
} from '../api/page';
import {
  DEBOUNCE_DELAY,
  LOCAL_STORAGE_KEY_PREFIX
} from '../utils/constants';
import { debounce } from '../utils/debounce';

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
  unsavedChanges: false,
};

// Helper functions for API calls
const fetchPagesApi = async (baseUrl: string): Promise<Page[]> => {
  try {
    const data = await fetchPagesEndpoint<Page>(baseUrl);
    return data.map((item) => item.value);
  } catch (error) {
    throw new Error('Failed to fetch pages');
  }
};

const fetchPageApi = async (baseUrl: string, key: string): Promise<Page> => {
  try {
    const data = await fetchPageEndpoint(baseUrl, key);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

const createPageApi = async (
  hydratedUrl: string,
  page: Omit<Page, 'key' | 'layout' | 'components'>
): Promise<Page> => {
  try {
    const data = await createPageEndpoint(hydratedUrl, page);
    return data.value;
  } catch (error) {
    throw new Error('Failed to create page');
  }
};

const updatePageApi = async (baseUrl: string, page: Page): Promise<Page> => {
  try {
    const data = await updatePageEndpoint<Page>(baseUrl, page.key, page);
    return data.value as Page;
  } catch (error) {
    throw new Error(`Failed to update page with key: ${page.key}`);
  }
};

const deletePageApi = async (baseUrl: string, key: string): Promise<void> => {
  try {
    await deletePageEndpoint(baseUrl, key);
  } catch (error) {
    throw new Error(`Failed to delete page with key: ${key}`);
  }
};

// Helper functions


export const usePages = (baseUrl: string) => {
  const [state, setState] = useState<PagesState>(initialState);

  // Create a debounced session storage save function
  const saveToSessionStorage = useCallback(
    debounce((pages: Page[], businessUnitKey: string) => {
      try {
        const safePages = JSON.parse(JSON.stringify({ pages })).pages;
        const storageKey = `${LOCAL_STORAGE_KEY_PREFIX}_${businessUnitKey}`;
        sessionStorage.setItem(storageKey, JSON.stringify(safePages));
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
    }, DEBOUNCE_DELAY),
    []
  );

  // Actions
  const fetchPages = useCallback(async (hydratedUrl: string) => {
    try {
      const pagesFromApi = await fetchPagesApi(hydratedUrl);
      setState((prev) => ({
        ...prev,
        pages: pagesFromApi,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        pages: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pages',
      }));
    }
  }, []);

  const syncPagesWithApi = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const pagesFromApi = await fetchPagesApi(baseUrl);

      setState((prev) => ({
        ...prev,
        pages: pagesFromApi,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sync pages with API',
      }));
    }
  }, [baseUrl]);

  const fetchPage = useCallback(async (hydratedUrl: string, key: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const page = await fetchPageApi(hydratedUrl, key);

      setState((prev) => ({
        ...prev,
        currentPage: page,
        loading: false,
      }));

      return page;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch page',
      }));
      throw error;
    }
  }, []);

  const updatePage = useCallback(async (hydratedUrl: string, page: Page) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const updatedPage = await updatePageApi(hydratedUrl, page);

      setState((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => (p.key === page.key ? updatedPage : p)),
        currentPage:
          prev.currentPage?.key === page.key ? updatedPage : prev.currentPage,
        loading: false,
      }));

      return updatedPage;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update page',
      }));
      throw error;
    }
  }, []);

  const deletePage = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deletePageApi(hydratedUrl, key);

        setState((prev) => ({
          ...prev,
          pages: prev.pages.filter((p) => p.key !== key),
          currentPage: prev.currentPage?.key === key ? null : prev.currentPage,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to delete page',
        }));
        throw error;
      }
    },
    []
  );

  // Local actions
  const setCurrentPage = useCallback((key: string) => {
    setState((prev) => {
      const page = prev.pages.find((p) => p.key === key);
      return { ...prev, currentPage: page || null };
    });
  }, []);

  const createEmptyPage = useCallback(
    async (
      hydratedUrl: string,
      page: Pick<Page, 'name' | 'route'>,
      businessUnitKey: string
    ): Promise<Page> => {
      const newPage: Omit<Page, 'key' | 'layout' | 'components'> = {
        name: page.name,
        route: page.route,
      };
      const createdPage = await createPageApi(hydratedUrl, newPage);

      setState((prev) => ({
        ...prev,
        pages: [...prev.pages, createdPage],
        currentPage: createdPage,
        unsavedChanges: true,
      }));

      // Save to session storage
      saveToSessionStorage([...state.pages, createdPage], businessUnitKey);

      return createdPage;
    },
    [state.pages, saveToSessionStorage]
  );

  const updateCurrentPage = useCallback(
    (updates: Partial<Page>, businessUnitKey: string) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const updatedPage = { ...prev.currentPage, ...updates };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, businessUnitKey);

        return {
          ...prev,
          pages: updatedPages,
          currentPage: updatedPage,
          unsavedChanges: true,
        };
      });
    },
    [saveToSessionStorage]
  );

  const addRowToCurrentPage = useCallback(
    async (hydratedUrl: string) => {
      if (!state.currentPage) return;
      const updatedPage = await addRowToPageApi(hydratedUrl, state.currentPage.key);
      console.log('updatedPage >>>>', updatedPage);
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [saveToSessionStorage, state]
  );

  const removeRowFromCurrentPage = useCallback(
    async (hydratedUrl: string, rowId: string) => {
      if (!state.currentPage) return;
      const updatedPage = await removeRowFromPageApi(hydratedUrl, state.currentPage.key, rowId);
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [saveToSessionStorage, state.currentPage]
  );

  const addComponentToCurrentPage = useCallback(
    async (hydratedUrl: string, componentType: string | null | undefined, rowId: string, cellId: string) => {
      if (!state.currentPage) return;
      if (!componentType) return;
      const updatedPage = await addComponentToPageApi(hydratedUrl, state.currentPage.key,componentType, rowId, cellId);
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [saveToSessionStorage, state.currentPage]
  );

  const updateCellSpanInCurrentPage = useCallback(
    async (hydratedUrl: string, rowId: string, cellId: string, updates: { colSpan: number, shouldRemoveEmptyCell?: boolean, shouldAddEmptyCell?: boolean }) => {
      if (!state.currentPage) return;
      const updatedPage = await updateCellSpanInPageApi(hydratedUrl, state.currentPage.key, rowId, cellId, updates);
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    }, [saveToSessionStorage, state.currentPage]
  );

  const updateComponentInCurrentPage = useCallback(
    (
      componentId: string,
      updates: Partial<ContentItem>,
      businessUnitKey: string
    ) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;
        // use direct api call to update content item

        const components = prev.currentPage.components.map((c) =>
          c.id === componentId ? { ...c, ...updates } : c
        );
        const updatedPage = { ...prev.currentPage, components };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, businessUnitKey);

        return {
          ...prev,
          pages: updatedPages,
          currentPage: updatedPage,
          unsavedChanges: true,
        };
      });
    },
    [saveToSessionStorage]
  );

  const removeComponentFromCurrentPage = useCallback(
    (componentId: string, businessUnitKey: string) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        // remove content item

        const components = prev.currentPage.components.filter(
          (c) => c.id !== componentId
        );
        const updatedPage = { ...prev.currentPage, components };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, businessUnitKey);

        return {
          ...prev,
          pages: updatedPages,
          currentPage: updatedPage,
          unsavedChanges: true,
        };
      });
    },
    [saveToSessionStorage]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearUnsavedChanges = useCallback(() => {
    setState((prev) => ({ ...prev, unsavedChanges: false }));
  }, []);

  return {
    // State
    pages: state.pages,
    currentPage: state.currentPage,
    loading: state.loading,
    error: state.error,
    unsavedChanges: state.unsavedChanges,

    // Actions
    fetchPages,
    syncPagesWithApi,
    fetchPage,
    updatePage,
    deletePage,
    setCurrentPage,
    createEmptyPage,
    updateCurrentPage,
    addRowToCurrentPage,
    removeRowFromCurrentPage,
    addComponentToCurrentPage,
    updateComponentInCurrentPage,
    removeComponentFromCurrentPage,
    updateCellSpanInCurrentPage,
    clearError,
    clearUnsavedChanges,
  };
};
