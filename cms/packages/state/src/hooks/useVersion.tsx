import { useState, useCallback } from 'react';
import {
  ContentItem,
  Page,
  ContentItemVersions,
  PageVersions,
  VersionState,
  ContentItemVersionInfo,
  PageVersionInfo,
} from '@commercetools-demo/contentools-types';
import {
  fetchVersionsEndpoint,
  saveVersionEndpoint,
  getVersionEndpoint,
} from '../api';

export function useVersion<T extends ContentItemVersionInfo | PageVersionInfo>(
  baseURL: string
) {
  const initialState: VersionState<T> = {
    versions: [],
    selectedVersion: null,
    contentType: 'content-items',
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

  const saveVersion = useCallback(
    async (
      hydratedUrl: string,
      item: ContentItem | Page,
      key: string,
      contentType: 'content-items' | 'pages'
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await saveVersionEndpoint<ContentItem | Page>(
          hydratedUrl,
          contentType,
          key,
          item
        );

        const versions = result.versions as T[];

        setState((prev) => ({
          ...prev,
          versions,
          loading: false,
        }));

        return versions;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to save version',
        }));
        throw error;
      }
    },
    []
  );

  const getVersion = useCallback(
    async (
      contentType: 'content-items' | 'pages',
      key: string,
      versionId: string
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await getVersionEndpoint<T>(
          baseURL,
          contentType,
          key,
          versionId
        );

        setState((prev) => ({
          ...prev,
          selectedVersion: result,
          loading: false,
        }));

        return result;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to get version',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const selectVersion = useCallback((versionId: string) => {
    setState((prev) => {
      const version =
        prev.versions.find((v) => 'id' in v && v.id === versionId) || null;
      return {
        ...prev,
        selectedVersion: version,
      };
    });
  }, []);

  const clearSelectedVersion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedVersion: null,
    }));
  }, []);

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

  const clearVersions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      versions: [],
      selectedVersion: null,
    }));
  }, []);

  // Selectors
  const getVersionById = useCallback(
    (versionId: string) => {
      return (
        state.versions.find((v) => 'id' in v && v.id === versionId) || null
      );
    },
    [state.versions]
  );

  const getVersionsByContentType = useCallback(
    (contentType: 'content-items' | 'pages') => {
      return state.versions.filter((v) => {
        // This would need to be implemented based on how versions are structured
        // For now, we'll return all versions
        return true;
      });
    },
    [state.versions]
  );

  const getLatestVersion = useCallback(() => {
    if (state.versions.length === 0) return null;

    // Assuming versions are sorted by timestamp, return the latest
    return state.versions.reduce((latest, current) => {
      const latestTimestamp = new Date(latest.timestamp).getTime();
      const currentTimestamp = new Date(current.timestamp).getTime();
      return currentTimestamp > latestTimestamp ? current : latest;
    });
  }, [state.versions]);

  const getVersionsCount = useCallback(() => {
    return state.versions.length;
  }, [state.versions]);

  return {
    // State
    versions: state.versions,
    selectedVersion: state.selectedVersion,
    contentType: state.contentType,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchVersions,
    saveVersion,
    getVersion,
    selectVersion,
    clearSelectedVersion,
    setContentType,
    clearError,
    clearVersions,

    // Selectors
    getVersionById,
    getVersionsByContentType,
    getLatestVersion,
    getVersionsCount,
  };
}
