import { useState, useCallback } from 'react';
import { ThemeTokens } from '@commercetools-demo/contentools-types';
import {
  fetchThemeEndpoint,
  createThemeEndpoint,
  updateThemeEndpoint,
  deleteThemeEndpoint,
} from '../api/configuration';

interface ConfigurationState {
  theme: ThemeTokens | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigurationState = {
  theme: null,
  loading: false,
  error: null,
};

export const useConfiguration = (
  projectKey: string,
  jwtToken?: string
) => {
  const [state, setState] = useState<ConfigurationState>(initialState);

  const fetchTheme = useCallback(async (baseURL: string) => {
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
  }, [projectKey]);

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

  const deleteTheme = useCallback(async (baseURL: string) => {
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
  }, [projectKey, jwtToken]);

  const saveTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      if (state.theme == null) {
        return createTheme(baseURL, value);
      }
      return updateTheme(baseURL, value);
    },
    [state.theme, createTheme, updateTheme]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    theme: state.theme,
    loading: state.loading,
    error: state.error,
    fetchTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    saveTheme,
    clearError,
  };
};
