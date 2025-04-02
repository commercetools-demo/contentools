import { v4 as uuidv4 } from 'uuid';
import { Component, ComponentMetadata, RegistryComponentData } from '../types';
import { store } from '../store';
import { fetchContentTypesThunk } from '../store/registry.slice';
import { defaultRegistry } from './registry-components/cms-components/default-components';

// Helper function to convert defaultRegistry to RegistryComponentData format
const convertDefaultRegistryToComponentData = (): RegistryComponentData[] => {
  return Object.values(defaultRegistry).map(metadata => ({
    metadata,
    deployedUrl: '', // Default components are built-in and don't have a deployedUrl
  }));
};

// Helper function to get registry components from store and combine with default registry
export const getRegistryComponentsFromStore = async ({ baseURL }: { baseURL: string }): Promise<RegistryComponentData[]> => {
  const state = store.getState();
  
  if (state.registry.components.length === 0 && !state.registry.loading) {
    await store.dispatch(fetchContentTypesThunk({ baseURL }));
  }
  
  const fetchedComponents = store.getState().registry.components;
  const defaultComponents = convertDefaultRegistryToComponentData();
  
  // Combine components, prioritizing fetched components over default ones with the same type
  const fetchedTypes = new Set(fetchedComponents.map(c => c.metadata.type));
  
  const filteredDefaultComponents = defaultComponents.filter(
    comp => !fetchedTypes.has(comp.metadata.type)
  );
  
  return [...fetchedComponents, ...filteredDefaultComponents];
};

// Helper functions
export const getComponentMetadata = async ({ baseURL, type }: { baseURL: string, type: string }): Promise<ComponentMetadata | null> => {
  const components = await getRegistryComponentsFromStore({ baseURL });
  const component = components.find(c => c.metadata.type === type);
  
  return component?.metadata || null;
};

export const getAllComponentTypes = async ({ baseURL }: { baseURL: string }): Promise<ComponentMetadata[]> => {
  const components = await getRegistryComponentsFromStore({ baseURL });
  return components.map(c => c.metadata);
};

export const createComponent = async ({ baseURL, type, name }: { baseURL: string, type: string, name?: string }): Promise<Component> => {
  const metadata = await getComponentMetadata({ baseURL, type });
  
  if (!metadata) {
    throw new Error(`Component type "${type}" not found in registry`);
  }
  
  return {
    id: uuidv4(),
    type: metadata.type,
    name: name || metadata.name,
    properties: { ...metadata.defaultProperties },
  };
};
