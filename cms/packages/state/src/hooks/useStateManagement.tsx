import { useState, useCallback } from 'react';
import {
  ContentItem,
  Page,
  ContentItemStates,
  PageStates,
  StateManagementState,
} from '@commercetools-demo/contentools-types';
import {
  getStatesEndpoint,
  saveDraftEndpoint,
  publishEndpoint,
  revertDraftEndpoint,
} from '../api';

const initialState: StateManagementState = {
  states: {},
  currentState: null,
  contentType: 'content-items',
  loading: false,
  error: null,
};

// Update current state based on state data
function determineCurrentState(states: {
  draft?: any;
  published?: any;
}): 'draft' | 'published' | 'both' | null {
  if (states?.draft && states?.published) {
    return 'both';
  } else if (states?.draft) {
    return 'draft';
  } else if (states?.published) {
    return 'published';
  }
  return null;
}

export const useStateManagement = (baseURL: string) => {
  const [state, setState] = useState<StateManagementState>(initialState);

  // Actions
  const fetchStates = useCallback(
    async (
      hydratedUrl: string,
      key: string,
      contentType: 'content-items' | 'pages'
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await getStatesEndpoint<ContentItemStates | PageStates>(
          hydratedUrl,
          contentType,
          key
        );

        const states = result.states || {};

        setState((prev) => ({
          ...prev,
          states,
          contentType,
          currentState: determineCurrentState(states),
          loading: false,
        }));

        return states;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to fetch states',
        }));
        throw error;
      }
    },
    []
  );

  const saveDraft = useCallback(
    async (
      hydratedUrl: string,
      item: ContentItem | Page,
      key: string,
      contentType: 'content-items' | 'pages'
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await saveDraftEndpoint<ContentItem | Page>(
          hydratedUrl,
          contentType,
          key,
          item
        );

        const states = result.states;

        setState((prev) => ({
          ...prev,
          states,
          contentType,
          currentState: determineCurrentState(states),
          loading: false,
        }));

        return states;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to save draft',
        }));
        throw error;
      }
    },
    []
  );

  const publish = useCallback(
    async (
      hydratedUrl: string,
      item: ContentItem | Page,
      key: string,
      contentType: 'content-items' | 'pages',
      clearDraft: boolean = false
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await publishEndpoint<ContentItem | Page>(
          hydratedUrl,
          contentType,
          key,
          item,
          clearDraft
        );

        const states = result.states;

        setState((prev) => ({
          ...prev,
          states,
          contentType,
          currentState: determineCurrentState(states),
          loading: false,
        }));

        return states;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to publish',
        }));
        throw error;
      }
    },
    []
  );

  const revertToPublished = useCallback(
    async (
      hydratedUrl: string,
      key: string,
      contentType: 'content-items' | 'pages'
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await revertDraftEndpoint(hydratedUrl, contentType, key);

        // After reverting, fetch the updated states
        const result = await getStatesEndpoint<ContentItemStates | PageStates>(
          hydratedUrl,
          contentType,
          key
        );

        const states = result.states || {};

        setState((prev) => ({
          ...prev,
          states,
          contentType,
          currentState: determineCurrentState(states),
          loading: false,
        }));

        return { success: true };
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to revert to published',
        }));
        throw error;
      }
    },
    []
  );

  const setContentType = useCallback(
    (contentType: 'content-items' | 'pages') => {
      setState((prev) => ({
        ...prev,
        contentType,
      }));
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearStates = useCallback(() => {
    setState((prev) => ({
      ...prev,
      states: {},
      currentState: null,
    }));
  }, []);

  // Selectors
  const hasChanges = useCallback(() => {
    return state.currentState === 'draft' || state.currentState === 'both';
  }, [state.currentState]);

  const isPublished = useCallback(() => {
    return state.currentState === 'published' || state.currentState === 'both';
  }, [state.currentState]);

  const isDraft = useCallback(() => {
    return state.currentState === 'draft' || state.currentState === 'both';
  }, [state.currentState]);

  const getDraftState = useCallback(() => {
    return state.states.draft || null;
  }, [state.states]);

  const getPublishedState = useCallback(() => {
    return state.states.published || null;
  }, [state.states]);

  const getStateInfo = useCallback(() => {
    return {
      currentState: state.currentState,
      hasChanges: hasChanges(),
      isPublished: isPublished(),
      isDraft: isDraft(),
      draft: getDraftState(),
      published: getPublishedState(),
    };
  }, [
    state.currentState,
    hasChanges,
    isPublished,
    isDraft,
    getDraftState,
    getPublishedState,
  ]);

  return {
    // State
    states: state.states,
    currentState: state.currentState,
    contentType: state.contentType,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchStates,
    saveDraft,
    publish,
    revertToPublished,
    setContentType,
    clearError,
    clearStates,

    // Selectors
    hasChanges,
    isPublished,
    isDraft,
    getDraftState,
    getPublishedState,
    getStateInfo,
  };
};
