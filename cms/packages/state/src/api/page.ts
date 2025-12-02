import {
  ApiResponse,
  ContentItem,
  Page,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import { fetchApi } from '../api';

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
 * Move a component in a page
 */
export async function moveComponentInPageApi(
  baseURL: string,
  key: string,
  contentItemKey: string,
  sourceRowId: string,
  sourceCellId: string,
  targetRowId: string,
  targetCellId: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/components/${contentItemKey}/move`,
    {
      method: 'POST',
      body: JSON.stringify({
        sourceRowId,
        sourceCellId,
        targetRowId,
        targetCellId,
      }),
    }
  );
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

export const fetchPagesApi = async (
  baseUrl: string
): Promise<
  {
    container: string;
    key: string;
    value: Page;
    version: number;
    states: StateInfo<Page>;
  }[]
> => {
  try {
    const response = await fetch(`${baseUrl}/pages`);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch pages');
  }
};

export const fetchPageApi = async (
  baseUrl: string,
  key: string
): Promise<Page> => {
  try {
    const response = await fetch(`${baseUrl}/pages/${key}`);
    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

export const fetchPublishedPageApi = async (
  baseUrl: string,
  key: string
): Promise<Page> => {
  try {
    const response = await fetch(`${baseUrl}/published/pages/${key}`);
    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

export const createPageApi = async (
  hydratedUrl: string,
  page: Omit<Page, 'key' | 'layout' | 'components'>
): Promise<Page> => {
  try {
    const response = await fetchApi<Page>(`${hydratedUrl}/pages`, {
      method: 'POST',
      body: JSON.stringify({ value: page }),
    });
    return response.value;
  } catch (error) {
    throw new Error('Failed to create page');
  }
};

export const updatePageApi = async (
  baseUrl: string,
  page: Page
): Promise<Page> => {
  try {
    const response = await fetchApi<Page>(`${baseUrl}/pages/${page.key}`, {
      method: 'PUT',
      body: JSON.stringify({ value: page }),
    });
    return response.value as Page;
  } catch (error) {
    throw new Error(`Failed to update page with key: ${page.key}`);
  }
};

export const deletePageApi = async (
  baseUrl: string,
  key: string
): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}/pages/${key}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    throw new Error(`Failed to delete page with key: ${key}`);
  }
};

/**
 * Query a single page
 */
export async function queryPageEndpoint(
  baseURL: string,
  query: string
): Promise<Page> {
  const response = await fetch(`${baseURL}/preview/pages/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Query a single page
 */
export async function queryPublishedPageEndpoint(
  baseURL: string,
  query: string
): Promise<Page> {
  const response = await fetch(`${baseURL}/published/pages/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}
