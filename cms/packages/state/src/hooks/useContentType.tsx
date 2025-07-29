import { useState, useCallback, useEffect } from 'react';
import { ContentTypeState, ContentTypeData, DatasourceInfo } from '@commercetools-demo/cms-types';
import {
  fetchContentTypesEndpoint,
  createContentTypeEndpoint,
  updateContentTypeEndpoint,
  deleteContentTypeEndpoint,
  getAvailableDatasourcesEndpoint,
  fetchContentTypeEndpoint,
} from '../api';
import { getAllContentTypesMetaData, getAllContentTypesRenderers } from '@commercetools-demo/cms-content-type-registry';

const initialState: ContentTypeState = {
  contentTypes: [],
  contentTypesRenderers: {},
  loading: false,
  error: null,
  availableDatasources: [],
  contentTypesMetaData: [],
};

export const useContentType = (baseURL: string) => {
  const [state, setState] = useState<ContentTypeState>(initialState);

  // Actions
  const fetchContentTypes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetchContentTypesEndpoint<ContentTypeData>(baseURL);
      const contentTypes = response.map(item => item);
      
      setState(prev => ({
        ...prev,
        contentTypes,
        loading: false,
      }));
      
      return contentTypes;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch content types',
      }));
      throw error;
    }
  }, [baseURL]);

  const fetchContentType = useCallback(async (key: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetchContentTypeEndpoint<ContentTypeData>(baseURL, key);
      const contentType = response.value;
      
      return contentType;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch content types',
      }));
      throw error;
    }
  }, [baseURL]);

  const fetchAvailableDatasources = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await getAvailableDatasourcesEndpoint<DatasourceInfo>(baseURL);
      const datasources = response.map(item => item.value as DatasourceInfo);
      
      setState(prev => ({
        ...prev,
        availableDatasources: datasources,
        loading: false,
      }));
      
      return datasources;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch available datasources',
      }));
      throw error;
    }
  }, [baseURL]);

  const addContentType = useCallback(async (contentType: ContentTypeData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await createContentTypeEndpoint<ContentTypeData>(
        baseURL,
        contentType.metadata.type,
        contentType
      );
      const newContentType = response.value;
      
      setState(prev => ({
        ...prev,
        contentTypes: [...prev.contentTypes, newContentType],
        loading: false,
      }));
      
      return newContentType;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add content type',
      }));
      throw error;
    }
  }, [baseURL]);

  const addContentTypeWithCode = useCallback(async ({ key, data }: { key: string, data: any }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await createContentTypeEndpoint<ContentTypeData>(
        baseURL,
        key,
        data
      );
      const newContentType = response.value;
      
      setState(prev => ({
        ...prev,
        contentTypes: [...prev.contentTypes, newContentType],
        loading: false,
      }));
      
      return newContentType;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add content type',
      }));
      throw error;
    }
  }, [baseURL]);

  const updateContentType = useCallback(async (key: string, contentType: ContentTypeData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await updateContentTypeEndpoint<ContentTypeData>(baseURL, key, contentType);
      const updatedContentType = response.value;
      
      setState(prev => ({
        ...prev,
        contentTypes: prev.contentTypes.map(ct => 
          ct.metadata.type === key ? updatedContentType : ct
        ),
        loading: false,
      }));
      
      return updatedContentType;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update content type',
      }));
      throw error;
    }
  }, [baseURL]);

  const removeContentType = useCallback(async (key: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteContentTypeEndpoint(baseURL, key);
      
      setState(prev => ({
        ...prev,
        contentTypes: prev.contentTypes.filter(ct => ct.metadata.type !== key),
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to remove content type',
      }));
      throw error;
    }
  }, [baseURL]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getContentTypeByType = useCallback((type: string) => {
    return state.contentTypes.find(ct => ct.metadata.type === type) || null;
  }, [state.contentTypes]);

  const getContentTypeMetadata = useCallback((type: string) => {
    const contentType = state.contentTypes.find(ct => ct.metadata.type === type);
    return contentType?.metadata || null;
  }, [state.contentTypes]);

  const getDatasourceByKey = useCallback((key: string) => {
    return state.availableDatasources.find(ds => ds.key === key) || null;
  }, [state.availableDatasources]);

  const fetchContentTypesMetaData = async () => {
    const contentTypesMetaData = await getAllContentTypesMetaData({ baseURL });
    setState(prev => ({ ...prev, contentTypesMetaData }));
  };

  const fetchContentTypesRenderers = async () => {
    const contentTypesRenderers = await getAllContentTypesRenderers();
    setState(prev => ({ ...prev, contentTypesRenderers }));
  };


  return {
    // State
    contentTypes: state.contentTypes,
    loading: state.loading,
    error: state.error,
    availableDatasources: state.availableDatasources,
    contentTypesMetaData: state.contentTypesMetaData,
    contentTypesRenderers: state.contentTypesRenderers,
    // Actions
    fetchContentTypes,
    fetchContentType,
    fetchAvailableDatasources,
    addContentType,
    updateContentType,
    removeContentType,
    clearError,
    fetchContentTypesMetaData,
    fetchContentTypesRenderers,
    
    // Selectors
    getContentTypeByType,
    getContentTypeMetadata,
    getDatasourceByKey,

    addContentTypeWithCode,
  };
}; 