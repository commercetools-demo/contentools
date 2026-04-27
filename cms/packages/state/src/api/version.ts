/**
 * Version management functions
 */

import { EContentType } from '@commercetools-demo/contentools-types';

// Fetch versions for a content type (content-items or pages)
export async function fetchVersionsEndpoint<T>(
  baseURL: string,
  projectKey: string,
  contentType: EContentType,
  key: string
): Promise<T> {
  return fetch(`${baseURL}/${contentType}/${key}/versions`, {
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
    },
  }).then((response) => response.json());
}
