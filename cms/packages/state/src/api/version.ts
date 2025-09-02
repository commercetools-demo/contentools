/**
 * Version management functions
 */

// Fetch versions for a content type (content-items or pages)
export async function fetchVersionsEndpoint<T>(
    baseURL: string,
    contentType: 'pages' | 'content-items',
    key: string
  ): Promise<T> {
    return fetch(`${baseURL}/${contentType}/${key}/versions`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
  }
  
  