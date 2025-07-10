import {
  ApiResponse,
  ContentItem,
  ContentItemStates,
  ContentItemVersions,
  Page,
  PageStates,
  PageVersions,
  StateInfo,
  MediaLibraryResult,
  ContentTypeData,
  DatasourceInfo,
} from '@commercetools-demo/cms-types';

/**
 * Generic fetch function for making API calls
 */
export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single custom object
 */
export async function fetchPageEndpoint<T>(baseURL: string, key: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/pages/${key}`);
}

/**
 * Fetch all custom objects
 */
export async function fetchPagesEndpoint<T>(baseURL: string): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/pages`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a custom object
 */
export async function updatePageEndpoint<T>(
  baseURL: string,
  key: string,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/pages/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
  });
}

/**
 * Create a custom object
 */
export async function createPageEndpoint<T extends { key: string }>(
  baseURL: string,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/pages/${data.key}`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
  });
}

/**
 * Delete a custom object
 */
export async function deletePageEndpoint(baseURL: string, key: string): Promise<void> {
  const response = await fetch(`${baseURL}/pages/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetch registry components
 */
export async function fetchContentTypesEndpoint<T>(baseURL: string): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/content-type`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single registry component
 */
export async function fetchContentTypeEndpoint<T>(
  baseURL: string,
  key: string
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`);
}

/**
 * Create a registry component
 */
export async function createContentTypeEndpoint<T>(
  baseURL: string,
  key: string,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
  });
}

/**
 * Update a registry component
 */
export async function updateContentTypeEndpoint<T>(
  baseURL: string,
  key: string,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
  });
}

/**
 * Delete a registry component
 */
export async function deleteContentTypeEndpoint(baseURL: string, key: string): Promise<void> {
  const response = await fetch(`${baseURL}/content-type/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetch all content items
 */
export async function fetchContentItemsEndpoint<T>(baseURL: string): Promise<
  {
    container: string;
    key: string;
    value: T;
    version: number;
    states: StateInfo;
  }[]
> {
  const response = await fetch(`${baseURL}/content-items`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch a single content item
 */
export async function fetchPreviewContentItemEndpoint<T>(baseURL: string, key: string): Promise<T> {
  const response = await fetch(`${baseURL}/preview/content-items/${key}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
  return response;
}

/**
 * Fetch a single content item
 */
export async function fetchPublishedContentItemEndpoint<T>(
  baseURL: string,
  key: string
): Promise<T> {
  const response = await fetch(`${baseURL}/published/content-items/${key}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
  return response;
}

/**
 * Create a content item
 */
export async function createContentItemEndpoint<T extends { key: string }>(
  baseURL: string,
  data: T
): Promise<T> {
  const response = await fetch(`${baseURL}/content-items/${data.key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: data }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a content item
 */
export async function updateContentItemEndpoint<T>(
  baseURL: string,
  key: string,
  data: T
): Promise<T> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: data }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a content item
 */
export async function deleteContentItemEndpoint(baseURL: string, key: string): Promise<void> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Get available datasources
 */
export async function getAvailableDatasourcesEndpoint<T>(
  baseURL: string
): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/datasources`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get datasource by key
 */
export async function getDatasourceByKeyEndpoint<T>(
  baseURL: string,
  key: string
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/datasources/${key}`);
}

/**
 * Compile and upload endpoint
 */
export async function compileAndUploadEndpoint<T>(
  baseURL: string,
  key?: string,
  files?: Record<string, { content: string }>
): Promise<ApiResponse<T>> {
  const url = key ? `${baseURL}/compile/${key}` : `${baseURL}/compile`;
  return fetchApi<T>(url, {
    method: 'POST',
    body: JSON.stringify({ files }),
  });
}

/**
 * Fetch versions endpoint
 */
export async function fetchVersionsEndpoint<T>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string
): Promise<T> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/versions`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save version endpoint
 */
export async function saveVersionEndpoint<T>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string,
  data: T
): Promise<ContentItemVersions | PageVersions> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/versions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: data }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get version endpoint
 */
export async function getVersionEndpoint<T>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string,
  versionId: string
): Promise<T> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/versions/${versionId}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get states endpoint
 */
export async function getStatesEndpoint<T>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string
): Promise<T> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/states`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save draft endpoint
 */
export async function saveDraftEndpoint<T>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string,
  data: T
): Promise<ContentItemStates | PageStates> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/states/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: data }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Publish endpoint
 */
export async function publishEndpoint<T extends (Page | ContentItem) & { states?: StateInfo }>(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string,
  data: T,
  clearDraft: boolean = false
): Promise<ContentItemStates | PageStates> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/states/published`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: data, clearDraft }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Revert draft endpoint
 */
export async function revertDraftEndpoint(
  baseURL: string,
  contentType: 'pages' | 'content-items',
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/states/draft`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetch media library
 */
export async function fetchMediaLibrary(
  baseURL: string,
  extensions: string[] = [],
  page: number = 1,
  limit: number = 20
): Promise<MediaLibraryResult> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (extensions.length > 0) {
    params.append('extensions', extensions.join(','));
  }

  const response = await fetch(`${baseURL}/media?${params}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload file
 */
export async function uploadFile(
  baseURL: string,
  file: File,
  title?: string,
  description?: string
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (title) {
    formData.append('title', title);
  }
  
  if (description) {
    formData.append('description', description);
  }

  const response = await fetch(`${baseURL}/media/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
} 