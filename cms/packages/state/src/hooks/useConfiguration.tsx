import { useState, useCallback } from 'react';
import {
  ThemeTokens,
  HeaderConfiguration,
} from '@commercetools-demo/contentools-types';
import {
  fetchAllConfigurationsEndpoint,
  fetchThemeEndpoint,
  createThemeEndpoint,
  updateThemeEndpoint,
  deleteThemeEndpoint,
  fetchHeaderEndpoint,
  createHeaderEndpoint,
  updateHeaderEndpoint,
  deleteHeaderEndpoint,
} from '../api/configuration';

interface ConfigurationState {
  theme: ThemeTokens | null;
  header: HeaderConfiguration | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigurationState = {
  theme: null,
  header: null,
  loading: false,
  error: null,
};

export const useConfiguration = (projectKey: string, jwtToken?: string) => {
  const [state, setState] = useState<ConfigurationState>(initialState);

  const fetchTheme = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await fetchThemeEndpoint(baseURL, projectKey);
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch theme configuration',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const createTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await createThemeEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const updateTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await updateThemeEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const deleteTheme = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteThemeEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({
          ...prev,
          theme: null,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const saveTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      if (state.theme == null) {
        return createTheme(baseURL, value);
      }
      return updateTheme(baseURL, value);
    },
    [state.theme, createTheme, updateTheme]
  );

  const fetchAllConfigurations = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const { theme, header } = await fetchAllConfigurationsEndpoint(
          baseURL,
          projectKey
        );
        setState((prev) => ({
          ...prev,
          theme,
          header,
          loading: false,
        }));
        return { theme, header };
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch configurations',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const fetchHeader = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await fetchHeaderEndpoint(baseURL, projectKey);
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch header configuration',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const createHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await createHeaderEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const updateHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await updateHeaderEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const deleteHeader = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteHeaderEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({
          ...prev,
          header: null,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const saveHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      if (state.header == null) {
        return createHeader(baseURL, value);
      }
      return updateHeader(baseURL, value);
    },
    [state.header, createHeader, updateHeader]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    theme: state.theme,
    header: state.header,
    loading: state.loading,
    error: state.error,
    fetchTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    saveTheme,
    fetchAllConfigurations,
    fetchHeader,
    createHeader,
    updateHeader,
    deleteHeader,
    saveHeader,
    clearError,
  };
};
