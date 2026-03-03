import {
  ThemeTokens,
  HeaderConfiguration,
} from '@commercetools-demo/contentools-types';

export interface AllConfigurationsResponse {
  theme: ThemeTokens | null;
  header: HeaderConfiguration | null;
}

/**
 * Fetch all configurations (theme + header) in one request.
 */
export async function fetchAllConfigurationsEndpoint(
  baseURL: string,
  projectKey: string
): Promise<AllConfigurationsResponse> {
  const response = await fetch(`${baseURL}/configuration`, {
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
  return {
    theme: data.theme ?? null,
    header: data.header ?? null,
  };
}

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

/**
 * Fetch header configuration (GET). Returns null when no header is stored.
 */
export async function fetchHeaderEndpoint(
  baseURL: string,
  projectKey: string
): Promise<HeaderConfiguration | null> {
  const response = await fetch(`${baseURL}/configuration/header`, {
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
  return data === null || data === undefined
    ? null
    : (data as HeaderConfiguration);
}

/**
 * Create header configuration (POST).
 */
export async function createHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: HeaderConfiguration
): Promise<HeaderConfiguration> {
  const response = await fetch(`${baseURL}/configuration/header`, {
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
  return data as HeaderConfiguration;
}

/**
 * Update header configuration (PUT).
 */
export async function updateHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: HeaderConfiguration
): Promise<HeaderConfiguration> {
  const response = await fetch(`${baseURL}/configuration/header`, {
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
  return data as HeaderConfiguration;
}

/**
 * Delete header configuration (DELETE).
 */
export async function deleteHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/header`, {
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
