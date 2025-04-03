import { v4 as uuidv4 } from 'uuid';
import { ContentItem, ContentTypeMetaData, ContentTypeData } from '../types';
import { store } from '../store';
import { fetchContentTypesThunk } from '../store/content-type.slice';
import { sampleContentTypeRegistry } from '../apps/content-type-registry/sample-content-types';

// Helper function to convert defaultRegistry to RegistryComponentData format
const convertSampleContentTypeToContentTypeData = (): ContentTypeData[] => {
  return Object.values(sampleContentTypeRegistry).map(metadata => ({
    metadata,
    deployedUrl: '', // Default components are built-in and don't have a deployedUrl
  }));
};

// Helper function to get registry components from store and combine with default registry
export const getAllContentTypes = async ({ baseURL }: { baseURL: string }): Promise<ContentTypeData[]> => {
  const state = store.getState();
  
  if (state.contentType.contentTypes.length === 0 && !state.contentType.loading) {
    await store.dispatch(fetchContentTypesThunk({ baseURL }));
  }
  
  const fetchedContentTypes = store.getState().contentType.contentTypes;
  const sampleContentTypes = convertSampleContentTypeToContentTypeData();
  
  // Combine components, prioritizing fetched components over default ones with the same type
  const fetchedTypes = new Set(fetchedContentTypes.map(c => c.metadata.type));
  
  const filteredSampleContentTypes = sampleContentTypes.filter(
    comp => !fetchedTypes.has(comp.metadata.type)
  );
  
  return [...fetchedContentTypes, ...filteredSampleContentTypes];
};

// Helper functions
export const getContentTypeMetaData = async ({ baseURL, type }: { baseURL: string, type: string }): Promise<ContentTypeMetaData | null> => {
  const contentTypes = await getAllContentTypes({ baseURL });
  const contentType = contentTypes.find(c => c.metadata.type === type);
  
  return contentType?.metadata || null;
};

export const getAllContentTypesMetaData = async ({ baseURL }: { baseURL: string }): Promise<ContentTypeMetaData[]> => {
  const contentTypes = await getAllContentTypes({ baseURL });
  return contentTypes.map(c => c.metadata);
};

export const createContentItem = async ({ baseURL, type, name }: { baseURL: string, type: string, name?: string }): Promise<ContentItem> => {
  const metadata = await getContentTypeMetaData({ baseURL, type });
  
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
