import {
  ContentItem,
  ContentItemStates,
  EContentType,
  Page,
  PageStates,
  StateInfo,
} from '@commercetools-demo/contentools-types';
/**
 * State management functions
 */

// Get states
export async function getStatesEndpoint<T>(
  baseURL: string,
  contentType: EContentType,
  key: string
): Promise<T> {
  return fetch(`${baseURL}/${contentType}/${key}/states`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

// Publish state
export async function publishEndpoint<
  T extends (Page | ContentItem) & { states?: StateInfo }
>(
  baseURL: string,
  contentType: EContentType,
  key: string,
  data: T,
  clearDraft: boolean = false
): Promise<ContentItemStates | PageStates> {
  let url = `${baseURL}/${contentType}/${key}/states/published`;
  if (clearDraft) {
    url += '?clearDraft=true';
  }

  if ('states' in data) {
    delete data.states;
  }

  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify({ value: data }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

// Revert draft state (delete draft)
export async function revertDraftEndpoint(
  baseURL: string,
  contentType: EContentType,
  key: string
): Promise<void> {
  const response = await fetch(
    `${baseURL}/${contentType}/${key}/states/draft`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return;
}
