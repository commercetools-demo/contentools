import { ContentItem, StateInfo } from '@commercetools-demo/contentools-types';
import { fetchApi } from '../api';
/**
 * Fetch all content items
 */
export async function fetchContentItemsEndpoint(baseURL: string, projectKey: string): Promise<
  {
    container: string;
    key: string;
    value: ContentItem;
    version: number;
    states: StateInfo<ContentItem>;
  }[]
> {
  const response = await fetch(`${baseURL}/content-items`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch a single content item
 */
export async function fetchPreviewContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/preview/content-items/${key}`, {
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Query a single content item
 */
export async function queryContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  query: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/preview/content-items/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Fetch a single content item without resolving datasources
 */
export async function fetchRawContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Fetch a single content item
 */
export async function fetchPublishedContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/published/content-items/${key}`, {
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Query a single content item
 */
export async function queryPublishedContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  query: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/published/content-items/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'x-project-key': projectKey,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  return response;
}

/**
 * Create a content item
 */
export async function createContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  data: ContentItem
): Promise<ContentItem> {
  const response = await fetchApi<ContentItem>(`${baseURL}/content-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value: data }),
  });
  return response.value;
}

/**
 * Update a content item
 */
export async function updateContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string,
  data: ContentItem
): Promise<ContentItem> {
  const response = await fetchApi<ContentItem>(
    `${baseURL}/content-items/${key}`,
    {
      method: 'PUT',
      body: JSON.stringify({ value: data }),
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        'Authorization': `Bearer ${jwtToken}`,
      },
    }
  );
  return response.value;
}

/**
 * Delete a content item
 */
export async function deleteContentItemEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      'Authorization': `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}
