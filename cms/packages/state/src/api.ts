import {
  ApiResponse,
  ContentTypeData,
  MediaLibraryResult,
  Page,
} from '@commercetools-demo/contentools-types';

/**
 * Generic fetch function for making API calls
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch registry components
 */
export async function fetchContentTypesEndpoint(
  baseURL: string,
  projectKey: string
): Promise<ContentTypeData[]> {
  const response = await fetch(`${baseURL}/content-type`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch a single registry component
 */
export async function fetchContentTypeEndpoint<T>(
  baseURL: string,
  projectKey: string,
  key: string
): Promise<T> {
  const response = await fetch(`${baseURL}/content-type/${key}`, {
    headers: {
      'x-project-key': projectKey,
    },
  });
  return response.json();
}

/**
 * Create a registry component
 */
export async function createContentTypeEndpoint<T>(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Update a registry component
 */
export async function updateContentTypeEndpoint<T>(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  data: T
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/content-type/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Delete a registry component
 */
export async function deleteContentTypeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/content-type/${key}`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}

export interface ImportResult {
  imported: string[];
  failed: Array<{ key: string; error: string }>;
}

/**
 * Import default content types from samples
 */
export async function importDefaultContentTypesEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<ImportResult> {
  const response = await fetch(`${baseURL}/content-type/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch available datasources
 */
export async function getAvailableDatasourcesEndpoint<T>(
  baseURL: string,
  projectKey: string
): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/datasource`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch a specific datasource by key
 */
export async function getDatasourceByKeyEndpoint<T>(
  baseURL: string,
  projectKey: string,
  key: string
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/datasource/${key}`, {
    headers: {
      'x-project-key': projectKey,
    },
  });
}

/**
 * Test a datasource
 */
export async function testDatasourceEndpoint<T>(
  baseURL: string,
  projectKey: string,
  key: string,
  params: Record<string, any>
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/datasource/${key}/test`, {
    method: 'POST',
    body: JSON.stringify({ params }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
    },
  });
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
  projectKey: string,
  jwtToken: string | undefined,
  key?: string,
  files?: Record<string, { content: string }>
): Promise<ApiResponse<T>> {
  return fetchApi<T>(`${baseURL}/compile-upload`, {
    method: 'POST',
    body: JSON.stringify({ key, files }),
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Fetch media library with optional extensions filter and pagination
 */
export async function fetchMediaLibrary(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  extensions: string[] = [],
  page: number = 1,
  limit: number = 20
): Promise<MediaLibraryResult> {
  const extensionsParam =
    extensions.length > 0 ? `extensions=${extensions.join(',')}` : '';
  const pageParam = `page=${page}`;
  const limitParam = `limit=${limit}`;

  const queryParams = [extensionsParam, pageParam, limitParam]
    .filter((param) => param)
    .join('&');

  const url = `${baseURL}/media-library${queryParams ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Upload a file to the server
 */
export async function uploadFile(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
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

  const response = await fetch(`${baseURL}/upload-file`, {
    method: 'POST',
    body: formData,
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
