import { v4 as uuidv4 } from 'uuid';
import { ContentItem, ContentTypeData, ContentTypeMetaData } from '@commercetools-demo/cms-types';
import { sampleContentTypeRegistry } from '@commercetools-demo/cms-content-type-registry';

// Helper function to convert defaultRegistry to RegistryComponentData format
const convertSampleContentTypeToContentTypeData = (): ContentTypeData[] => {
  return Object.values(sampleContentTypeRegistry).map(metadata => ({
    metadata,
    deployedUrl: '', // Default components are built-in and don't have a deployedUrl
  }));
};

// Helper function to get registry components from store and combine with default registry
export const getAllContentTypes = async ({ baseURL }: { baseURL: string }): Promise<ContentTypeData[]> => {
  // For now, just return sample content types
  // In a real implementation, this would fetch from the API
  const sampleContentTypes = convertSampleContentTypeToContentTypeData();
  return [...sampleContentTypes];
};

// Helper functions
export const getContentTypeMetaData = async ({
  baseURL,
  type,
}: {
  baseURL: string;
  type: string;
}): Promise<ContentTypeMetaData | null> => {
  const contentTypes = await getAllContentTypes({ baseURL });
  const contentType = contentTypes.find(c => c.metadata.type === type);

  return contentType?.metadata || null;
};

export const getAllContentTypesMetaData = async ({
  baseURL,
}: {
  baseURL: string;
}): Promise<ContentTypeMetaData[]> => {
  const contentTypes = await getAllContentTypes({ baseURL });
  return contentTypes.map(c => c.metadata);
};

export const createContentItem = async ({
  baseURL,
  type,
  name,
  businessUnitKey,
}: {
  baseURL: string;
  type: string;
  name?: string;
  businessUnitKey: string;
}): Promise<ContentItem> => {
  const metadata = await getContentTypeMetaData({ baseURL, type });

  if (!metadata) {
    throw new Error(`Component type "${type}" not found in registry`);
  }

  return {
    id: uuidv4(),
    key: uuidv4(),
    businessUnitKey,
    type: metadata.type,
    name: name || metadata.name,
    properties: { ...metadata.defaultProperties },
  };
}; 