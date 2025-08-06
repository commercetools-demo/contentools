import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Page,
  PagesState,
  ContentItem,
  GridRow,
  GridCell,
} from '@commercetools-demo/cms-types';
import { debounce } from '../utils/debounce';
import {
  NUMBER_OF_COLUMNS,
  LOCAL_STORAGE_KEY_PREFIX,
  DEBOUNCE_DELAY,
} from '../utils/constants';
import {
  fetchPagesEndpoint,
  fetchPageEndpoint,
  createPageEndpoint,
  updatePageEndpoint,
  deletePageEndpoint,
} from '../api';

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
  unsavedChanges: false,
  businessUnitKey: '',
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
    const data = await fetchPageEndpoint<Page>(baseUrl, key);
    return data.value;
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

const createPageApi = async (baseUrl: string, page: Page): Promise<Page> => {
  try {
    const data = await createPageEndpoint<Page>(baseUrl, page);
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
const createEmptyGridRow = (): GridRow => {
  const cells: GridCell[] = [];

  for (let i = 0; i < NUMBER_OF_COLUMNS; i++) {
    cells.push({
      id: uuidv4(),
      componentId: null,
      colSpan: 1,
    });
  }

  return {
    id: uuidv4(),
    cells,
  };
};

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
  const fetchPages = useCallback(async (businessUnitKey: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // First try to get from session storage
      const storageKey = `${LOCAL_STORAGE_KEY_PREFIX}_${businessUnitKey}`;
      const storedPages = sessionStorage.getItem(storageKey);
      const pagesFromStorage = storedPages
        ? (JSON.parse(storedPages) as Page[])
        : null;

      setState((prev) => ({
        ...prev,
        pages: pagesFromStorage || [],
        businessUnitKey,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        pages: [],
        businessUnitKey,
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

  const fetchPage = useCallback(
    async (key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const page = await fetchPageApi(baseUrl, key);

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
          error:
            error instanceof Error ? error.message : 'Failed to fetch page',
        }));
        throw error;
      }
    },
    [baseUrl]
  );

  const createPage = useCallback(
    async (page: Page) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const createdPage = await createPageApi(baseUrl, page);

        setState((prev) => ({
          ...prev,
          pages: [...prev.pages, createdPage],
          loading: false,
        }));

        return createdPage;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to create page',
        }));
        throw error;
      }
    },
    [baseUrl]
  );

  const updatePage = useCallback(
    async (page: Page) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const updatedPage = await updatePageApi(baseUrl, page);

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
          error:
            error instanceof Error ? error.message : 'Failed to update page',
        }));
        throw error;
      }
    },
    [baseUrl]
  );

  const deletePage = useCallback(
    async (key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deletePageApi(baseUrl, key);

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
    [baseUrl]
  );

  // Local actions
  const setCurrentPage = useCallback((key: string) => {
    setState((prev) => {
      const page = prev.pages.find((p) => p.key === key);
      return { ...prev, currentPage: page || null };
    });
  }, []);

  const createEmptyPage = useCallback(
    (name: string, route: string, businessUnitKey: string) => {
      const newPage: Page = {
        key: `page-${uuidv4()}`,
        name,
        uuid: uuidv4(),
        route,
        businessUnitKey,
        layout: {
          rows: [createEmptyGridRow()],
        },
        components: [],
      };

      setState((prev) => ({
        ...prev,
        pages: [...prev.pages, newPage],
        currentPage: newPage,
        unsavedChanges: true,
        businessUnitKey,
      }));

      // Save to session storage
      saveToSessionStorage([...state.pages, newPage], businessUnitKey);
    },
    [state.pages, saveToSessionStorage]
  );

  const updateCurrentPage = useCallback(
    (updates: Partial<Page>) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const updatedPage = { ...prev.currentPage, ...updates };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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
    (rowIndex?: number) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const newRow = createEmptyGridRow();
        const layout = { ...prev.currentPage.layout };

        if (rowIndex !== undefined) {
          layout.rows.splice(rowIndex + 1, 0, newRow);
        } else {
          layout.rows.push(newRow);
        }

        const updatedPage = { ...prev.currentPage, layout };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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

  const removeRowFromCurrentPage = useCallback(
    (rowId: string) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const layout = { ...prev.currentPage.layout };
        layout.rows = layout.rows.filter((row) => row.id !== rowId);

        const updatedPage = { ...prev.currentPage, layout };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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

  const addComponentToCurrentPage = useCallback(
    (component: ContentItem) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const components = [...prev.currentPage.components, component];
        const updatedPage = { ...prev.currentPage, components };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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

  const updateComponentInCurrentPage = useCallback(
    (componentId: string, updates: Partial<ContentItem>) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const components = prev.currentPage.components.map((c) =>
          c.id === componentId ? { ...c, ...updates } : c
        );
        const updatedPage = { ...prev.currentPage, components };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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
    (componentId: string) => {
      setState((prev) => {
        if (!prev.currentPage) return prev;

        const components = prev.currentPage.components.filter(
          (c) => c.id !== componentId
        );
        const updatedPage = { ...prev.currentPage, components };
        const updatedPages = prev.pages.map((p) =>
          p.key === prev.currentPage!.key ? updatedPage : p
        );

        // Save to session storage
        saveToSessionStorage(updatedPages, prev.businessUnitKey);

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
    businessUnitKey: state.businessUnitKey,

    // Actions
    fetchPages,
    syncPagesWithApi,
    fetchPage,
    createPage,
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
    clearError,
    clearUnsavedChanges,
  };
};
