import {
  ContentItem,
  EContentType,
  Page,
  PagesState,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import { useCallback, useState } from 'react';
import {
  addComponentToPageApi,
  addRowToPageApi,
  createPageApi,
  deletePageApi,
  fetchPageApi,
  fetchPagesApi,
  fetchPublishedPageApi,
  queryPageEndpoint,
  queryPublishedPageEndpoint,
  removeComponentFromPageApi,
  removeRowFromPageApi,
  updateCellSpanInPageApi,
  updateComponentInPageApi,
  updatePageApi,
} from '../api/page';
import { getStatesEndpoint } from '../api/state';

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  states: {},
  loading: false,
  error: null,
  unsavedChanges: false,
};

// Helper functions

export const usePages = () => {
  const [state, setState] = useState<PagesState>(initialState);

  // Actions
  const fetchPages = useCallback(async (hydratedUrl: string) => {
    try {
      const pagesFromApi = await fetchPagesApi(hydratedUrl);
      const pages = pagesFromApi.map((item) => item.value);
      const states = pagesFromApi.reduce((acc: Record<string, StateInfo<Page>>, item) => {
        acc[item.key] = item.states;
        return acc;
      }, {} as Record<string, StateInfo<Page>>);
      console.log('pages', pages);
      console.log('states', states);
      setState((prev) => ({
        ...prev,
        pages: pages,
        states,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        pages: [],
        states: {},
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pages',
      }));
    }
  }, []);


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

  const fetchPublishedPage = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const page = await fetchPublishedPageApi(
          hydratedUrl,
          key
        );

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        return page;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch published page',
        }));
        throw error;
      }
    },
    []
  );

  const queryPage = useCallback(
    async (hydratedUrl: string, query: string) => {
      return await queryPageEndpoint(hydratedUrl, query);
    },
    []
  );

  const queryPublishedPage = useCallback(
    async (hydratedUrl: string, query: string) => {
      return await queryPublishedPageEndpoint(
        hydratedUrl,
        query
      );
    },
    []
  );

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

  const deletePage = useCallback(async (hydratedUrl: string, key: string) => {
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
        error: error instanceof Error ? error.message : 'Failed to delete page',
      }));
      throw error;
    }
  }, []);

  const fetchItemState = useCallback(async (hydratedUrl: string, contentItemKey: string) => {
    const result = await getStatesEndpoint<{
      businessUnitKey: string;
      key: string;
      states: StateInfo<ContentItem>;
    }>(hydratedUrl, EContentType.PAGE_ITEMS, contentItemKey);
    return result;
  }, []);

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

      return createdPage;
    },
    [state.pages]
  );

  const addRowToCurrentPage = useCallback(
    async (hydratedUrl: string) => {
      if (!state.currentPage) return;
      const updatedPage = await addRowToPageApi(
        hydratedUrl,
        state.currentPage.key
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
  );

  const removeRowFromCurrentPage = useCallback(
    async (hydratedUrl: string, rowId: string) => {
      if (!state.currentPage) return;
      const updatedPage = await removeRowFromPageApi(
        hydratedUrl,
        state.currentPage.key,
        rowId
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
  );

  const addComponentToCurrentPage = useCallback(
    async (
      hydratedUrl: string,
      componentType: string | null | undefined,
      rowId: string,
      cellId: string
    ) => {
      if (!state.currentPage) return;
      if (!componentType) return;
      const updatedPage = await addComponentToPageApi(
        hydratedUrl,
        state.currentPage.key,
        componentType,
        rowId,
        cellId
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
  );

  const updateCellSpanInCurrentPage = useCallback(
    async (
      hydratedUrl: string,
      rowId: string,
      cellId: string,
      updates: {
        colSpan: number;
        shouldRemoveEmptyCell?: boolean;
        shouldAddEmptyCell?: boolean;
      }
    ) => {
      if (!state.currentPage) return;
      const updatedPage = await updateCellSpanInPageApi(
        hydratedUrl,
        state.currentPage.key,
        rowId,
        cellId,
        updates
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
  );

  const updateComponentInCurrentPage = useCallback(
    async (
      hydratedUrl: string,
      contentItemKey: string,
      updates: Partial<ContentItem>
    ) => {
      if (!state.currentPage) return;
      const updatedPage = await updateComponentInPageApi(
        hydratedUrl,
        state.currentPage.key,
        contentItemKey,
        updates
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
  );

  const removeComponentFromCurrentPage = useCallback(
    async (hydratedUrl: string, contentItemKey: string) => {
      if (!state.currentPage) return;
      const updatedPage = await removeComponentFromPageApi(
        hydratedUrl,
        state.currentPage.key,
        contentItemKey
      );
      setState((prev) => ({
        ...prev,
        currentPage: updatedPage.value,
        unsavedChanges: true,
      }));
      return updatedPage;
    },
    [state.currentPage]
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
    states: state.states,
    loading: state.loading,
    error: state.error,
    unsavedChanges: state.unsavedChanges,

    // Actions
    fetchPages,
    fetchPage,
    fetchPublishedPage,
    queryPage,
    queryPublishedPage,
    fetchItemState,
    updatePage,
    deletePage,
    setCurrentPage,
    createEmptyPage,
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
