import {
    ContentItem,
    StateInfo
} from '@commercetools-demo/contentools-types';
import { fetchApi } from '../api';
/**
 * Fetch all content items
 */
export async function fetchContentItemsEndpoint(baseURL: string): Promise<
  {
    container: string;
    key: string;
    value: ContentItem;
    version: number;
    states: StateInfo<ContentItem>;
  }[]
> {
  const response = await fetch(`${baseURL}/content-items`);

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
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/preview/content-items/${key}`, {
    headers: {
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
  query: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/preview/content-items/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
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
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    headers: {
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
  key: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/published/content-items/${key}`, {
    headers: {
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
  query: string
): Promise<ContentItem> {
  const response = await fetch(`${baseURL}/published/content-items/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
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
  data: ContentItem
): Promise<ContentItem> {
  const response = await fetchApi<ContentItem>(`${baseURL}/content-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
  key: string,
  data: ContentItem
): Promise<ContentItem> {
  const response = await fetchApi<ContentItem>(`${baseURL}/content-items/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
  });
  return response.value;
}

/**
 * Delete a content item
 */
export async function deleteContentItemEndpoint(
  baseURL: string,
  key: string
): Promise<void> {
  const response = await fetch(`${baseURL}/content-items/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}
