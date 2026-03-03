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
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  componentType: string,
  rowId: string,
  cellId: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/components`, {
    method: 'POST',
    body: JSON.stringify({ componentType, rowId, cellId }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Move a component in a page
 */
export async function moveComponentInPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
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
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
}

/**
 * Remove a row from a page
 */
export async function removeRowFromPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  rowId: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/rows/${rowId}`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Add a row to a page
 */
export async function addRowToPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(`${baseURL}/pages/${key}/rows`, {
    method: 'POST',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}

/**
 * Update a cell span in a page
 */
export async function updateCellSpanInPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
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
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
}

/**
 * Update a component in a page
 */
export async function updateComponentInPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  contentItemKey: string,
  updates: Partial<ContentItem>
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/components/${contentItemKey}`,
    {
      method: 'PUT',
      body: JSON.stringify({ updates }),
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
}

/**
 * Remove a component from a page
 */
export async function removeComponentFromPageApi(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  contentItemKey: string
): Promise<ApiResponse<Page>> {
  return fetchApi<Page>(
    `${baseURL}/pages/${key}/components/${contentItemKey}`,
    {
      method: 'DELETE',
      headers: {
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
}

export const fetchPagesApi = async (
  baseUrl: string,
  projectKey: string
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
    const response = await fetch(`${baseUrl}/pages`, {
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
  } catch (error) {
    throw new Error('Failed to fetch pages');
  }
};

export const fetchPageApi = async (
  baseUrl: string,
  projectKey: string,
  key: string
): Promise<Page> => {
  try {
    const response = await fetch(`${baseUrl}/pages/${key}`, {
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
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

export const fetchPublishedPageApi = async (
  baseUrl: string,
  projectKey: string,
  key: string
): Promise<Page> => {
  try {
    const response = await fetch(`${baseUrl}/published/pages/${key}`, {
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
  } catch (error) {
    throw new Error(`Failed to fetch page with key: ${key}`);
  }
};

export const createPageApi = async (
  hydratedUrl: string,
  projectKey: string,
  jwtToken: string | undefined,
  page: Omit<Page, 'key' | 'layout' | 'components'>
): Promise<Page> => {
  try {
    const response = await fetchApi<Page>(`${hydratedUrl}/pages`, {
      method: 'POST',
      body: JSON.stringify({ value: page }),
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.value;
  } catch (error) {
    throw new Error('Failed to create page');
  }
};

export const updatePageApi = async (
  baseUrl: string,
  projectKey: string,
  jwtToken: string | undefined,
  page: Page
): Promise<Page> => {
  try {
    const response = await fetchApi<Page>(`${baseUrl}/pages/${page.key}`, {
      method: 'PUT',
      body: JSON.stringify({ value: page }),
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.value as Page;
  } catch (error) {
    throw new Error(`Failed to update page with key: ${page.key}`);
  }
};

export const deletePageApi = async (
  baseUrl: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string
): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}/pages/${key}`, {
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
  } catch (error) {
    throw new Error(`Failed to delete page with key: ${key}`);
  }
};

/**
 * Query a single page
 */
export async function queryPageEndpoint(
  baseURL: string,
  projectKey: string,
  query: string
): Promise<Page> {
  const response = await fetch(`${baseURL}/preview/pages/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Query a single page
 */
export async function queryPublishedPageEndpoint(
  baseURL: string,
  projectKey: string,
  query: string
): Promise<Page> {
  const response = await fetch(`${baseURL}/published/pages/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
    },
  }).then((response) => response.json());
  return response;
}
