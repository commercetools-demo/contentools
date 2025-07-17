import { useState, useCallback } from 'react';
import { DatasourceInfo } from '@commercetools-demo/cms-types';
import {
  getAvailableDatasourcesEndpoint,
  getDatasourceByKeyEndpoint,
} from '../api';

interface DatasourceState {
  datasources: DatasourceInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: DatasourceState = {
  datasources: [],
  loading: false,
  error: null,
};

export const useDatasource = (baseURL: string) => {
  const [state, setState] = useState<DatasourceState>(initialState);

  // Actions
  const fetchDatasources = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await getAvailableDatasourcesEndpoint<DatasourceInfo>(baseURL);
      const datasources = response.map(item => item.value as DatasourceInfo);
      
      setState(prev => ({
        ...prev,
        datasources,
        loading: false,
      }));
      
      return datasources;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch datasources',
      }));
      throw error;
    }
  }, [baseURL]);

  const fetchDatasourceByKey = useCallback(async (key: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await getDatasourceByKeyEndpoint<DatasourceInfo>(baseURL, key);
      const datasource = response.value as DatasourceInfo;
      
      setState(prev => ({
        ...prev,
        loading: false,
      }));
      
      return datasource;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : `Failed to fetch datasource with key: ${key}`,
      }));
      throw error;
    }
  }, [baseURL]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Selectors
  const getDatasourceByKey = useCallback((key: string) => {
    return state.datasources.find(ds => ds.key === key) || null;
  }, [state.datasources]);

  const getDatasourcesByType = useCallback((type: string) => {
    return state.datasources.filter(ds => 
      ds.params.some(param => param.type === type)
    );
  }, [state.datasources]);

  const getAllDatasourceKeys = useCallback(() => {
    return state.datasources.map(ds => ds.key);
  }, [state.datasources]);

  return {
    // State
    datasources: state.datasources,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchDatasources,
    fetchDatasourceByKey,
    clearError,
    
    // Selectors
    getDatasourceByKey,
    getDatasourcesByType,
    getAllDatasourceKeys,
  };
};
