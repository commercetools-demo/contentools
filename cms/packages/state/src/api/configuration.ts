import { ThemeTokens } from '@commercetools-demo/contentools-types';

/**
 * Fetch theme configuration (GET). Returns null when no theme is stored.
 */
export async function fetchThemeEndpoint(
  baseURL: string,
  projectKey: string
): Promise<ThemeTokens | null> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data === null || data === undefined ? null : (data as ThemeTokens);
}

/**
 * Create theme configuration (POST).
 */
export async function createThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: ThemeTokens
): Promise<ThemeTokens> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as ThemeTokens;
}

/**
 * Update theme configuration (PUT).
 */
export async function updateThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: ThemeTokens
): Promise<ThemeTokens> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as ThemeTokens;
}

/**
 * Delete theme configuration (DELETE).
 */
export async function deleteThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
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
