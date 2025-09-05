import {
  ApiResponse,
  ContentItem,
  Page,
} from '@commercetools-demo/contentools-types';
import { fetchApi } from '../api';
/**
 * Fetch a single custom object
 */
export async function fetchPageEndpoint(
  baseURL: string,
  key: string
): Promise<Page> {
  const response = await fetch(`${baseURL}/pages/${key}`);
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Fetch all custom objects
 */
export async function fetchPagesEndpoint<T>(
  baseURL: string
): Promise<ApiResponse<T>[]> {
  const response = await fetch(`${baseURL}/pages`);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
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
export async function createPageEndpoint(
  baseURL: string,
  data: Omit<Page, 'key' | 'layout' | 'components'>
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages`, {
    method: 'POST',
    body: JSON.stringify({ value: data }),
  });
}

/**
 * Delete a custom object
 */
export async function deletePageEndpoint(
  baseURL: string,
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/pages/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Add a component to a page
 */
export async function addComponentToPageApi(
  baseURL: string,
  key: string,
  componentType: string,
  rowId: string,
  cellId: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/components`, {
    method: 'POST',
    body: JSON.stringify({ componentType, rowId, cellId }),
  });
}

/**
 * Remove a row from a page
 */
export async function removeRowFromPageApi(
  baseURL: string,
  key: string,
  rowId: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/rows/${rowId}`, {
    method: 'DELETE',
  });
}

/**
 * Add a row to a page
 */
export async function addRowToPageApi(
  baseURL: string,
  key: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/rows`, {
    method: 'POST',
  });
}

/**
 * Update a cell span in a page
 */
export async function updateCellSpanInPageApi(
  baseURL: string,
  key: string,
  rowId: string,
  cellId: string,
  updates: {
    colSpan: number;
    shouldRemoveEmptyCell?: boolean;
    shouldAddEmptyCell?: boolean;
  }
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/rows/${rowId}/cells/${cellId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    }
  );
}

/**
 * Update a component in a page
 */
export async function updateComponentInPageApi(
  baseURL: string,
  key: string,
  contentItemKey: string,
  updates: Partial<ContentItem>
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/components/${contentItemKey}`,
    {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    }
  );
}

/**
 * Remove a component from a page
 */
export async function removeComponentFromPageApi(
  baseURL: string,
  key: string,
  contentItemKey: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/components/${contentItemKey}`,
    {
      method: 'DELETE',
    }
  );
}
