import { ContentTypeData, ContentTypeMetaData } from '@commercetools-demo/cms-types';
import { sampleContentTypeRegistry, sampleContentTypeRenderers } from '../sample-content-type-definitions';

// Helper function to convert defaultRegistry to RegistryComponentData format
const convertSampleContentTypeToContentTypeData = (): ContentTypeData[] => {
  return Object.values(sampleContentTypeRegistry).map(metadata => ({
    metadata,
    deployedUrl: '', // Default components are built-in and don't have a deployedUrl
  }));
};

// Helper function to get registry components from store and combine with default registry
const getAllContentTypes = async ({ baseURL }: { baseURL: string }): Promise<ContentTypeData[]> => {
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

// TODO: add baseUrl later
export const getAllContentTypesRenderers = async (): Promise<Record<string, React.FC<any>>> => {
  return sampleContentTypeRenderers;
};

export const getAllContentTypesMetaData = async ({
  baseURL,
}: {
  baseURL: string;
}): Promise<ContentTypeMetaData[]> => {
  const contentTypes = await getAllContentTypes({ baseURL });
  return contentTypes.map(c => c.metadata);
};

