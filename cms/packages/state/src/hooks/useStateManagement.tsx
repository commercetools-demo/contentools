import { useState, useCallback } from 'react';
import {
  ContentItem,
  Page,
  ContentItemStates,
  PageStates,
  StateManagementState,
  EContentType,
  EStateType,
} from '@commercetools-demo/contentools-types';
import {
  getStatesEndpoint,
  publishEndpoint,
  revertDraftEndpoint,
} from '../api/state';

const initialState: StateManagementState = {
  states: {},
  currentState: null,
  loading: false,
  error: null,
};

// Update current state based on state data
function determineCurrentState(states: {
  draft?: any;
  published?: any;
}): EStateType | null {
  if (states?.draft && states?.published) {
    return EStateType.BOTH;
  } else if (states?.draft) {
    return EStateType.DRAFT;
  } else if (states?.published) {
    return EStateType.PUBLISHED;
  }
  return null;
}

export const useStateManagement = () => {
  const [state, setState] = useState<StateManagementState>(initialState);

  // Actions
  const fetchStates = useCallback(
    async (
      hydratedUrl: string,
      key: string,
      contentType: EContentType
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

  const publish = useCallback(
    async (
      hydratedUrl: string,
      item: ContentItem | Page,
      key: string,
      contentType: EContentType,
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
      contentType: EContentType
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


  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    states: state.states,
    currentState: state.currentState,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchStates,
    publish,
    revertToPublished,
    clearError,
  };
};
