import { useState, useCallback } from 'react';
import {
  ContentItem,
  Page,
  ContentItemStates,
  PageStates,
  StateManagementState,
  EContentType,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import {
  getStatesEndpoint,
  getStateEndpoint,
  publishEndpoint,
  revertDraftEndpoint,
} from '../api/state';

const initialState: StateManagementState = {
  states: {},
  currentState: {},
  loading: false,
  error: null,
};

export const useStateManagement = () => {
  const [state, setState] = useState<StateManagementState>(initialState);

  // Actions
  const fetchStates = useCallback(
    async (hydratedUrl: string, key: string, contentType: EContentType) => {
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
          currentState: states,
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
          currentState: states,
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
    async (hydratedUrl: string, key: string, contentType: EContentType) => {
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
          currentState: states,
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
