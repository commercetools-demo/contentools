import {
  ContentItemVersionInfo,
  ContentItemVersions,
  PageVersionInfo,
  PageVersions,
  VersionState
} from '@commercetools-demo/contentools-types';
import { useCallback, useState } from 'react';
import {
  fetchVersionsEndpoint
} from '../api';

export function useVersion<T extends ContentItemVersionInfo | PageVersionInfo>(
) {
  const initialState: VersionState<T> = {
    versions: [],
    loading: false,
    error: null,
  };
  const [state, setState] = useState<VersionState<T>>(initialState);

  // Actions
  const fetchVersions = useCallback(
    async (
      hydratedUrl: string,
      key: string,
      contentType: 'content-items' | 'pages'
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await fetchVersionsEndpoint<
          ContentItemVersions | PageVersions
        >(hydratedUrl, contentType, key);

        const versions = result.versions as T[];

        setState((prev) => ({
          ...prev,
          versions,
          contentType,
          loading: false,
        }));

        return versions;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to fetch versions',
        }));
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearVersions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      versions: [],
    }));
  }, []);

  return {
    // State
    versions: state.versions,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchVersions,
    clearError,
    clearVersions,
  };
}
