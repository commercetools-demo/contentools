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
export async function updatePageEndpoint<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/pages/${key}`, {
    method: 'PUT',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Create a custom object
 */
export async function createPageEndpoint<T extends {key: string}>(baseURL: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/pages/${data.key}`, {
    method: 'POST',
    body: JSON.stringify({value: data}),
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
export async function fetchContentTypeEndpoint<T>(baseURL: string, key: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`);
}

/**
 * Create a registry component
 */
export async function createContentTypeEndpoint<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`, {
    method: 'POST',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Update a registry component
 */
export async function updateContentTypeEndpoint<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`, {
    method: 'PUT',
    body: JSON.stringify({value: data}),
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