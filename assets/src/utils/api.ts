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
export async function fetchCustomObject<T>(baseURL: string, key: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/custom-objects/${key}`);
}

/**
 * Fetch all custom objects
 */
export async function fetchCustomObjects<T>(baseURL: string): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/custom-objects`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a custom object
 */
export async function updateCustomObject<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/custom-objects/${key}`, {
    method: 'PUT',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Create a custom object
 */
export async function createCustomObject<T extends {key: string}>(baseURL: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/custom-objects/${data.key}`, {
    method: 'POST',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Delete a custom object
 */
export async function deleteCustomObject(baseURL: string, key: string): Promise<void> {
  const response = await fetch(`${baseURL}/custom-objects/${key}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetch registry components
 */
export async function fetchRegistry<T>(baseURL: string): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/registry`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single registry component
 */
export async function fetchRegistryComponent<T>(baseURL: string, key: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/registry/${key}`);
}

/**
 * Create a registry component
 */
export async function createRegistryComponent<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/registry/${key}`, {
    method: 'POST',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Update a registry component
 */
export async function updateRegistryComponent<T>(baseURL: string, key: string, data: T): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/registry/${key}`, {
    method: 'PUT',
    body: JSON.stringify({value: data}),
  });
}

/**
 * Delete a registry component
 */
export async function deleteRegistryComponent(baseURL: string, key: string): Promise<void> {
  const response = await fetch(`${baseURL}/registry/${key}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
}