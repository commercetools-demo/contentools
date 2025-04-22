import { ApiResponse, ContentItemStates, ContentItemVersions, PageStates, PageVersions } from '../types';

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
export async function fetchPagesEdnpoint<T>(baseURL: string): Promise<ApiResponse<T>[]> {
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
export async function fetchContentItemsEndpoint<T>(baseURL: string): Promise<ApiResponse<T>[]> {
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
export async function fetchContentItemEndpoint<T>(baseURL: string, key: string): Promise<T> {
  const response = await fetchApi<T>(`${baseURL}/content-items/${key}`);
  return response.value;
}

/**
 * Create a content item
 */
export async function createContentItemEndpoint<T extends { key: string }>(
  baseURL: string,
  data: T
): Promise<T> {
  const response = await fetchApi<T>(`${baseURL}/content-items/${data.key}`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
  });
  return response.value;
}

/**
 * Update a content item
 */
export async function updateContentItemEndpoint<T>(
  baseURL: string,
  key: string,
  data: T
): Promise<T> {
  const response = await fetchApi<T>(`${baseURL}/content-items/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
  });
  return response.value;
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
 * Fetch available datasources
 */
export async function getAvailableDatasourcesEndpoint<T>(
  baseURL: string
): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/datasource`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a specific datasource by key
 */
export async function getDatasourceByKeyEndpoint<T>(
  baseURL: string,
  key: string
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/datasource/${key}`);
}

/**
 * Compile and upload TypeScript files to create a bundled JavaScript file
 *
 * @param baseURL Base URL for the API
 * @param key Component key
 * @param files Object containing file names as keys and file content as values
 * @returns Promise with the API response
 */
export async function compileAndUploadEndpoint<T>(
  baseURL: string,
  key?: string,
  files?: Record<string, { content: string }>
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/compile-upload`, {
    method: 'POST',
    body: JSON.stringify({ key, files }),
  });
}

/**
 * Version management functions
 */

// Fetch versions for a content type (content-items or pages)
export async function fetchVersionsEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string
): Promise<T> {
  return fetch(`${baseURL}/${contentType}/${key}/versions`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

// Save a new version
export async function saveVersionEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string, 
  data: T
): Promise<ContentItemVersions | PageVersions> {
  console.log('Saving version:', data);
  return fetch(`${baseURL}/${contentType}/${key}/versions`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

// Get a specific version
export async function getVersionEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string,
  versionId: string
): Promise<T> {
  return fetch(`${baseURL}/${contentType}/${key}/versions/${versionId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

/**
 * State management functions
 */

// Get states
export async function getStatesEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string
): Promise<T> {
  return fetch(`${baseURL}/${contentType}/${key}/states`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

// Save draft state
export async function saveDraftEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string, 
  data: T
): Promise<ContentItemStates | PageStates> {
  console.log('Saving draft:', data);
  return fetch(`${baseURL}/${contentType}/${key}/states/draft`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

// Publish state
export async function publishEndpoint<T>(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string, 
  data: T,
  clearDraft: boolean = false
): Promise<ContentItemStates | PageStates> {
  let url = `${baseURL}/${contentType}/${key}/states/published`;
  if (clearDraft) {
    url += '?clearDraft=true';
  }
  
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

// Revert draft state (delete draft)
export async function revertDraftEndpoint(
  baseURL: string, 
  contentType: 'pages' | 'content-items', 
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/${contentType}/${key}/states/draft`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return;
}
