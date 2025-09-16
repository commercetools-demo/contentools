import { useState, useCallback } from 'react';
import {
  ContentTypeState,
  ContentTypeData,
  DatasourceInfo,
} from '@commercetools-demo/contentools-types';
import {
  fetchContentTypesEndpoint,
  createContentTypeEndpoint,
  updateContentTypeEndpoint,
  deleteContentTypeEndpoint,
  getAvailableDatasourcesEndpoint,
  fetchContentTypeEndpoint,
} from '../api';
import { decodeFromBase64, encodeToBase64 } from '../utils/text-encoder';

const initialState: ContentTypeState = {
  contentTypes: [],
  contentTypesRenderers: {},
  loading: false,
  error: null,
  availableDatasources: [],
};

export const useContentType = (baseURL: string) => {
  const [state, setState] = useState<ContentTypeState>(initialState);

  // Actions
  const fetchContentTypes = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetchContentTypesEndpoint(baseURL);
      const contentTypes = response.map((item) => {
        try {
          const base64Code = atob(item.code?.transpiledCode || '');
          const base64Text = atob(item.code?.text || '');
          item.code = {
            componentName: item.metadata.type,
            transpiledCode: base64Code,
            text: base64Text,
          };
        } catch (error) {
          item.code = {
            componentName: item.metadata.type,
            transpiledCode: '',
            text: '',
          };
        }
        return item;
      });

      setState((prev) => ({
        ...prev,
        contentTypes,
        loading: false,
      }));

      return contentTypes;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch content types',
      }));
      throw error;
    }
  }, [baseURL]);

  const fetchContentType = useCallback(
    async (key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetchContentTypeEndpoint<ContentTypeData>(
          baseURL,
          key
        );
        try {
          const base64Code = decodeFromBase64(
            response.code?.transpiledCode || ''
          );
          const base64Text = decodeFromBase64(response.code?.text || '');
          response.code = {
            componentName: response.metadata.type,
            transpiledCode: base64Code,
            text: base64Text,
          };
        } catch (error) {
          response.code = {
            componentName: response.metadata.type,
            transpiledCode: '',
            text: '',
          };
        }

        return response;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch content types',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const fetchAvailableDatasources = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await getAvailableDatasourcesEndpoint<DatasourceInfo>(
        baseURL
      );
      const datasources = response.map((item) => item.value as DatasourceInfo);

      setState((prev) => ({
        ...prev,
        availableDatasources: datasources,
        loading: false,
      }));

      return datasources;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch available datasources',
      }));
      throw error;
    }
  }, [baseURL]);

  const addContentType = useCallback(
    async (contentType: ContentTypeData) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await createContentTypeEndpoint<ContentTypeData>(
          baseURL,
          contentType
        );
        const newContentType = response.value;

        setState((prev) => ({
          ...prev,
          contentTypes: [...prev.contentTypes, newContentType],
          loading: false,
        }));

        return newContentType;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to add content type',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const addContentTypeWithCode = useCallback(
    async ({ data }: { data: any }) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await createContentTypeEndpoint<ContentTypeData>(
          baseURL,
          data
        );
        const newContentType = response.value;

        setState((prev) => ({
          ...prev,
          contentTypes: [...prev.contentTypes, newContentType],
          loading: false,
        }));

        return newContentType;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to add content type',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const updateContentType = useCallback(
    async (key: string, contentType: ContentTypeData) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const base64Code = encodeToBase64(
          contentType.code?.transpiledCode || ''
        );
        const base64Text = encodeToBase64(contentType.code?.text || '');
        contentType.code = {
          componentName: contentType.metadata.type,
          transpiledCode: base64Code,
          text: base64Text,
        };
        const response = await updateContentTypeEndpoint<ContentTypeData>(
          baseURL,
          key,
          contentType
        );
        const updatedContentType = response.value;

        setState((prev) => ({
          ...prev,
          contentTypes: prev.contentTypes.map((ct) =>
            ct.metadata.type === key ? updatedContentType : ct
          ),
          loading: false,
        }));

        return updatedContentType;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update content type',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const removeContentType = useCallback(
    async (key: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteContentTypeEndpoint(baseURL, key);

        setState((prev) => ({
          ...prev,
          contentTypes: prev.contentTypes.filter(
            (ct) => ct.metadata.type !== key
          ),
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to remove content type',
        }));
        throw error;
      }
    },
    [baseURL]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const getContentTypeByType = useCallback(
    (type: string) => {
      return state.contentTypes.find((ct) => ct.metadata.type === type) || null;
    },
    [state.contentTypes]
  );

  const getContentTypeMetadata = useCallback(
    (type: string) => {
      const contentType = state.contentTypes.find(
        (ct) => ct.metadata.type === type
      );
      return contentType?.metadata || null;
    },
    [state.contentTypes]
  );

  const getDatasourceByKey = useCallback(
    (key: string) => {
      return state.availableDatasources.find((ds) => ds.key === key) || null;
    },
    [state.availableDatasources]
  );

  return {
    // State
    contentTypes: state.contentTypes,
    loading: state.loading,
    error: state.error,
    availableDatasources: state.availableDatasources,
    contentTypesRenderers: state.contentTypesRenderers,
    // Actions
    fetchContentTypes,
    fetchContentType,
    fetchAvailableDatasources,
    addContentType,
    updateContentType,
    removeContentType,
    clearError,

    // Selectors
    getContentTypeByType,
    getContentTypeMetadata,
    getDatasourceByKey,

    addContentTypeWithCode,
  };
};
