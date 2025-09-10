import { useState, useCallback } from 'react';
import {
  ContentItem,
  ContentItemState,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import {
  fetchContentItemsEndpoint,
  fetchPreviewContentItemEndpoint,
  createContentItemEndpoint,
  updateContentItemEndpoint,
  deleteContentItemEndpoint,
  fetchRawContentItemEndpoint,
  fetchPublishedContentItemEndpoint,
  queryContentItemEndpoint,
  queryPublishedContentItemEndpoint,
} from '../api/content-item';

const initialState: ContentItemState = {
  items: [],
  states: {},
  loading: false,
  error: null,
};

export const useContentItem = () => {
  const [state, setState] = useState<ContentItemState>(initialState);

  // Actions
  const fetchContentItems = useCallback(async (hydratedUrl: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await fetchContentItemsEndpoint(hydratedUrl);

      const items = result.map((item) => item.value);
      const states = result.reduce((acc, item) => {
        acc[item.key] = item.states;
        return acc;
      }, {} as Record<string, StateInfo<ContentItem>>);

      setState((prev) => ({
        ...prev,
        items,
        states,
        loading: false,
      }));

      return { items, states };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch content items',
      }));
      throw error;
    }
  }, []);

  const fetchContentItem = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const item = await fetchPreviewContentItemEndpoint(hydratedUrl, key);

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        return item;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch content item',
        }));
        throw error;
      }
    },
    []
  );

  const fetchRawContentItem = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const item = await fetchRawContentItemEndpoint(hydratedUrl, key);

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        return item;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch content item',
        }));
        throw error;
      }
    },
    []
  );

  const fetchPublishedContentItem = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const item = await fetchPublishedContentItemEndpoint(hydratedUrl, key);

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        return item;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch published content item',
        }));
        throw error;
      }
    },
    []
  );

  const createContentItem = useCallback(
    async (hydratedUrl: string, item: ContentItem) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const createdItem = await createContentItemEndpoint(hydratedUrl, item);

        setState((prev) => ({
          ...prev,
          items: [...prev.items, createdItem],
          loading: false,
        }));

        return createdItem;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create content item',
        }));
        throw error;
      }
    },
    []
  );

  const updateContentItem = useCallback(
    async (hydratedUrl: string, key: string, item: ContentItem) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const updatedItem = await updateContentItemEndpoint(
          hydratedUrl,
          key,
          item
        );

        setState((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i.id === updatedItem.id ? updatedItem : i
          ),
          loading: false,
        }));

        return updatedItem;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update content item',
        }));
        throw error;
      }
    },
    []
  );

  const deleteContentItem = useCallback(
    async (hydratedUrl: string, key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteContentItemEndpoint(hydratedUrl, key);

        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.key !== key),
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete content item',
        }));
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Local state actions
  const addContentItemLocally = useCallback((item: ContentItem) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  const updateContentItemLocally = useCallback(
    (itemId: string, updates: Partial<ContentItem>) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    },
    []
  );

  const removeContentItemLocally = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }, []);

  const updateContentItemState = useCallback(
    (key: string, stateInfo: StateInfo<ContentItem>) => {
      setState((prev) => ({
        ...prev,
        states: {
          ...prev.states,
          [key]: stateInfo,
        },
      }));
    },
    []
  );

  // Selectors
  const getContentItemById = useCallback(
    (id: string) => {
      return state.items.find((item) => item.id === id) || null;
    },
    [state.items]
  );

  const getContentItemByKey = useCallback(
    (key: string) => {
      return state.items.find((item) => item.key === key) || null;
    },
    [state.items]
  );

  const getContentItemsByType = useCallback(
    (type: string) => {
      return state.items.filter((item) => item.type === type);
    },
    [state.items]
  );

  const getContentItemsByBusinessUnit = useCallback(
    (businessUnitKey: string) => {
      return state.items.filter(
        (item) => item.businessUnitKey === businessUnitKey
      );
    },
    [state.items]
  );

  const getContentItemState = useCallback(
    (key: string) => {
      return state.states[key] || null;
    },
    [state.states]
  );

  const queryContentItem = useCallback(
    async (hydratedUrl: string, query: string) => {
      return await queryContentItemEndpoint(hydratedUrl, query);
    },
    []
  );

  const queryPublishedContentItem = useCallback(
    async (hydratedUrl: string, query: string) => {
      return await queryPublishedContentItemEndpoint(hydratedUrl, query);
    },
    []
  );

  return {
    // State
    items: state.items,
    states: state.states,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchContentItems,
    fetchContentItem,
    queryContentItem,
    queryPublishedContentItem,
    fetchRawContentItem,
    fetchPublishedContentItem,
    createContentItem,
    updateContentItem,
    deleteContentItem,
    clearError,

    // Local actions
    addContentItemLocally,
    updateContentItemLocally,
    removeContentItemLocally,
    updateContentItemState,

    // Selectors
    getContentItemById,
    getContentItemByKey,
    getContentItemsByType,
    getContentItemsByBusinessUnit,
    getContentItemState,
  };
};
