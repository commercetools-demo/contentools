import { ApiResponse } from '../types';

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
